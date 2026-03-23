const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

const cards = JSON.parse(fs.readFileSync(path.join(ROOT, 'all_new_cards_deduped.json'), 'utf8'));
console.log(`Loaded ${cards.length} cards\n`);

let fixedHint = 0;
let cleanedSemicolons = 0;
let cleanedNumbers = 0;
let cleanedAbbreviations = 0;
let stillMessy = [];

function cleanFront(front, back) {
    if (!front || !back) return front;

    // Split on ===HINT===
    const parts = front.split('===HINT===');
    let definition = (parts[0] || '').trim();
    let hint = (parts[1] || '').trim();

    // Fix 1: Hint should ALWAYS be just the first letter of `back`
    const firstLetter = back.charAt(0).toLowerCase();
    if (hint !== firstLetter) {
        hint = firstLetter;
        fixedHint++;
    }

    // Fix 2: Remove numbered lists like "1. X; 2. Y" or "1. X 2. Y"
    if (/^\d+\.\s/.test(definition)) {
        // Remove leading "1. " and convert "2. " "3. " to "; "
        definition = definition
            .replace(/^\d+\.\s*/, '')
            .replace(/\s*;\s*\d+\.\s*/g, '; ')
            .replace(/\s+\d+\.\s+/g, '; ');
        cleanedNumbers++;
    }

    // Fix 3: Clean abbreviations
    if (definition.includes('(ant.')) {
        definition = definition.replace(/\(ant\.\s*/g, '(antonym: ');
        cleanedAbbreviations++;
    }
    if (definition.includes('(syn.')) {
        definition = definition.replace(/\(syn\.\s*/g, '(synonym: ');
        cleanedAbbreviations++;
    }

    // Fix 4: Clean semicolons - replace with commas for readability
    // But only if the definition is a list of short synonyms (not full sentences)
    const semiParts = definition.split(';').map(s => s.trim());
    if (semiParts.length >= 2 && semiParts.every(p => p.split(' ').length <= 6)) {
        // These are short synonym-style definitions like "tarnish; besmirch; defile"
        // Convert to "tarnish, besmirch, or defile"
        if (semiParts.length === 2) {
            definition = semiParts.join(' or ');
        } else {
            const last = semiParts.pop();
            definition = semiParts.join(', ') + ', or ' + last;
        }
        cleanedSemicolons++;
    }

    // Fix 5: Capitalize first letter of definition
    if (definition && /^[a-z]/.test(definition)) {
        definition = definition.charAt(0).toUpperCase() + definition.slice(1);
    }

    // Fix 6: Remove trailing period if present (for consistency)
    definition = definition.replace(/\.\s*$/, '');

    // Fix 7: If definition is very short (< 15 chars), flag as potentially messy
    if (definition.length < 15 && !definition.includes(' ')) {
        stillMessy.push({ back, front: definition + ' ===HINT=== ' + hint, reason: 'too_short' });
    }

    // Fix 8: If definition still has weird patterns, flag it
    if (/^\d/.test(definition) || definition.includes('  ') || /[;]{2,}/.test(definition)) {
        stillMessy.push({ back, front: definition + ' ===HINT=== ' + hint, reason: 'still_messy' });
    }

    return definition + ' ===HINT=== ' + hint;
}

// Process all cards
const fixed = cards.map(card => ({
    ...card,
    front: cleanFront(card.front, card.back)
}));

console.log("--- Fixes Applied ---");
console.log(`Hints fixed to first letter: ${fixedHint}`);
console.log(`Semicolons cleaned: ${cleanedSemicolons}`);
console.log(`Numbered lists cleaned: ${cleanedNumbers}`);
console.log(`Abbreviations expanded: ${cleanedAbbreviations}`);
console.log(`Still potentially messy: ${stillMessy.length}`);

if (stillMessy.length > 0) {
    console.log("\nSample messy cards:");
    stillMessy.slice(0, 10).forEach(c => console.log(`  "${c.back}": "${c.front}" (${c.reason})`));
}

// Save the still-messy ones for agent rewriting
if (stillMessy.length > 0) {
    const messyPath = path.join(ROOT, 'messy_fronts.json');
    fs.writeFileSync(messyPath, JSON.stringify(stillMessy, null, 2));
    console.log(`\nSaved ${stillMessy.length} messy cards to messy_fronts.json`);
}

// Show samples of fixed cards
console.log("\n--- Sample Fixed Cards ---");
const samples = fixed.filter(c => c.front !== cards.find(o => o.back === c.back)?.front).slice(0, 10);
for (const s of samples) {
    const original = cards.find(o => o.back === s.back);
    console.log(`\n  "${s.back}":`);
    console.log(`    BEFORE: ${original?.front.substring(0, 80)}`);
    console.log(`    AFTER:  ${s.front.substring(0, 80)}`);
}

// Save
fs.writeFileSync(path.join(ROOT, 'all_new_cards_deduped.json'), JSON.stringify(fixed, null, 2));
console.log(`\nSaved ${fixed.length} fixed cards to all_new_cards_deduped.json`);
