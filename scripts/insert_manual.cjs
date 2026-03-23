const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envContent = fs.readFileSync('.env', 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);
const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function main() {
    const cards = JSON.parse(fs.readFileSync('manual_cards.json', 'utf8'));
    console.log('Cards to insert:', cards.length);

    // Check for duplicates
    const { data: existing } = await supabase.from('cards').select('back').in('back', cards.map(c => c.back));
    const existingSet = new Set((existing || []).map(e => e.back.toLowerCase()));

    const toInsert = cards.filter(c => !existingSet.has(c.back.toLowerCase()));
    const dupes = cards.filter(c => existingSet.has(c.back.toLowerCase()));

    if (dupes.length > 0) {
        console.log('Duplicates skipped:', dupes.map(d => d.back).join(', '));
    }

    console.log('Inserting:', toInsert.length);

    if (toInsert.length > 0) {
        const { error } = await supabase.from('cards').insert(toInsert);
        if (error) {
            console.error('Batch error:', error.message);
            let ok = 0, fail = 0;
            for (const card of toInsert) {
                const { error: e } = await supabase.from('cards').insert(card);
                if (e) { console.error('  Failed:', card.back, '-', e.message); fail++; }
                else { console.log('  OK:', card.back); ok++; }
            }
            console.log(`Individual: ${ok} ok, ${fail} failed`);
        } else {
            console.log('All inserted successfully!');
        }
    }

    const { count } = await supabase.from('cards').select('*', { count: 'exact', head: true });
    console.log('Total cards in DB now:', count);
}
main().catch(e => console.error(e));
