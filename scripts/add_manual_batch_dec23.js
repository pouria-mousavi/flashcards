import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

// Helper to interactively create card objects
const cards = [
    {
        word: "Endearing",
        front: "دوست‌داشتنی / جذاب (چیزی که باعث میشه کسی رو دوست داشته باشی)",
        definition: "Inspiring love or affection.",
        examples: ["She has such an endearing smile.", "His clumsiness is actually quite endearing."],
        forms: { adj: "endearing", verb: "endear" },
        tone: "neutral"
    },
    {
        word: "Off-putting",
        front: "زننده / دافعه‌دار",
        definition: "Unpleasant; disconcerting; repelling.",
        examples: ["His attitude was quite off-putting.", "The smell was off-putting."],
        forms: { adj: "off-putting", verb: "put off" },
        tone: "neutral"
    },
    {
        word: "Reviled",
        front: "منفور / مورد تنفر / فحش‌خورده",
        definition: "Criticized in an abusive or angrily insulting manner.",
        examples: ["The dictator was reviled by his people.", "He was a reviled figure in the community."],
        forms: { adj: "reviled", verb: "revile", noun: "revilement" },
        tone: "formal"
    },
    {
        word: "Dogmatists",
        front: "آدم‌های دگم / متعصب (روی عقاید)",
        definition: "People who are inclined to lay down principles as incontrovertibly true.",
        examples: ["He argued against the religious dogmatists.", "She refused to listen to the dogmatists of her party."],
        forms: { noun: "dogmatist", adj: "dogmatic", noun2: "dogma" },
        tone: "formal"
    },
    {
        word: "Deem",
        front: "تلقی کردن / پنداشتن (رسمی)",
        definition: "Regard or consider in a specified way.",
        examples: ["The area was deemed unsafe for tourists.", "I deem it an honor to serve."],
        forms: { verb: "deem", past: "deemed", pp: "deemed" },
        tone: "formal"
    },
    {
        word: "Opt out",
        front: "انصراف دادن / کنار کشیدن (از یک سیستم یا گروه)",
        definition: "Choose not to participate in or carry on with something.",
        examples: ["You can opt out of the newsletter at any time.", "She decided to opt out of the company pension scheme."],
        forms: { verb: "opt out", noun: "option", past: "opted out", pp: "opted out" },
        tone: "neutral"
    },
    {
        word: "Burden",
        front: "بار (مسئولیت یا سنگینی) / سربار بودن",
        definition: "A load, especially a heavy one; a duty or misfortune.",
        examples: ["I don't want to be a burden to you.", "The burden of proof is on the prosecution."],
        forms: { noun: "burden", verb: "burden", adj: "burdensome" },
        tone: "neutral"
    },
    {
        word: "Inflicting",
        front: "تحمیل کردن (درد یا رنج) / وارد کردن (ضربه)",
        definition: "Causing something unpleasant to be suffered by someone or something.",
        examples: ["Stop inflicting pain on yourself.", "They were accused of inflicting unnecessary suffering."],
        forms: { verb: "inflict", noun: "infliction", past: "inflicted", pp: "inflicted" },
        tone: "neutral"
    },
    {
        word: "Legitimate",
        front: "مشروع / قانونی / برحق",
        definition: "Conforming to the law or to rules.",
        examples: ["She has a legitimate reason for being late.", "Is this a legitimate business?"],
        forms: { adj: "legitimate", adv: "legitimately", noun: "legitimacy", verb: "legitimize" },
        tone: "formal"
    },
    {
        word: "Make someone better off",
        front: "وضع کسی رو بهتر کردن (مادی/روحی)",
        definition: "To improve someone's financial or general situation.",
        examples: ["Ideally, the tax cut will make families better off.", "You'd be better off without him."],
        forms: { adj: "better off" },
        tone: "neutral"
    },
    {
        word: "Get by",
        front: "گذران زندگی کردن / سر کردن (با پول کم)",
        definition: "Manage with difficulty to live or accomplish something.",
        examples: ["My French isn't great, but I can get by.", "I can't get by on such a small salary."],
        forms: { verb: "get by", past: "got by", pp: "got by" },
        tone: "neutral"
    },
    {
        word: "Rehearsal",
        front: "تمرین (تئاتر/موسیقی قبل اجرا)",
        definition: "A practice or trial performance of a play or other work.",
        examples: ["The band is in rehearsal for their tour.", "Dress rehearsal starts at 6 PM."],
        forms: { noun: "rehearsal", verb: "rehearse", past: "rehearsed" },
        tone: "neutral"
    },
    {
        word: "Sludge",
        front: "لجن / گل و لای غلیظ",
        definition: "Thick, soft, wet mud or a similar viscous mixture.",
        examples: ["The river was full of toxic sludge.", "The car got stuck in the sludge."],
        forms: { noun: "sludge", adj: "sludgy" },
        tone: "neutral"
    },
    {
        word: "Depiction",
        front: "تصویرسازی / نمایش / تجسم",
        definition: "The action or result of depicting something, especially in art.",
        examples: ["The movie's depiction of war was brutal.", "A realistic depiction of daily life."],
        forms: { noun: "depiction", verb: "depict", past: "depicted" },
        tone: "formal"
    },
    {
        word: "Obesity",
        front: "چاقی مفرط",
        definition: "The state or condition of being very fat or overweight.",
        examples: ["Obesity is a major health problem.", "Rates of obesity have risen."],
        forms: { noun: "obesity", adj: "obese" },
        tone: "neutral"
    },
    {
        word: "Threefold",
        front: "سه‌برابر / سه‌گانه",
        definition: "Three times as great or as numerous.",
        examples: ["Since 2010, revenue has increased threefold.", "The problem is threefold."],
        forms: { adj: "threefold", adv: "threefold" },
        tone: "formal"
    }
];

async function main() {
    console.log(`Processing ${cards.length} manual additions...`);

    for (const card of cards) {
        // 1. Check for duplicates (fuzzy check on back content)
        // We check if the word starts with the target word
        const { data: existing, error: searchError } = await supabase
            .from('cards')
            .select('id, back')
            .ilike('back', `${card.word}%`);

        if (searchError) {
            console.error("Search error:", searchError);
            continue;
        }

        if (existing && existing.length > 0) {
            console.log(`Skipping duplicate: ${card.word} (Found: ${existing[0].back})`);
            continue;
        }

        // 2. Construct Payload
        const backContent = `${card.word}\nLet's hear it!\n\n${card.definition}\n\nExamples:\n${card.examples.map(ex => `- ${ex}`).join('\n')}`;
        
        const payload = {
            id: crypto.randomUUID(),
            front: card.front,
            back: backContent,
            state: 'NEW',
            interval: 0,
            ease_factor: 2.5,
            next_review: new Date().toISOString(), // Now
            tone: card.tone,
            word_forms: card.forms,
            created_at: new Date().toISOString()
        };

        // 3. Insert
        const { error: insertError } = await supabase
            .from('cards')
            .insert(payload);

        if (insertError) {
            console.error(`Failed to insert ${card.word}:`, insertError.message);
        } else {
            console.log(`✅ Added: ${card.word}`);
        }
    }
}

main();
