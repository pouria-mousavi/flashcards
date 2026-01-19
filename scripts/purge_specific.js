import { createClient } from '@supabase/supabase-js';

const args = process.argv.slice(2);
const [url, key] = args;
const supabase = createClient(url, key);

async function purge() {
    console.log("Attempting to delete 'منو ببخش'...");
    
    // First check if it exists
    const { data: check, error: e1 } = await supabase
        .from('cards')
        .select('id, front')
        .eq('front', 'منو ببخش');

    if (e1) console.error("Check Error:", e1);
    else console.log("Found before purge:", check);

    if (check && check.length > 0) {
        // Delete by ID to be sure
        const ids = check.map(c => c.id);
        const { error: e2, count } = await supabase
            .from('cards')
            .delete({ count: 'exact' })
            .in('id', ids);
            
        if (e2) console.error("Delete Error:", e2);
        else console.log(`Deleted count: ${count}`);
    } else {
        console.log("Card not found, nothing to delete.");
    }
}

purge();
