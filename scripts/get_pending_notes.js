import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load Env
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

if (!urlMatch || !keyMatch) {
    console.error("Supabase Credentials not found");
    process.exit(1);
}

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function main() {
    const { data: cards, error } = await supabase
        .from('cards')
        .select('*')
        .not('user_notes', 'is', null)
        .neq('user_notes', '');
        
    if (error) {
        console.error(error);
        return;
    }

    console.log(JSON.stringify(cards, null, 2));
}

main();
