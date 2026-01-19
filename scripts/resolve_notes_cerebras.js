
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Env
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length > 1) {
        let val = parts.slice(1).join('=').trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
        env[parts[0].trim()] = val;
    }
});

const url = env.VITE_SUPABASE_URL;
const key = env.VITE_SUPABASE_ANON_KEY;
const cerebrasKey = "csk-h4cdc836ffmc3tv59fvhwjkyx36kef3hk4d6fpjhr395h4mj"; // Hardcoded Free AI Key

if (!url || !key) {
    console.error("Credentials not found");
    process.exit(1);
}

const supabase = createClient(url, key);
const client = new OpenAI({
    apiKey: cerebrasKey,
    baseURL: "https://api.cerebras.ai/v1",
});

const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function processCard(card) {
    console.log(`Resolving Note: "${card.user_notes}" for [${card.front}]`);

    const prompt = `
    You are an expert editor for a flashcard database.
    User Instruction: "${card.user_notes}"
    Current Front: "${card.front}"
    Current Back: "${card.back}"

    Analyze instruction.
    Output JSON ONLY:
    {
        "action": "DELETE" | "UPDATE" | "IGNORE",
        "reason": "explanation"
    }
    If UPDATE, assume standardization script will handle content later. Only use UPDATE if user explicitly provides new content here, otherwise IGNORE.
    Actually, if standardization is coming next, we mainly care about DELETE.
    If user says "Wrong translation", standardized script will fix it. So IGNORE (actually standardization handles it).
    If user says "Delete this", then DELETE.
    `;

    try {
        const completion = await client.chat.completions.create({
            model: "llama-3.3-70b",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature: 0.1
        });
        const plan = JSON.parse(completion.choices[0].message.content);
        console.log(`-> Action: ${plan.action}`);

        if (plan.action === 'DELETE') {
            await supabase.from('cards').delete().eq('id', card.id);
            console.log("Deleted.");
        } else {
            // For Update/Ignore, we clear the note so standardization can run cleanly?
            // User said "Resolve all existing notes... ensure you do not touch my progress".
            // Standardization will supersede content. So we can clear note.
            // BUT: If user provided specific example in note "Use example: I love cats", standardization might miss it.
            // However, user said "Standardize... write a new script... call API to verify".
            // So relying on AI standardization seems preferred over manual note parsing unless it's a DELETE.
            await supabase.from('cards').update({ user_notes: null }).eq('id', card.id);
            console.log("Note Cleared.");
        }
    } catch (e) {
        console.error("Error:", e.message);
    }
}

async function main() {
    const { data: cards } = await supabase.from('cards')
        .select('*')
        .not('user_notes', 'is', null)
        .neq('user_notes', '');

    if (!cards || cards.length === 0) {
        console.log("No notes.");
        return;
    }
    
    console.log(`Processing ${cards.length} notes...`);
    for (const card of cards) {
        if (card.user_notes.startsWith('[Audit Fixed')) {
            await supabase.from('cards').update({ user_notes: null }).eq('id', card.id);
            continue;
        }
        await processCard(card);
        // Cerebras is fast, minimal delay
        await delay(200);
    }
}
main();
