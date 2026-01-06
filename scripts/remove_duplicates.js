import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load Supabase credentials
const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

const stateRank = {
    'REVIEW': 4,
    'LEARNING': 3,
    'RELEARNING': 3,
    'NEW': 1,
    'suspended': 0
};

async function main() {
    console.log("🚀 Starting Duplicate Removal...");

    // 1. Fetch ALL cards
    let allCards = [];
    let page = 0;
    console.log("Fetching cards...");
    while(true) {
        const { data, error } = await supabase.from('cards').select('*').range(page*1000, (page+1)*1000 - 1);
        if(!data || data.length === 0) break;
        allCards.push(...data);
        page++;
    }
    console.log(`Fetched ${allCards.length} cards.`);

    // 2. Group by normalized Back (English)
    const groups = {};
    for (const card of allCards) {
        if (!card.back) continue;
        const key = card.back.trim().toLowerCase();
        if (!groups[key]) groups[key] = [];
        groups[key].push(card);
    }

    // 3. Identify duplicates
    const duplicates = Object.values(groups).filter(g => g.length > 1);
    console.log(`Found ${duplicates.length} sets of duplicates.`);

    // 4. Determine keep/delete
    const toDeleteIds = [];


    
    // Iterate over the groups values
    Object.values(groups).forEach(group => {
        if (group.length <= 1) return;

        // Sort to find the BEST card to Keep
        group.sort((a, b) => {
            // 1. Higher State Rank first
            const rankA = stateRank[a.state] || 1;
            const rankB = stateRank[b.state] || 1;
            if (rankA !== rankB) return rankB - rankA;

            // 2. Higher Interval (More progress)
            const intA = a.interval || 0;
            const intB = b.interval || 0;
            if (intA !== intB) return intB - intA;

            // 3. Older create date (Preserve history/original)
            // Actually, maybe newer is better if semantic enrichment was recent? 
            // But they were all enriched recently.
            // Let's keep the one created earlier as the "original".
            return new Date(a.created_at) - new Date(b.created_at);
        });

        // The first one is the winner
        const keeper = group[0];
        const losers = group.slice(1);

        // console.log(`Keeping "${keeper.back}" (State: ${keeper.state}, ID: ${keeper.id}). Deleting ${losers.length} others.`);
        
        losers.forEach(l => toDeleteIds.push(l.id));
    });

    console.log(`Identified ${toDeleteIds.length} cards to delete.`);

    if (toDeleteIds.length === 0) {
        console.log("No duplicates to delete.");
        return;
    }

    // 5. Delete in batches
    const BATCH_SIZE = 100;
    for (let i = 0; i < toDeleteIds.length; i += BATCH_SIZE) {
        const batch = toDeleteIds.slice(i, i + BATCH_SIZE);
        const { error } = await supabase.from('cards').delete().in('id', batch);
        if (error) {
            console.error("Error deleting batch:", error);
        } else {
            console.log(`Deleted batch ${i+1}-${i+batch.length}`);
        }
    }

    console.log("Cleanup Complete! 🧹");
}

main();
