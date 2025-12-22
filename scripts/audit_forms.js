import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function main() {
    console.log("Auditing Word Forms...");
    
    // Fetch ALL cards with word_forms
    const { data: cards, error } = await supabase
        .from('cards')
        .select('id, back, word_forms')
        .not('word_forms', 'is', null);

    if (error) {
        console.error(error);
        return;
    }

    const incomplete = [];
    
    for (const card of cards) {
        const forms = card.word_forms;
        const keys = Object.keys(forms);
        const values = Object.values(forms).filter(v => !!v); // Non-empty values

        // Heuristic: If it has LESS than 3 forms, it's suspiciously sparse.
        // Or if it has 'verb' but no 'past'/'pp'.
        let isSuspicious = false;
        let reason = "";

        if (forms.verb && (!forms.past || !forms.pp)) {
            isSuspicious = true;
            reason = "Verb missing Past/PP";
        }
        
        if (forms.adj && !forms.adv && !forms.noun) {
             // Maybe okay for some adjectives, but check
             // isSuspicious = true; 
             // reason = "Adj missing Adv/Noun";
        }

        // Catch-all: If total meaningful forms < 3 (e.g. just Noun/Verb)
        // And word length > 5 (likely not a particle)
        if (values.length < 3 && card.back.length > 4 && !card.back.includes(' ')) {
             isSuspicious = true;
             reason = "Sparse Data (<3 forms)";
        }

        if (isSuspicious) {
            incomplete.push({
                id: card.id,
                word: card.back,
                forms: forms,
                reason
            });
        }
    }

    console.log(`Found ${incomplete.length} potentially incomplete cards out of ${cards.length} enriched cards.`);
    
    // Save to file for processing
    fs.writeFileSync('incomplete_forms.json', JSON.stringify(incomplete, null, 2));
    console.log("Saved candidates to incomplete_forms.json");
    
    // Preview top 5
    console.log("Top 5 candidates:");
    console.log(JSON.stringify(incomplete.slice(0, 5), null, 2));
}

main();
