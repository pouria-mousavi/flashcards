import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function main() {
    console.log("🛡️ Running Safety Check on Enrichment...");

    // 1. Get a random existing card
    const { data: cards } = await supabase.from('cards').select('*').limit(1);
    if (!cards || cards.length === 0) { console.log("No cards to test."); return; }
    
    const original = cards[0];
    console.log(`Target Validity Check: ${original.back}`);
    console.log(`Original Stats: State=${original.state}, Interval=${original.interval}, Ease=${original.ease_factor}, Due=${original.next_review}`);

    // 2. Mock Update (simulate what enrich_forms.js does)
    // It calls: .update({ word_forms: ... }).eq('id', ...)
    const dummyForms = { noun: "test", verb: "test" };
    
    const { error } = await supabase
        .from('cards')
        .update({ word_forms: dummyForms })
        .eq('id', original.id);

    if (error) { console.error("Update failed", error); return; }

    // 3. Re-fetch and Compare
    const { data: updatedCards } = await supabase.from('cards').select('*').eq('id', original.id);
    const updated = updatedCards[0];

    const statsChanged = 
        original.state !== updated.state ||
        original.interval !== updated.interval ||
        original.ease_factor !== updated.ease_factor ||
        original.next_review !== updated.next_review;

    if (statsChanged) {
        console.error("❌ CRITICAL FAILURE: Stats were modified!");
        console.error("Original:", original);
        console.error("Updated:", updated);
    } else {
        console.log("✅ SUCCESS: Study Progress (Stats) remained untouched.");
        console.log("Updated Word Forms:", updated.word_forms);
    }
    
    // Cleanup (optional, remove the dummy forms if we want, but it's just a test)
    // await supabase.from('cards').update({ word_forms: null }).eq('id', original.id);
}

main();
