import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load Env
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function main() {
    console.log("Applying manual note resolutions...");
    
    const updates = [
        {
            id: "34ad10df-df20-4b9a-b949-b2a0167a461e", // fancy sb
            examples: [
                "Women who fancy someone often smile more.",
                "I think he fancies you.",
                "Do you fancy a drink tonight?"
            ],
            user_notes: null
        },
        {
            id: "d6c241a1-96f7-4fbc-80b4-afbfc8e44bc0", // Remorse
            examples: [
                "The killer showed no remorse.",
                "He was filled with remorse for his actions.",
                "She felt a pang of remorse."
            ],
            user_notes: null
        },
        {
            id: "ff6639a7-7f8f-43d2-a082-32a125a4457f", // deteriorate
            examples: [
                "Her health began to deteriorate rapidly.",
                "Relations between the countries have deteriorated sharply.",
                "The weather deteriorated overnight."
            ],
            user_notes: null
        }
    ];

    for (const update of updates) {
        const { error } = await supabase
            .from('cards')
            .update({ examples: update.examples, user_notes: update.user_notes })
            .eq('id', update.id);
            
        if (error) console.error(`Failed ${update.id}:`, error);
        else console.log(`Updated & Cleared Note for ${update.id}`);
    }
}

main();
