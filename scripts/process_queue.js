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

async function main() {
    console.log("Checking Queue...");
    
    // 1. Fetch Queue
    const { data: queue, error } = await supabase
        .from('book_queue')
        .select('*')
        .eq('status', 'PENDING')
        .limit(20); // Batch limit
        
    if (error) { console.error(error); return; }
    if (!queue || queue.length === 0) { console.log("Queue empty."); return; }

    console.log(`Processing ${queue.length} items...`);
    const words = queue.map(q => q.word);

    // 2. Prompt Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const prompt = `
    I have a list of words: ${JSON.stringify(words)}.

    For EACH word, generate a FLASHCARD object with:
    - front: The Persian translation and Definition (e.g. "**Def**: ... \\n**Farsi**: ...")
    - back: The Word itself.
    - pronunciation: IPA.
    - tone: Register (Formal/Informal).
    - examples: Array of 2 sentences.
    
    AND include "word_forms" object with:
    - noun, verb, adj, adv, past, pp (if applicable, else null).

    Return JSON Array:
    [
      {
        "word": "Create",
        "data": {
           "front": "**Def**: To bring into existence.\\n**Farsi**: خلق کردن",
           "back": "Create",
           "pronunciation": "/kriˈeɪt/",
           "tone": "Neutral",
           "examples": ["God created the world.", "He created a masterpiece."],
           "word_forms": {
             "noun": "creation", "verb": "create", "adj": "creative", "adv": "creatively", "past": "created", "pp": "created"
           }
        }
      }
    ]
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        const generated = JSON.parse(text);

        for (const item of generated) {
            // Find original queue item ID
            const qItem = queue.find(q => q.word.toLowerCase() === item.word.toLowerCase()) || queue.find(q => item.word.toLowerCase().includes(q.word.toLowerCase()));
            
            if (!qItem) {
                console.warn(`Could not match result for ${item.word}`);
                continue;
            }

            // Insert Card
            const { error: insertErr } = await supabase.from('cards').insert({
                id: crypto.randomUUID(),
                ...item.data,
                state: 'NEW',
                next_review: new Date().toISOString(),
                interval: 0,
                ease_factor: 2.5
            });

            if (insertErr) {
                console.error(`Failed to insert ${item.word}: ${insertErr.message}`);
            } else {
                console.log(`Added Card: ${item.word}`);
                // Update Queue Status
                await supabase.from('book_queue').update({ status: 'PROCESSED' }).eq('id', qItem.id);
            }
        }

    } catch (e) {
        console.error("Gemini Error:", e);
    }
}

main();
