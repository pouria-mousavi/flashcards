import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function main() {
    const { count, error } = await supabase
        .from('cards')
        .select('*', { count: 'exact', head: true })
        .is('tone', null);

    if (error) console.error(error);
    else console.log(`Cards with missing Tone: ${count}`);
}

main();
