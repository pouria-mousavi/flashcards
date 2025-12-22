import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai'; // Assuming this imports exists or using basic fetch?
// Actually I'll use the same pattern as resolve_notes but optimized for batch.

import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);
const geminiMatch = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());
const genAI = new GoogleGenerativeAI(geminiMatch[1].trim());

const BATCH_SIZE = 40; // Conservative batch size

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function processBatch(cards) {
    const list = cards.map(c => `ID: ${c.id} | Word: ${c.back} | Mean: ${c.front}`).join('\n');
    // Note: Assuming Swapped state: Front=Mean, Back=Word. 
    // If not swapped, our prompt might be confused, but "Word: ..." label clears it up.
    
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    
    const prompt = `
    Analyze the register/tone of the following vocabulary items within their context.
    Return a JSON Object where keys are IDs and values are the Tone.
    
    Possible Tones:
    - Formal
    - Informal
    - Neutral
    - Slang
    - Literary
    - Offensive
    - Humorous
    - Old-fashioned
    
    If it's a standard word with no special register, use "Neutral".
    
    INPUT:
    ${list}
    
    OUTPUT FORMAT (JSON ONLY):
    {
      "uuid1": "Formal",
      "uuid2": "Neutral"
    }
    `;

    let attempt = 1;
    while (true) {
        try {
            const result = await model.generateContent(prompt);
            const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
            const json = JSON.parse(text);
            return json;
        } catch (e) {
            console.error(`Batch Error (Attempt ${attempt}): ${e.message}`);
            if (e.message.includes("429") || e.message.includes("Quota")) {
                 const wait = Math.min(attempt * 20000, 60000); 
                 console.log(`Waiting ${wait/1000}s...`);
                 await delay(wait);
                 attempt++;
            } else {
                 await delay(5000); // Network error?
                 attempt++;
            }
        }
    }
}

async function main() {
    let page = 0;
    let totalUpdated = 0;
    
    while (true) {
        // Fetch cards with NULL tone
        const { data: cards, error } = await supabase
            .from('cards')
            .select('id, front, back')
            .is('tone', null)
            .range(0, BATCH_SIZE - 1); // Always fetch next batch of nulls (so 0 to N)
            
        if (error || !cards || cards.length === 0) {
            console.log("No more cards to process!");
            break;
        }
        
        console.log(`Processing batch of ${cards.length}...`);
        
        const updates = await processBatch(cards);
        
        // Execute Updates
        for (const [id, tone] of Object.entries(updates)) {
            // Validate ID is in our batch to prevent weird hallucinations
            if (!cards.find(c => c.id === id)) continue;
            
            await supabase.from('cards').update({ tone: tone }).eq('id', id);
        }
        
        totalUpdated += cards.length;
        console.log(`Enriched ${totalUpdated} cards so far.`);
        
        await delay(2000); // Safety buffer
    }
}

main();
