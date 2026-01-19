
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

async function check() {
    let page = 0;
    const size = 1000;
    let allCards = [];
    
    while(true) {
        const { data, error } = await supabase
            .from('cards')
            .select('id, front, back, examples')
            .range(page * size, (page + 1) * size - 1);
            
        if (error) {
            console.error(error);
            break;
        }
        if (!data || data.length === 0) break;
        
        allCards = allCards.concat(data);
        page++;
    }

    const incomplete = allCards.filter(c => {
        if (!c.examples) return true;
        if (!Array.isArray(c.examples)) return true;
        return c.examples.length < 4;
    });

    console.log(`Total Scanned: ${allCards.length}`);
    console.log(`Found ${incomplete.length} cards with < 4 examples.`);
    
    if (incomplete.length > 0) {
        console.log('Sample IDs:', incomplete.slice(0, 5).map(c => c.id));
        console.log('Sample Card:', incomplete[0]);
        fs.writeFileSync('strict_candidates.json', JSON.stringify(incomplete, null, 2));
    }
}

check();
