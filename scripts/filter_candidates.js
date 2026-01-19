import fs from 'fs';

const noForms = JSON.parse(fs.readFileSync('cards_without_forms.json', 'utf8'));

// Filter for likely single words or short phrases
const candidates = noForms.filter(c => {
    if (!c.word) return false;
    const word = c.word.trim();
    
    // Filter out obvious phrases/idioms
    if (word.includes('...')) return false;
    if (word.includes('/')) return false; // "word / word"
    if (word.includes('[')) return false; // "word [ipa]" - often implies existing metadata or complex entry
    if (word.length < 3) return false;
    
    const spaceCount = word.split(' ').length - 1;
    
    // Single words or simple loose compounds
    return spaceCount <= 1; 
});

console.log(`Found ${candidates.length} candidates for enrichment out of ${noForms.length} un-enriched cards.`);
console.log(JSON.stringify(candidates.slice(0, 50), null, 2));

fs.writeFileSync('enrich_candidates.json', JSON.stringify(candidates, null, 2));
