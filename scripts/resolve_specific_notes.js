
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load Env
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

if (!urlMatch || !keyMatch) {
    console.error("Supabase credentials not found");
    process.exit(1);
}

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function main() {
    console.log("Resolving specific notes...");

    // 1. Fix "حل اختلاف"
    const id1 = '08d6099e-b9d7-48f2-a9af-9f1061ff29de';
    console.log(`Updating card ${id1}...`);
    const { error: err1 } = await supabase
        .from('cards')
        .update({ 
            front: 'حل اختلاف',
            user_notes: null 
        })
        .eq('id', id1);
    
    if (err1) console.error(`Error updating ${id1}:`, err1);
    else console.log(`Updated ${id1} successfully.`);

    // 2. Clear note for "ترسو"
    const id2 = 'f32df88c-1b47-419b-a7b6-8fc379978eb0';
    console.log(`Clearing note for ${id2}...`);
    const { error: err2 } = await supabase
        .from('cards')
        .update({ user_notes: null })
        .eq('id', id2);

    if (err2) console.error(`Error updating ${id2}:`, err2);
    else console.log(`Cleared note for ${id2}.`);

    // 3. Clear note for "همراه آمدن"
    const id3 = '3ae74a6c-9091-4721-834c-37d160253314';
    console.log(`Clearing note for ${id3}...`);
    const { error: err3 } = await supabase
        .from('cards')
        .update({ user_notes: null })
        .eq('id', id3);

    if (err3) console.error(`Error updating ${id3}:`, err3);
    else console.log(`Cleared note for ${id3}.`);
    
    console.log("Done.");
}

main();
