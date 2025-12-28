import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function main() {
    console.log("Auditing Word Forms Gap...");

    // Fetch ALL cards
    const { data: allCards, error } = await supabase
        .from('cards')
        .select('id, front, back, word_forms');

    if (error) {
        console.error("Error fetching cards:", error);
        return;
    }

    console.log(`Total cards in DB: ${allCards.length}`);

    // Categories
    const noForms = [];       // word_forms is null or {}
    const partialForms = [];  // word_forms has some keys but < 3
    const goodForms = [];     // word_forms has 3+ keys

    for (const card of allCards) {
        const forms = card.word_forms;
        
        if (!forms || Object.keys(forms).length === 0) {
            noForms.push(card);
        } else {
            const filledCount = Object.values(forms).filter(v => !!v).length;
            if (filledCount < 3) {
                partialForms.push({ ...card, filledCount });
            } else {
                goodForms.push(card);
            }
        }
    }

    console.log(`\n--- RESULTS ---`);
    console.log(`Cards with NO word forms: ${noForms.length}`);
    console.log(`Cards with PARTIAL forms (<3): ${partialForms.length}`);
    console.log(`Cards with GOOD forms (3+): ${goodForms.length}`);

    // Sample of cards with NO forms (first 20)
    console.log(`\n--- SAMPLE: No Forms (first 20) ---`);
    noForms.slice(0, 20).forEach(c => {
        // Extract first line of back as the "word"
        const word = c.back.split('\n')[0].substring(0, 40);
        console.log(`- ${word}`);
    });

    // Export for further processing
    const exportData = noForms.map(c => ({
        id: c.id,
        word: c.back.split('\n')[0].substring(0, 60),
        front: c.front.substring(0, 60)
    }));
    fs.writeFileSync('cards_without_forms.json', JSON.stringify(exportData, null, 2));
    console.log(`\nExported ${exportData.length} cards without forms to cards_without_forms.json`);
}

main();
