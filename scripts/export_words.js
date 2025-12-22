import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function main() {
    console.log("Exporting all words...");
    
    const { data: cards, error } = await supabase
        .from('cards')
        .select('id, back')
        .is('word_forms', null); // Only missing ones
        
    if (error) { console.error(error); return; }
    
    console.log(`Found ${cards.length} cards missing forms.`);
    
    // Clean up content
    const cleanList = cards.map(c => ({
        id: c.id,
        word: c.back.split('\n')[0].replace(/\[.*?\]/g, '').trim() // Remove IPA/newlines
    }));
    
    fs.writeFileSync('words_export.json', JSON.stringify(cleanList, null, 2));
    console.log("Exported to words_export.json");
}

main();
