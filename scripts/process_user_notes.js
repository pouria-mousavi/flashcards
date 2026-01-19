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
    console.log(`🚀 Starting Note Processing (${MODEL})...`);
    
    // Fetch all cards with notes
    const { data: cards, error } = await supabase
        .from('cards')
        .select('*')
        .not('user_notes', 'is', null)
        .neq('user_notes', '');

    if (error) {
        console.error("Error fetching cards:", error);
        return;
    }

    console.log(`Found ${cards.length} cards with pending notes.`);

    for (const card of cards) {
        await processCard(card);
        // Small polite delay
        await new Promise(r => setTimeout(r, 200)); 
    }

    console.log("Done! 🎉");
}

async function processCard(card) {
    try {
        console.log(`Processing ${card.back}: "${card.user_notes}"`);

        const prompt = `
        You are an expert linguist helpful assistant.
        The user has left a specific feedback note on this flashcard.
        Your task is to EDIT the card to address the user's note perfectly.

        If the user provides a translation, USE IT.
        If the user says the translation is wrong, FIX IT (Persian native level).
        If the user asks for examples, ADD THEM (high quality).

        Card Data:
        - Front (Persian): "${card.front}"
        - Back (English): "${card.back}"
        - Current Examples: ${JSON.stringify(card.examples)}
        - Metadata: ${JSON.stringify(card.word_forms)}

        USER NOTE: "${card.user_notes}"

        Return the COMPLETELY UPDATED card JSON.
        - Ensure "front" is Persian and "back" is English (Standard Format).
        - Keep other metadata if not asked to change, but feel free to improve it if it looks wrong.
        
        Output JSON strictly:
        {
            "front": "Persian",
            "back": "English",
            "pronunciation": "...",
            "tone": "...",
            "synonyms": "...",
            "word_forms": {...},
            "examples": [...]
        }
        `;

        const response = await client.chat.completions.create({
            model: MODEL,
            messages: [
                { role: "system", content: "You are a JSON factory. Respond ONLY with valid JSON." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
        });

        const result = JSON.parse(response.choices[0].message.content);

        // Validation
        if (!result.front || !result.back) {
            console.error(`❌ Invalid output for ${card.id}`);
            return;
        }

        const updates = {
            front: result.front,
            back: result.back,
            pronunciation: result.pronunciation,
            tone: result.tone,
            synonyms: result.synonyms,
            word_forms: result.word_forms,
            examples: result.examples,
            user_notes: null // Clear the note as it is processed
        };

        const { error: updateError } = await supabase
            .from('cards')
            .update(updates)
            .eq('id', card.id);

        if (updateError) {
            console.error(`❌ DB Error ${card.id}:`, updateError.message);
        } else {
            console.log(`✅ Fixed: ${result.back} -> ${result.front}`);
        }

    } catch (err) {
        console.error(`❌ Failed ${card.id}: ${err.message}`);
    }
}

main();
