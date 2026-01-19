import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

// Load Env
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);
const geminiMatch = envContent.match(/VITE_GEMINI_API_KEY=(.+)/);

if (!urlMatch || !keyMatch || !geminiMatch) {
    console.error("Missing .env configuration");
    process.exit(1);
}

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());
console.log(`Key Length: ${geminiMatch[1].trim().length}`);
const genAI = new GoogleGenerativeAI(geminiMatch[1].trim());
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const delay = ms => new Promise(res => setTimeout(res, ms));

async function main() {
    console.log("Enriching Examples (Target: 4+ per card)...");
    
    let processed = 0;
    
    while (true) {
        // Fetch cards. We can't filter by array length easily in basic Supabase SDK without RPC
        // So we fetch a chunk and filter in memory.
        const { data: cards, error } = await supabase
            .from('cards')
            .select('*')
            .order('next_review', { ascending: false }) // Process recently reviewed or just random?
            .range(processed, processed + 49);
            
        if (error) {
            console.error("Fetch error:", error);
            break;
        }
        
        if (!cards || cards.length === 0) {
            console.log("No more cards to check.");
            break;
        }

        const candidates = cards.filter(c => {
             let exCount = 0;
             if (Array.isArray(c.examples)) exCount = c.examples.length;
             // Handle string case (if any legacy data)
             else if (typeof c.examples === 'string') {
                 try { exCount = JSON.parse(c.examples).length; } catch(e) { exCount = 1; }
             }
             return exCount < 4;
        });

        if (candidates.length === 0) {
            console.log(`Batch of ${cards.length} checked. All have enough examples. Skipping...`);
            processed += cards.length;
            continue;
        }

        console.log(`Found ${candidates.length} candidates in current batch.`);
        
        // Process in smaller sub-batches to avoid huge prompts
        const SUB_BATCH_SIZE = 5;
        for (let i = 0; i < candidates.length; i += SUB_BATCH_SIZE) {
            const chunk = candidates.slice(i, i + SUB_BATCH_SIZE);
            
            const prompt = `
            You are a language tutor. I have a list of Flashcards.
            For each card, I need a total of 4 distinct, high-quality example sentences.
            
            Rules:
            1. Use the main word AND its forms (noun/verb/adj/etc) if available in 'word_forms'.
            2. Result must be a JSON object where Key = Card ID, Value = Array of 4 Strings.
            3. The sentences should be B2/C1 level English.
            4. Keep sentences concise but context-rich.
            
            Cards:
            ${JSON.stringify(chunk.map(c => ({ 
                id: c.id, 
                word: c.back, 
                definition: c.front, // Actually front is Persian usually? 
                original_examples: c.examples,
                forms: c.word_forms 
            })))}
            
            Output JSON:
            `;

            try {
                const result = await model.generateContent(prompt);
                const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
                const json = JSON.parse(text);
                
                for (const [id, newExamples] of Object.entries(json)) {
                    if (Array.isArray(newExamples) && newExamples.length >= 4) {
                        await supabase
                            .from('cards')
                            .update({ examples: newExamples })
                            .eq('id', id);
                        console.log(`✅ Updated ${id.slice(0,8)} with ${newExamples.length} examples.`);
                    }
                }
                
                await delay(1000); // Rate limit
            } catch(e) {
                console.error("GenAI Error:", e.message);
                await delay(5000);
            }
        }

        processed += cards.length;
        console.log(`Total Scanned: ${processed}`);
        if(processed > 200) break; // Safety cap for first run
    }
}

main();
