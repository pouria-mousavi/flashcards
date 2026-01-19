import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

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

    // Hybrid Parser: Handles both single-line (V5) and multi-line (V6) formats
    const cards = [];
    const lines = text.split('\n');
    let currentCard = null;

    for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        // Check if line is a metadata line (starts with --)
        if (line.startsWith('--')) {
            if (currentCard) {
                // Parse metadata line
                parseMetadata(line, currentCard);
            }
            continue;
        }

        // Otherwise, assume it's a new card header "Front | Back"
        if (line.includes('|')) {
            // Push previous card if exists
            if (currentCard) {
                cards.push(currentCard);
            }

            // Start new card
            const parts = line.split('|');
            let front = parts[0].trim();
            front = front.replace(/^(Persian|Farsi|Meaning|Question|معنی|فارسی)(\s*Meaning)?\s*[:：]\s*/i, '').trim();

            let rest = parts.slice(1).join('|').trim();
            
            // Check for inline metadata (V5 style: "Back -- Key: Val")
            let back = rest;
            if (rest.includes('--')) {
                const splitIdx = rest.indexOf('--');
                back = rest.substring(0, splitIdx).trim();
                const inlineMeta = rest.substring(splitIdx).trim();
                // We'll process this inline meta after creating the object
                // But simplified: extract back first.
                
                // We need to parse valid inline segments too
                // Let's defer inline parsing to the common helper if possible, 
                // but for now let's just clean the back and assume metadata lines follow.
                // actually, for V5, the metadata IS inline.
            }
            back = back.replace(/^(English|Eng)(\s*Meaning)?\s*[:：]\s*/i, '').trim();

            currentCard = {
                front,
                back, // Will be cleaned of inline meta below
                pronunciation: null,
                tone: 'Neutral',
                synonyms: null,
                examples: null,
                state: 'NEW',
                next_review: new Date().toISOString(),
                interval: 0,
                ease_factor: 2.5
            };
            
            // Handle inline metadata if present in the header line
            if (rest.includes('--')) {
                 const segments = rest.split('--').map(s => s.trim());
                 // segments[0] is back def, already handled. Start from 1.
                 for (let i = 1; i < segments.length; i++) {
                     parseMetadata('-- ' + segments[i], currentCard);
                 }
            }
        }
    }
    // Push last card
    if (currentCard) cards.push(currentCard);

    function parseMetadata(line, card) {
        // line expects "-- Key: Value" format
        // remove leading dashes
        const clean = line.replace(/^--\s*/, '');
        
        if (clean.match(/^Pronunciation\s*[:：]/i)) {
            card.pronunciation = clean.replace(/^Pronunciation\s*[:：]\s*/i, '').trim();
        } else if (clean.match(/^Tone\s*[:：]/i)) {
            card.tone = clean.replace(/^Tone\s*[:：]\s*/i, '').trim();
        } else if (clean.match(/^(Alt|Synonyms|Alternative)\s*[:：]/i)) {
            card.synonyms = clean.replace(/^(Alt|Synonyms|Alternative)\s*[:：]\s*/i, '').trim();
        } else if (clean.match(/^(Ex|Example|Examples)\s*[:：]/i)) {
            const rawEx = clean.replace(/^(Ex|Example|Examples)\s*[:：]\s*/i, '').trim();
            // Robust Example Splitter
            const matches = rawEx.split(/\d+\.\s+/).filter(s => s.trim().length > 0);
            if (matches.length > 0) {
                 if (!card.examples) card.examples = [];
                 card.examples.push(...matches.map(m => m.trim()));
            } else {
                 if (!card.examples) card.examples = [];
                 card.examples.push(rawEx);
            }
        }
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
            // New card: Generate ID explicitly to avoid DB errors if default is missing
            return {
                ...c,
                id: crypto.randomUUID()
            };
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
