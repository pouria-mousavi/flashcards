import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

// Load Supabase credentials from .env
const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const supabaseKey = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, supabaseKey);

// OpenAI Configuration
const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY || "", 
});

const DRY_RUN = false; 

async function main() {
    console.log("Starting TARGETED retry for skipped cards...");
    
    // Load skipped IDs
    const skippedIds = JSON.parse(fs.readFileSync('skipped_cards.json', 'utf8'));
    console.log(`Loaded ${skippedIds.length} skipped IDs.`);

    // Fetch card details in batches
    // We can't fetch 1330 by ID in one go usually, let's chunk the FETCH too
    const FETCH_SIZE = 50;
    
    for (let i = 0; i < skippedIds.length; i += FETCH_SIZE) {
        const batchIds = skippedIds.slice(i, i + FETCH_SIZE);
        const { data: cards, error } = await supabase
            .from('cards')
            .select('*')
            .in('id', batchIds); // Fetch by ID list

        if (error) {
            console.error("Error fetching batch:", error);
            continue;
        }

        if (error) {
            console.error("Error fetching batch:", error);
            continue;
        }

        console.log(`Fetched batch of ${cards.length} to retry...`);

        // Process strictly sequentially
        for (const card of cards) {
            await processCard(card);
            // Hard delay between cards to be nice to the API
            await new Promise(r => setTimeout(r, 1000)); 
        }
    }

    console.log("Retry Run Complete! 🎉 check logs for remaining errors.");
}

async function callOpenAIWithRetry(prompt, retries = 10) { // Increased retries
    for (let i = 0; i < retries; i++) {
        try {
            return await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "system", content: "You are a JSON factory." }, { role: "user", content: prompt }],
                response_format: { type: "json_object" },
                temperature: 0.7
            });
        } catch (error) {
            if (error.status === 429 || error.code === 'rate_limit_exceeded') {
                const waitTime = Math.pow(2, i) * 1000 + 2000; // More aggressive backoff
                console.warn(`⚠️ Rate limit hit. Waiting ${waitTime}ms before retry...`);
                await new Promise(r => setTimeout(r, waitTime));
            } else {
                throw error;
            }
        }
    }
    throw new Error("Max retries exceeded");
}

async function processCard(card) {
    try {
        const prompt = `
        You are an expert linguist and flashcard creator. Your task is to standardize and enrich a flashcard for a user learning English (Persian native speaker).
        
        Input Data (Current State):
        - Front: "${card.front}"
        - Back: "${card.back}"
        - Existing Examples: ${JSON.stringify(card.examples)}

        STRICT GOAL FORMAT:
        1. **Front**: The Natural Persian Translation.
        2. **Back**: The English Word/Phrase (The answer).
        3. **Metadata**: Pronunciation (IPA), Tone, Word Forms, AND Synonyms.

        Rules:
        - **Front (Persian)**: Must be a natural, native Persian translation.
        - **Back (English)**: The main English word or phrase.
        - **Pronunciation**: IPA format.
        - **Tone**: Formal/Informal/etc.
        - **Word Forms**: Noun, Verb, Adj, Adv, Past, PP.
        - **Synonyms**: 3-5 common English synonyms, comma-separated.
        - **Examples**: 2-4 excellent context sentences.

        Output JSON strictly:
        {
            "front": "Persian Translation",
            "back": "English Word",
            "pronunciation": "/IPA/",
            "tone": "Neutral",
            "synonyms": "synonym1, synonym2, synonym3",
            "word_forms": {
                "noun": "...",
                "verb": "...",
                "adj": "...",
                "adv": "...",
                "past": "...",
                "pp": "..."
            },
            "examples": ["sentence 1", "sentence 2", "sentence 3"]
        }
        `;

        const response = await callOpenAIWithRetry(prompt);
        const result = JSON.parse(response.choices[0].message.content);
        
        if (!result.front || !result.back || !Array.isArray(result.examples)) {
            console.error(`❌ Invalid response for card ${card.id}`);
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
        };

        if (DRY_RUN) {
            console.log(`[DRY RUN] Would update ${card.id}:`, JSON.stringify(updates));
        } else {
            const { error: updateError } = await supabase
                .from('cards')
                .update(updates)
                .eq('id', card.id);
            
            if (updateError) {
                console.error(`❌ Error updating ${card.id}:`, updateError.message);
                // Handle duplicate front violation by appending (dup) or similar? 
                // Or just Log it.
            } else {
                console.log(`✅ Updated: ${result.back} (${result.front})`);
            }
        }

    } catch (err) {
        console.error(`❌ Failed to process card ${card.id} (${card.front}):`, err.message);
    }
}

main();
