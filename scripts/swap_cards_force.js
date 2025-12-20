import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function main() {
    let page = 0;
    const pageSize = 1000;
    let swapped = 0;
    
    while (true) {
        const { data: cards, error } = await supabase
            .from('cards')
            .select('*')
            .eq('state', 'NEW')
            .range(page * pageSize, (page + 1) * pageSize - 1);
        
        if (error || !cards || cards.length === 0) break;
        
        console.log(`Page ${page}: Inspecting ${cards.length} cards...`);

        for (const card of cards) {
            // Heuristic for "Needs Swap":
            // Front is "English Word" (No '**Def**', No Persian)
            // Back is "Farsi/Def" (Has Persian or '**Def**')
            
            const frontHasMetdata = card.front.includes("**Def**") || /[\u0600-\u06FF]/.test(card.front);
            
            if (!frontHasMetdata) {
                // Front looks like a pure word (e.g., "Abomination").
                // Check if it's actually just English text.
                // WE SWAP!
                
                await supabase.from('cards').update({ 
                    front: card.back, 
                    back: card.front 
                }).eq('id', card.id);
                
                swapped++;
                if (swapped % 50 === 0) process.stdout.write('S');
            }
        }
        page++;
    }
    console.log(`\nForce Swapped ${swapped} cards.`);
}

main();
