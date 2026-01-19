
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

async function main() {
    const { count, error } = await supabase
        .from('cards')
        .select('*', { count: 'exact', head: true });

    if (error) console.error(error);
    else console.log(`TRUE TOTAL COUNT: ${count}`);
}

main();
