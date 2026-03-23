const fs = require('fs');
const path = require('path');
const nlp = require('compromise');
const CMUDict = require('cmudict');

const ROOT = path.resolve(__dirname, '..');
const cmuDict = new CMUDict.CMUDict();

// ARPAbet to IPA mapping
const ARPA_TO_IPA = {
    'AA': 'ɑ', 'AE': 'æ', 'AH': 'ə', 'AO': 'ɔ', 'AW': 'aʊ',
    'AY': 'aɪ', 'B': 'b', 'CH': 'tʃ', 'D': 'd', 'DH': 'ð',
    'EH': 'ɛ', 'ER': 'ɝ', 'EY': 'eɪ', 'F': 'f', 'G': 'ɡ',
    'HH': 'h', 'IH': 'ɪ', 'IY': 'i', 'JH': 'dʒ', 'K': 'k',
    'L': 'l', 'M': 'm', 'N': 'n', 'NG': 'ŋ', 'OW': 'oʊ',
    'OY': 'ɔɪ', 'P': 'p', 'R': 'ɹ', 'S': 's', 'SH': 'ʃ',
    'T': 't', 'TH': 'θ', 'UH': 'ʊ', 'UW': 'u', 'V': 'v',
    'W': 'w', 'Y': 'j', 'Z': 'z', 'ZH': 'ʒ'
};

// Stressed vowel IPA (primary stress)
const ARPA_STRESSED = {
    'AA': 'ɑː', 'AE': 'æ', 'AH': 'ʌ', 'AO': 'ɔː', 'AW': 'aʊ',
    'AY': 'aɪ', 'EH': 'ɛ', 'ER': 'ɜːɹ', 'EY': 'eɪ', 'IH': 'ɪ',
    'IY': 'iː', 'OW': 'oʊ', 'OY': 'ɔɪ', 'UH': 'ʊ', 'UW': 'uː'
};

function arpaToIPA(arpa) {
    if (!arpa) return null;
    const phones = arpa.split(' ');
    let ipa = '';
    for (const phone of phones) {
        const stress = phone.match(/\d$/);
        const base = phone.replace(/\d$/, '');
        if (stress && stress[0] === '1') {
            ipa += 'ˈ' + (ARPA_STRESSED[base] || ARPA_TO_IPA[base] || base.toLowerCase());
        } else if (stress && stress[0] === '2') {
            ipa += 'ˌ' + (ARPA_TO_IPA[base] || base.toLowerCase());
        } else {
            ipa += (ARPA_TO_IPA[base] || base.toLowerCase());
        }
    }
    return '/' + ipa + '/';
}

function getPronunciation(word) {
    // Try the word directly
    const w = word.toLowerCase().trim();
    let arpa = cmuDict.get(w);
    if (arpa) return arpaToIPA(arpa);

    // Try without hyphens
    const noHyphen = w.replace(/-/g, '');
    arpa = cmuDict.get(noHyphen);
    if (arpa) return arpaToIPA(arpa);

    // For phrases, try each word
    if (w.includes(' ')) {
        const words = w.split(/\s+/);
        const ipas = words.map(part => {
            const a = cmuDict.get(part);
            return a ? arpaToIPA(a).slice(1, -1) : part; // remove outer slashes
        });
        if (ipas.some(p => p.includes('ˈ'))) {
            return '/' + ipas.join(' ') + '/';
        }
    }
    return null;
}

function getWordForms(word) {
    const forms = { pp: null, adj: null, adv: null, noun: null, past: null, verb: null };
    const w = word.toLowerCase().trim();
    const doc = nlp(w);

    // Try verb conjugation
    const verbData = doc.verbs().conjugate();
    if (verbData && verbData.length > 0) {
        const v = verbData[0];
        forms.verb = v.Infinitive || w;
        forms.past = v.PastTense || null;
        forms.pp = v.PastTense || null; // compromise doesn't have PP separately
    }

    // Try adjective forms
    const adjData = doc.adjectives().json();
    if (adjData && adjData.length > 0 && adjData[0].adjective) {
        const a = adjData[0].adjective;
        forms.adj = w;
        if (a.adverb) forms.adv = a.adverb;
        if (a.noun && a.noun !== w) forms.noun = a.noun;
    }

    // Try noun forms
    const nounData = doc.nouns().json();
    if (nounData && nounData.length > 0) {
        forms.noun = forms.noun || w;
    }

    return forms;
}

function mergeWordForms(existing, generated) {
    const base = { pp: null, adj: null, adv: null, noun: null, past: null, verb: null };

    // Apply generated forms
    if (generated) {
        for (const key of Object.keys(base)) {
            if (generated[key]) base[key] = generated[key];
        }
    }

    // Override with existing non-empty values
    if (existing && typeof existing === 'object') {
        for (const key of ['pp', 'adj', 'adv', 'noun', 'past', 'verb']) {
            const val = existing[key];
            if (val && val !== '' && val !== 'null') {
                base[key] = val;
            }
        }
    }

    return base;
}

function processCard(card) {
    const word = card.back;
    if (!word) return null;

    // Pronunciation - keep existing if good, otherwise generate
    let pronunciation = card.pronunciation;
    if (!pronunciation || pronunciation === '' || pronunciation === 'null') {
        pronunciation = getPronunciation(word);
    }
    // Clean up existing pronunciation
    if (pronunciation && !pronunciation.startsWith('/')) {
        pronunciation = '/' + pronunciation + '/';
    }
    // Remove double slashes like //word//
    if (pronunciation) {
        pronunciation = pronunciation.replace(/^\/\//, '/').replace(/\/\/$/, '/');
    }

    // Word forms
    const generatedForms = getWordForms(word);
    const wordForms = mergeWordForms(card.word_forms, generatedForms);

    // Examples - keep what we have
    let examples = Array.isArray(card.examples) ? card.examples.filter(e => e && e.trim()) : [];

    // Front - ensure ===HINT=== format
    let front = card.front || '';
    if (!front.includes('===HINT===') && word) {
        front = front + ' ===HINT=== ' + word.charAt(0).toLowerCase();
    }

    // Tone
    const tone = card.tone || 'neutral';

    // Other meanings
    const otherMeanings = Array.isArray(card.other_meanings) ? card.other_meanings : [];

    return {
        front,
        back: word,
        pronunciation,
        tone,
        word_forms: wordForms,
        examples,
        other_meanings: otherMeanings,
        synonyms: card.synonyms || null,
        native_speaking: false
    };
}

function processFile(filename) {
    const filepath = path.join(ROOT, filename);
    if (!fs.existsSync(filepath)) {
        console.error(`File not found: ${filename}`);
        return [];
    }

    const cards = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    console.log(`\nProcessing ${filename}: ${cards.length} cards`);

    const enriched = [];
    let withPronunciation = 0;
    let withExamples = 0;

    for (const card of cards) {
        const processed = processCard(card);
        if (processed) {
            enriched.push(processed);
            if (processed.pronunciation) withPronunciation++;
            if (processed.examples.length > 0) withExamples++;
        }
    }

    console.log(`  Enriched: ${enriched.length}, with pronunciation: ${withPronunciation} (${(withPronunciation/enriched.length*100).toFixed(1)}%), with examples: ${withExamples}`);
    return enriched;
}

function main() {
    console.log("=== CARD ENRICHMENT v2 (Local NLP) ===\n");

    const files = [
        'extracted_book1.json',
        'extracted_book2.json',
        'extracted_book3.json',
        'extracted_book4.json',
        'book4_ch4_greek.json',
        'book4_ch5_latin.json',
        'book4_ch6_7_myth_anglo.json',
        'book4_ch8_10_foreign.json',
    ];

    let allEnriched = [];
    for (const file of files) {
        allEnriched = allEnriched.concat(processFile(file));
    }

    console.log(`\nTotal enriched: ${allEnriched.length}`);

    // Deduplicate
    console.log("\n--- Deduplicating ---");
    const existingWords = JSON.parse(fs.readFileSync(path.join(ROOT, 'existing_db_words.json'), 'utf8'));
    const existingSet = new Set(existingWords.map(w => w.toLowerCase().trim()));

    const seenWords = new Set();
    const unique = [];
    let dupDB = 0, dupInternal = 0, noExamples = 0, noPronunciation = 0;

    for (const card of allEnriched) {
        const normalized = card.back.toLowerCase().trim().replace(/\s+/g, ' ');

        if (existingSet.has(normalized)) { dupDB++; continue; }
        if (seenWords.has(normalized)) { dupInternal++; continue; }

        // Skip cards with no examples
        if (!card.examples || card.examples.length === 0) {
            noExamples++;
            continue;
        }

        seenWords.add(normalized);
        unique.push(card);
    }

    console.log(`Duplicates with DB: ${dupDB}`);
    console.log(`Duplicates internal: ${dupInternal}`);
    console.log(`Dropped (no examples): ${noExamples}`);
    console.log(`Unique cards with examples: ${unique.length}`);

    // Quality report before saving
    const stats = {
        total: unique.length,
        withPronunciation: unique.filter(c => c.pronunciation).length,
        withWordForms: unique.filter(c => c.word_forms && Object.values(c.word_forms).some(v => v)).length,
        oneExample: unique.filter(c => c.examples.length === 1).length,
        twoExamples: unique.filter(c => c.examples.length === 2).length,
        threeOrMore: unique.filter(c => c.examples.length >= 3).length,
        withSynonyms: unique.filter(c => c.synonyms).length,
    };

    console.log("\n--- Quality Report ---");
    console.log(`Total unique cards: ${stats.total}`);
    console.log(`With pronunciation: ${stats.withPronunciation} (${(stats.withPronunciation/stats.total*100).toFixed(1)}%)`);
    console.log(`With word_forms: ${stats.withWordForms} (${(stats.withWordForms/stats.total*100).toFixed(1)}%)`);
    console.log(`Examples: 1=${stats.oneExample}, 2=${stats.twoExamples}, 3+=${stats.threeOrMore}`);
    console.log(`With synonyms: ${stats.withSynonyms}`);

    // Cards missing pronunciation
    const missingPron = unique.filter(c => !c.pronunciation);
    if (missingPron.length > 0) {
        console.log(`\nSample cards missing pronunciation:`);
        missingPron.slice(0, 10).forEach(c => console.log(`  - ${c.back}`));
    }

    // Add DB fields and save
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

    // Also save a sample for inspection
    const samplePath = path.join(ROOT, 'sample_enriched.json');
    const sample = insertReady.filter(c => c.pronunciation && c.examples.length >= 1).slice(0, 5);
    fs.writeFileSync(samplePath, JSON.stringify(sample, null, 2));
    console.log(`Saved 5 sample cards to sample_enriched.json for inspection`);
}

main();
