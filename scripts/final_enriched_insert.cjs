const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const ROOT = path.resolve(__dirname, '..');
const envContent = fs.readFileSync(path.join(ROOT, '.env'), 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);
const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function main() {
    console.log("=== FINAL ENRICHED MERGE + INSERT ===\n");

    // 1. Load base cards (has pronunciation, word_forms, 1 example each)
    const cards = JSON.parse(fs.readFileSync(path.join(ROOT, 'all_new_cards_deduped.json'), 'utf8'));
    console.log(`Base cards: ${cards.length}`);

    // 2. Load rewritten fronts into map
    const frontMap = {};
    let frontTotal = 0;
    for (let i = 0; i < 22; i++) {
        try {
            const data = JSON.parse(fs.readFileSync(path.join(ROOT, `rewritten_${i}.json`), 'utf8'));
            for (const item of data) {
                if (item.back && item.front) {
                    frontMap[item.back.toLowerCase().trim()] = item.front;
                    frontTotal++;
                }
            }
        } catch (e) {
            console.error(`Missing rewritten_${i}.json: ${e.message}`);
        }
    }
    console.log(`Rewritten fronts: ${frontTotal}`);

    // 3. Load enrichment data into map (examples + synonyms)
    const enrichMap = {};
    let enrichTotal = 0;
    for (let i = 0; i < 16; i++) {
        try {
            const data = JSON.parse(fs.readFileSync(path.join(ROOT, `enriched_${i}.json`), 'utf8'));
            for (const item of data) {
                if (item.back) {
                    enrichMap[item.back.toLowerCase().trim()] = item;
                    enrichTotal++;
                }
            }
        } catch (e) {
            console.error(`Missing enriched_${i}.json: ${e.message}`);
        }
    }
    console.log(`Enrichment entries: ${enrichTotal}`);

    // 4. Merge everything
    let frontApplied = 0, enrichApplied = 0, noEnrich = 0;

    const finalCards = cards.map(card => {
        const key = card.back.toLowerCase().trim();

        // Apply rewritten front
        const newFront = frontMap[key];
        let front = newFront || card.front;
        if (newFront) frontApplied++;

        // Apply enrichment (examples + synonyms)
        const enrichment = enrichMap[key];
        let examples = [...(card.examples || [])];
        let synonyms = card.synonyms;

        if (enrichment) {
            enrichApplied++;

            // Add new examples (keep existing book example first, add 3 new ones)
            if (enrichment.examples && Array.isArray(enrichment.examples)) {
                const existingLower = new Set(examples.map(e => e.toLowerCase()));
                for (const ex of enrichment.examples) {
                    if (ex && !existingLower.has(ex.toLowerCase()) && examples.length < 4) {
                        examples.push(ex);
                        existingLower.add(ex.toLowerCase());
                    }
                }
            }

            // Add synonyms
            if (enrichment.synonyms && !synonyms) {
                synonyms = enrichment.synonyms;
            }
        } else {
            noEnrich++;
        }

        return {
            ...card,
            front,
            examples,
            synonyms,
        };
    });

    console.log(`\nFronts applied: ${frontApplied}`);
    console.log(`Enrichment applied: ${enrichApplied}`);
    console.log(`No enrichment match: ${noEnrich}`);

    // 5. Quality report
    const stats = {
        total: finalCards.length,
        hasHint: finalCards.filter(c => c.front.includes('===HINT===')).length,
        hasPronunciation: finalCards.filter(c => c.pronunciation).length,
        hasSynonyms: finalCards.filter(c => c.synonyms).length,
        examples1: finalCards.filter(c => c.examples.length === 1).length,
        examples2: finalCards.filter(c => c.examples.length === 2).length,
        examples3: finalCards.filter(c => c.examples.length === 3).length,
        examples4: finalCards.filter(c => c.examples.length >= 4).length,
        hasWordForms: finalCards.filter(c => c.word_forms && Object.values(c.word_forms).filter(v => v).length >= 2).length,
    };

    console.log("\n--- Quality Report ---");
    console.log(`Total: ${stats.total}`);
    console.log(`Has hint: ${stats.hasHint} (${(stats.hasHint/stats.total*100).toFixed(1)}%)`);
    console.log(`Has pronunciation: ${stats.hasPronunciation} (${(stats.hasPronunciation/stats.total*100).toFixed(1)}%)`);
    console.log(`Has synonyms: ${stats.hasSynonyms} (${(stats.hasSynonyms/stats.total*100).toFixed(1)}%)`);
    console.log(`Examples: 1=${stats.examples1}, 2=${stats.examples2}, 3=${stats.examples3}, 4+=${stats.examples4}`);
    console.log(`Word forms (2+ fields): ${stats.hasWordForms} (${(stats.hasWordForms/stats.total*100).toFixed(1)}%)`);

    // Show samples
    console.log("\n--- Sample Cards ---");
    const samples = finalCards.filter(c => c.pronunciation && c.synonyms && c.examples.length >= 4).slice(0, 3);
    for (const s of samples) {
        console.log(`\n  ${s.back} (${s.pronunciation})`);
        console.log(`  Front: ${s.front}`);
        console.log(`  Examples: ${s.examples.length}`);
        console.log(`  Synonyms: ${s.synonyms?.substring(0, 80)}...`);
        console.log(`  Word forms: ${JSON.stringify(s.word_forms)}`);
    }

    // 6. Insert into Supabase
    console.log("\n--- Inserting into Supabase ---");

    const BATCH_SIZE = 50;
    let successCount = 0;
    let failCount = 0;
    const failedWords = [];

    for (let i = 0; i < finalCards.length; i += BATCH_SIZE) {
        const batch = finalCards.slice(i, i + BATCH_SIZE);
        const { error } = await supabase.from('cards').insert(batch);

        if (error) {
            for (const card of batch) {
                const { error: singleError } = await supabase.from('cards').insert(card);
                if (singleError) {
                    failCount++;
                    failedWords.push(card.back);
                } else {
                    successCount++;
                }
            }
        } else {
            successCount += batch.length;
        }

        const progress = Math.min(i + BATCH_SIZE, finalCards.length);
        if (progress % 500 === 0 || progress === finalCards.length) {
            console.log(`Progress: ${progress}/${finalCards.length} (${successCount} ok, ${failCount} failed)`);
        }
    }

    console.log(`\n=== FINAL RESULTS ===`);
    console.log(`Successfully inserted: ${successCount}`);
    console.log(`Failed: ${failCount}`);
    if (failedWords.length > 0) {
        console.log(`Failed words: ${failedWords.slice(0, 20).join(", ")}`);
    }
    console.log("Done!");
}

main().catch(err => {
    console.error("Fatal:", err);
    process.exit(1);
});
