import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load Env
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

if (!urlMatch || !keyMatch) {
    console.error("Supabase credentials not found");
    process.exit(1);
}

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function main() {
    console.log("Fetching cards with notes...");
    
    const { data: cards, error } = await supabase
        .from('cards')
        .select('id, front, back, user_notes')
        .not('user_notes', 'is', null)
        .neq('user_notes', ''); // Also exclude empty strings if not null
        
    if (error) {
        console.error("Error:", error);
        return;
    }
    
    console.log(`Found ${cards.length} cards with notes.`);
    cards.forEach(c => {
        console.log("---------------------------------------------------");
        console.log(`ID: ${c.id}`);
        console.log(`Front: ${c.front}`);
        console.log(`Note: "${c.user_notes}"`);
    });
}

main();
