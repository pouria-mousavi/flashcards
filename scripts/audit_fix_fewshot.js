import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

// Load Supabase credentials
const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

// Cerebras Configuration
const CEREBRAS_KEY = "csk-h4cdc836ffmc3tv59fvhwjkyx36kef3hk4d6fpjhr395h4mj";
const client = new OpenAI({
    apiKey: CEREBRAS_KEY,
    baseURL: "https://api.cerebras.ai/v1",
});

const MODEL = "llama-3.3-70b"; 

async function main() {
    console.log(`🚀 Starting Few-Shot Translation Audit (${MODEL})...`);
    
    // 1. Fetch ALL cards
    let allCards = [];
    let page = 0;
    process.stdout.write("Fetching cards... ");
    while(true) {
        const { data, error } = await supabase.from('cards').select('id, front, back').range(page*1000, (page+1)*1000 - 1);
        if(!data || data.length === 0) break;
        allCards.push(...data);
        page++;
    }
    console.log(`Converted ${allCards.length} cards.`);

    const BATCH_SIZE = 10; 
    
    for (let i = 0; i < allCards.length; i += BATCH_SIZE) {
        const batch = allCards.slice(i, i + BATCH_SIZE);
        await processBatch(batch);
    }

    console.log("Translation Audit Complete! 🎉");
}

async function processBatch(cards) {
    try {
        const prompt = `
        You are a Persian Language Expert JSON Machine.
        TASK: Convert English to "Standard Iranian Persian" (Farsi).
        
        CRITICAL INSTRUCTIONS:
        1. **Value MUST be a String ONLY**. NO explanations. NO "Because...". NO parentheses.
        2. **Idioms**: Use the Common Persian Proverb.
           - "Hit the sack" -> "خوابیدن" OR "کپه‌ی مرگ را گذاشتن" inside the string. NOTHING ELSE.
        3. **Consistency**: If existing literal translation is "Okay" but not "Great", CHANGE IT to "Great".
        
        EXAMPLES:
        - Input: "The early bird catches the worm" -> "سحرخیز باش تا کامروا باشی"
        - Input: "Piece of cake" -> "مثل آب خوردن"
        - Input: "Watch your mouth" -> "مراقب حرف زدنت باش"
        
        Input JSON:
        ${JSON.stringify(cards.map(c => ({ id: c.id, english: c.back, current_persian: c.front })))}

        Output strictly a JSON object:
        {
            "card_id": "Just The Persian Phrase"
        }
        `;

        const response = await client.chat.completions.create({
            model: MODEL,
            messages: [
                { role: "system", content: "You are a JSON factory. Respond ONLY with valid JSON." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.2, 
        });

        const corrections = JSON.parse(response.choices[0].message.content);

        // Apply updates
        for (const card of cards) {
            const suggested = corrections[card.id];
            
            // Validation
            if (!suggested || !isDifferent(card.front, suggested)) continue;
            if (/[\u4E00-\u9FFF]/.test(suggested)) continue; // Skip Chinese
            
            console.log(`✨ FEW-SHOT FIX: [${card.back}] "${card.front}" -> "${suggested}"`);
            
            const { error } = await supabase
                .from('cards')
                .update({ front: suggested }) 
                .eq('id', card.id);

            if (error) console.error(`Error updating ${card.id}:`, error.message);
        }

    } catch (err) {
        console.error("Batch processing failed:", err.message);
    }
}

function isDifferent(str1, str2) {
    if (!str1 || !str2) return true;
    const n1 = str1.trim().replace(/[!?.،]/g, '');
    const n2 = str2.trim().replace(/[!?.،]/g, '');
    return n1 !== n2;
}

main();
