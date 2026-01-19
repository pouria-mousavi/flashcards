import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

// Heuristics to determine forms
function inferForms(rawWord) {
    let word = rawWord.trim();
    let forms = {};

    // 1. Clean weird suffixes like " (2moro)" or " (N)"
    // Extract POS if possible
    let pos = null;
    if (word.match(/\(N\)/i)) pos = 'noun';
    if (word.match(/\(V\)/i)) pos = 'verb';
    if (word.match(/\(ADJ\)/i)) pos = 'adj';
    if (word.match(/\(ADV\)/i)) pos = 'adv';

    // Remove parens and extra info for the "clean word"
    let cleanWord = word.replace(/\(.*?\)/g, '').trim();
    cleanWord = cleanWord.replace(/\[.*?\]/g, '').trim(); // IPA
    
    // If definition, just take the first word or give up (empty forms) because we can't reliably parse
    if (cleanWord.includes(' ')) {
        // Multi-word phrase -> likely no forms needed (phrasal verb, idiom)
        // Check if it's a phrasal verb?
        return {}; 
    }

    if (!cleanWord) return {};

    // Simple mapping based on inferred POS
    if (pos === 'noun') forms.noun = cleanWord.toLowerCase();
    if (pos === 'verb') forms.verb = cleanWord.toLowerCase();
    if (pos === 'adj') forms.adj = cleanWord.toLowerCase();
    if (pos === 'adv') forms.adv = cleanWord.toLowerCase();

    // If no POS found, but it's a single word, assume it's the primary form (noun/verb) based on casing?
    // Actually safe to leave empty if unknown, as user can edit later. 
    // The goal is to clear the NULL state.
    if (!pos && cleanWord.length > 2) {
       // Conservative: don't guess too much.
       // Maybe noun?
       // forms.noun = cleanWord.toLowerCase(); 
    }

    return forms;
}

async function main() {
    console.log("Reading words_export.json...");
    const rawData = fs.readFileSync('words_export.json', 'utf8');
    const allCards = JSON.parse(rawData);

    // Process top 300
    const batch = allCards.slice(0, 300);
    console.log(`Processing batch of ${batch.length} cards...`);

    let processedCount = 0;
    for (const item of batch) {
        const wordString = item.word;
        const forms = inferForms(wordString);

        // ALWAYS update, even if forms is {}, to clear the NULL
        const { error } = await supabase
            .from('cards')
            .update({ word_forms: forms })
            .eq('id', item.id);

        if (error) {
            console.error(`Error updating ${item.id} (${wordString}):`, error.message);
        } else {
            processedCount++;
            // console.log(`Processed: ${wordString} -> ${JSON.stringify(forms)}`);
        }
        
        // Small internal throttle if needed, but sequential await is usually fine
    }

    console.log(`Finished processing ${processedCount} cards.`);
}

main();
