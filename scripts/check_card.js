
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

async function main() {
    const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('id', '00ec828b-7135-4ed0-ab82-1643f57e671d')
        .single();
    
    if (error) console.error(error);
    else console.log(JSON.stringify(data, null, 2));
}

main();
