import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

// Load Env
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);
const apiKeyMatch = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);

if (!urlMatch || !keyMatch || !apiKeyMatch) {
    console.error("Credentials not found");
    process.exit(1);
}

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());
const genAI = new GoogleGenerativeAI(apiKeyMatch[1].trim());
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function processCardWithRetry(card, retries = 5) {
    console.log(`Processing: "${card.front.substring(0, 30)}..." | Note: "${card.user_notes}"`);

    const prompt = `
    You are an expert editor for a flashcard database.
    
    Current Card:
    - Front: "${card.front}"
    - Back: "${card.back}"
    - Examples: ${JSON.stringify(card.examples || [])}
    
    User Instruction (Note): "${card.user_notes}"
    
    Analyze the user's instruction and decide on an ACTION.
    
    Possible Actions:
    1. DELETE: The user wants to remove/delete the card.
    2. UPDATE: The user wants to fix translation, add examples, or change content.
    3. IGNORE: The note is vague or not actionable.

    If UPDATE:
    - Provide the fully corrected FRONT and BACK content.
    - If modifying translation, ensure it is accurate Persian.
    - If adding examples, generate high-quality sentences.
    
    Response Format (JSON ONLY):
    {
        "action": "DELETE" | "UPDATE" | "IGNORE",
        "front": "string",
        "back": "string",
        "examples": ["string", "string"],
        "reason": "short explanation"
    }
    `;

    let attempt = 1;
    while (true) {
        try {
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const plan = JSON.parse(jsonStr);
            
            console.log(`-> Action: ${plan.action} (${plan.reason})`);
            
            if (plan.action === 'DELETE') {
                const { error } = await supabase.from('cards').delete().eq('id', card.id);
                if (error) throw new Error("Delete DB Error: " + error.message);
                console.log("Card Deleted.");
            } 
            else if (plan.action === 'UPDATE') {
                const { error } = await supabase.from('cards').update({
                    front: plan.front,
                    back: plan.back,
                    examples: plan.examples,
                    user_notes: null
                }).eq('id', card.id);
                if (error) throw new Error("Update DB Error: " + error.message);
                console.log("Card Updated & Note Cleared.");
            }
            else {
                 await supabase.from('cards').update({ user_notes: null }).eq('id', card.id);
                 console.log("Note Cleared (Ignored Action).");
            }

            return; // Success, break loop

        } catch (e) {
            console.error(`Error (Attempt ${attempt}): ${e.message}`);
            if (e.message.includes("429") || e.message.includes("Quota")) {
                 const waitTime = Math.min(attempt * 30000, 300000); // 30s, 60s... max 5 mins
                 console.log(`Waiting ${waitTime/1000}s due to Rate Limit...`);
                 await delay(waitTime);
                 attempt++;
            } else { // Critical error
                 console.error("Non-retriable error (or network). waiting 10s...");
                 await delay(10000);
                 attempt++;
            }
        }
    }
}

async function main() {
    const { data: cards, error } = await supabase
        .from('cards')
        .select('*')
        .not('user_notes', 'is', null)
        .neq('user_notes', '');
        
    if (!cards || cards.length === 0) {
        console.log("No notes to process.");
        return;
    }

    console.log(`Found ${cards.length} cards to process.`);
    
    for (const card of cards) {
        await processCardWithRetry(card);
        // Base delay between cards
        await delay(2000); 
    }
    
    console.log("All notes processed.");
}

main();
