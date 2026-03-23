const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const ROOT = path.resolve(__dirname, '..');
const envContent = fs.readFileSync(path.join(ROOT, '.env'), 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);
const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function main() {
    console.log("=== MERGE ENRICHMENT + INSERT ===\n");

    // 1. Load base cards
    const cards = JSON.parse(fs.readFileSync(path.join(ROOT, 'all_new_cards_deduped.json'), 'utf8'));
    console.log(`Base cards: ${cards.length}`);

    // 2. Load all enrichment files into a map
    const enrichMap = {};
    let enrichTotal = 0;
    for (let i = 0; i < 32; i++) {
        try {
            const data = JSON.parse(fs.readFileSync(path.join(ROOT, `enrichment_${i}.json`), 'utf8'));
            for (const item of data) {
                if (item.word) {
                    enrichMap[item.word.toLowerCase().trim()] = item;
                    enrichTotal++;
                }
            }
        } catch (e) {
            console.error(`Error loading enrichment_${i}.json: ${e.message}`);
        }
    }
    console.log(`Enrichment entries loaded: ${enrichTotal} (unique: ${Object.keys(enrichMap).length})`);

    // 3. Merge enrichment into base cards
    let mergedCount = 0;
    let noMatchCount = 0;

    const finalCards = cards.map(card => {
        const key = card.back.toLowerCase().trim();
        const enrichment = enrichMap[key];

        if (!enrichment) {
            noMatchCount++;
            return card;
        }

        mergedCount++;

        // Merge examples: keep book example first, add enrichment examples
        let examples = [...(card.examples || [])];
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
        let synonyms = card.synonyms;
        if (!synonyms && enrichment.synonyms) {
            synonyms = enrichment.synonyms;
        }

        return {
            ...card,
            examples,
            synonyms,
        };
    });

    console.log(`\nMerged: ${mergedCount}, No match: ${noMatchCount}`);

    // 4. Quality report
    const stats = {
        total: finalCards.length,
        withPronunciation: finalCards.filter(c => c.pronunciation).length,
        withSynonyms: finalCards.filter(c => c.synonyms).length,
        examples1: finalCards.filter(c => c.examples.length === 1).length,
        examples2: finalCards.filter(c => c.examples.length === 2).length,
        examples3: finalCards.filter(c => c.examples.length === 3).length,
        examples4: finalCards.filter(c => c.examples.length >= 4).length,
        goodWordForms: finalCards.filter(c => c.word_forms && Object.values(c.word_forms).filter(v => v).length >= 2).length,
    };

    console.log("\n--- Quality Report ---");
    console.log(`Total: ${stats.total}`);
    console.log(`With pronunciation: ${stats.withPronunciation} (${(stats.withPronunciation / stats.total * 100).toFixed(1)}%)`);
    console.log(`With synonyms: ${stats.withSynonyms} (${(stats.withSynonyms / stats.total * 100).toFixed(1)}%)`);
    console.log(`Examples: 1=${stats.examples1}, 2=${stats.examples2}, 3=${stats.examples3}, 4+=${stats.examples4}`);
    console.log(`Word forms (2+ fields): ${stats.goodWordForms} (${(stats.goodWordForms / stats.total * 100).toFixed(1)}%)`);

    // Show a sample
    const sample = finalCards.filter(c => c.pronunciation && c.synonyms && c.examples.length >= 3)[0];
    if (sample) {
        console.log("\n--- Sample Card ---");
        console.log(JSON.stringify(sample, null, 2));
    }

    // 5. Insert into Supabase
    console.log("\n--- Inserting into Supabase ---");

    const BATCH_SIZE = 50;
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < finalCards.length; i += BATCH_SIZE) {
        const batch = finalCards.slice(i, i + BATCH_SIZE);

        const { error } = await supabase.from('cards').insert(batch);

        if (error) {
            // Try one by one
            for (const card of batch) {
                const { error: singleError } = await supabase.from('cards').insert(card);
                if (singleError) {
                    failCount++;
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
    console.log("Done!");
}

main().catch(err => {
    console.error("Fatal:", err);
    process.exit(1);
});
