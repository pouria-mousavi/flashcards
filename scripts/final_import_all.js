
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load Env
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

if (!urlMatch || !keyMatch) {
    console.error("Supabase credentials not found in .env");
    process.exit(1);
}

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function main() {
    console.log("Starting Final Database Update (Optimized)...");

    const jsonPath = path.resolve(process.cwd(), 'all_words_processed.json');
    if (!fs.existsSync(jsonPath)) {
        console.error("all_words_processed.json not found!");
        process.exit(1);
    }

    const content = fs.readFileSync(jsonPath, 'utf8');
    let cards;
    try {
        cards = JSON.parse(content);
    } catch (e) {
        console.error("Failed to parse JSON:", e.message);
        process.exit(1);
    }

    if (!Array.isArray(cards)) {
        console.error("JSON root is not an array.");
        process.exit(1);
    }

    console.log(`Found ${cards.length} cards to process.`);

    let successCount = 0;
    let failCount = 0;
    let processedCount = 0;

    const BATCH_SIZE = 20; // Number of concurrent requests

    for (let i = 0; i < cards.length; i += BATCH_SIZE) {
        const batch = cards.slice(i, i + BATCH_SIZE);
        const promises = batch.map(async (card) => {
            if (!card.id) return;

            const { error } = await supabase
                .from('cards')
                .update({
                    front: card.front,
                    back: card.back,
                    pronunciation: card.pronunciation,
                    tone: card.tone,
                    word_forms: card.word_forms,
                    examples: card.examples,
                    other_meanings: card.other_meanings,
                    user_notes: null 
                })
                .eq('id', card.id);

            if (error) {
                // Ignore unique constraint errors on front to reduce noise, they are collisions
                if (!error.message.includes("unique_front")) {
                     console.error(`Failed to update ${card.id}:`, error.message);
                }
                failCount++;
            } else {
                successCount++;
            }
        });

        await Promise.all(promises);
        processedCount += batch.length;

        if (processedCount % 100 === 0) {
             console.log(`Processed ${Math.min(processedCount, cards.length)}/${cards.length}...`);
        }
    }

    console.log("\n--- Final Update Complete ---");
    console.log(`Successfully updated: ${successCount}`);
    console.log(`Failed/Skipped: ${failCount}`);
}

main();
