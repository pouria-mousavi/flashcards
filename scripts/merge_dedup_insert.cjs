const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load env
const envPath = path.resolve(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

if (!urlMatch || !keyMatch) {
    console.error("Supabase credentials not found in .env");
    process.exit(1);
}

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());
const ROOT = path.resolve(__dirname, '..');

function loadJSON(filename) {
    const filepath = path.join(ROOT, filename);
    if (!fs.existsSync(filepath)) {
        console.error(`File not found: ${filename}`);
        return [];
    }
    try {
        const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
        return Array.isArray(data) ? data : [];
    } catch (e) {
        console.error(`Failed to parse ${filename}: ${e.message}`);
        return [];
    }
}

function normalizeWord(word) {
    if (!word) return '';
    return word.toLowerCase().trim().replace(/\s+/g, ' ');
}

async function main() {
    console.log("=== MERGE, DEDUPLICATE & INSERT ===\n");

    // Step 1: Load all book files
    console.log("--- Step 1: Loading all book files ---");

    const book1 = loadJSON('extracted_book1.json');
    console.log(`Book 1 (EVU Upper Intermediate): ${book1.length} cards`);

    const book2 = loadJSON('extracted_book2.json');
    console.log(`Book 2 (EVU Advanced): ${book2.length} cards`);

    const book3 = loadJSON('extracted_book3.json');
    console.log(`Book 3 (Collocations Advanced): ${book3.length} cards`);

    // Book 4 - merge all chapter files
    const book4_ch1_3 = loadJSON('extracted_book4.json');
    const book4_ch4 = loadJSON('book4_ch4_greek.json');
    const book4_ch5 = loadJSON('book4_ch5_latin.json');
    const book4_ch6_7 = loadJSON('book4_ch6_7_myth_anglo.json');
    const book4_ch8_10 = loadJSON('book4_ch8_10_foreign.json');

    const book4 = [...book4_ch1_3, ...book4_ch4, ...book4_ch5, ...book4_ch6_7, ...book4_ch8_10];
    console.log(`Book 4 (College Bound): ${book4.length} cards (${book4_ch1_3.length} + ${book4_ch4.length} + ${book4_ch5.length} + ${book4_ch6_7.length} + ${book4_ch8_10.length})`);

    const allCards = [...book1, ...book2, ...book3, ...book4];
    console.log(`\nTotal raw cards: ${allCards.length}`);

    // Step 2: Load existing DB words for dedup
    console.log("\n--- Step 2: Loading existing database words ---");
    const existingWords = loadJSON('existing_db_words.json');
    console.log(`Existing DB words: ${existingWords.length}`);

    const existingWordSet = new Set(existingWords.map(w => normalizeWord(w)));
    console.log(`Unique existing DB words: ${existingWordSet.size}`);

    // Step 3: Deduplicate
    console.log("\n--- Step 3: Deduplicating ---");

    const seenWords = new Set();
    const uniqueCards = [];
    let dupWithinBooks = 0;
    let dupWithDB = 0;
    let noBack = 0;

    for (const card of allCards) {
        if (!card.back) {
            noBack++;
            continue;
        }

        const normalized = normalizeWord(card.back);

        if (!normalized) {
            noBack++;
            continue;
        }

        // Check against existing DB
        if (existingWordSet.has(normalized)) {
            dupWithDB++;
            continue;
        }

        // Check within our new cards
        if (seenWords.has(normalized)) {
            dupWithinBooks++;
            continue;
        }

        seenWords.add(normalized);
        uniqueCards.push(card);
    }

    console.log(`Cards with no 'back' field: ${noBack}`);
    console.log(`Duplicates within books: ${dupWithinBooks}`);
    console.log(`Duplicates with existing DB: ${dupWithDB}`);
    console.log(`\nUnique new cards to insert: ${uniqueCards.length}`);

    // Step 4: Validate and clean cards
    console.log("\n--- Step 4: Validating card format ---");
    let fixedCount = 0;

    const cleanCards = uniqueCards.map(card => {
        let front = card.front || '';
        const back = card.back || '';

        // Ensure ===HINT=== is present
        if (!front.includes('===HINT===') && back) {
            front = front + ' ===HINT=== ' + back.charAt(0).toLowerCase();
            fixedCount++;
        }

        return {
            front: front,
            back: back,
            pronunciation: card.pronunciation || null,
            tone: card.tone || 'neutral',
            word_forms: card.word_forms || null,
            examples: Array.isArray(card.examples) ? card.examples : (card.examples ? [card.examples] : []),
            other_meanings: Array.isArray(card.other_meanings) ? card.other_meanings : [],
            state: 'NEW',
            next_review: new Date().toISOString(),
            interval: 0,
            ease_factor: 2.5,
            user_notes: null,
            synonyms: null,
            native_speaking: false
        };
    });

    console.log(`Cards needing ===HINT=== fix: ${fixedCount}`);

    // Save for reference
    const outputPath = path.join(ROOT, 'all_new_cards_deduped.json');
    fs.writeFileSync(outputPath, JSON.stringify(cleanCards, null, 2));
    console.log(`\nSaved ${cleanCards.length} cards to all_new_cards_deduped.json`);

    // Step 5: Insert into Supabase
    console.log("\n--- Step 5: Inserting into Supabase ---");

    const BATCH_SIZE = 50;
    let successCount = 0;
    let failCount = 0;
    let errorMessages = [];

    for (let i = 0; i < cleanCards.length; i += BATCH_SIZE) {
        const batch = cleanCards.slice(i, i + BATCH_SIZE);

        const { data, error } = await supabase
            .from('cards')
            .insert(batch)
            .select('id');

        if (error) {
            // Try one by one for failed batches
            console.error(`Batch ${i}-${i+batch.length} failed: ${error.message}`);

            for (const card of batch) {
                const { error: singleError } = await supabase
                    .from('cards')
                    .insert(card);

                if (singleError) {
                    failCount++;
                    if (!errorMessages.includes(singleError.message)) {
                        errorMessages.push(singleError.message);
                    }
                } else {
                    successCount++;
                }
            }
        } else {
            successCount += batch.length;
        }

        const processed = Math.min(i + BATCH_SIZE, cleanCards.length);
        if (processed % 200 === 0 || processed === cleanCards.length) {
            console.log(`Progress: ${processed}/${cleanCards.length} (${successCount} ok, ${failCount} failed)`);
        }
    }

    console.log("\n=== FINAL RESULTS ===");
    console.log(`Total raw cards from all books: ${allCards.length}`);
    console.log(`Duplicates removed (within books): ${dupWithinBooks}`);
    console.log(`Duplicates removed (existing DB): ${dupWithDB}`);
    console.log(`Unique new cards attempted: ${cleanCards.length}`);
    console.log(`Successfully inserted: ${successCount}`);
    console.log(`Failed to insert: ${failCount}`);

    if (errorMessages.length > 0) {
        console.log(`\nUnique error messages:`);
        errorMessages.forEach(msg => console.log(`  - ${msg}`));
    }

    console.log("\nDone!");
}

main().catch(err => {
    console.error("Fatal error:", err);
    process.exit(1);
});
