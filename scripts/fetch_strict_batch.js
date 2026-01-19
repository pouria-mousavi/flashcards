
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

async function fetchCandidates() {
    let page = 0;
    const size = 1000; // fetch large chunks to find the gaps
    let found = [];
    
    // Scan db
    while(found.length < 200) { // Get 200 at a time
        const { data, error } = await supabase
            .from('cards')
            .select('id, front, back, examples')
            .range(page * size, (page + 1) * size - 1)
            .order('created_at', { ascending: true }); // Try oldest first again, but with strict check
            
        if (error || !data || data.length === 0) break;
        
        const strictIncomplete = data.filter(c => {
             if (!c.examples) return true;
             if (!Array.isArray(c.examples)) return true;
             return c.examples.length < 4;
        });
        
        found = found.concat(strictIncomplete);
        page++;
        if (page > 10) break; // safety
    }

    // Slice to 200
    const batch = found.slice(0, 200);

    if (batch.length > 0) {
        fs.writeFileSync('strict_batch.json', JSON.stringify(batch, null, 2));
        console.log(`Wrote ${batch.length} cards to strict_batch.json`);
    } else {
        console.log("No strictly unenriched cards found.");
    }
}

fetchCandidates();
