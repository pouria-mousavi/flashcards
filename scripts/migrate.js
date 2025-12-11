import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Run with: node scripts/migrate.js <URL> <KEY>

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.error("Usage: node migrate.js <SUPABASE_URL> <SUPABASE_KEY>");
        process.exit(1);
    }
    const [url, key] = args;
    const supabase = createClient(url, key);

    console.log("Reading flashcards...");
    const filePath = path.join(__dirname, '../flashcards.txt');
    const text = fs.readFileSync(filePath, 'utf-8');

    // Simple parser (duplicating logic to avoid TS complexity in raw node script)
    const cards = [];
    const lines = text.split('\n');
    for (let line of lines) {
        line = line.trim();
        if (!line) continue;
        const parts = line.split('|');
        if (parts.length < 2) continue;

        // 1. Clean Front
        let front = parts[0].trim();
        // Remove prefixes like "Persian:", "Farsi:", "Meaning:", "Question:" (case insensitive)
        // Also handles "Persian Meaning:", "English Meaning:" if present on front (rare but possible)
        front = front.replace(/^(Persian|Farsi|Meaning|Question|معنی|فارسی)(\s*Meaning)?\s*[:：]\s*/i, '').trim();

        // 2. Parse Rest (Back side chunks)
        const rest = parts.slice(1).join('|').trim();
        // Use a more robust split that respects the "-- Key: Value" structure
        const segments = rest.split(/--(?=\s*\w+\s*[:：])/).map(s => s.trim()).filter(s => s);
        
        // Sometimes the first chunk is the definition without a key
        // But in the file it might just be "Word -- Pronunciation: ..."
        // Let's rely on the previous split logic which was working but buggy with variables.
        
        const rawSegments = rest.split('--').map(s => s.trim());
        let back = rawSegments[0] || '';
        back = back.replace(/^(English|Eng)(\s*Meaning)?\s*[:：]\s*/i, '').trim();

        let pronunciation = null;
        let tone = 'Neutral'; 
        let synonyms = null;
        let examples = null;

        for (let i = 1; i < rawSegments.length; i++) {
            const seg = rawSegments[i];
            if (seg.match(/^Pronunciation\s*[:：]/i)) {
                pronunciation = seg.replace(/^Pronunciation\s*[:：]\s*/i, '').trim();
            } else if (seg.match(/^Tone\s*[:：]/i)) {
                tone = seg.replace(/^Tone\s*[:：]\s*/i, '').trim();
            } else if (seg.match(/^(Alt|Synonyms|Alternative)\s*[:：]/i)) {
                synonyms = seg.replace(/^(Alt|Synonyms|Alternative)\s*[:：]\s*/i, '').trim();
            } else if (seg.match(/^(Ex|Example|Examples)\s*[:：]/i)) {
                const rawEx = seg.replace(/^(Ex|Example|Examples)\s*[:：]\s*/i, '').trim();
                const matches = rawEx.match(/\d+\.\s*([^0-9]+)/g);
                if (matches) {
                    examples = matches.map(m => m.replace(/^\d+\.\s*/, '').trim());
                } else {
                    examples = [rawEx];
                }
            }
        }

        cards.push({
            front,
            back,
            pronunciation,
            tone,
            synonyms, 
            examples: examples, // Pass array directly for JSONB
            state: 'NEW',
            next_review: new Date().toISOString(),
            interval: 0,
            ease_factor: 2.5
        });
    }
    console.log(`Found ${cards.length} cards. Deduplicating...`);
    
    const uniqueCards = [];
    const seenMap = new Set();
    
    for (const c of cards) {
        // Normalize front for dedupe check (optional, but good)
        const key = c.front.trim().toLowerCase();
        if (seenMap.has(key)) {
            continue;
        }
        seenMap.add(key);
        uniqueCards.push(c);
    }
    
    console.log(`Unique cards: ${uniqueCards.length}. Uploading to Supabase...`);
    if (uniqueCards.length > 0) {
        console.log("Sample Card:", JSON.stringify(uniqueCards[0], null, 2));
    }

    // 3. Batch Process
    const batchSize = 5; // Safer batch size for URL limits
    let processingError = null;

    for (let i = 0; i < uniqueCards.length; i += batchSize) {
        const batch = uniqueCards.slice(i, i + batchSize);
        
        const fronts = batch.map(c => c.front);
        // Supabase .in() filter creates a long URL string. 
        // With long flashcard sentences, this can easily exceed 4KB/8KB limits.
        const { data: existing, error: fetchErr } = await supabase
            .from('cards')
            .select('front, state, next_review, interval, ease_factor, id')
            .in('front', fronts);
            
        if (fetchErr) {
            console.error("Error fetching existing cards:", fetchErr);
            processingError = fetchErr;
            // Fallback: If fetch fails, we skip preserving stats to avoid crashing via upsert errors?
            // Or we just try to upsert anyway.
            // If we continue, we risk overwriting stats, but it's better than crashing.
        }
        
        const existingMap = new Map();
        if (existing) {
            existing.forEach(e => existingMap.set(e.front, e));
        }
        
        const finalBatch = batch.map(c => {
            const old = existingMap.get(c.front);
            if (old) {
                // Preserve stats
                return {
                    ...c,
                    id: old.id,
                    state: old.state,
                    next_review: old.next_review,
                    interval: old.interval,
                    ease_factor: old.ease_factor
                };
            }
            // New card: ensure NO ID is present to let DB generate it
            const { id, ...rest } = c; 
            return rest;
        });
        
        const { error: upsertErr } = await supabase.from('cards').upsert(finalBatch, { onConflict: 'front' });
        if (upsertErr) {
            console.error("Error upserting batch:", upsertErr);
            processingError = upsertErr;
        } else {
            console.log(`Processed batch ${i} - ${i + batch.length}`);
        }
    }

    if (processingError) {
        console.error("Migration finished with errors.");
    } else {
        console.log("Success! Cards migrated.");
    }
}

migrate();
