
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
    console.error("Missing env vars.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const anthropic = new Anthropic({ apiKey: anthropicKey });

async function generateHints() {
    console.log("Starting Hint Generation...");
    
    let page = 0;
    const pageSize = 20; // Reduced from 50 to minimize json break risk

    while(true) {
        const { data: cards, error } = await supabase
            .from('cards')
            .select('*')
            .range(page * pageSize, (page + 1) * pageSize - 1)
            .order('id');
            
        if (error || !cards || cards.length === 0) break;
        
        console.log(`Processing batch ${page} (${cards.length} cards)...`);
        
        // Filter cards that already have a hint
        const cardsToProcess = cards.filter(c => !c.front.includes('===HINT==='));
        
        if (cardsToProcess.length === 0) {
            console.log("  -> All cards in batch already have hints. Skipping.");
            page++;
            continue;
        }

        const items = cardsToProcess.map(c => `ID: ${c.id}\nWord: ${c.back}`).join('\n\n');
        
        const prompt = `
        You are a dictionary assistant.
        For each English word below, provide a SHORT, SIMPLE English definition (max 10-15 words).
        CRITICAL RULES:
        1. DO NOT use the answer word itself in the definition.
        2. Output strict, valid JSON. Double-check for unescaped quotes.
        
        Input:
        ${items}
        
        Output JSON format:
        {
            "definitions": [
                { "id": "card_id", "definition": "short definition text" }
            ]
        }
        `;

        try {
            const msg = await anthropic.messages.create({
                model: "claude-3-haiku-20240307",
                max_tokens: 2500,
                messages: [{ role: "user", content: prompt }]
            });

            const text = msg.content[0].text;
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            
            if (jsonMatch) {
                let result;
                try {
                    result = JSON.parse(jsonMatch[0]);
                } catch (jsonErr) {
                    console.error("  -> JSON Parse Failed. Retrying batch with stricter prompt...");
                    // Retry logic or just log raw text to debug
                    console.log("Failed Text:", text.slice(0, 200) + "...");
                }

                if (result && result.definitions) {
                    await Promise.all(result.definitions.map(async (def) => {
                        const originalCard = cardsToProcess.find(c => c.id === def.id);
                        if (originalCard && def.definition) {
                            const newFront = `${originalCard.front.split('===HINT===')[0].trim()}\n\n===HINT===\n${def.definition}`;
                            const { error: upErr } = await supabase
                                .from('cards')
                                .update({ front: newFront })
                                .eq('id', def.id);
                                
                            if (upErr) console.error(`Failed to update ${def.id}:`, upErr);
                        }
                    }));
                    console.log(`  -> Updated ${result.definitions.length} cards.`);
                }
            } else {
                 console.log("  -> No JSON found in response.");
            }
        } catch (e) {
            console.error("  -> Error processing batch:", e);
        }

        page++;
        // Safety cap 
        if (page > 400) break; 
    }
    console.log("Done.");
}

generateHints();
