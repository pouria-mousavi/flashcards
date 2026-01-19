import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function main() {
    console.log("Applying Manual Resolution for 5 New Cards...");

    const updates = [
        // 1. repel/fight ("Give more examples")
        {
            id: "9725c9c2-9f4b-4dd3-9ba2-935ec82fc95f",
            changes: {
                examples: [
                    "The army successfully repelled the attack.",
                    "This coat has a special finish that repels moisture.",
                    "The walls repel water."
                ],
                user_notes: null
            }
        },
        // 2. confide in sb ("Add more examples")
        {
            id: "7c3fea71-f16b-4f7c-afbd-6ab28073355a",
            changes: {
                examples: [
                    "She confided in me about her problems with her husband.",
                    "I hope you know that you can always confide in me.",
                    "They're prepared to confide in me now."
                ],
                user_notes: null
            }
        },
        // 3. Going bust ("Add examples")
        {
            id: "defbdfe8-5a61-465a-ab52-c2334fdfa709",
            changes: {
                examples: [
                    "During the recession, thousands of small businesses went bust.",
                    "If we don't cut costs, the company will go bust within a year."
                ],
                user_notes: null
            }
        },
        // 4. with hindsight ("Add more examples")
        {
            id: "778a6349-b2b5-4b76-b21c-03dd5accbf02",
            changes: {
                examples: [
                    "With hindsight, I should have seen the warning signs.",
                    "It's easy to criticize with the benefit of hindsight.",
                    "With hindsight I should've worked harder."
                ],
                user_notes: null
            }
        },
        // 5. discharged ("Add more examples")
        {
            id: "cd21331f-1290-48e6-abe8-15343c5fb26f",
            changes: {
                examples: [
                    "He was discharged from the hospital yesterday.",
                    "She was discharged from the army after ten years of service.",
                    "The patient was discharged after making a full recovery."
                ],
                user_notes: null
            }
        }
    ];

    for (const item of updates) {
        const { error } = await supabase
            .from('cards')
            .update(item.changes)
            .eq('id', item.id);
        
        if (error) console.error(`Error updating ${item.id}: ${error.message}`);
        else console.log(`Resolved note for card ${item.id}`);
    }
    
    console.log("All 5 active notes resolved.");
}

main();
