import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function main() {
    let allCards = [];
    let page = 0;
    const pageSize = 1000;
    
    while (true) {
        const { data: cards, error } = await supabase
            .from('cards')
            .select('id, front, back')
            .is('tone', null)
            .range(page * pageSize, (page + 1) * pageSize - 1);
            
        if (error || !cards || cards.length === 0) break;
        
        allCards.push(...cards);
        console.log(` fetched ${cards.length}...`);
        page++;
    }

    fs.writeFileSync('untagged_list.json', JSON.stringify(allCards, null, 2));
    console.log(`Exported TOTAL ${allCards.length} cards to untagged_list.json`);
}

main();
