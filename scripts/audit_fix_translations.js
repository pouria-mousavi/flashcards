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
    console.log(`🚀 Starting Translation Audit (${MODEL})...`);
    
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

    // 2. Process in batches for speed
    // Cerebras is fast, so fairly large batch size
    const BATCH_SIZE = 10; 
    
    for (let i = 0; i < allCards.length; i += BATCH_SIZE) {
        const batch = allCards.slice(i, i + BATCH_SIZE);
        await processBatch(batch);
        // Polite delay NOT needed for Cerebras usually, but good for local logic
    }

    console.log("Translation Audit Complete! 🎉");
}

async function processBatch(cards) {
    try {
        // Construct a batch prompt
        const prompt = `
        You are a modern, educated Native Persian Speaker from Tehran.
        Review these English-Persian flashcards. 
        
        The 'current_persian' may be improper or machine-translated.
        **Fix it to be natural, standard colloquial or formal Persian (as appropriate).**
        
        CRITICAL RULES:
        1. **IDIOMS**: Use the correct Persian idiom. never literal.
           - "Piece of cake" -> "مثل آب خوردن" (NOT "تکه کیک").
           - "Hit the sack" -> "کپه‌ی مرگ را گذاشتن" or "خوابیدن".
        2. **STRICT PURITY**: Output ONLY Persian characters. NO English words (unless the term is English in Persian like "IP Address"). NO Chinese characters.
        3. **NO EXPLANATIONS**: Return ONLY the phrase.
        4. **ONLY FIX IF NECESSARY**: If existing is good, return null.

        Input JSON:
        ${JSON.stringify(cards.map(c => ({ id: c.id, english: c.back, current_persian: c.front })))}

        Output strictly a JSON object mapping ID to the CORRECTED Persian translation:
        {
            "uuid": "Corrected Persian",
            "uuid2": null
        }
        `;

        const response = await client.chat.completions.create({
            model: "llama-3.3-70b",
            messages: [
                { role: "system", content: "You are a JSON factory. Respond ONLY with valid JSON." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.3, // Slightly higher to avoid deterministic weirdness
        });

        const corrections = JSON.parse(response.choices[0].message.content);

        // Apply updates
        for (const card of cards) {
            const suggested = corrections[card.id];
            
            // Validation: Must contain at least one Persian char and NO Chinese/weird symbols
            if (!suggested || !isDifferent(card.front, suggested)) continue;
            
            // Regex: Arabic/Persian range is roughly [\u0600-\u06FF]
            // We want to reject if it has Chinese [\u4E00-\u9FFF]
            if (/[\u4E00-\u9FFF]/.test(suggested)) {
                console.warn(`⚠️ SKIPPING HALLUCINATION: ${suggested}`);
                continue;
            }

            console.log(`✨ RE-FIX: [${card.back}] "${card.front}" -> "${suggested}"`);
            
            const { error } = await supabase
                .from('cards')
                .update({ front: suggested }) // ONLY update front
                .eq('id', card.id);

            if (error) console.error(`Error updating ${card.id}:`, error.message);
        }

    } catch (err) {
        console.error("Batch processing failed:", err.message);
    }
}

function isDifferent(str1, str2) {
    if (!str1 || !str2) return true;
    // Normalize punctuation/whitespace
    const n1 = str1.trim().replace(/[!?.،]/g, '');
    const n2 = str2.trim().replace(/[!?.،]/g, '');
    return n1 !== n2;
}

main();
