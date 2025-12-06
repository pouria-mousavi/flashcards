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
        const front = parts[0].trim();
        
        let rest = parts.slice(1).join('|').trim();
        const backEndIndex = rest.indexOf(' -- ');
        let back = rest;
        let meta = '';
        if (backEndIndex !== -1) {
            back = rest.substring(0, backEndIndex).trim();
            meta = rest.substring(backEndIndex);
        }

        // Extract basic metadata for 'back' content
        // We will store the full 'back' + metadata as the 'back' field for now to preserve display logic,
        // OR we split them if we updated schema. 
        // The current App expects 'back', 'pronunciation', etc. 
        // Let's just persist the RAW fields we parsed.
        
        // Actually, better to store structured data if possible.
        // But for migration speed, let's replicate the structure the App expects.
        // App expects: id, front, back, pronunciation, examples, tone.
        
        const pronunciationMatch = meta.match(/-- Pronunciation: (.*?) (--|$)/);
        const examplesMatch = meta.match(/-- Ex: (.*?) (--|$)/);
        const toneMatch = meta.match(/-- Tone: (.*?) (--|$)/);

        const pronunciation = pronunciationMatch ? pronunciationMatch[1].trim() : null;
        const tone = toneMatch ? toneMatch[1].trim() : null;
        let examples = [];
        if (examplesMatch) {
             examples = examplesMatch[1].trim().split(/\d+\.\s+/).filter(ex => ex.trim().length > 0);
        }

        cards.push({
            front,
            back, // The definition
            pronunciation,
            tone,
            examples, // JSON
            state: 'NEW',
            interval: 0,
            ease_factor: 2.5,
            next_review: new Date().toISOString()
        });
    }

    console.log(`Found ${cards.length} cards. Uploading to Supabase...`);

    const { error } = await supabase.from('cards').upsert(cards, { onConflict: 'front' });

    if (error) {
        console.error("Error uploading:", error);
    } else {
        console.log("Success! Cards migrated.");
    }
}

migrate();
