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
    baseURL: "https://api.cerebras.ai/v1", // Inference Endpoint
});

const MODEL = "llama-3.3-70b"; 

async function main() {
    console.log(`🚀 Starting Cerebras Enrichment (${MODEL})...`);
    
    if (!fs.existsSync('skipped_cards.json')) {
        console.error("No skipped_cards.json found.");
        return;
    }

    const skippedIds = JSON.parse(fs.readFileSync('skipped_cards.json', 'utf8'));
    console.log(`Loaded ${skippedIds.length} skipped IDs.`);

    // Cerebras is fast, we can use a decent batch size for fetching
    const BATCH_SIZE = 50; 
    
    for (let i = 0; i < skippedIds.length; i += BATCH_SIZE) {
        const batchIds = skippedIds.slice(i, i + BATCH_SIZE);
        
        const { data: cards, error } = await supabase
            .from('cards')
            .select('*')
            .in('id', batchIds);

        if (error) {
            console.error("Error fetching batch:", error);
            continue;
        }

        console.log(`Processing batch ${i+1}-${i+cards.length}...`);

        // We can do some parallelism here because Cerebras is fast (e.g., 5 at a time)
        const CONCURRENCY = 5;
        for (let j = 0; j < cards.length; j += CONCURRENCY) {
            const chunk = cards.slice(j, j + CONCURRENCY);
            await Promise.all(chunk.map(processCard));
            
            // Small delay to be polite, though Cerebras has high limits
            await new Promise(r => setTimeout(r, 200)); 
        }
    }

    console.log("Done! 🎉");
}

async function processCard(card) {
    try {
        const prompt = `
        You are an expert linguist. Standardize this flashcard for a Persian speaker learning English.

        Input:
        - Front: "${card.front}"
        - Back: "${card.back}"
        - Existing Examples: ${JSON.stringify(card.examples)}

        REQUIREMENTS:
        1. **Front**: Natural Persian Translation.
        2. **Back**: English Word/Phrase.
        3. **Metadata**: Pronunciation (IPA), Tone, Word Forms, Synonyms (3-5).
        4. **Examples**: 2-4 excellent context sentences (Movie/Book style).

        Output JSON strictly:
        {
            "front": "Persian Translation",
            "back": "English Word",
            "pronunciation": "/IPA/",
            "tone": "Neutral",
            "synonyms": "syn1, syn2, syn3",
            "word_forms": { "noun": "...", "verb": "...", "adj": "...", "adv": "..." },
            "examples": ["sentence 1", "sentence 2"]
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
        };

        const { error: updateError } = await supabase
            .from('cards')
            .update(updates)
            .eq('id', card.id);

        if (updateError) {
            console.error(`❌ DB Error ${card.id}:`, updateError.message);
        } else {
            console.log(`✅ Updated: ${result.back} (${result.front})`);
        }

    } catch (err) {
        console.error(`❌ Failed ${card.id}: ${err.message}`);
    }
}

main();
