
import { createClient } from '@supabase/supabase-js';
import { generateText, OPENAI_MODEL, env as aiEnv } from './lib/openai.cjs';
import fs from 'fs';
import path from 'path';

// Manual env parsing
const envPath = path.resolve(process.cwd(), '.env');
let env = {};

if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    lines.forEach(line => {
        const [key, ...rest] = line.split('=');
        if (key && rest.length > 0) {
            let val = rest.join('=').trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                val = val.slice(1, -1);
            }
            env[key.trim()] = val;
        }
    });
}

const supabaseUrl = env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const openaiKey = aiEnv.OPENAI_API_KEY;

if (!supabaseUrl || !supabaseKey || !openaiKey) {
    console.error("Missing env vars. Need Supabase and OpenAI Key.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function deduplicate() {
    console.log("Fetching all cards...");
    const { data: cards, error } = await supabase.from('cards').select('*');
    if (error) {
        console.error(error);
        return;
    }

    // Group by Front
    const groups = {};
    cards.forEach(c => {
        const front = c.front.trim(); // Normalize
        if (!groups[front]) groups[front] = [];
        groups[front].push(c);
    });

    let duplicatesFound = 0;
    for (const [front, group] of Object.entries(groups)) {
        if (group.length > 1) {
            duplicatesFound++;
            console.log(`\nDuplicate Front found: "${front}" (${group.length} cards)`);
            group.forEach(g => console.log(` - ID: ${g.id} | Back: ${g.back}`));
            
            // Ask OpenAI to differntiate them
            const backs = group.map(g => g.back).join(', ');
            const prompt = `
            The following English words have identically translated Flashcards in Persian ("${front}").
            Words: ${backs}
            
            Task: Provide DISTINCT, natural Persian translations for each word to avoid collision.
            If they truly mean the exact same thing, suggest which one to keep or how to merge, but prefer distinct nuances if possible.
            
            Output JSON:
            {
                "resolutions": [
                    { "word": "word1", "new_front": "Persian1" },
                    { "word": "word2", "new_front": "Persian2" }
                ]
            }
            `;
            
            try {
                const msg = await generateText({
                    model: OPENAI_MODEL,
                    maxOutputTokens: 300,
                    messages: [{ role: "user", content: prompt }]
                });
                
                const text = msg;
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const result = JSON.parse(jsonMatch[0]);
                    for (const res of result.resolutions) {
                        const targetCard = group.find(g => g.back === res.word);
                        if (targetCard) {
                            if (targetCard.front !== res.new_front) {
                                console.log(`   -> Updating "${targetCard.back}" to "${res.new_front}"`);
                                await supabase
                                    .from('cards')
                                    .update({ front: res.new_front, user_notes: (targetCard.user_notes || '') + ' [Deduplicated]' })
                                    .eq('id', targetCard.id);
                            } else {
                                console.log(`   -> "${targetCard.back}" keeps "${res.new_front}"`);
                            }
                        }
                    }
                }
            } catch (err) {
                console.error("OpenAI Error:", err);
            }
        }
    }
    console.log(`\nProcessed ${duplicatesFound} duplicate groups.`);
}

deduplicate();
