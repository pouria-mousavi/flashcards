const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const ROOT = path.resolve(__dirname, '..');
const envContent = fs.readFileSync(path.join(ROOT, '.env'), 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);
const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function main() {
    console.log("=== FINAL MERGE + INSERT ===\n");

    // 1. Load base cards
    const cards = JSON.parse(fs.readFileSync(path.join(ROOT, 'all_new_cards_deduped.json'), 'utf8'));
    console.log(`Base cards: ${cards.length}`);

    // 2. Load all rewritten fronts into a map (back -> new front)
    const frontMap = {};
    let rewrittenTotal = 0;
    for (let i = 0; i < 22; i++) {
        const filePath = path.join(ROOT, `rewritten_${i}.json`);
        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            for (const item of data) {
                if (item.back && item.front) {
                    frontMap[item.back.toLowerCase().trim()] = item.front;
                    rewrittenTotal++;
                }
            }
        } catch (e) {
            console.error(`Missing or error in rewritten_${i}.json: ${e.message}`);
        }
    }
    console.log(`Rewritten fronts loaded: ${rewrittenTotal} (unique: ${Object.keys(frontMap).length})`);

    // 3. Apply rewritten fronts
    let appliedCount = 0;
    let missedCount = 0;
    const missed = [];

    const finalCards = cards.map(card => {
        const key = card.back.toLowerCase().trim();
        const newFront = frontMap[key];

        if (!newFront) {
            missedCount++;
            missed.push(card.back);
            return card;
        }

        appliedCount++;
        return { ...card, front: newFront };
    });

    console.log(`Applied: ${appliedCount}, Missed: ${missedCount}`);
    if (missed.length > 0 && missed.length <= 20) {
        console.log("Missed words:", missed.join(", "));
    }

    // 4. Quality checks
    let issues = [];
    for (const card of finalCards) {
        if (!card.front.includes('===HINT===')) {
            issues.push(`No hint separator: ${card.back}`);
        }
        const hintPart = card.front.split('===HINT===')[1]?.trim();
        if (hintPart && hintPart.length > 1) {
            issues.push(`Hint too long (${hintPart}): ${card.back}`);
        }
        if (!card.pronunciation) {
            // Not a blocker, just note it
        }
        if (!card.examples || card.examples.length === 0) {
            issues.push(`No examples: ${card.back}`);
        }
    }

    if (issues.length > 0) {
        console.log(`\n--- Quality Issues (${issues.length}) ---`);
        issues.slice(0, 20).forEach(i => console.log(`  ${i}`));
        if (issues.length > 20) console.log(`  ... and ${issues.length - 20} more`);
    } else {
        console.log("\nAll cards pass quality checks!");
    }

    // 5. Show samples
    console.log("\n--- Sample Cards ---");
    const samples = finalCards.filter(c => c.pronunciation && c.examples.length >= 3).slice(0, 5);
    for (const s of samples) {
        console.log(`\n  ${s.back} (${s.pronunciation})`);
        console.log(`  Front: ${s.front}`);
        console.log(`  Examples: ${s.examples.length}`);
        console.log(`  Synonyms: ${s.synonyms?.substring(0, 60) || 'none'}...`);
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
            // Try one by one
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
