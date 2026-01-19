import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

const MANUAL_FIXES = {
    "The early bird catches the worm": "سحرخیز باش تا کامروا باشی",
    "Watch your mouth": "مراقب حرف زدنت باش",
    "Hit the sack": "خوابیدن",
    "Piece of cake": "مثل آب خوردن",
    "It's raining cats and dogs": "مثل دم اسب باران می‌بارد"
};

async function main() {
    console.log("Applying Manual Fixes...");
    
    for (const [english, persian] of Object.entries(MANUAL_FIXES)) {
        console.log(`Fixing: ${english} -> ${persian}`);
        
        // Find cards with this back (case-insensitive)
        const { data: cards, error } = await supabase
            .from('cards')
            .select('id, back, front')
            .ilike('back', english.trim());
            
        if (error) console.error(error);
        
        if (cards && cards.length > 0) {
            for (const card of cards) {
                 const { error: updateError } = await supabase
                    .from('cards')
                    .update({ front: persian })
                    .eq('id', card.id);
                 if (!updateError) console.log(`✅ Updated card ${card.id}`);
            }
        } else {
            console.log(`⚠️ Card not found for: ${english}`);
        }
    }
}

main();
