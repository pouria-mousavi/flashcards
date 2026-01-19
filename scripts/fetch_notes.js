import { createClient } from '@supabase/supabase-js';

const args = process.argv.slice(2);
if (args.length < 2) {
    console.error("Usage: node scripts/fetch_notes.js <URL> <KEY>");
    process.exit(1);
}
const [url, key] = args;
const supabase = createClient(url, key);

async function fetchNotes() {
    console.log("Checking for pending user notes...");
    
    const { data: cards, error } = await supabase
        .from('cards')
        .select('id, front, back, user_notes')
        .not('user_notes', 'is', null)
        .neq('user_notes', '');

    if (error) {
        console.error("Error fetching notes:", error);
        return;
    }

    if (cards && cards.length > 0) {
        console.log(`Found ${cards.length} cards with notes:`);
        console.log(JSON.stringify(cards, null, 2));
    } else {
        console.log("No pending notes found.");
    }
}

fetchNotes();
