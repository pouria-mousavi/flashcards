import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

// Load Env
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);
const geminiMatch = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());
const genAI = new GoogleGenerativeAI(geminiMatch[1].trim());

// Rate Limit Pause
const delay = ms => new Promise(res => setTimeout(res, ms));

async function main() {
    console.log("Enriching Word Forms...");
    
    let processed = 0;
    
    while (true) {
        // Fetch 50 cards waiting for forms
        // Assuming 'word_forms' is null
        const { data: cards, error } = await supabase
            .from('cards')
            .select('id, back') // 'back' contains the Word
            .is('word_forms', null)
            .limit(50);
            
        if (error || !cards || cards.length === 0) {
            console.log("No more cards to enrich.");
            break;
        }

        const batch = cards.map(c => ({ id: c.id, word: c.back }));
        console.log(`Processing Batch of ${batch.length}...`);

        const prompt = `
        Ref: ${JSON.stringify(batch)}

        Identify the main English word in 'word' (cleanup IPA/extra text).
        Then provide word forms: Noun, Verb, Adj, Adv, Past Tense, Past Participle.

        Output JSON Object (Key = ID, Value = WordForms Object):
        {
           "uuid1": { "noun": "creation", "verb": "create", "adj": "creative", "adv": "creatively", "past": "created", "pp": "created" },
           "uuid2": { "noun": "running", "verb": "run", "adj": "running", "adv": null, "past": "ran", "pp": "run" }
        }
        `;
        
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
            const result = await model.generateContent(prompt);
            const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
            const data = JSON.parse(text);
            
            // Bulk Update? No, Supabase doesn't do complex bulk update easily. Loop.
            for (const [id, forms] of Object.entries(data)) {
                 await supabase.from('cards').update({ word_forms: forms }).eq('id', id);
            }
            
            processed += batch.length;
            console.log(`Completed ${processed} cards.`);
            // Pause for Rate Limit
            await delay(10000); 
            
        } catch (e) {
            console.error("Batch Failed:", e.message);
            await delay(30000); // Backoff
        }
    }
}

main();
