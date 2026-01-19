import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load Supabase credentials
const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

const OLLAMA_URL = 'http://localhost:11434/api/generate'; // Safer legacy endpoint
const MODEL = 'llama3.2'; 

async function callOllama(prompt) {
    try {
        const response = await fetch(OLLAMA_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: MODEL,
                prompt: `You are a JSON factory. Respond ONLY with valid JSON.\n\n${prompt}`, // Construct raw prompt
                stream: false,
                format: "json" 
            })
        });

        if (!response.ok) {
            throw new Error(`Ollama Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.response; // /api/generate returns 'response' field
    } catch (error) {
        console.error("Connection to Ollama failed:", error.message);
        throw error;
    }
}

async function main() {
    console.log(`🚀 Starting Ollama Enrichment (${MODEL})...`);
    
    // Check connection first
    try {
        await callOllama("test");
        console.log("✅ Connected to local Ollama.");
    } catch (e) {
        console.error("❌ Could not connect to Ollama at http://localhost:11434. Is it running?");
        process.exit(1);
    }

    if (!fs.existsSync('skipped_cards.json')) {
        console.error("No skipped_cards.json found.");
        return;
    }

    const skippedIds = JSON.parse(fs.readFileSync('skipped_cards.json', 'utf8'));
    console.log(`Loaded ${skippedIds.length} skipped IDs.`);

    // Process iteratively
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

        // Serial processing for local LLM to avoid context switching overhead/OOM on laptop
        for (const card of cards) {
            await processCard(card);
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

        Output JSON ONLY:
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

        const rawResponse = await callOllama(prompt);
        // Clean up response if needed (Ollama sometimes adds text outside format=json)
        const jsonStr = rawResponse.match(/\{[\s\S]*\}/)?.[0] || rawResponse;
        const result = JSON.parse(jsonStr);

        if (!result.front || !result.back) {
            console.error(`❌ Invalid output for ${card.id}`);
            return;
        }

        const updates = {
            front: result.front, // Persian
            back: result.back,   // English
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
