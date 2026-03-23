
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
    console.log("Counting cards...");
    
    const { count, error } = await supabase
        .from('cards')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error("Error counting cards:", error);
    } else {
        console.log(`Total records in 'cards' table: ${count}`);
    }
}

main();
