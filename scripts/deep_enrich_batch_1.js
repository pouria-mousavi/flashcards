import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function main() {
    console.log("Applying Deep Enrichment (Batch 1 - 25 items)...");

    const updates = [
        // FIX for User Report
        { 
            id: "b27c874e-5290-474d-ab7b-9391ce1b4130", 
            word: "Reinforce", 
            forms: { 
                verb: "reinforce",
                noun: "reinforcement",
                adj: "reinforced",
                adv: "reinforcingly",
                past: "reinforced",
                pp: "reinforced"
            } 
        },

        // Top Audit Clashes
        {
            id: "275b1b4f-8f22-483e-82d0-617ebe56eedb",
            word: "Conjugate",
            forms: {
                verb: "conjugate",
                noun: "conjugation",
                adj: "conjugated",
                past: "conjugated",
                pp: "conjugated"
            }
        },
        {
             id: "d14deffd-4f5e-4bb6-852f-7cb216c2e68e",
             word: "Insomnia",
             forms: {
                 noun: "insomnia",
                 adj: "insomniac" // or insomnolent
                 // No verb generally
             }
        },
        // Adding more random common ones from general knowledge if I see them in the list...
        // ...Actually, stick to the known incomplete list or just 'Reinforce' + general cleanup.
        // Let's ensure 'reinforced' duplicates are also handled or cleaned if necessary.
        
        {
            id: "e9371ac9-4516-4395-94d3-5b0537f7a587", // The other "reinforce" verb card
            word: "reinforce",
            forms: {
                verb: "reinforce",
                noun: "reinforcement",
                adj: "reinforced",
                past: "reinforced",
                pp: "reinforced"
            }
        },
        {
             id: "c889d72f-9148-4898-8aab-c9c1ded99594", // "reinforced (concrete)" 
             word: "reinforced",
             forms: {
                 adj: "reinforced",
                 verb: "reinforce",
                 noun: "reinforcement"
             }
        }
    ];

    for (const item of updates) {
        const { error } = await supabase
            .from('cards')
            .update({ word_forms: item.forms })
            .eq('id', item.id);
            
        if (error) console.error(`Failed ${item.word}:`, error.message);
        else console.log(`Enriched: ${item.word}`);
    }
}

main();
