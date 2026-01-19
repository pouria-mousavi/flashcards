import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';

// Load Supabase credentials
const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

// Claude Configuration
const CLAUDE_KEY = process.env.CLAUDE_KEY || "";
const anthropic = new Anthropic({
  apiKey: CLAUDE_KEY, 
});

const MODEL = "claude-sonnet-4-5-20250929"; 

async function main() {
    console.log(`🚀 Starting Final Translation Audit (${MODEL})...`);
    
    // 1. Fetch ALL cards
    let allCards = [];
    let page = 0;
    process.stdout.write("Fetching cards... ");
    while(true) {
        const { data, error } = await supabase.from('cards').select('id, front, back').range(page*1000, (page+1)*1000 - 1);
        if(!data || data.length === 0) break;
        allCards.push(...data);
        page++;
    }
    console.log(`Converted ${allCards.length} cards.`);

    // Batch Size calculation: 
    // Avg card is ~20 tokens. 50 cards = 1000 tokens INPUT. (Cheap)
    // Output is mostly "null" or short phrases. very Cheap.
    const BATCH_SIZE = 50; 
    
    for (let i = 0; i < allCards.length; i += BATCH_SIZE) {
        const batch = allCards.slice(i, i + BATCH_SIZE);
        await processBatch(batch);
        // Anthropic has rate limits. Sonnet 3.5 Tier 1 is generous but let's be safe.
        // Parallelizing might hit RPM limits. Sequential is safer for "Cost-Optimization" debugging too.
    }

    console.log("Translation Audit Complete! 🎉");
}

async function processBatch(cards) {
    try {
        const prompt = `
        You are a highly educated Native Persian Translator.
        
        TASK: Review this list of English-Persian flashcards.
        For each card, determine if the Persian translation is:
        1. Literal/Machine-translated (Bad)
        2. Unnatural/Awkward (Bad)
        3. Incorrect (Bad)
        4. Or Natural, Common, Native Persian (Good)
        
        CRITICAL: If it is BAD, provide the CORRECT Natural/Idiomatic Persian translation.
        
        EXAMPLES OF CORRECTIONS:
        - "The early bird catches the worm" -> "سحرخیز باش تا کامروا باشی" (NOT "سحرخیز، نصیب‌بر")
        - "Hit the sack" -> "خوابیدن" (NOT "به گونی زدن")
        - "Piece of cake" -> "مثل آب خوردن"
        - "Watch your mouth" -> "مراقب حرف زدنت باش"
        - "It's raining cats and dogs" -> "مثل دم اسب باران می‌بارد"
        
        OUTPUT FORMAT:
        Return a JSON object where Keys are the Card IDs.
        values are:
        - NULL if the existing translation is GOOD.
        - The Correct Persian String if the existing one needs fixing.
        
        INPUT JSON:
        ${JSON.stringify(cards.map(c => ({ id: c.id, english: c.back, current_persian: c.front })))}
        
        Respond ONLY with the JSON object. No markdown.
        `;

        const response = await anthropic.messages.create({
            model: MODEL,
            max_tokens: 4096,
            temperature: 0.1, 
            system: "You are a backend JSON processor. Output valid JSON only.",
            messages: [{ role: "user", content: prompt }]
        });

        // Filter out markdown code blocks if Claude adds them
        let content = response.content[0].text;
        content = content.replace(/```json/g, '').replace(/```/g, '').trim();
        
        const corrections = JSON.parse(content);

        // Apply updates
        for (const card of cards) {
            const suggested = corrections[card.id];
            
            // Validation
            if (!suggested || !isDifferent(card.front, suggested)) continue;
            
            console.log(`✨ CLAUDE FIX: [${card.back}] "${card.front}" -> "${suggested}"`);
            
            const { error } = await supabase
                .from('cards')
                .update({ front: suggested }) 
                .eq('id', card.id);

            if (error) console.error(`Error updating ${card.id}:`, error.message);
        }

    } catch (err) {
        console.error("Batch processing failed:", err.message);
        // If JSON parse fails, log content for debugging
        if (err instanceof SyntaxError) console.error("Invalid JSON from Claude");
    }
}

function isDifferent(str1, str2) {
    if (!str1 || !str2) return true;
    const n1 = str1.trim().replace(/[!?.،]/g, '');
    const n2 = str2.trim().replace(/[!?.،]/g, '');
    return n1 !== n2;
}

main();
