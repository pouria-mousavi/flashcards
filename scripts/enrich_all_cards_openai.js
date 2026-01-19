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

const DRY_RUN = false; // Safety first
const LIMIT = 10000; 

async function main() {
    console.log(` Starting STRICT enrichment process... (DRY_RUN: ${DRY_RUN})`);

    let processedCount = 0;
    let page = 0;
    const CLIENT_PAGE_SIZE = 1000; // Supabase limit

    while (true) {
        console.log(`Fetching DB page ${page} (Rows ${page * CLIENT_PAGE_SIZE} to ${(page + 1) * CLIENT_PAGE_SIZE - 1})...`);
        
        const { data: cards, error } = await supabase
            .from('cards')
            .select('*')
            .range(page * CLIENT_PAGE_SIZE, (page + 1) * CLIENT_PAGE_SIZE - 1)
            .order('created_at', { ascending: true }); // Stable ordering

        if (error) {
            console.error("Error fetching cards:", error);
            break;
        }

        if (!cards || cards.length === 0) {
            console.log("No more cards to fetch.");
            break;
        }

        console.log(`Fetched ${cards.length} cards from DB. Processing...`);

        // Process this page in smaller chunks for API
        // 2. Process in chunks - REDUCED for Rate Limits
        const CHUNK_SIZE = 4; // Slightly increased from 2 to speed up, using retry logic
        for (let i = 0; i < cards.length; i += CHUNK_SIZE) {
            const chunk = cards.slice(i, i + CHUNK_SIZE);
            process.stdout.write(`Processing batch ${i + 1}-${i + chunk.length} of page ${page}... `);
            
            await Promise.all(chunk.map(processCard));
            process.stdout.write("Done.\n");

            // Delay for rate limits
            await new Promise(r => setTimeout(r, 1000)); 
        }

        processedCount += cards.length;
        page++;
        
        // Safety Break for dry run
        if (DRY_RUN && page > 0) break; 
    }
    
    console.log(`Done! 🎉 Total cards processed: ${processedCount}`);
}

async function callOpenAIWithRetry(prompt, retries = 5) {
    for (let i = 0; i < retries; i++) {
        try {
            return await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [{ role: "system", content: "You are a JSON factory." }, { role: "user", content: prompt }],
                response_format: { type: "json_object" },
                temperature: 0.7
            });
        } catch (error) {
            if (error.status === 429) {
                const waitTime = Math.pow(2, i) * 1000 + 1000; // Exponential backoff
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
        
        // Validation check (basic)
        if (!result.front || !result.back || !Array.isArray(result.examples)) {
            console.error(`❌ Invalid response for card ${card.id}`);
            return;
        }

        // PRESERVE PROGRESS: We only update content fields.
        const updates = {
            front: result.front, // Persian
            back: result.back,   // English
            pronunciation: result.pronunciation,
            tone: result.tone,
            synonyms: result.synonyms, // Added synonyms
            word_forms: result.word_forms,
            examples: result.examples,
        };

        if (DRY_RUN) {
            console.log(`[DRY RUN] Would update ${card.id} (${card.front} -> ${result.front}):`, JSON.stringify(updates, null, 2));
        } else {
            const { error: updateError } = await supabase
                .from('cards')
                .update(updates)
                .eq('id', card.id);
            
            if (updateError) {
                console.error(`❌ Error updating ${card.id}:`, updateError.message);
            } else {
                console.log(`✅ Updated: ${result.back} (${result.front})`);
            }
        }

    } catch (err) {
        console.error(`❌ Failed to process card ${card.id} (${card.front}):`, err.message);
    }
}

main();
