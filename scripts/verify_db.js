import { createClient } from '@supabase/supabase-js';

const url = process.argv[2];
const key = process.argv[3];
const supabase = createClient(url, key);

async function check() {
    const { data, error } = await supabase.from('cards').select('front, examples').limit(3);
    if (error) {
        console.error(error);
        return;
    }
    console.log("Data sample:", JSON.stringify(data, null, 2));
    
    data.forEach(d => {
        console.log(`Front: ${d.front}`);
        console.log(`Examples type: ${typeof d.examples}`);
        console.log(`Is Array? ${Array.isArray(d.examples)}`);
    });
}

check();
