const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.resolve(__dirname, '..');
const DELAY_MS = 150; // delay between API calls to avoid rate limiting
const API_BASE = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

// ---- Helpers ----

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchJSON(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { timeout: 5000 }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve(null);
                }
            });
        }).on('error', () => resolve(null));
    });
}

async function lookupWord(word) {
    // For phrases, try the main word
    const lookupTerm = word.includes(' ')
        ? word.split(' ').find(w => w.length > 3) || word.split(' ')[0]
        : word;

    const data = await fetchJSON(API_BASE + encodeURIComponent(lookupTerm.toLowerCase()));
    if (!data || !Array.isArray(data) || data.length === 0) return null;
    return data[0];
}

function extractPronunciation(apiData) {
    if (!apiData) return null;
    // Prefer US pronunciation
    if (apiData.phonetics) {
        const us = apiData.phonetics.find(p => p.audio && p.audio.includes('-us'));
        if (us && us.text) return us.text;
        const any = apiData.phonetics.find(p => p.text);
        if (any) return any.text;
    }
    return apiData.phonetic || null;
}

function extractWordForms(apiData, word) {
    const forms = { pp: null, adj: null, adv: null, noun: null, past: null, verb: null };
    if (!apiData || !apiData.meanings) return forms;

    for (const meaning of apiData.meanings) {
        const pos = meaning.partOfSpeech;
        if (pos === 'noun' && !forms.noun) forms.noun = word;
        if (pos === 'verb' && !forms.verb) forms.verb = word;
        if (pos === 'adjective' && !forms.adj) forms.adj = word;
        if (pos === 'adverb' && !forms.adv) forms.adv = word;
    }

    // Derive common forms
    const w = word.toLowerCase();
    if (forms.verb) {
        if (!forms.past) {
            if (w.endsWith('e')) forms.past = w + 'd';
            else if (w.endsWith('y') && !/[aeiou]y$/.test(w)) forms.past = w.slice(0, -1) + 'ied';
            else forms.past = w + 'ed';
        }
        if (!forms.pp) forms.pp = forms.past;
    }
    if (forms.adj && !forms.adv) {
        if (w.endsWith('le')) forms.adv = w.slice(0, -2) + 'ly';
        else if (w.endsWith('y')) forms.adv = w.slice(0, -1) + 'ily';
        else if (w.endsWith('ic')) forms.adv = w + 'ally';
        else forms.adv = w + 'ly';
    }

    return forms;
}

function extractSynonyms(apiData) {
    if (!apiData || !apiData.meanings) return [];
    const syns = new Set();
    for (const meaning of apiData.meanings) {
        if (meaning.synonyms) meaning.synonyms.forEach(s => syns.add(s));
        for (const def of (meaning.definitions || [])) {
            if (def.synonyms) def.synonyms.forEach(s => syns.add(s));
        }
    }
    return [...syns].slice(0, 6);
}

function extractExamples(apiData) {
    if (!apiData || !apiData.meanings) return [];
    const examples = [];
    for (const meaning of apiData.meanings) {
        for (const def of (meaning.definitions || [])) {
            if (def.example) examples.push(def.example);
        }
    }
    return examples.slice(0, 4);
}

function formatSynonyms(synonyms) {
    if (!synonyms || synonyms.length === 0) return null;
    return synonyms.map(s => `${s} = similar meaning`).join(' | ');
}

function mergeWordForms(existing, fromAPI) {
    if (!existing && !fromAPI) return { pp: null, adj: null, adv: null, noun: null, past: null, verb: null };
    const base = { pp: null, adj: null, adv: null, noun: null, past: null, verb: null };

    // Start with API data
    if (fromAPI) {
        for (const key of Object.keys(base)) {
            if (fromAPI[key]) base[key] = fromAPI[key];
        }
    }

    // Override with existing data if more complete
    if (existing) {
        for (const key of ['pp', 'adj', 'adv', 'noun', 'past', 'verb']) {
            const val = existing[key];
            if (val && val !== '' && val !== existing.noun) { // avoid "noun: bronco" style
                base[key] = val;
            }
        }
    }

    return base;
}

function mergeExamples(bookExamples, apiExamples, maxTotal = 4) {
    const result = [];
    const seen = new Set();

    // Book examples first (they're authoritative)
    for (const ex of (bookExamples || [])) {
        if (ex && !seen.has(ex.toLowerCase())) {
            result.push(ex);
            seen.add(ex.toLowerCase());
        }
    }

    // Fill up with API examples
    for (const ex of (apiExamples || [])) {
        if (result.length >= maxTotal) break;
        if (ex && !seen.has(ex.toLowerCase())) {
            result.push(ex);
            seen.add(ex.toLowerCase());
        }
    }

    return result;
}

// ---- Main Processing ----

async function processFile(filename) {
    const filepath = path.join(ROOT, filename);
    if (!fs.existsSync(filepath)) {
        console.error(`File not found: ${filename}`);
        return [];
    }

    const cards = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    console.log(`\nProcessing ${filename}: ${cards.length} cards`);

    const enriched = [];
    let apiHits = 0, apiMisses = 0;

    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const word = card.back;

        if (!word) continue;

        // Look up in dictionary API
        const apiData = await lookupWord(word);

        let pronunciation = card.pronunciation;
        let wordForms = card.word_forms;
        let examples = Array.isArray(card.examples) ? card.examples : [];
        let synonyms = card.synonyms || null;

        if (apiData) {
            apiHits++;

            // Fill pronunciation if missing
            if (!pronunciation || pronunciation === '') {
                pronunciation = extractPronunciation(apiData);
            }

            // Enrich word forms
            const apiWordForms = extractWordForms(apiData, word);
            wordForms = mergeWordForms(wordForms, apiWordForms);

            // Enrich examples (keep book examples, add API examples)
            const apiExamples = extractExamples(apiData);
            examples = mergeExamples(examples, apiExamples, 4);

            // Add synonyms if missing
            if (!synonyms) {
                const synList = extractSynonyms(apiData);
                if (synList.length > 0) {
                    synonyms = formatSynonyms(synList);
                }
            }
        } else {
            apiMisses++;
            // Ensure word_forms has proper structure even without API
            wordForms = mergeWordForms(wordForms, null);
        }

        // Ensure front has ===HINT===
        let front = card.front || '';
        if (!front.includes('===HINT===') && word) {
            front = front + ' ===HINT=== ' + word.charAt(0).toLowerCase();
        }

        enriched.push({
            front,
            back: word,
            pronunciation: pronunciation || null,
            tone: card.tone || 'neutral',
            word_forms: wordForms,
            examples: examples,
            other_meanings: Array.isArray(card.other_meanings) ? card.other_meanings : [],
            synonyms: synonyms,
            native_speaking: false
        });

        // Progress
        if ((i + 1) % 100 === 0) {
            console.log(`  ${i + 1}/${cards.length} (API hits: ${apiHits}, misses: ${apiMisses})`);
        }

        await sleep(DELAY_MS);
    }

    console.log(`  Done: ${enriched.length} cards (API hits: ${apiHits}, misses: ${apiMisses})`);
    return enriched;
}

async function main() {
    console.log("=== CARD ENRICHMENT PIPELINE ===\n");

    const allFiles = [
        { file: 'extracted_book1.json', source: 'EVU_Upper_Intermediate' },
        { file: 'extracted_book2.json', source: 'EVU_Advanced' },
        { file: 'extracted_book3.json', source: 'Collocations_Advanced' },
        { file: 'extracted_book4.json', source: 'College_Bound' },
        { file: 'book4_ch4_greek.json', source: 'College_Bound' },
        { file: 'book4_ch5_latin.json', source: 'College_Bound' },
        { file: 'book4_ch6_7_myth_anglo.json', source: 'College_Bound' },
        { file: 'book4_ch8_10_foreign.json', source: 'College_Bound' },
    ];

    let allEnriched = [];

    for (const { file, source } of allFiles) {
        const enriched = await processFile(file);
        allEnriched = allEnriched.concat(enriched);
    }

    console.log(`\nTotal enriched cards: ${allEnriched.length}`);

    // Deduplicate
    console.log("\n--- Deduplicating ---");
    const existingWords = JSON.parse(fs.readFileSync(path.join(ROOT, 'existing_db_words.json'), 'utf8'));
    const existingSet = new Set(existingWords.map(w => w.toLowerCase().trim()));

    const seenWords = new Set();
    const unique = [];
    let dupDB = 0, dupInternal = 0, noExamples = 0;

    for (const card of allEnriched) {
        const normalized = card.back.toLowerCase().trim();

        if (existingSet.has(normalized)) { dupDB++; continue; }
        if (seenWords.has(normalized)) { dupInternal++; continue; }
        if (!card.examples || card.examples.length === 0) { noExamples++; continue; }

        seenWords.add(normalized);
        unique.push(card);
    }

    console.log(`Duplicates with DB: ${dupDB}`);
    console.log(`Duplicates internal: ${dupInternal}`);
    console.log(`Dropped (no examples): ${noExamples}`);
    console.log(`Unique cards with examples: ${unique.length}`);

    // Add DB insert fields
    const insertReady = unique.map(card => ({
        ...card,
        state: 'NEW',
        next_review: new Date().toISOString(),
        interval: 0,
        ease_factor: 2.5,
        user_notes: null,
    }));

    const outPath = path.join(ROOT, 'all_new_cards_deduped.json');
    fs.writeFileSync(outPath, JSON.stringify(insertReady, null, 2));
    console.log(`\nSaved ${insertReady.length} enriched cards to all_new_cards_deduped.json`);

    // Quality report
    const noPronunciation = insertReady.filter(c => !c.pronunciation).length;
    const oneExample = insertReady.filter(c => c.examples.length === 1).length;
    const multiExample = insertReady.filter(c => c.examples.length >= 2).length;
    const hasSynonyms = insertReady.filter(c => c.synonyms).length;

    console.log("\n--- Quality Report ---");
    console.log(`Total: ${insertReady.length}`);
    console.log(`With pronunciation: ${insertReady.length - noPronunciation} (${((insertReady.length - noPronunciation) / insertReady.length * 100).toFixed(1)}%)`);
    console.log(`1 example: ${oneExample}, 2+ examples: ${multiExample}`);
    console.log(`With synonyms: ${hasSynonyms} (${(hasSynonyms / insertReady.length * 100).toFixed(1)}%)`);
}

main().catch(err => {
    console.error("Fatal:", err);
    process.exit(1);
});
