
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

async function fixNotes() {
    console.log("Fetching cards with notes...");
    const { data: cards, error } = await supabase
        .from('cards')
        .select('*')
        .not('user_notes', 'is', null)
        .neq('user_notes', '');

    if (error) {
        console.error("Error fetching:", error);
        return;
    }

    console.log(`Found ${cards.length} cards with notes.`);

    for (const card of cards) {
        // Skip already fixed
        if (card.user_notes && card.user_notes.includes("[AI Fixed]")) {
             console.log(`Skipping already fixed: ${card.back}`);
             continue;
        }

        console.log(`\nProcessing: ${card.back} | Note: ${card.user_notes}`);
        
        const prompt = `
        You are an expert Persian translator.
        The user has flagged a flashcard with a note indicating the translation is wrong or could be better.
        
        Word: "${card.back}"
        Current Persian Translation (Front): "${card.front}"
        User Note: "${card.user_notes}"
        
        Task: Provide a BETTER Persian translation that addresses the user's note.
        If the user provides a specific word in the note, USE IT.
        If the user says "wrong meaning", find the correct meaning for the context implied or general usage.
        
        Output ONLY the JSON object:
        { "new_front": "Persian translation" }
        `;

        try {
            const msg = await anthropic.messages.create({
                model: "claude-3-haiku-20240307",
                max_tokens: 200,
                messages: [{ role: "user", content: prompt }]
            });

            const text = msg.content[0].text;
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            
            if (jsonMatch) {
                const result = JSON.parse(jsonMatch[0]);
                console.log(`   -> New Front: ${result.new_front}`);
                
                // Update DB
                const { error: updateError } = await supabase
                    .from('cards')
                    .update({ 
                        front: result.new_front, 
                        user_notes: `${card.user_notes} [AI Fixed]` 
                    })
                    .eq('id', card.id);
                    
                 if (updateError) {
                     if (updateError.code === '23505') {
                        console.log("   -> Collision detected! Asking for synonym...");
                        const prompt2 = `
                        The translation "${result.new_front}" is already taken by another card.
                        The English word is "${card.back}".
                        Provide a VALID, SYNONYM Persian translation that is different.
                        Output JSON: { "new_front": "synonym" }
                        `;
                        const msg2 = await anthropic.messages.create({
                            model: "claude-3-haiku-20240307",
                            max_tokens: 200,
                            messages: [{ role: "user", content: prompt2 }]
                        });
                        const text2 = msg2.content[0].text;
                        const jsonMatch2 = text2.match(/\{[\s\S]*\}/);
                        if (jsonMatch2) {
                            const res2 = JSON.parse(jsonMatch2[0]);
                             console.log(`   -> Synonym: ${res2.new_front}`);
                             const { error: err2 } = await supabase
                                .from('cards')
                                .update({ 
                                    front: res2.new_front, 
                                    user_notes: `${card.user_notes} [AI Fixed w/ Synonym]` 
                                })
                                .eq('id', card.id);
                             if (err2) console.error("   -> Failed again:", err2);
                             else console.log("   -> Saved synonym.");
                        }
                     } else {
                         console.error("Update failed", updateError);
                     }
                 }
                 else console.log("   -> Saved.");
            }
        } catch (e) {
            console.error("Claude error:", e);
        }
    }
}

fixNotes();

