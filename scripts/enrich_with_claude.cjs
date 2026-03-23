const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

const ROOT = path.resolve(__dirname, '..');
const envContent = fs.readFileSync(path.join(ROOT, '.env'), 'utf8');
const apiKey = envContent.match(/VITE_CLAUDE_KEY=(.*)/)?.[1]?.trim();

if (!apiKey) {
    console.error("No Anthropic API key found");
    process.exit(1);
}

const client = new Anthropic({ apiKey });
const BATCH_SIZE = 40;
const DELAY_MS = 500;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function enrichBatch(words) {
    const wordList = words.map((w, i) => `${i + 1}. ${w}`).join('\n');

    const response = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 8000,
        messages: [{
            role: 'user',
            content: `For each word/phrase below, provide:
1. Three natural example sentences
2. Synonyms (3-5) with brief usage context, separated by pipes (|)
3. Complete word forms: pp (past participle), adj, adv, noun, past, verb - use null if doesn't apply

Return ONLY a JSON array. Each element: {"word": "...", "examples": ["...", "...", "..."], "synonyms": "word1 = context | word2 = context", "word_forms": {"pp": "...", "adj": "...", "adv": "...", "noun": "...", "past": "...", "verb": "..."}}

Words:
${wordList}

Return ONLY valid JSON, no markdown, no explanation.`
        }]
    });

    const text = response.content[0].text.trim();
    // Try to extract JSON from response
    let jsonStr = text;
    if (text.startsWith('```')) {
        jsonStr = text.replace(/^```json?\n?/, '').replace(/\n?```$/, '');
    }

    try {
        return JSON.parse(jsonStr);
    } catch (e) {
        // Try to find JSON array in text
        const match = text.match(/\[[\s\S]*\]/);
        if (match) {
            try {
                return JSON.parse(match[0]);
            } catch (e2) {
                console.error('  Failed to parse batch response');
                return null;
            }
        }
        console.error('  Failed to parse response');
        return null;
    }
}

async function main() {
    console.log("=== ENRICHMENT WITH CLAUDE ===\n");

    const cardsPath = path.join(ROOT, 'all_new_cards_deduped.json');
    const cards = JSON.parse(fs.readFileSync(cardsPath, 'utf8'));
    console.log(`Loaded ${cards.length} cards to enrich\n`);

    // Create word list for batching
    const words = cards.map(c => c.back);

    let enrichmentMap = {};
    let successCount = 0;
    let failCount = 0;

    // Load existing progress if any
    const progressPath = path.join(ROOT, 'enrichment_progress.json');
    if (fs.existsSync(progressPath)) {
        enrichmentMap = JSON.parse(fs.readFileSync(progressPath, 'utf8'));
        console.log(`Resuming: ${Object.keys(enrichmentMap).length} words already enriched\n`);
    }

    for (let i = 0; i < words.length; i += BATCH_SIZE) {
        const batch = words.slice(i, i + BATCH_SIZE);

        // Skip already enriched words
        const needsEnrichment = batch.filter(w => !enrichmentMap[w.toLowerCase()]);
        if (needsEnrichment.length === 0) {
            continue;
        }

        try {
            const results = await enrichBatch(needsEnrichment);
            if (results && Array.isArray(results)) {
                for (const r of results) {
                    if (r && r.word) {
                        enrichmentMap[r.word.toLowerCase()] = r;
                        successCount++;
                    }
                }
            } else {
                failCount += needsEnrichment.length;
            }
        } catch (e) {
            console.error(`  API error at batch ${i}: ${e.message}`);
            failCount += needsEnrichment.length;

            // If rate limited, wait longer
            if (e.status === 429) {
                console.log('  Rate limited, waiting 30s...');
                await sleep(30000);
            }
        }

        const progress = Math.min(i + BATCH_SIZE, words.length);
        if (progress % 200 === 0 || progress >= words.length) {
            console.log(`Progress: ${progress}/${words.length} (enriched: ${successCount}, failed: ${failCount})`);
            // Save progress
            fs.writeFileSync(progressPath, JSON.stringify(enrichmentMap, null, 2));
        }

        await sleep(DELAY_MS);
    }

    // Save final progress
    fs.writeFileSync(progressPath, JSON.stringify(enrichmentMap, null, 2));
    console.log(`\nEnrichment complete: ${successCount} enriched, ${failCount} failed`);
    console.log(`Total in map: ${Object.keys(enrichmentMap).length}`);

    // Apply enrichment to cards
    console.log("\n--- Applying enrichment to cards ---");
    let enrichedCount = 0;

    const finalCards = cards.map(card => {
        const enrichment = enrichmentMap[card.back.toLowerCase()];
        if (!enrichment) return card;

        enrichedCount++;

        // Merge examples: keep book example first, add Claude examples
        let examples = [...(card.examples || [])];
        if (enrichment.examples && Array.isArray(enrichment.examples)) {
            const existing = new Set(examples.map(e => e.toLowerCase()));
            for (const ex of enrichment.examples) {
                if (ex && !existing.has(ex.toLowerCase()) && examples.length < 4) {
                    examples.push(ex);
                    existing.add(ex.toLowerCase());
                }
            }
        }

        // Merge word_forms
        let wordForms = { ...card.word_forms };
        if (enrichment.word_forms) {
            for (const key of ['pp', 'adj', 'adv', 'noun', 'past', 'verb']) {
                const newVal = enrichment.word_forms[key];
                const existingVal = wordForms[key];
                if (newVal && newVal !== 'null' && newVal !== '' && (!existingVal || existingVal === null)) {
                    wordForms[key] = newVal;
                }
            }
        }

        // Add synonyms
        let synonyms = card.synonyms;
        if (!synonyms && enrichment.synonyms) {
            synonyms = enrichment.synonyms;
        }

        return {
            ...card,
            examples,
            word_forms: wordForms,
            synonyms,
        };
    });

    console.log(`Enriched ${enrichedCount}/${finalCards.length} cards`);

    // Quality report
    const stats = {
        total: finalCards.length,
        withPronunciation: finalCards.filter(c => c.pronunciation).length,
        withSynonyms: finalCards.filter(c => c.synonyms).length,
        oneExample: finalCards.filter(c => c.examples.length === 1).length,
        twoExamples: finalCards.filter(c => c.examples.length === 2).length,
        threeExamples: finalCards.filter(c => c.examples.length === 3).length,
        fourPlusExamples: finalCards.filter(c => c.examples.length >= 4).length,
        goodWordForms: finalCards.filter(c => c.word_forms && Object.values(c.word_forms).filter(v => v).length >= 3).length,
    };

    console.log("\n--- Final Quality Report ---");
    console.log(`Total: ${stats.total}`);
    console.log(`With pronunciation: ${stats.withPronunciation} (${(stats.withPronunciation/stats.total*100).toFixed(1)}%)`);
    console.log(`With synonyms: ${stats.withSynonyms} (${(stats.withSynonyms/stats.total*100).toFixed(1)}%)`);
    console.log(`Examples: 1=${stats.oneExample}, 2=${stats.twoExamples}, 3=${stats.threeExamples}, 4+=${stats.fourPlusExamples}`);
    console.log(`Word forms (3+ fields): ${stats.goodWordForms} (${(stats.goodWordForms/stats.total*100).toFixed(1)}%)`);

    // Save final result
    const finalPath = path.join(ROOT, 'all_new_cards_deduped.json');
    fs.writeFileSync(finalPath, JSON.stringify(finalCards, null, 2));
    console.log(`\nSaved ${finalCards.length} fully enriched cards to all_new_cards_deduped.json`);

    // Show sample
    const sample = finalCards.filter(c => c.pronunciation && c.synonyms && c.examples.length >= 3).slice(0, 3);
    console.log("\n--- Sample enriched cards ---");
    for (const c of sample) {
        console.log(`\n  ${c.back} (${c.pronunciation})`);
        console.log(`  Front: ${c.front.substring(0, 80)}...`);
        console.log(`  Examples: ${c.examples.length}`);
        console.log(`  Synonyms: ${c.synonyms?.substring(0, 80)}...`);
        console.log(`  Forms: ${JSON.stringify(c.word_forms)}`);
    }
}

main().catch(err => {
    console.error("Fatal:", err);
    process.exit(1);
});
