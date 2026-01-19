
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
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
const anthropicKey = env.VITE_CLAUDE_KEY || process.env.VITE_CLAUDE_KEY;

if (!supabaseUrl || !supabaseKey || !anthropicKey) {
    console.error("Missing env vars. Need Supabase and Claude Key.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const anthropic = new Anthropic({ apiKey: anthropicKey });

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
            
            // Ask Claude to differntiate them
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
                const msg = await anthropic.messages.create({
                    model: "claude-3-haiku-20240307",
                    max_tokens: 300,
                    messages: [{ role: "user", content: prompt }]
                });
                
                const text = msg.content[0].text;
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
                console.error("Claude Error:", err);
            }
        }
    }
    console.log(`\nProcessed ${duplicatesFound} duplicate groups.`);
}

deduplicate();
