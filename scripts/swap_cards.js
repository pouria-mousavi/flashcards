import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load Env
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function main() {
    let count = 0;
    let page = 0;
    const pageSize = 1000;
    while (true) {
        const { data: cards, error } = await supabase
            .from('cards')
            .select('*')
            .eq('state', 'NEW')
            .range(page * pageSize, (page + 1) * pageSize - 1);
        
        if (error || !cards || cards.length === 0) break;
        
        console.log(`Page ${page}: Processing ${cards.length} cards...`);

        for (const card of cards) {
            // Safety: If Front contains "**Def**" or Persian, assume it's already Meaning (Swapped).
            // Persian Char Range: \u0600-\u06FF
            const hasPersian = /[\u0600-\u06FF]/.test(card.front);
            const hasDef = card.front.includes("**Def**");
            
            if (hasPersian || hasDef) {
                // Already swapped?
                continue;
            }

            const newFront = card.back;
            let newBack = card.front; 
            
            await supabase.from('cards').update({ front: newFront, back: newBack }).eq('id', card.id);
            count++;
        }
        page++;
    }
    
    console.log(`\nSwapped ${count} cards.`);
}

main();
