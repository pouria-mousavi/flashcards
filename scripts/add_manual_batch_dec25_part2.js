import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load Env
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

if (!urlMatch || !keyMatch) {
    console.error("Credentials not found");
    process.exit(1);
}

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function main() {
    console.log("Adding Manual Batch (Dec 25 Part 2)...");

    const cards = [
        {
            front: "**Def**: Gentle and kind; (of a disease) not harmful in effect.\n**Farsi**: خوش‌خیم، بی‌خطر، مهربان",
            back: "Benign",
            word_forms: { adj: "benign", adv: "benignly", noun: "benignity" },
            examples: ["The tumor was benign.", "He has a benign smile."]
        },
        {
            front: "**Def**: A person or plan that has no chance of succeeding or being effective.\n**Farsi**: (عملاً) محکوم به شکست، بی‌نتیجه",
            back: "A literal nonstarter",
            // Mapping to "Nonstarter" forms but keeping key phrase
            word_forms: { noun: "nonstarter" },
            examples: ["The proposal is a literal nonstarter due to the cost.", "His candidacy was a nonstarter from the beginning."]
        },
        {
            front: "**Def**: The practice of persuading someone to do something by using force or threats.\n**Farsi**: اجبار، زورگویی",
            back: "Coercion",
            word_forms: { noun: "coercion", verb: "coerce", adj: "coercive", past: "coerced", pp: "coerced" },
            examples: ["He claimed he acted under coercion.", "Coercion is illegal in contract law."]
        },
        {
            front: "**Def**: Succeed in persuading or leading someone to do something; bring about.\n**Farsi**: وادار کردن، القا کردن، باعث شدن",
            back: "Induce",
            word_forms: { verb: "induce", noun: "inducement", adj: "inductive", past: "induced", pp: "induced" },
            examples: ["Nothing could induce me to go back.", "The drug encourages sleep."]
        },
        {
            front: "**Def**: The action of intruding; wrongful entry.\n**Farsi**: نفوذ، مزاحمت، سرک کشیدن",
            back: "Intrusion",
            word_forms: { noun: "intrusion", verb: "intrude", adj: "intrusive", past: "intruded", pp: "intruded" },
            examples: ["I apologized for the intrusion.", "They regarded the law as an intrusion on their privacy."]
        },
        {
            front: "**Def**: Having or showing no skill; clumsy.\n**Farsi**: بی‌عرضه، ناشی، نامناسب",
            back: "Inept",
            word_forms: { adj: "inept", noun: "ineptitude", adv: "ineptly" },
            examples: ["He was criticizing his inept attempt at cooking.", "The government was utterly inept."]
        }
    ];

    let count = 0;
    for (const card of cards) {
        // Check if exists first
        const { data: existing } = await supabase
            .from('cards')
            .select('id')
            .ilike('back', card.back);
            
        if (existing && existing.length > 0) {
            console.log(`Skipping duplicate: ${card.back}`);
            continue;
        }

        const { error } = await supabase
            .from('cards')
            .insert({
                front: card.front,
                back: card.back,
                examples: card.examples,
                word_forms: card.word_forms,
                tone: 'Academic', 
                interval: 1,
                ease_factor: 2.5,
                state: 'new'
            });

        if (error) {
            console.error(`Error inserting ${card.back}:`, error.message);
        } else {
            console.log(`Inserted: ${card.back}`);
            count++;
        }
    }
    console.log(`\nOperation Complete. Added ${count} new cards.`);
}

main();
