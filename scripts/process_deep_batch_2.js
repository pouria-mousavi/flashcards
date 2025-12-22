import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function main() {
    console.log("Deep Enrichment Batch 2 (151-300)...");

    const updates = [
        {
            id: "4cb46c4c-b1cd-4a06-85d2-9ce20b4f9dbd",
            word: "Exacerbate",
            forms: { verb: "exacerbate", noun: "exacerbation", adj: "exacerbated", past: "exacerbated", pp: "exacerbated" }
        },
        {
            id: "9157f188-9526-412c-970b-84941df096b6",
            word: "Scrutinize",
            forms: { verb: "scrutinize", noun: "scrutiny", noun2: "scrutinizer", adj: "scrutinized", adv: "scrutinizingly", past: "scrutinized", pp: "scrutinized" }
        },
        {
            id: "0f1e1b7a-94b9-4e13-9f9b-4a4237d28a0d",
            word: "Stuck in traffic",
            forms: { verb: "stick", past: "stuck", pp: "stuck", adj: "stuck" }
        },
        {
            id: "35689392-5efc-430b-af0e-9a164b36af99",
            word: "combination",
            forms: { noun: "combination", verb: "combine", adj: "combined", past: "combined", pp: "combined" }
        },
        {
            id: "712d902a-8815-423e-b17c-c84f2c91be77",
            word: "Arms deal probe",
            forms: { noun: "probe", verb: "probe", past: "probed", pp: "probed" }
        },
        {
            id: "4d01c4c6-1e28-4b02-b65e-0818ef692cc4",
            word: "As it happens",
            forms: { verb: "happen", noun: "happening", past: "happened", pp: "happened" }
        },
        {
            id: "6f0dec1d-a0f0-4ca5-929d-2a9c222c763c",
            word: "Nodded",
            forms: { verb: "nod", noun: "nod", past: "nodded", pp: "nodded" }
        },
        {
            id: "c1cc75d7-6959-4a7a-b095-52f25b9309b5",
            word: "Notorious",
            forms: { adj: "notorious", noun: "notoriety", adv: "notoriously" }
        },
        {
            id: "8a5c3377-b51e-4545-a9b7-f71ac23d08cb",
            word: "display sth",
            forms: { verb: "display", noun: "display", adj: "displayed", past: "displayed", pp: "displayed" }
        },
        {
            id: "dbef85f4-d588-4380-82ca-70288113fb05",
            word: "Nonchalant",
            forms: { adj: "nonchalant", noun: "nonchalance", adv: "nonchalantly" }
        },
        {
            id: "d183a267-894c-40e3-96ae-4187c1b7b1ee",
            word: "Intricate",
            forms: { adj: "intricate", noun: "intricacy", adv: "intricately" }
        },
        {
            id: "c6bc749e-da90-4d4d-8b3b-ebd8e43782a8",
            word: "Inevitable",
            forms: { adj: "inevitable", noun: "inevitability", adv: "inevitably" }
        },
        {
            id: "617f6e4e-46b0-471a-879e-93423c35a92e",
            word: "Seemingly",
            forms: { adv: "seemingly", verb: "seem", adj: "seeming", past: "seemed", pp: "seemed" }
        },
        {
            id: "7eb661e9-609f-4db5-a35a-6a767f717f93",
            word: "Embark",
            forms: { verb: "embark", noun: "embarkation", past: "embarked", pp: "embarked" }
        },
        {
            id: "d12616a5-1e35-46ec-b141-5289004c553f",
            word: "Undermine",
            forms: { verb: "undermine", noun: "undermining", past: "undermined", pp: "undermined" }
        },
        {
            id: "4bc76f40-16ed-42e7-87eb-c4bf7f40c510",
            word: "Tangible",
            forms: { adj: "tangible", noun: "tangibility", adv: "tangibly", antonym: "intangible" }
        },
        {
            id: "2c453ead-97fe-4d64-a1d4-c046193aa079",
            word: "Mundane",
            forms: { adj: "mundane", noun: "mundanity", adv: "mundanely" } // noun mundanity is better than mundaneness
        },
        {
            id: "2628f0cd-b37e-46c9-84a7-0b58e75842fb",
            word: "Down-to-earth",
            forms: { adj: "down-to-earth" }
        },
        {
            id: "ca9b1f67-dfdd-4f14-bb61-dde8a0d92e6a",
            word: "go red",
            forms: { verb: "go", past: "went", pp: "gone" }
        },
        {
            id: "781dff63-d82e-46cd-8057-54c6f4d8e7e7",
            word: "sweat",
            forms: { verb: "sweat", noun: "sweat", adj: "sweaty", past: "sweated", pp: "sweated" } // or sweat/sweat/sweat in US, but sweated ok
        },
        {
            id: "38d22f92-d815-4f6d-9afa-63cb37916403",
            word: "Conducive",
            forms: { adj: "conducive", noun: "conduciveness" }
        },
        {
            id: "4a573545-f0e7-4aaf-a407-f6491facc69b",
            word: "Put on hold",
            forms: { verb: "put", past: "put", pp: "put" }
        },
        {
            id: "484998a4-7849-4fc8-b92a-1fc024719674",
            word: "Blow off",
            forms: { verb: "blow", past: "blew", pp: "blown" }
        },
        {
            id: "68a230f4-8f00-4c76-bfbd-10e72340ac2a",
            word: "Loathe",
            forms: { verb: "loathe", noun: "loathing", adj: "loathsome", past: "loathed", pp: "loathed" }
        },
        {
            id: "629e4e07-f9c5-4b3c-9a7f-a5ac64a37374",
            word: "Breaking up",
            forms: { verb: "break", noun: "breakup", past: "broke", pp: "broken" }
        },
        {
            id: "fc8e6cef-bb90-4b44-8ce9-bf51c8d6204a",
            word: "Whisk",
            forms: { verb: "whisk", noun: "whisk", past: "whisked", pp: "whisked" }
        },
        {
            id: "81e997e0-c966-4a5f-9188-353a928e40e9",
            word: "Comprehensive",
            forms: { adj: "comprehensive", noun: "comprehension", adv: "comprehensively", verb: "comprehend" }
        },
        {
            id: "9dd2e20b-28c7-4a00-aedf-b744e1e9080a",
            word: "Grater",
            forms: { noun: "grater", verb: "grate", past: "grated", pp: "grated" }
        },
        {
            id: "6593c02f-e064-4b20-bc5f-e1a13b6e2363",
            word: "Appease",
            forms: { verb: "appease", noun: "appeasement", past: "appeased", pp: "appeased" }
        },
        {
            id: "8748d39a-297b-404a-8ab7-eb110765287c",
            word: "Flake / Bail",
            forms: { verb: "flake", noun: "flake", adj: "flaky", past: "flaked", pp: "flaked" }
        },
        {
            id: "c2aa70f8-c27f-47a3-9132-3e92299e2e76",
            word: "Fryer",
            forms: { noun: "fryer", verb: "fry", past: "fried", pp: "fried", adj: "fried" }
        },
        {
            id: "899ea962-98f7-42b2-ac41-9e237e2392cc",
            word: "Cost-effective",
            forms: { adj: "cost-effective", noun: "cost-effectiveness" }
        },
        {
            id: "3452d60d-0121-4698-814a-e9d6122860cb",
            word: "excessive",
            forms: { adj: "excessive", noun: "excess", adv: "excessively", verb: "exceed" }
        },
        {
            id: "391575e6-2c51-4244-b581-86d8b17278c3",
            word: "Grudge",
            forms: { noun: "grudge", verb: "grudge", adj: "grudging", adv: "grudgingly", past: "grudged", pp: "grudged" }
        },
        {
            id: "a6b11d5c-ec37-40bc-9459-57581542ffcd",
            word: "Vague",
            forms: { adj: "vague", noun: "vagueness", adv: "vaguely" }
        },
        {
            id: "dadba331-fb6f-469e-9be4-ae696c5e7f60",
            word: "Bland",
            forms: { adj: "bland", noun: "blandness", adv: "blandly" }
        },
        {
            id: "854343c4-d113-41da-94df-9fe40ac55d1a",
            word: "count",
            forms: { verb: "count", noun: "count", adj: "countable", past: "counted", pp: "counted" }
        },
        {
            id: "ccde2aef-0f86-4fea-a13a-f3f0d2455836",
            word: "Impromptu",
            forms: { adj: "impromptu", adv: "impromptu" }
        },
        {
            id: "b90046e9-8f21-462a-85bf-9091c01ecea9",
            word: "Concise",
            forms: { adj: "concise", noun: "conciseness", adv: "concisely" }
        },
        {
            id: "8051e820-77a0-43c3-85cd-cb77011c7860",
            word: "Grueling",
            forms: { adj: "grueling", adv: "gruelingly" }
        },
        {
            id: "565473b0-fc2c-46bf-95a5-baa94d0b4f00",
            word: "Procrastinate",
            forms: { verb: "procrastinate", noun: "procrastination", noun2: "procrastinator", past: "procrastinated", pp: "procrastinated" }
        },
        {
            id: "123f1860-d333-437e-9077-07fd9da70822",
            word: "Yearn",
            forms: { verb: "yearn", noun: "yearning", past: "yearned", pp: "yearned", adv: "yearningly" }
        },
        {
            id: "ca064a8b-27e2-4640-a881-2944ef63c954",
            word: "Parallel park",
            forms: { verb: "park", noun: "parking", past: "parked", pp: "parked" }
        },
        {
            id: "651c695d-265e-4cff-a35d-1782302bdc01",
            word: "imply sth",
            forms: { verb: "imply", noun: "implication", past: "implied", pp: "implied" }
        },
        {
            id: "4f244358-96bb-417c-8614-62440692999c",
            word: "stubbornness",
            forms: { noun: "stubbornness", adj: "stubborn", adv: "stubbornly" }
        },
        {
            id: "34ad10df-df20-4b9a-b949-b2a0167a461e",
            word: "fancy sb",
            forms: { verb: "fancy", noun: "fancy", adj: "fancy", past: "fancied", pp: "fancied" }
        },
        {
            id: "456b9d20-542c-4835-99ab-7467423e70f8",
            word: "lodge",
            forms: { verb: "lodge", noun: "lodge", past: "lodged", pp: "lodged", noun2: "lodging" }
        },
        {
            id: "f955dffa-3a9a-4cb5-86cf-f0cfb75e4e5a",
            word: "Subservient",
            forms: { adj: "subservient", noun: "subservience", adv: "subserviently" }
        },
        {
            id: "480dc2c7-247e-405f-8462-13126c922c46",
            word: "Scarce",
            forms: { adj: "scarce", noun: "scarcity", adv: "scarcely" }
        },
        {
            id: "5a717cd3-a112-405b-923d-fa3db8477ee7",
            word: "harbor",
            forms: { noun: "harbor", verb: "harbor", past: "harbored", pp: "harbored" }
        },
        {
            id: "ad8de8b8-5895-4085-a242-461e0cbeb5e5",
            word: "Abundant",
            forms: { adj: "abundant", noun: "abundance", adv: "abundantly" }
        },
        {
            id: "7ef1c2c0-838d-410d-a5be-8dda47533fb5",
            word: "Swindle",
            forms: { verb: "swindle", noun: "swindle", noun2: "swindler", past: "swindled", pp: "swindled" }
        },
        {
            id: "0cf345aa-ef10-4c14-b162-fc659cfa9918",
            word: "Alert",
            forms: { adj: "alert", verb: "alert", noun: "alert", adv: "alertly", past: "alerted", pp: "alerted" }
        },
        {
            id: "b46a9d0d-a261-4b8e-b342-00a225c81947",
            word: "Respectful",
            forms: { adj: "respectful", noun: "respect", verb: "respect", adv: "respectfully", past: "respected", pp: "respected" }
        },
        {
            id: "fa7bb9cf-3930-48f1-beb7-ef4aac19721f",
            word: "Vital",
            forms: { adj: "vital", noun: "vitality", adv: "vitally" }
        },
        {
            id: "90fccac1-78b8-46f6-a2de-9ecbe4b06e6b",
            word: "Oversleep",
            forms: { verb: "oversleep", past: "overslept", pp: "overslept" }
        },
        {
            id: "ebb8432d-9663-4757-a55a-464f6c17b9af",
            word: "outspend",
            forms: { verb: "outspend", past: "outspent", pp: "outspent" }
        },
        {
            id: "eda644ce-a0d2-43e4-9c62-f9da27c129de",
            word: "Shone",
            forms: { verb: "shine", past: "shone", pp: "shone", noun: "shine", adj: "shiny" }
        },
        {
            id: "566a740e-76f3-42bf-868a-84a431225636",
            word: "stroke sth",
            forms: { verb: "stroke", noun: "stroke", past: "stroked", pp: "stroked" }
        },
        {
            id: "bc2f6a94-21fb-4c89-8406-800a27188f1c",
            word: "Mitigate",
            forms: { verb: "mitigate", noun: "mitigation", adj: "mitigated", past: "mitigated", pp: "mitigated" }
        },
        {
            id: "e2fc97de-54cf-47dd-97fb-eefc1255bc3e",
            word: "Greasy",
            forms: { adj: "greasy", noun: "grease", verb: "grease", adv: "greasily" }
        },
        {
            id: "ff0b4d9e-6fca-4e81-a9f1-d1f73d18acfa",
            word: "Apprised",
            forms: { verb: "apprise", past: "apprised", pp: "apprised" }
        },
        {
            id: "c11180ef-e42c-458f-bec8-ea85b4e723b0",
            word: "Moldy",
            forms: { adj: "moldy", noun: "mold", verb: "mold" }
        },
        {
            id: "18a70bab-ab55-4565-9760-07189d8401fa",
            word: "fiddle with sth",
            forms: { verb: "fiddle", noun: "fiddle", past: "fiddled", pp: "fiddled" }
        },
        {
            id: "e52eb3ea-e667-4f80-a201-bacda710d29d",
            word: "Coherent",
            forms: { adj: "coherent", noun: "coherence", adv: "coherently", antonym: "incoherent" }
        },
        {
            id: "5bd1a4c8-6f0d-4e0a-a979-8246ba0da510",
            word: "Bitter",
            forms: { adj: "bitter", noun: "bitterness", adv: "bitterly" }
        },
        {
            id: "f73d63d7-be77-424f-9845-b4f134277abb",
            word: "Furious",
            forms: { adj: "furious", noun: "fury", adv: "furiously" }
        },
        {
            id: "e646c931-9e14-4f19-a814-576517154b6c",
            word: "Sour",
            forms: { adj: "sour", noun: "sourness", verb: "sour", adv: "sourly" }
        },
        {
            id: "544c468e-7e78-4e2b-b42e-06df3fa7ef60",
            word: "Nauseous",
            forms: { adj: "nauseous", noun: "nausea", verb: "nauseate", adv: "nauseously" }
        },
        {
            id: "2dc8f245-282b-4b0c-a819-6a0411bcfb9d",
            word: "Paled",
            forms: { verb: "pale", adj: "pale", noun: "paleness", past: "paled", pp: "paled" }
        },
        {
            id: "e443fc65-0b4c-4d6a-b263-cb0cc9b16461",
            word: "Flared",
            forms: { verb: "flare", noun: "flare", past: "flared", pp: "flared" }
        }
    ];

    for (const item of updates) {
        const { error } = await supabase
            .from('cards')
            .update({ word_forms: item.forms })
            .eq('id', item.id);
            
        if (error) console.error(`Failed ${item.word}:`, error.message);
    }
    console.log("Batch 2 Complete.");
}

main();
