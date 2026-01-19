import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function main() {
    // Fetch cards where user_notes is NOT NULL and NOT Empty string
    const { data: cards, error } = await supabase
        .from('cards')
        .select('*')
        .not('user_notes', 'is', null)
        .neq('user_notes', '');

    if (error) {
        console.error(error);
        return;
    }

    console.log(`Found ${cards.length} cards with notes.`);
    fs.writeFileSync('notes_dump.json', JSON.stringify(cards, null, 2));
}

main();
