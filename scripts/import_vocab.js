import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load Env
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

if (!urlMatch || !keyMatch) {
    console.error("Supabase credentials not found");
    process.exit(1);
}

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

const jsonDir = path.resolve(process.cwd(), "scripts/extracted_json");

async function main() {
    console.log("Starting Import...");
    
    // 1. Gather Data
    const files = fs.readdirSync(jsonDir).filter(f => f.endsWith('.json'));
    let allWords = [];
    
    for (const file of files) {
        try {
            const content = fs.readFileSync(path.join(jsonDir, file), 'utf8');
            // Remove any potential markdown before parsing (just in case)
            const clean = content.replace(/```json/g, '').replace(/```/g, '').trim();
            const data = JSON.parse(clean);
            if (Array.isArray(data)) {
                allWords.push(...data);
            }
        } catch (e) {
            console.error(`Error parsing ${file}:`, e.message);
        }
    }
    
    console.log(`Found ${allWords.length} total words extracted.`);
    
    // 2. Fetch existing to dedupe
    // We can fetch all 'front' columns to memory if < 10000
    const { data: existing, error } = await supabase.from('cards').select('front');
    if (error) {
        console.error("Error fetching existing:", error);
        return;
    }
    
    const existingSet = new Set(existing.map(c => c.front.toLowerCase().trim()));
    
    // 3. Insert Batch
    let addedCount = 0;
    
    for (const item of allWords) {
        if (!item.word) continue;
        
        const front = item.word.trim();
        // Check dedupe
        if (existingSet.has(front.toLowerCase())) {
            // console.log(`Skipping duplicate: ${front}`);
            continue;
        }
        
        // Prepare Card
        const card = {
            id: crypto.randomUUID(),
            front: front,
            back: item.definition || "Definition pending...",
            examples: item.example ? [item.example] : [],
            synonyms: item.persian ? [item.persian] : [], // Storing Persian in synonyms/alt field for now? Or better in 'back'?
            // Actually, better to put Persian in the Back along with definition, or create a specific structure.
            // User likes "Concept -> Word" or "Word -> Definition".
            // Standard format: Front=Word, Back=Definition + Persian + Example.
            
            // Re-formatting Back:
            // **Def**: ...
            // **Ex**: ...
            // **Farsi**: ...
            
            // Wait, card object structure in DB:
            // front, back, tone, pronunciation, examples (jsonb array), definitions?
            // Let's stick to the App's format.
            
            state: 'NEW',
            next_review: new Date().toISOString(),
            interval: 0,
            ease_factor: 2.5
        };
        
        // Format Back Content Richly
        card.back = `
**Def**: ${item.definition || 'N/A'}
**Farsi**: ${item.persian || 'N/A'}
        `.trim();
        
        const { error: insertError } = await supabase.from('cards').insert({
             id: card.id,
             front: card.front,
             back: card.back,
             examples: card.examples,
             state: card.state,
             next_review: card.next_review,
             interval: card.interval,
             ease_factor: card.ease_factor
        });
        
        if (insertError) {
             console.error(`Failed to insert ${front}:`, insertError.message);
        } else {
             addedCount++;
             existingSet.add(front.toLowerCase());
             if (addedCount % 10 === 0) process.stdout.write('+');
        }
    }
    
    console.log(`\nImport Complete! Added ${addedCount} new cards.`);
}

main();
