import { createClient } from '@supabase/supabase-js';

const args = process.argv.slice(2);
const [url, key] = args;
const supabase = createClient(url, key);

async function checkCount() {
    const { count, error } = await supabase
        .from('cards')
        .select('*', { count: 'exact', head: true });
        
    if (error) console.error("Error:", error);
    else console.log(`Total cards in DB: ${count}`);
}

checkCount();
