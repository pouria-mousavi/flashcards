import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function main() {
    console.log("Fetching cards...");
    // Fetch all NEW/Untagged cards (assuming we want to process the same set)
    // Actually, let's process ALL cards where tone is NULL, same as before.
    
    let allCards = [];
    let page = 0;
    const pageSize = 1000;
    
    while (true) {
        const { data: cards, error } = await supabase
            .from('cards')
            .select('id, front, back')
            .is('tone', null)
            .range(page * pageSize, (page + 1) * pageSize - 1);
            
        if (error || !cards || cards.length === 0) break;
        allCards.push(...cards);
        page++;
    }
    
    console.log(`Analyzing ${allCards.length} cards locally...`);
    
    let updates = 0;
    
    for (const card of allCards) {
        let tone = 'Neutral';
        const text = (card.front || '') + ' ' + (card.back || ''); // Check both sides
        
        // Regex Logic (Order matters slightly, usually explicit tags override others)
        if (/\b(slang)\b/i.test(text)) {
            tone = 'Slang';
        } else if (/\b(offensive)\b/i.test(text)) {
            tone = 'Offensive';
        } else if (/\b(old-fashioned)\b/i.test(text)) {
             tone = 'Old-fashioned';
        } else if (/\b(literary)\b/i.test(text)) {
             tone = 'Literary';
        } else if (/\b(formal|FML)\b/i.test(text)) {
             tone = 'Formal';
        } else if (/\b(informal|INF)\b/i.test(text)) {
             tone = 'Informal';
        } else if (/\b(approving)\b/i.test(text)) {
             tone = 'Approving';
        } else if (/\b(disapproving)\b/i.test(text)) {
             tone = 'Disapproving';
        } else if (/\b(humorous)\b/i.test(text)) {
             tone = 'Humorous';
        }
        
        // Update
        const { error: upErr } = await supabase.from('cards').update({ tone: tone }).eq('id', card.id);
        if (upErr) console.error(upErr.message);
        else updates++;
        
        if (updates % 100 === 0) process.stdout.write('.');
    }
    
    console.log(`\nEnriched ${updates} cards.`);
}

main();
