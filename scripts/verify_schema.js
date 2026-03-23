
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
    console.log("Verifying other_meanings column...");

    const { data, error } = await supabase
        .from('cards')
        .select('other_meanings')
        .limit(1);

    if (error) {
        console.error("Verification FAILED:", error.message);
        console.error("It seems the column 'other_meanings' does not exist or is not accessible.");
    } else {
        console.log("Verification SUCCESS: 'other_meanings' column exists and is accessible.");
        console.log("Sample Data:", data);
    }
}

main();
