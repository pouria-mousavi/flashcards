
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';

// Env setup
const envPath = path.resolve(process.cwd(), '.env');
let env = {};
if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    lines.forEach(line => {
        const [key, ...rest] = line.split('=');
        if (key && rest.length > 0) {
            let val = rest.join('=').trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                val = val.slice(1, -1);
            }
            env[key.trim()] = val;
        }
    });
}

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
const anthropic = new Anthropic({ apiKey: env.VITE_CLAUDE_KEY });

async function processList() {
    console.log("Reading raw list...");
    const rawText = fs.readFileSync('data/raw_list_jan9.txt', 'utf-8');

    // Step 1: Extract Headwords
    console.log("Step 1: Extracting English Terms...");
    const extractMsg = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 2000,
        messages: [{
            role: "user", 
            content: `Extract ONLY the main English HEADWORDS from this list. 
            The list format is: 
            Line 1: Word
            Line 2: Definition
            Line 3: Persian
            
            I want a JSON array of JUST the Line 1s (Words).
            Example Input:
            existential
            about human existence
            وجودی
            ontology
            study of being
            هستی‌شناسی
            
            Example Output: ["existential", "ontology"]

            Raw Text:
            ${rawText.slice(0, 10000)}` 
        }]
    });
    
    let extractedWords = [];
    try {
        const text = extractMsg.content[0].text;
        const start = text.indexOf('[');
        const end = text.lastIndexOf(']');
        if (start !== -1 && end !== -1) {
            extractedWords = JSON.parse(text.slice(start, end + 1));
            console.log(`Extracted ${extractedWords.length} words.`);
        } else {
             throw new Error("No JSON array found");
        }
    } catch(e) {
        console.error("Extraction failed", e);
        console.log("Debug text:", extractMsg.content[0].text);
        return;
    }

    // Step 2: Deduplicate against DB
    console.log("Step 2: Checking Duplicates in DB...");
    const { data: existingData } = await supabase.from('cards').select('back');
    const existingBacks = new Set(existingData.map(c => c.back.toLowerCase().trim()));
    
    let uniqueWords = extractedWords.filter(w => !existingBacks.has(w.toLowerCase().trim()));
    console.log(`${uniqueWords.length} words are new.`);

    // Step 3: Filter Niche Academic Terms
    console.log("Step 3: Filtering Niche/Academic Terms...");
    // Split into batches for filtering
    let filteredWords = [];
    const filterBatchSize = 50;
    
    for (let i = 0; i < uniqueWords.length; i += filterBatchSize) {
        const batch = uniqueWords.slice(i, i + filterBatchSize);
        const filterPrompt = `
        Filter this list of psychology terms.
        KEEP words that are useful for effective communication, self-understanding, or deep conversation.
        REMOVE words that are "VERY Psychological" (overly obscure, purely academic jargon, or useless for a non-professional).
        
        Keep "existential", "neurosis", "projection".
        Maybe remove "catecholamines" or "Causa Sui" if they are too niche.
        
        List: ${JSON.stringify(batch)}
        
        Return JSON array of KEP_WORDS only.
        `;
        
        try {
            const filterMsg = await anthropic.messages.create({
                model: "claude-3-haiku-20240307",
                max_tokens: 1000,
                messages: [{ role: "user", content: filterPrompt }]
            });
            const allowed = JSON.parse(filterMsg.content[0].text.match(/\[[\s\S]*\]/)[0]);
            filteredWords.push(...allowed);
        } catch(e) { 
            console.error("Filter batch failed, keeping all.", e);
            filteredWords.push(...batch);
        }
    }
    console.log(`${filteredWords.length} words survived filtering.`);

    // Step 4: Enrichment & Insertion
    console.log("Step 4: Enriching and Inserting...");
    const enrichBatchSize = 10;
    for (let i = 0; i < filteredWords.length; i += enrichBatchSize) {
        const batch = filteredWords.slice(i, i + enrichBatchSize);
        console.log(`Processing batch ${i/enrichBatchSize + 1}... [${batch[0]}...]`);
        
        const enrichPrompt = `
        Enrich these English words for a Persian Flashcard App.
        
        For each word:
        1. "front": Natural Persian Translation.
        2. "hint": Short English definition (NO SPOILERS! Do not use the word itself).
        3. "metadata": Pronunciation (IPA), Tone, Synonyms (3), Examples (2).
        
        CRITICAL: Output STRICT JSON. Escape all quotes. Do not verify, just JSON.
        
        Input: ${JSON.stringify(batch)}
        
        Output JSON:
        {
            "cards": [
                {
                    "back": "Word",
                    "front": "Persian",
                    "hint": "Definition...",
                    "pronunciation": "/.../",
                    "tone": "Formal/Neutral",
                    "synonyms": "a, b, c",
                    "examples": ["Ex 1", "Ex 2"]
                }
            ]
        }
        `;
        
        try {
            const enrichMsg = await anthropic.messages.create({
                model: "claude-3-haiku-20240307",
                max_tokens: 3000,
                messages: [{ role: "user", content: enrichPrompt }]
            });
            
            const result = JSON.parse(enrichMsg.content[0].text.match(/\{[\s\S]*\}/)[0]);
            
            const dbRows = result.cards.map(c => ({
                back: c.back,
                front: `${c.front}\n\n===HINT===\n${c.hint}`,
                pronunciation: c.pronunciation,
                tone: c.tone,
                synonyms: c.synonyms,
                examples: JSON.stringify(c.examples),
                state: 'NEW',
                interval: 0,
                ease_factor: 2.5,
                next_review: new Date().toISOString()
            }));
            
            const { error } = await supabase.from('cards').insert(dbRows);
            if (error) console.error("DB Insert Error", error);
            else console.log(`Saved ${dbRows.length} cards.`);
            
        } catch(e) {
            console.error("Enrichment failed for batch", e);
        }
    }
    console.log("Done.");
}

processList();
