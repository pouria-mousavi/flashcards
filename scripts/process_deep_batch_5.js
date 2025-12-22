import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function main() {
    console.log("Deep Enrichment Batch 5...");

    const updates = [
        {
            id: "27685601-576e-4e4b-9729-23c2a6f3a3f5",
            word: "Conservative ",
            forms: { adj: "conservative", adv: "conservatively", noun: "conservatism", verb: "conserve", past: "conserved", pp: "conserved" }
        },
        {
            id: "2fc00d34-b248-475d-b836-69b7dfff2f97",
            word: "Ruefully",
            forms: { adj: "rueful", adv: "ruefully", noun: "ruefulness", verb: "rue", past: "rued", pp: "rued" }
        },
        {
            id: "b759313d-823d-4e1d-ad7e-60db916d1b65",
            word: "Jump the gun",
            forms: { verb: "jump the gun", past: "jumped the gun", pp: "jumped the gun" }
        },
        {
            id: "feddb988-ac3a-49ba-a8e4-8118bd4395bb",
            word: "play a part",
            forms: { verb: "play a part", past: "played a part", pp: "played a part" }
        },
        {
            id: "22e1d901-1850-409c-9076-7f95a2a74868",
            word: "stir-fry",
            forms: { noun: "stir-fry", verb: "stir-fry", past: "stir-fried", pp: "stir-fried" }
        },
        {
            id: "a67edfb0-3d25-4229-b7af-aa752eba28c7",
            word: "incoherent",
            forms: { adj: "incoherent", adv: "incoherently", noun: "incoherence" }
        },
        {
            id: "4bc7d92b-a9c2-4204-bf42-65d03690a5fc",
            word: "Stocky",
            forms: { adj: "stocky", noun: "stockiness" }
        },
        {
            id: "9f564ce1-71de-490a-beac-097d42b01c83",
            word: "Nefarious",
            forms: { adj: "nefarious", adv: "nefariously", noun: "nefariousness" }
        },
        {
            id: "43ee0dfb-21a9-4a12-943b-4a56955aaa4d",
            word: "Implications",
            forms: { adj: "implicit", noun: "implication", verb: "imply", past: "implied", pp: "implied" }
        },
        {
            id: "47c00140-57d8-4412-9f74-bef73f8155bf",
            word: "Beat the rap",
            forms: { verb: "beat the rap", past: "beat the rap", pp: "beaten the rap" }
        },
        {
            id: "6ec7d70f-53f4-42d2-86f1-44de987c348f",
            word: "discursive",
            forms: { adj: "discursive", adv: "discursively", noun: "discursiveness" }
        },
        {
            id: "1cf0e89c-2557-472a-bfc2-53d036a4027f",
            word: "beep",
            forms: { noun: "beep", verb: "beep", past: "beeped", pp: "beeped" }
        },
        {
            id: "b71fb0ef-1b75-48ef-8208-08bd25f9ecd5",
            word: "screech",
            forms: { adj: "screeching", noun: "screech", verb: "screech", past: "screeched", pp: "screeched" }
        },
        {
            id: "eb22f2de-7fb7-455f-ae8a-98dffa9fdd39",
            word: "slam",
            forms: { noun: "slam", verb: "slam", past: "slammed", pp: "slammed" }
        },
        {
            id: "bde68238-34c1-4083-b68e-fdfac31f9017",
            word: "squelch",
            forms: { noun: "squelch", verb: "squelch", past: "squelched", pp: "squelched" }
        },
        {
            id: "6fb4182d-dfac-4b99-b09e-e35989818d51",
            word: "Unavoidable",
            forms: { adj: "unavoidable", adv: "unavoidably", noun: "unavoidability" }
        },
        {
            id: "880474f7-e13c-454a-a538-74cca5aa2f44",
            word: "gait",
            forms: { noun: "gait" }
        },
        {
            id: "c6f8ab32-095e-4a9b-b56f-68fb22c149c2",
            word: "be into sth",
            forms: { verb: "be into" }
        },
        {
            id: "fcc4e92c-3226-41a8-a4ff-1ccb29964da5",
            word: "sour grapes",
            forms: { noun: "sour grapes" }
        },
        {
            id: "8ad15974-14f8-453e-8a7f-4bb819dd6ee1",
            word: "Sputtered",
            forms: { noun: "sputter", verb: "sputter", past: "sputtered", pp: "sputtered" }
        },
        {
            id: "456e76f5-a93e-4dd4-9f52-ebb51b78c714",
            word: "Murky",
            forms: { adj: "murky", noun: "murkiness" }
        },
        {
            id: "c6c09b6e-b065-4549-b525-276bf1676dec",
            word: "skimpy",
            forms: { adj: "skimpy", noun: "skimpiness" }
        },
        {
            id: "2494aae6-2390-4d4d-bf58-ce0efc28ca7e",
            word: "naivete",
            forms: { adj: "naive", noun: "naivete" }
        },
        {
            id: "2eb04285-80d1-48a5-9b43-8d74ff901e2d",
            word: "Crested",
            forms: { noun: "crest", verb: "crest", past: "crested", pp: "crested" }
        },
        {
            id: "9f839aa5-f1f7-43a8-8b24-e9f4996393c3",
            word: "creak",
            forms: { adj: "creaky", noun: "creak", verb: "creak", past: "creaked", pp: "creaked" }
        },
        {
            id: "a9f8abbd-6d9d-4171-8f39-e7a9a38cf801",
            word: "high-pitched",
            forms: { adj: "high-pitched" }
        },
        {
            id: "3ff93036-1e67-4662-938c-6b984e6901bb",
            word: "bark",
            forms: { noun: "bark", verb: "bark", past: "barked", pp: "barked" }
        },
        {
            id: "42a574d8-b6c1-43df-bec0-c3127144ccfe",
            word: "distinct",
            forms: { adj: "distinct", adv: "distinctly", noun: "distinction" }
        },
        {
            id: "77ad4f28-c958-49b3-9bda-ddf62d83dab0",
            word: "Welding",
            forms: { noun: "welder", verb: "weld", past: "welded", pp: "welded" }
        },
        {
            id: "08757d81-7b6c-4f6f-954c-0b818eba581a",
            word: "Julienne",
            forms: { adj: "julienne", verb: "julienne", past: "julienned", pp: "julienned" }
        },
        {
            id: "bc27f1e3-4485-4ce9-8da1-951bc5cc92b4",
            word: "restrained",
            forms: { adj: "restrained", noun: "restraint", verb: "restrain", past: "restrained", pp: "restrained" }
        },
        {
            id: "4b6d3ceb-e292-445f-855b-fa951e7ae087",
            word: "prospect",
            forms: { adj: "prospective", noun: "prospect", verb: "prospect", past: "prospected", pp: "prospected" }
        },
        {
            id: "3b5dd35a-94dc-458f-9c0b-a3b85131a2a9",
            word: "take it easy",
            forms: { verb: "take it easy", past: "took it easy", pp: "taken it easy" }
        },
        {
            id: "75d6d8c2-93a7-4e47-82db-dddadc9fb76a",
            word: "reluctant",
            forms: { adj: "reluctant", adv: "reluctantly", noun: "reluctance" }
        },
        {
            id: "64b71898-41e9-4be9-8aa7-cd5b29fe56a7",
            word: "Hurtling",
            forms: { verb: "hurtle", past: "hurtled", pp: "hurtled" }
        },
        {
            id: "df75a92b-ab03-4e3e-8c92-90be1be4b8f9",
            word: "astray",
            forms: { adj: "astray", adv: "astray" }
        },
        {
            id: "defbdfe8-5a61-465a-ab52-c2334fdfa709",
            word: "Going bust",
            forms: { verb: "go bust", past: "went bust", pp: "gone bust" }
        },
        {
            id: "2ac52e37-1eb4-4eaa-ac09-eb4fe1e38767",
            word: "nibble",
            forms: { noun: "nibble", verb: "nibble", past: "nibbled", pp: "nibbled" }
        },
        {
            id: "5658a251-bfd9-4e08-9a52-7e8d2be9d05f",
            word: "sheer",
            forms: { adj: "sheer", adv: "sheerly", noun: "sheerness" }
        },
        {
            id: "947dc114-ab33-4365-aa9f-73129cdde415",
            word: "Stiff",
            forms: { adj: "stiff", adv: "stiffly", noun: "stiffness", verb: "stiffen", past: "stiffened", pp: "stiffened" }
        },
        {
            id: "cc61c2a0-d32a-4518-a043-18c328690ad7",
            word: "growl",
            forms: { noun: "growl", verb: "growl", past: "growled", pp: "growled" }
        },
        {
            id: "ebaab407-c339-43ca-be4e-b2ccb2a2ac8a",
            word: "firms",
            forms: { adj: "firm", noun: "firm", verb: "firm", past: "firmed", pp: "firmed" }
        },
        {
            id: "0ec7ee60-0b70-440b-a3cb-d2b46c0a0d7c",
            word: "Sloppy",
            forms: { adj: "sloppy", adv: "sloppily", noun: "sloppiness" }
        },
        {
            id: "c9c5d8ef-c1bc-4b71-86dc-8410b22aec03",
            word: "appeal",
            forms: { adj: "appealing", noun: "appeal", verb: "appeal", past: "appealed", pp: "appealed" }
        },
        {
            id: "d7b6b11e-c5a6-4f53-8a3d-c64239430c6b",
            word: "Steering",
            forms: { noun: "steering", verb: "steer", past: "steered", pp: "steered" }
        },
        {
            id: "71776a02-8d17-4047-be01-e421e9d5c73b",
            word: "buzz",
            forms: { adj: "buzzing", noun: "buzz", verb: "buzz", past: "buzzed", pp: "buzzed" }
        },
        {
            id: "3bcb435f-2686-4630-bfa4-009ad9b7896c",
            word: "curable",
            forms: { adj: "curable", noun: "cure", verb: "cure", past: "cured", pp: "cured" }
        },
        {
            id: "17e0c92f-dce6-4b92-b493-be24efc52d28",
            word: "howl",
            forms: { adj: "howling", noun: "howl", verb: "howl", past: "howled", pp: "howled" }
        },
        {
            id: "754f9c66-271c-4b45-8e87-219b860b9da5",
            word: "bring sth about",
            forms: { verb: "bring about", past: "brought about", pp: "brought about" }
        },
        {
            id: "17f655be-1538-4f22-9e79-c0c623d9ed1d",
            word: "whatsoever",
            forms: { adv: "whatsoever" }
        },
        {
            id: "55297a7d-5e5b-4ded-8fcb-07d22f8bc0b9",
            word: "altruistic",
            forms: { adj: "altruistic", adv: "altruistically", noun: "altruism" }
        },
        {
            id: "6679e34f-31c6-44b4-8c93-f6dde8775746",
            word: "Perpendicular",
            forms: { adj: "perpendicular", adv: "perpendicularly", noun: "perpendicularity" }
        },
        {
            id: "dc82a570-c245-4d73-ab16-4a47a3a0be2d",
            word: "go to pieces",
            forms: { verb: "go to pieces", past: "went to pieces", pp: "gone to pieces" }
        },
        {
            id: "06ebe114-9129-4dcf-96e4-75369a9afaf2",
            word: "predicament",
            forms: { noun: "predicament" }
        },
        {
            id: "51484d75-23d6-4c8c-bbaa-c66c8a299ca6",
            word: "Juxtaposition",
            forms: { noun: "juxtaposition", verb: "juxtapose", past: "juxtaposed", pp: "juxtaposed" }
        },
        {
            id: "68f63483-0e03-4469-b942-00102e36f51c",
            word: "Indecisiveness",
            forms: { adj: "indecisive", adv: "indecisively", noun: "indecisiveness" }
        },
        {
            id: "e28614b7-2c3c-4a86-9758-c8046f4481e9",
            word: "roar",
            forms: { adj: "roaring", noun: "roar", verb: "roar", past: "roared", pp: "roared" }
        },
        {
            id: "214b62d6-054a-4c5b-b9d2-4bc01a75444c",
            word: "squeak",
            forms: { adj: "squeaky", noun: "squeak", verb: "squeak", past: "squeaked", pp: "squeaked" }
        },
        {
            id: "63abbd28-95ed-4eb2-994a-d833b77ec894",
            word: "miscast",
            forms: { adj: "miscast", verb: "miscast", past: "miscast", pp: "miscast" }
        },
        {
            id: "956c372b-33dc-405d-889d-34286da1539b",
            word: "atrocity",
            forms: { adj: "atrocious", noun: "atrocity" }
        },
        {
            id: "66347c78-1867-4624-a60d-3619e398e7f5",
            word: "charade",
            forms: { noun: "charade" }
        },
        {
            id: "9ecffae7-dcaa-49e6-bbdb-29fe3e09db4e",
            word: "Profit Margin",
            forms: { noun: "profit margin" }
        },
        {
            id: "c86f60ca-49fa-4d12-b26c-7b570646db93",
            word: "Liquidity",
            forms: { adj: "liquid", noun: "liquidity" }
        },
        {
            id: "d449399d-e1f6-4d07-ac88-03973ca55343",
            word: "hedge",
            forms: { noun: "hedge", verb: "hedge", past: "hedged", pp: "hedged" }
        },
        {
            id: "03998000-29ab-4d24-ac15-2d87ef2249f0",
            word: "incentive",
            forms: { adj: "incentivized", noun: "incentive", verb: "incentivize", past: "incentivized", pp: "incentivized" }
        },
        {
            id: "c01143d0-3a44-4d96-9dd2-cb0f9a3ef8ad",
            word: "crow",
            forms: { noun: "crow", verb: "crow", past: "crowed", pp: "crowed" }
        },
        {
            id: "55843edc-da78-4f76-809f-721e9a3fe6ee",
            word: "crouch",
            forms: { noun: "crouch", verb: "crouch", past: "crouched", pp: "crouched" }
        },
        {
            id: "d644859b-fac2-4f9d-8591-c2d09c362222",
            word: "Cumbersome",
            forms: { adj: "cumbersome", noun: "cumbersomeness" }
        },
        {
            id: "964bec77-ba56-4a2c-ac86-3cd5c876065c",
            word: "eyesight",
            forms: { noun: "eyesight" }
        },
        {
            id: "10e831c7-26d0-4b5d-88c6-aa47c20460d9",
            word: "eye strain",
            forms: { noun: "eye strain" }
        },
        {
            id: "66a3497d-ddee-4865-be5b-fe869a6c6a8c",
            word: "Scalable",
            forms: { adj: "scalable", noun: "scalability", verb: "scale", past: "scaled", pp: "scaled" }
        },
        {
            id: "85796349-e6ec-45bd-be9c-d55ed1889205",
            word: "temptation",
            forms: { adj: "tempting", noun: "temptation", verb: "tempt", past: "tempted", pp: "tempted" }
        },
        {
            id: "e6b74d55-3f11-4227-9ec9-e403511a6a04",
            word: "Insidious",
            forms: { adj: "insidious", adv: "insidiously", noun: "insidiousness" }
        },
        {
            id: "a6afa935-7de0-45ad-bf30-b3af259aca08",
            word: "Impeccable",
            forms: { adj: "impeccable", adv: "impeccably", noun: "impeccability" }
        },
        {
            id: "fdc5c308-04f2-4a75-b342-98af735c7eb9",
            word: "Outsourcing",
            forms: { noun: "outsourcing", verb: "outsource", past: "outsourced", pp: "outsourced" }
        },
        {
            id: "70a00c25-652a-42ad-bd50-b1dc76f99edb",
            word: "Articulate",
            forms: { adj: "articulate", noun: "articulation", verb: "articulate", past: "articulated", pp: "articulated" }
        },
        {
            id: "8e87f3e1-4dc0-499b-bb75-7fd6ad357256",
            word: "apprehension",
            forms: { adj: "apprehensive", noun: "apprehension", verb: "apprehend", past: "apprehended", pp: "apprehended" }
        },
        {
            id: "f44fe249-07f8-4677-a513-d219eb185099",
            word: "Prodigal",
            forms: { adj: "prodigal", noun: "prodigality" }
        },
        {
            id: "0934d551-9a66-45d6-a9b0-a6149e6077da",
            word: "Break-even point",
            forms: { noun: "break-even point" }
        },
        {
            id: "b40ed67b-b965-432a-a9ac-c27123ebcd01",
            word: "hoot",
            forms: { noun: "hoot", verb: "hoot", past: "hooted", pp: "hooted" }
        },
        {
            id: "801e3805-d4c7-4977-9274-1fd8e4c13b0b",
            word: "Shrill",
            forms: { adj: "shrill", adv: "shrilly", noun: "shrillness", verb: "shrill", past: "shrilled", pp: "shrilled" }
        },
        {
            id: "98fa00a5-c0e7-4376-bbf3-11f1b24f9f93",
            word: "Coarse",
            forms: { adj: "coarse", adv: "coarsely", noun: "coarseness" }
        },
        {
            id: "dc0cb545-a226-45eb-b8bd-5755f501a8e3",
            word: "incurable",
            forms: { adj: "incurable", adv: "incurably", noun: "incurability" }
        },
        {
            id: "27f67876-af32-4f5d-a2a0-becb0bbefe96",
            word: "Cautious",
            forms: { adj: "cautious", adv: "cautiously", noun: "caution" }
        },
        {
            id: "c6631526-f07f-4cb9-831f-48eea9ee4e2f",
            word: "Bold",
            forms: { adj: "bold", adv: "boldly", noun: "boldness" }
        },
        {
            id: "ecf3a4f4-d07f-40bd-ae1b-6889631cc6dc",
            word: "Regret",
            forms: { adj: "regretful", noun: "regret", verb: "regret", past: "regretted", pp: "regretted" }
        },
        {
            id: "dc262bfb-43ff-4fcb-908c-443bc9cbbfcd",
            word: "Meticulous",
            forms: { adj: "meticulous", adv: "meticulously", noun: "meticulousness" }
        },
        {
            id: "e74f1d73-96bf-4cae-a235-ecaf2263f168",
            word: "Ephemeral",
            forms: { adj: "ephemeral", adv: "ephemerally", noun: "ephemera" }
        },
        {
            id: "2fee88dc-d267-43eb-b83e-27c7248feba1",
            word: "Delicate",
            forms: { adj: "delicate", adv: "delicately", noun: "delicacy" }
        },
        {
            id: "4b7a10d1-f12f-4da4-b442-8a5cef5185ca",
            word: "Superfluous",
            forms: { adj: "superfluous", adv: "superfluously", noun: "superfluity" }
        },
        {
            id: "8077cc6b-0659-4b5e-8555-e610ac7f5957",
            word: "Paradox",
            forms: { adj: "paradoxical", adv: "paradoxically", noun: "paradox" }
        },
        {
            id: "03e6c383-cff1-4c8c-bb8c-9ba116175227",
            word: "Altruism",
            forms: { adj: "altruistic", adv: "altruistically", noun: "altruism" }
        },
        {
            id: "cdfad4e8-7129-4f44-aab4-eeec75f2da17",
            word: "Perseverance",
            forms: { adj: "persevering", noun: "perseverance", verb: "persevere", past: "persevered", pp: "persevered" }
        },
        {
            id: "935b7b1d-a3ac-4989-9a34-a9669eba036b",
            word: "impulse",
            forms: { adj: "impulsive", noun: "impulse" }
        },
        {
            id: "ceb8f6eb-fd0d-44ff-b8ab-4f59cb6b9e2c",
            word: "Mundane",
            forms: { adj: "mundane", adv: "mundanely", noun: "mundaneness" }
        },
        {
            id: "458a62aa-06b7-4b94-9dfa-e38f5a3b5e55",
            word: "Pessimistic",
            forms: { adj: "pessimistic", adv: "pessimistically", noun: "pessimism" }
        },
        {
            id: "55bf24e4-6d46-4704-a033-f9a5ec77134e",
            word: "Fragile",
            forms: { adj: "fragile", adv: "fragilely", noun: "fragility" }
        },
        {
            id: "2f5f7ad9-375e-4e34-bee5-27f8863941c1",
            word: "Pivotal",
            forms: { adj: "pivotal", noun: "pivot", verb: "pivot", past: "pivoted", pp: "pivoted" }
        },
        {
            id: "cbd545da-f522-43e2-87d9-ef43afc8d53a",
            word: "Transparent",
            forms: { adj: "transparent", adv: "transparently", noun: "transparency" }
        }
    ];

    for (const item of updates) {
        const { error } = await supabase
            .from('cards')
            .update({ word_forms: item.forms })
            .eq('id', item.id);
            
        if (error) console.error(`Failed ${item.word}:`, error.message);
    }
    console.log("Batch 5 Complete.");
}

main();
