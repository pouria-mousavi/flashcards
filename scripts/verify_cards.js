import { createClient } from '@supabase/supabase-js';

const args = process.argv.slice(2);
const [url, key] = args;
const supabase = createClient(url, key);

async function verify() {
    // Check for deleted
    const { data: lost, error: e1 } = await supabase.from('cards').select('*').eq('front', 'منو ببخش');
    
    // Check for added
    const { data: found, error: e2 } = await supabase.from('cards').select('*').eq('front', 'با مخالفت موافقت کردن');

    if (lost && lost.length > 0) console.log("FAIL: Beginner card 'Forgive me' still exists!");
    else console.log("PASS: Beginner card 'Forgive me' is gone.");
    
    if (found && found.length > 0) console.log("PASS: Advanced card 'Agree to disagree' exists.");
    else console.log("FAIL: Advanced card 'Agree to disagree' missing.");
}

verify();
