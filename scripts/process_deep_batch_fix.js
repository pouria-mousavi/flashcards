import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function main() {
    console.log("Applying Manual Deep Enrichment Batch (Fixes)...");

    const updates = [
        // --- From No Forms ---
        { word: "Ajar", id: "6cde093e-e67e-4327-a77f-77e7cc5b5301", forms: { adj: "ajar" } },
        { word: "Power Strip", id: "161d7b1b-a625-4833-96cf-7675626dfbda", forms: { noun: "power strip" } },
        { word: "Learning Curve", id: "4f44b247-eacd-4c9c-a020-0b0e26c0ad7f", forms: { noun: "learning curve" } },
        { word: "Bottle Cap", id: "eccac478-e9c0-469e-bac7-775b2c9b9de6", forms: { noun: "bottle cap" } },
        { word: "Vanishing Point", id: "f3be292d-ba2c-4580-854b-65661a4bb16b", forms: { noun: "vanishing point" } },
        { word: "ulterior motive", id: "e9b46b7a-ee0a-4177-b182-692447cca70b", forms: { noun: "ulterior motive" } },
        { word: "old-fashioned", id: "eccccdcc-a59f-4456-b786-077be98606d7", forms: { adj: "old-fashioned", noun: "old-fashionedness" } },
        { word: "Still (nevertheless)", id: "37574f2f-49ac-4abd-a975-83eb8d0e4e69", forms: { adv: "still" } },
        { word: "come with", id: "3ae74a6c-9091-4721-834c-37d160253314", forms: { verb: "come", past: "came", pp: "come" } }, 
        { word: "Man up", id: "83642800-3c81-4b0c-afe3-cfe3ae327c6c", forms: { verb: "man up", past: "manned up", pp: "manned up" } },

        // --- From Incomplete (Missing Past/PP) ---
        { id: "81e997e0-c966-4a5f-9188-353a928e40e9", word: "Comprehensive", forms: { adj: "comprehensive", adv: "comprehensively", noun: "comprehension", verb: "comprehend", past: "comprehended", pp: "comprehended" } },
        { id: "3452d60d-0121-4698-814a-e9d6122860cb", word: "excessive", forms: { adj: "excessive", adv: "excessively", noun: "excess", verb: "exceed", past: "exceeded", pp: "exceeded" } },
        { id: "ab9a7cb3-9af5-4785-8818-4dcce0db0462", word: "make generalizations", forms: { verb: "generalize", past: "generalized", pp: "generalized", noun: "generalization", adj: "general" } },
        { id: "1c6860c9-7a4b-4c4b-93f2-82da3e53726a", word: "Go on a diet", forms: { verb: "diet", past: "dieted", pp: "dieted", noun: "diet" } },
        { id: "39f827c5-d8a8-4223-9c40-5aad27895f9b", word: "Back up", forms: { verb: "back up", past: "backed up", pp: "backed up", noun: "backup" } },
        { id: "9da87876-9624-40ad-af5e-840f766b73ec", word: "Devour", forms: { verb: "devour", past: "devoured", pp: "devoured" } },
        { id: "e2fc97de-54cf-47dd-97fb-eefc1255bc3e", word: "Greasy", forms: { adj: "greasy", noun: "grease", verb: "grease", past: "greased", pp: "greased" } },
        { id: "c11180ef-e42c-458f-bec8-ea85b4e723b0", word: "Moldy", forms: { adj: "moldy", noun: "mold", verb: "mold", past: "molded", pp: "molded" } },
        { id: "284a0970-b906-4b8b-855c-c3820bcd582b", word: "Expire", forms: { verb: "expire", past: "expired", pp: "expired", noun: "expiration" } },
        { id: "e646c931-9e14-4f19-a814-576517154b6c", word: "Sour", forms: { adj: "sour", verb: "sour", past: "soured", pp: "soured", noun: "sourness" } },
        { id: "544c468e-7e78-4e2b-b42e-06df3fa7ef60", word: "Nauseous", forms: { adj: "nauseous", noun: "nausea", verb: "nauseate", past: "nauseated", pp: "nauseated" } },
        { id: "85d17561-a433-40ae-8059-20c516621857", word: "Fussy", forms: { adj: "fussy", verb: "fuss", past: "fussed", pp: "fussed", noun: "fuss" } },
        { id: "3fb77456-2fc3-475f-9b23-affa24727a71", word: "Numb", forms: { adj: "numb", verb: "numb", past: "numbed", pp: "numbed", noun: "numbness" } },
        { id: "47bc908c-e872-428a-ae90-eaaddc6b9d40", word: "Hollow", forms: { adj: "hollow", verb: "hollow", past: "hollowed", pp: "hollowed", noun: "hollowness" } },
        { id: "4c6c0890-1d33-4214-a20b-4e4b0fa92934", word: "Itchy", forms: { adj: "itchy", verb: "itch", past: "itched", pp: "itched", noun: "itch" } },
        { id: "c9f3e12a-e0c2-4e4e-a0fe-fe0c599ad350", word: "Tight", forms: { adj: "tight", verb: "tighten", past: "tightened", pp: "tightened", noun: "tightness", adv: "tightly" } },
        { id: "f1ac302e-ff61-43f2-9fca-b3bf9623ac81", word: "Rotten", forms: { adj: "rotten", verb: "rot", past: "rotted", pp: "rotted", noun: "rot" } },
        { id: "e5d51ad9-5d19-4b9a-91cf-2c86312c637a", word: "Apprentice", forms: { noun: "apprentice", verb: "apprentice", past: "apprenticed", pp: "apprenticed", noun2: "apprenticeship" } },
        { id: "d62128c2-1488-460f-a71a-dce9ec4c4416", word: "Adjustable", forms: { adj: "adjustable", verb: "adjust", past: "adjusted", pp: "adjusted", noun: "adjustability" } },
        { id: "2c07253b-a996-4c04-95c3-86616b2413cd", word: "Sticky", forms: { adj: "sticky", verb: "stick", past: "stuck", pp: "stuck", noun: "stickiness" } },
        { id: "84f7bf03-3220-4f44-a786-daf6a18ed240", word: "Panic", forms: { noun: "panic", verb: "panic", past: "panicked", pp: "panicked", adj: "panicky" } },
        { id: "7f39c7f8-34cd-4464-8b69-0375221b8bbe", word: "workout", forms: { noun: "workout", verb: "work out", past: "worked out", pp: "worked out" } },
        { id: "06fda1c8-a43d-422f-aa54-a703f6d022f1", word: "Optional", forms: { adj: "optional", verb: "opt", past: "opted", pp: "opted", noun: "option", adv: "optionally" } },
        { id: "14a10095-d5dc-43ac-a637-efab90d6f953", word: "Offensive", forms: { adj: "offensive", verb: "offend", past: "offended", pp: "offended", noun: "offense", adv: "offensively" } },
        { id: "9b234aa9-fab7-4e48-a486-9d23732b8434", word: "Stall", forms: { noun: "stall", verb: "stall", past: "stalled", pp: "stalled" } },
        { id: "659514c7-259e-4a1c-9149-4c18419692d5", word: "Humor me", forms: { verb: "humor", past: "humored", pp: "humored" } },
        { id: "f4cb63ff-e030-46c5-9dc9-c44a826fa6dd", word: "Show off", forms: { verb: "show off", past: "showed off", pp: "shown off", noun: "show-off" } },
        { id: "a6d58083-921f-42fd-8ded-e0bdf8359b38", word: "Conventional", forms: { adj: "conventional", verb: "conventionalize", past: "conventionalized", pp: "conventionalized", noun: "convention" } },
        { id: "2f7866ef-6b58-4eb8-8803-2aed8255cdd3", word: "Brown-nosing", forms: { verb: "brown-nose", past: "brown-nosed", pp: "brown-nosed" } },
        { id: "fb9c8e3f-c431-48fb-9993-1f20078d74b8", word: "Cover up", forms: { verb: "cover up", past: "covered up", pp: "covered up", noun: "cover-up" } }
    ];

    for (const item of updates) {
        const { error } = await supabase
            .from('cards')
            .update({ word_forms: item.forms })
            .match({ id: item.id });

        if (error) console.error(`Failed ${item.word}:`, error.message);
        else console.log(`Enriched: ${item.word}`);
    }
    console.log(`Deep Batch Fix Complete. Processed ${updates.length} items.`);
}

main();
