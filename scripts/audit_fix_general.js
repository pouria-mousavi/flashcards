
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

async function auditGeneral() {
    // Process in batches of 50
    let lastId = null; 
    let pageSize = 50;
    
    // Maybe just random sample or check all? 
    // User said "Fix translations for ALL the weird words". 
    // Checking 2000 cards might cost tokens. 
    // I will iterate all, but maybe just check validity?
    
    // Efficient strategy: Send batch of 20 (Word, Front) to Claude.
    // Ask: "Which of these are unnatural or wrong? Return JSON of fixes."
    // If correct, return nothing.
    
    console.log("Starting General Audit...");
    
    let page = 0;
    while(true) {
        const { data: cards, error } = await supabase
            .from('cards')
            .select('*')
            .range(page * pageSize, (page + 1) * pageSize - 1)
            .order('id');
            
        if (error || !cards || cards.length === 0) break;
        
        console.log(`Analyzing batch ${page} (${cards.length} cards)...`);
        
        const listToCheck = cards.map(c => `- ID: ${c.id}, Word: "${c.back}", Translation: "${c.front}"`).join('\n');
        
        const prompt = `
        You are a strict Persian translator editor.
        Review the following flashcards. 
        Identify ONLY the ones where the Persian translation is "weird", "unnatural", "wrong", or "robotic".
        Ignore minor stylistic differences. Focus on quality corrections.
        
        List:
        ${listToCheck}
        
        Output JSON of CORRECTIONS ONLY:
        {
            "corrections": [
                { "id": "card_id", "new_front": "Better Persian Translation", "reason": "why" }
            ]
        }
        
        If all are good, return { "corrections": [] }.
        `;
        
        try {
            const msg = await anthropic.messages.create({
                model: "claude-3-haiku-20240307",
                max_tokens: 1000,
                messages: [{ role: "user", content: prompt }]
            });
            
            const text = msg.content[0].text;
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            
            if (jsonMatch) {
                const result = JSON.parse(jsonMatch[0]);
                if (result.corrections && result.corrections.length > 0) {
                    console.log(`   Found ${result.corrections.length} fixes.`);
                    for (const fix of result.corrections) {
                        console.log(`   Fixing "${fix.id}": ${fix.new_front} (Reason: ${fix.reason})`);
                        const { error: updateError } = await supabase
                            .from('cards')
                            .update({ front: fix.new_front, user_notes: `[Audit Fixed: ${fix.reason}]` })
                            .eq('id', fix.id);
                            
                        if (updateError && updateError.code === '23505') {
                            console.log(`   -> Collision for "${fix.new_front}". Asking for synonym...`);
                            // Logic to ask for synonym could go here, but for batch it's complex.
                            // Just logging for now to avoid crash loop, or maybe skip.
                            console.log("   -> Skipping unique violation to avoid token waste.");
                        }
                    }
                } else {
                    console.log("   No issues found in batch.");
                }
            }
        } catch(e) {
            console.error("Claude Error:", e);
        }
        
        page++;
        // Safety break
        if(page > 200) break; 
    }
}

auditGeneral();
