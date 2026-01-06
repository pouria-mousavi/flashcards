import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load Supabase credentials
const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

async function check() {
    console.log("Analyzing for duplicates...");

    // Fetch ALL cards (pagination needed if > 1000 generally, but let's try strict range loop)
    let allCards = [];
    let page = 0;
    while(true) {
        const { data, error } = await supabase.from('cards').select('*').range(page*1000, (page+1)*1000 - 1);
        if(!data || data.length === 0) break;
        allCards.push(...data);
        page++;
    }
    
    console.log(`Total cards scanned: ${allCards.length}`);

    // Group by BACK (English) normalizer
    const backGroups = {};
    const frontGroups = {}; // Just in case unique_front isn't perfect or normalized

    for (const card of allCards) {
        // Normalize Back
        const backNorm = (card.back || "").trim().toLowerCase();
        if (!backGroups[backNorm]) backGroups[backNorm] = [];
        backGroups[backNorm].push(card);

        // Normalize Front
        const frontNorm = (card.front || "").trim().toLowerCase();
        if (!frontGroups[frontNorm]) frontGroups[frontNorm] = [];
        frontGroups[frontNorm].push(card);
    }

    // Filter for duplicates
    const duplicatesBack = Object.entries(backGroups).filter(([k, v]) => v.length > 1);
    const duplicatesFront = Object.entries(frontGroups).filter(([k, v]) => v.length > 1);

    console.log(`\nFound ${duplicatesBack.length} sets of duplicates based on English Back (same word).`);
    console.log(`Found ${duplicatesFront.length} sets of normalized duplicates on Persian Front (should be 0 if unique constraint works).`);

    // Output sample
    if(duplicatesBack.length > 0) {
        console.log("\nSample Back Duplicates:");
        duplicatesBack.slice(0, 5).forEach(([key, list]) => {
            console.log(`Word: "${key}" (${list.length} cards)`);
            list.forEach(c => console.log(`   - ID: ${c.id} | Front: "${c.front}" | Quality: ${c.examples ? 'Enriched' : 'Raw'} | State: ${c.state}`));
        });
        
        // Save to file for processing script
        fs.writeFileSync('duplicates_back.json', JSON.stringify(duplicatesBack.map(x => x[1]), null, 2));
    }
    
    if(duplicatesFront.length > 0) {
        console.log("\nFront Duplicates (Constraint Violations?):");
        duplicatesFront.forEach(([key, list]) => {
            console.log(`Word: "${key}"`);
        });
    }
}

check();
