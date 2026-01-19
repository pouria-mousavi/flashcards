
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Env
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length > 1) {
        let val = parts.slice(1).join('=').trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
        env[parts[0].trim()] = val;
    }
});

const url = env.VITE_SUPABASE_URL;
const key = env.VITE_SUPABASE_ANON_KEY;
const cerebrasKey = "csk-h4cdc836ffmc3tv59fvhwjkyx36kef3hk4d6fpjhr395h4mj"; 

if (!url || !key) {
    console.error("Supabase Credentials missing");
    process.exit(1);
}

const supabase = createClient(url, key);
const client = new OpenAI({
    apiKey: cerebrasKey,
    baseURL: "https://api.cerebras.ai/v1",
});

async function standardizeCard(card) {
    const existingDefinition = (card.front || '').includes('===HINT===') ? card.front.split('===HINT===')[1].trim() : '';

    console.log(`Processing: [${card.front.split('===')[0].trim()}]`);
    const prompt = `
    Standardize this flashcard (English learning for Persian speaker).
    
    Current Front: "${card.front}"
    Current Back: "${card.back}"
    Current Examples: ${JSON.stringify(card.examples)}

    Task:
    1. Translate English word to Persian (Front). Must be specific.
    2. Provide non-spoiler English definition (Front Definition).
    3. Provide IPA Pronunciation and Tone.
    4. Provide Word Forms (Noun, Verb, etc).
    5. Provide 4+ High Quality Examples (English sentences).
    6. Identify Other Distinct Meanings (if any).

    OUTPUT JSON ONLY:
    {
      "front": "Persian Translation",
      "front_definition": "English definition",
      "back": "English Word",
      "pronunciation": "/ipa/",
      "tone": "Neutral",
      "word_forms": { "noun": "...", "verb": "...", "other_meanings": [ { "part_of_speech": "n", "definition": "...", "translation": "..." } ] },
      "examples": ["Ex 1", "Ex 2", "Ex 3", "Ex 4"]
    }
    NOTE: 'other_meanings' MUST be inside 'word_forms' object if present, distinct from main meaning.
    `;

    try {
        const completion = await client.chat.completions.create({
            model: "llama-3.3-70b",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature: 0.1
        });
        return JSON.parse(completion.choices[0].message.content);
    } catch (e) {
        console.error("AI Error:", e.message);
        return null; // Skip
    }
}

async function main() {
    console.log("Starting Standardization with Cerebras...");
    let page = 0;
    const PAGE_SIZE = 50;
    
    while(true) {
        const { data: cards, error } = await supabase.from('cards').select('*')
            .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)
            .order('created_at', { ascending: true });

        if (error || !cards || cards.length === 0) break;
        
        console.log(`Page ${page}: ${cards.length} cards`);
        
        const BATCH_SIZE = 5;
        for (let i = 0; i < cards.length; i += BATCH_SIZE) {
            const batch = cards.slice(i, i + BATCH_SIZE);
            await Promise.all(batch.map(async (card) => {
                const std = await standardizeCard(card);
                if (std) {
                     // PACKING DATA (Hack for no-schema-migration capability)
                     const newFront = `${std.front} ===HINT=== ${std.front_definition}`;
                     
                     // Ensure word_forms has keys
                     const wf = std.word_forms || {};
                     // If AI put other_meanings outside, move it inside
                     if (std.other_meanings && !wf.other_meanings) {
                         wf.other_meanings = std.other_meanings;
                     }

                     const updates = {
                        front: newFront,
                        back: std.back, // English
                        pronunciation: std.pronunciation,
                        tone: std.tone,
                        word_forms: wf, // Contains other_meanings
                        examples: std.examples
                     };
                     
                     // Upsert/Update
                     const { error: upErr } = await supabase.from('cards').update(updates).eq('id', card.id);
                     if (upErr) console.error("Update failed:", upErr);
                }
            }));
            await new Promise(r => setTimeout(r, 500)); // Rate limit safety
        }
        page++;
    }
    console.log("Done.");
}
main();
