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
    console.log("Adding Manual Batch (Dec 25)...");

    const cards = [
        {
            front: "**Def**: The production and discharge of something, especially gas or radiation.\n**Farsi**: انتشار، صدور (گاز و ...)",
            back: "Emission",
            word_forms: { noun: "emission", verb: "emit", past: "emitted", pp: "emitted" },
            examples: ["The emission of carbon dioxide is a major problem.", "Strict emission standards were enforced."]
        },
        {
            front: "**Def**: Disagreeable to taste, smell, or look at; morally offensive.\n**Farsi**: ناخوشایند، زننده، بدنام",
            back: "Unsavory",
            word_forms: { adj: "unsavory", noun: "unsavoriness" },
            examples: ["He has an unsavory reputation.", "The dish had an unsavory appearance."]
        },
        {
            front: "**Def**: Thick, soft, wet mud or a similar viscous mixture.\n**Farsi**: لجن، گل و لای",
            back: "Sludge",
            word_forms: { noun: "sludge", adj: "sludgy" },
            examples: ["The industrial waste turned into toxic sludge.", "We walked through thick sludge."]
        },
        {
            front: "**Def**: To make great efforts to achieve or obtain something.\n**Farsi**: تلاش کردن، جان کندن (برای هدف)",
            back: "Strive",
            word_forms: { verb: "strive", past: "strove", pp: "striven", noun: "striving" },
            examples: ["We strive for excellence.", "He strove to finish the project on time."]
        },
        {
            front: "**Def**: In a way that is not directly expressed;\n**Farsi**: تلویحاً، به طور ضمنی",
            back: "Implicitly",
            word_forms: { adv: "implicitly", adj: "implicit", noun: "implication", verb: "imply" },
            examples: ["He implicitly agreed to the terms.", "The risks were implicitly understood."]
        },
        {
            front: "**Def**: The action or result of depicting something, especially in art.\n**Farsi**: ترسیم، تصویرسازی (در هنر/داستان)",
            back: "Depiction",
            word_forms: { noun: "depiction", verb: "depict", past: "depicted", pp: "depicted" },
            examples: ["The movie's depiction of war was realistic.", "Her depiction of the events was accurate."]
        },
        {
            front: "**Def**: Having three parts or elements; three times as great.\n**Farsi**: سه برابر، سه‌گانه",
            back: "Threefold",
            word_forms: { adj: "threefold", adv: "threefold" },
            examples: ["A threefold increase in profits.", "The problem is threefold."]
        },
        {
            front: "**Def**: Originate in or be caused by.\n**Farsi**: نشأت گرفتن (از)، ریشه داشتن (در)",
            back: "Stem from",
            word_forms: { verb: "stem", past: "stemmed", pp: "stemmed" },
            examples: ["Her problems stem from her childhood.", "Corruption stems from poor governance."]
        },
        {
            front: "**Def**: A statement or slogan repeated frequently.\n**Farsi**: شعار، مانترا (تکرار واژه مقدس یا کلام)",
            back: "Mantra",
            word_forms: { noun: "mantra" },
            examples: ["His personal mantra is 'never give up'.", "The team's mantra was simple: focus."]
        },
        {
            front: "**Def**: Express contempt for; ridicule.\n**Farsi**: مسخره کردن، استهزا کردن",
            back: "Deride",
            word_forms: { verb: "deride", past: "derided", pp: "derided", noun: "derision", adj: "derisive" },
            examples: ["The proposal was derided by critics.", "He derided my efforts to start a business."]
        },
        {
            front: "**Def**: A view or opinion that is incorrect because based on faulty thinking.\n**Farsi**: باورهای غلط، تصورات نادرست",
            back: "Misconception",
            word_forms: { noun: "misconception", verb: "misconceive" },
            examples: ["There is a common misconception about diet.", "We need to clear up these misconceptions."]
        },
        {
            front: "**Def**: A person new to or inexperienced in a field or situation.\n**Farsi**: تازه‌کار، ناشی، مبتدی",
            back: "Novice",
            word_forms: { noun: "novice" },
            examples: ["I am a novice at chess.", "Novice drivers often make mistakes."]
        },
        {
            front: "**Def**: Lower in rank, status, or quality.\n**Farsi**: پایین‌تر، نامرغوب (نسبت به چیز دیگر)",
            back: "Inferior",
            word_forms: { adj: "inferior", noun: "inferiority" },
            examples: ["This product is inferior to the original.", "He always felt inferior to his brother."]
        },
        {
            front: "**Def**: Based on observation or experience rather than theory.\n**Farsi**: تجربی (بر پایه مشاهده و آزمایش)",
            back: "Empirical",
            word_forms: { adj: "empirical", adv: "empirically", noun: "empiricism" },
            examples: ["We need empirical evidence to support the claim.", "His study was based on empirical data."]
        },
        {
            front: "**Def**: In a vigorous or forceful manner; with great effort.\n**Farsi**: با شدت و جدیت، به سختی (تلاش زیاد)",
            back: "Strenuously",
            word_forms: { adv: "strenuously", adj: "strenuous", noun: "strenuousness" },
            examples: ["She strenuously denied the allegations.", "We worked strenuously to finish the job."]
        }
    ];

    let count = 0;
    for (const card of cards) {
        // Check if exists first to avoid dupes (optional but good practice)
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
                tone: 'Academic', // Defaulting to Academic for these words
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
