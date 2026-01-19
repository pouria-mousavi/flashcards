import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function main() {
    console.log("Exporting Deep Enrichment Candidates...");
    
    // Fetch ALL cards
    const { data: cards, error } = await supabase
        .from('cards')
        .select('id, back, word_forms')
        // Filter out obvious sentences later in JS to be safe
        .range(0, 4999);

    if (error) {
        console.error(error);
        return;
    }

    const candidates = cards.filter(c => {
        // Clean the word
        const cleanWord = c.back.replace(/\(.*?\)/g, '').trim(); // Remove (N), (V)
        const wordCount = cleanWord.split(' ').length;
        
        // Include if:
        // 1. Short (1-3 words)
        // 2. AND (Missing forms OR has NULL forms)
        // We want to "make sure every card... has it". 
        // So we check if it already has all 6. If not, it's a candidate.
        
        const wf = c.word_forms || {};
        const hasAll = wf.noun && wf.verb && wf.adj && wf.adv && wf.past && wf.pp; // strict check
        
        // Relax strictness: Some words legitimately don't have all.
        // But we put them in the candidate list to checking.
        
        return wordCount <= 3 && !hasAll; 
    }).map(c => ({
        id: c.id,
        word: c.back,
        existing: c.word_forms || {}
    }));

    console.log(`Found ${candidates.length} candidates for deep enrichment out of ${cards.length} total.`);
    
    fs.writeFileSync('deep_candidates.json', JSON.stringify(candidates, null, 2));
}

main();
