import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function main() {
    // Check "Abomination"
    const { data: cards } = await supabase.from('cards').select('*').ilike('back', '%Abomination%'); // Should be on back now
    console.log("Checking for Abomination on BACK:", JSON.stringify(cards, null, 2));
    
    // Check "nauseating" (likely front?)
    const { data: cards2 } = await supabase.from('cards').select('*').ilike('front', '%نفرت%'); // Should contain Persian on front
    console.log("Checking for Farsi on FRONT:", JSON.stringify(cards2, null, 2));
}

main();
