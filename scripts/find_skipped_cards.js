import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

async function check() {
    console.log("Scanning for messy/skipped cards...");
    
    // Fetch all cards and filter in memory since regex filter might be tricky over API
    // Or just check for missing word_forms / weird fronts
    let page = 0;
    let messyCount = 0;
    let messyIds = [];

    while(true) {
        const { data: cards, error } = await supabase
            .from('cards')
            .select('*')
            .range(page * 1000, (page + 1) * 1000 - 1);
        
        if (!cards || cards.length === 0) break;

        for (const c of cards) {
            // Criteria for "Messy":
            // 1. Front contains "**Def**" (Old format)
            // 2. Word Forms is empty/null (Enrichment didn't run/save)
            // 3. Front looks like English (Standardization should have made it Persian)
            //    -> Hard to detect strictly, but we can check if it has ASCII only?
            
            const isOldFormat = c.front.includes("**Def**") || c.front.startsWith("Word:");
            const missingEnrichment = !c.word_forms || Object.keys(c.word_forms).length === 0;
            
            if (isOldFormat || missingEnrichment) {
                messyCount++;
                messyIds.push(c.id);
                // console.log(`Found messy card: ${c.front.substring(0, 50)}...`);
            }
        }
        console.log(`Scanned page ${page}. Total messy so far: ${messyCount}`);
        page++;
    }

    console.log(`Total messy/skipped cards found: ${messyCount}`);
    fs.writeFileSync('skipped_cards.json', JSON.stringify(messyIds, null, 2));
}

check();
