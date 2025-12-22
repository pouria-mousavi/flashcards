import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function main() {
    console.log("Deep Enrichment Batch 3 (301-450)...");

    const updates = [
        {
            id: "bc3d07a5-f3ef-432c-b52b-84ef20c6583f",
            word: "Dizzy",
            forms: { adj: "dizzy", noun: "dizziness", verb: "dizzy", adv: "dizzily", past: "dizzied", pp: "dizzied" }
        },
        {
            id: "baec3ac8-17ba-4d87-aafc-a1e9bcbf0d5b",
            word: "Compromise",
            forms: { noun: "compromise", verb: "compromise", adj: "compromised", past: "compromised", pp: "compromised" }
        },
        {
            id: "b9605899-4f30-48f2-9616-507a510211ae",
            word: "Terrified",
            forms: { adj: "terrified", noun: "terror", verb: "terrify", noun2: "terrorism", past: "terrified", pp: "terrified" }
        },
        {
            id: "00836b31-8646-4d88-937d-d0e76c892121",
            word: "Adapt",
            forms: { verb: "adapt", noun: "adaptation", adj: "adaptive", adv: "adaptively", past: "adapted", pp: "adapted", noun2: "adaptability" }
        },
        {
            id: "6bdd6888-14d5-4dfd-a923-63138ef0dc73",
            word: "Bland",
            forms: { adj: "bland", noun: "blandness", adv: "blandly" }
        },
        {
            id: "04a3de63-49b2-4a8d-81d3-c9f79d8ade5f",
            word: "creep (V)",
            forms: { verb: "creep", noun: "creep", adj: "creepy", adv: "creepily", past: "crept", pp: "crept" }
        },
        {
            id: "62de8545-8663-4625-b51b-f97c9a05ece4",
            word: "Obligator",
            forms: { noun: "obligator", noun2: "obligation", adj: "obligatory", verb: "obligate" }
        },
        {
            id: "66cf7f4c-ccc1-45f1-87dd-c5058273700a",
            word: "Capsize",
            forms: { verb: "capsize", noun: "capsizing", past: "capsized", pp: "capsized" }
        },
        {
            id: "ccb518e4-4b58-4cdb-a874-ef10b185810d",
            word: "Mild",
            forms: { adj: "mild", noun: "mildness", adv: "mildly" }
        },
        {
            id: "10aaafbb-3048-440c-8ba9-789b85fb8776",
            word: "pry into sth",
            forms: { verb: "pry", noun: "pry", adj: "prying", past: "pried", pp: "pried" }
        },
        {
            id: "5e82972e-f307-4b07-90f5-b87a5e6db5a2",
            word: "Simultaneously",
            forms: { adv: "simultaneously", adj: "simultaneous", noun: "simultaneity" }
        },
        {
            id: "e23edae4-0068-4f0e-aacc-cb9a2bfeaaa8",
            word: "You rocked it",
            forms: { verb: "rock", past: "rocked", pp: "rocked" }
        },
        {
            id: "fd3467eb-c77c-4847-b369-3a184e26ee59",
            word: "Conjugate", // Duplicate ID, same word
            forms: { verb: "conjugate", noun: "conjugation", adj: "conjugated", past: "conjugated", pp: "conjugated" }
        },
        {
            id: "e6d5f345-39b8-46b7-bc36-47e90f5c8fe9",
            word: "Grumpy",
            forms: { adj: "grumpy", noun: "grumpiness", adv: "grumpily" }
        },
        {
            id: "c286ce35-1b7a-4a58-ad56-b97c6bde74b7",
            word: "Parasol",
            forms: { noun: "parasol" }
        },
        {
            id: "6d779718-e75c-40fc-9bf5-0a9e67764650",
            word: "backlash",
            forms: { noun: "backlash" }
        },
        {
            id: "85d17561-a433-40ae-8059-20c516621857",
            word: "Fussy",
            forms: { adj: "fussy", noun: "fussiness", verb: "fuss", adv: "fussily" }
        },
        {
            id: "6accd548-c30e-4212-adbf-978ad09cd58c",
            word: "Praise",
            forms: { noun: "praise", verb: "praise", adj: "praiseworthy", past: "praised", pp: "praised" }
        },
        {
            id: "d8870aae-9349-46b2-a324-53181ea69c67",
            word: "Severe / Acute",
            forms: { adj: "severe", noun: "severity", adv: "severely" }
        },
        {
            id: "53cb6bd0-8e1f-4d1e-bc8f-617f277f2f0d",
            word: "Pantry",
            forms: { noun: "pantry" }
        },
        {
            id: "cb48b0cb-5dcc-4ee4-94b1-ed1f47a452e3",
            word: "Wistful",
            forms: { adj: "wistful", noun: "wistfulness", adv: "wistfully" }
        },
        {
            id: "d46140cf-7cc8-4f4d-b90d-aa8d402981dc",
            word: "Enigmatic",
            forms: { adj: "enigmatic", noun: "enigma", adv: "enigmatically" }
        },
        {
            id: "6ee9b125-5aa4-434c-b12f-4d0d0af449e6",
            word: "Blatant",
            forms: { adj: "blatant", noun: "blatancy", adv: "blatantly" }
        },
        {
            id: "f1c9447a-584a-4788-be9b-7094d184204b",
            word: "Keen",
            forms: { adj: "keen", noun: "keenness", adv: "keenly" }
        },
        {
            id: "deafd570-5402-4673-be56-0e1fdf06c8fa",
            word: "Slippery",
            forms: { adj: "slippery", noun: "slipperiness", verb: "slip", adv: "slipperily", past: "slipped", pp: "slipped" }
        },
        {
            id: "7f28775b-7e7a-4acb-ae11-881b70e2bb56",
            word: "stroll",
            forms: { noun: "stroll", verb: "stroll", adj: "strolling", past: "strolled", pp: "strolled" }
        },
        {
            id: "010590f1-8c69-41e9-b6e9-faf44b520ca0",
            word: "limp",
            forms: { adj: "limp", noun: "limp", verb: "limp", adv: "limply", past: "limped", pp: "limped" }
        },
        {
            id: "6f6fb772-a0f2-448b-8316-b2cb150b6d21",
            word: "circumstance",
            forms: { noun: "circumstance", adj: "circumstantial", adv: "circumstantially" }
        },
        {
            id: "fe846cef-92a2-4c23-8c0f-61850161a339",
            word: "Zealous",
            forms: { adj: "zealous", noun: "zeal", adv: "zealously", noun2: "zealot" }
        },
        {
            id: "7f09e845-bd24-449a-b5a1-8b89d4691e08",
            word: "allegedly",
            forms: { adv: "allegedly", adj: "alleged", verb: "allege", noun: "allegation", past: "alleged", pp: "alleged" }
        },
        {
            id: "7bd5019f-62b8-4059-915f-b2c72f1ac82c",
            word: "Stingy",
            forms: { adj: "stingy", noun: "stinginess", adv: "stingily" }
        },
        {
            id: "98735591-325c-41ab-8435-4d6f9e567db5",
            word: "Vacillate",
            forms: { verb: "vacillate", noun: "vacillation", past: "vacillated", pp: "vacillated" }
        },
        {
            id: "3fb77456-2fc3-475f-9b23-affa24727a71",
            word: "Numb",
            forms: { adj: "numb", noun: "numbness", verb: "numb", adv: "numbly" }
        },
        {
            id: "938957c0-fa62-4187-9803-901fc4a0f235",
            word: "Viscosity",
            forms: { noun: "viscosity", adj: "viscous" }
        },
        {
            id: "1dced483-c317-467f-b637-f7cd9cca0951",
            word: "Smidgen",
            forms: { noun: "smidgen" }
        },
        {
            id: "47bc908c-e872-428a-ae90-eaaddc6b9d40",
            word: "Hollow",
            forms: { adj: "hollow", noun: "hollowness", verb: "hollow", adv: "hollowly" }
        },
        {
            id: "f35a7c03-aeb3-45ed-a2c5-18a5f6e22772",
            word: "Tidy",
            forms: { adj: "tidy", noun: "tidiness", verb: "tidy", adv: "tidily", past: "tidied", pp: "tidied" }
        },
        {
            id: "939de1d9-bb1a-4920-9ede-16454806d24d",
            word: "Conferred",
            forms: { verb: "confer", noun: "conference", adj: "conferred", past: "conferred", pp: "conferred" }
        },
        {
            id: "33c6a0f0-f7b0-45e3-887b-acb5ab181fd1",
            word: "Restless",
            forms: { adj: "restless", noun: "restlessness", adv: "restlessly" }
        },
        {
            id: "70721e9d-d48c-4e3b-b94c-fc48a10392ad",
            word: "Cramped",
            forms: { adj: "cramped", verb: "cramp", past: "cramped", pp: "cramped" }
        },
        {
            id: "4c6c0890-1d33-4214-a20b-4e4b0fa92934",
            word: "Itchy",
            forms: { adj: "itchy", noun: "itch", verb: "itch", adv: "itchily" }
        },
        {
            id: "ede6a589-166a-4834-9fce-8559300a6702",
            word: "Solitude",
            forms: { noun: "solitude", adj: "solitary" }
        },
        {
            id: "a6c98170-cb57-402d-878e-4d907148fa00",
            word: "Get cold feet",
            forms: { verb: "get", past: "got", pp: "gotten" } // or got
        },
        {
            id: "ba615440-63f7-4341-82c3-d97e8e4e42ed",
            word: "Swollen",
            forms: { adj: "swollen", verb: "swell", past: "swelled", pp: "swollen", noun: "swelling" }
        },
        {
            id: "d37b13af-3ba7-4b72-9f42-dc5d868bda8e",
            word: "Bruised",
            forms: { adj: "bruised", noun: "bruise", verb: "bruise", past: "bruised", pp: "bruised" }
        },
        {
            id: "d2c46c4f-d2a3-43aa-8b34-c9a983ea846f",
            word: "chase sb/sth",
            forms: { verb: "chase", noun: "chase", past: "chased", pp: "chased" }
        },
        {
            id: "f1f0190c-7b43-41b4-bfc8-64bbf89cef51",
            word: "Crispy",
            forms: { adj: "crispy", noun: "crispiness", adv: "crispily" }
        },
        {
            id: "3af5ece5-f3b0-4093-b359-4aef894173bc",
            word: "dash",
            forms: { verb: "dash", noun: "dash", past: "dashed", pp: "dashed" }
        },
        {
            id: "646e5d7d-da17-46e9-a93e-a0cf5f817a39",
            word: "Riffling",
            forms: { verb: "riffle", past: "riffled", pp: "riffled" }
        },
        {
            id: "4f9be05a-6795-470f-bb98-25afee4efc60",
            word: "conducive",
            forms: { adj: "conducive", noun: "conduciveness" }
        },
        {
            id: "55f44f82-1716-4b7d-b184-d4c0210726e5",
            word: "finalize",
            forms: { verb: "finalize", noun: "finalization", adj: "final", adv: "finally", past: "finalized", pp: "finalized" }
        },
        {
            id: "b285fe07-d52c-4414-b2fa-74d054836a5b",
            word: "Spicy",
            forms: { adj: "spicy", noun: "spice", adv: "spicily" }
        },
        {
            id: "8186746d-0487-4bb7-9ebc-90fa2e123ef7",
            word: "Messy",
            forms: { adj: "messy", noun: "mess", adv: "messily" }
        },
        {
            id: "7cdb8c53-d4f7-4ca8-9d9d-d9b47a3be9fb",
            word: "Cozy",
            forms: { adj: "cozy", noun: "coziness", adv: "cozily" }
        },
        {
            id: "05f862c5-a95b-43e6-b98e-b43fed422d18",
            word: "Waterproof",
            forms: { adj: "waterproof", verb: "waterproof", past: "waterproofed", pp: "waterproofed" }
        },
        {
            id: "c9f3e12a-e0c2-4e4e-a0fe-fe0c599ad350",
            word: "Tight",
            forms: { adj: "tight", noun: "tightness", verb: "tighten", adv: "tightly" }
        },
        {
            id: "f1ac302e-ff61-43f2-9fca-b3bf9623ac81",
            word: "Rotten",
            forms: { adj: "rotten", noun: "rot", verb: "rot" }
        },
        {
            id: "5baf4080-2192-45c6-a427-5e0b3a540656",
            word: "march",
            forms: { verb: "march", noun: "march", past: "marched", pp: "marched" }
        },
        {
            id: "d62128c2-1488-460f-a71a-dce9ec4c4416",
            word: "Adjustable",
            forms: { adj: "adjustable", noun: "adjustability", verb: "adjust" }
        },
        {
            id: "45f4e373-ee8d-4b0a-8a2a-33946c044db6",
            word: "Portable",
            forms: { adj: "portable", noun: "portability" }
        },
        {
            id: "1baa93fd-0d25-4aa2-9bb3-cc4ccd5ea9d9",
            word: "Apathy",
            forms: { noun: "apathy", adj: "apathetic", adv: "apathetically" }
        },
        {
            id: "81ecbcdf-ffca-47e7-8c34-416ab8b1954a",
            word: "handling",
            forms: { noun: "handling", verb: "handle", past: "handled", pp: "handled" }
        },
        {
            id: "4c9fece7-b00e-410c-81cf-fbae1f3ee573",
            word: "gallop",
            forms: { verb: "gallop", noun: "gallop", past: "galloped", pp: "galloped" }
        },
        {
            id: "97015f2f-3c27-40e5-a8b4-95ebbad5354e",
            word: "Upside down",
            forms: { adj: "upside-down", adv: "upside down" }
        },
        {
            id: "2012d70a-ee56-4c1e-9f1a-201de07ab690",
            word: "charge",
            forms: { verb: "charge", noun: "charge", past: "charged", pp: "charged" }
        },
        {
            id: "e5d51ad9-5d19-4b9a-91cf-2c86312c637a",
            word: "Apprentice",
            forms: { noun: "apprentice", noun2: "apprenticeship", verb: "apprentice" }
        },
        {
            id: "b1289478-bc7a-49dd-aef6-c992461fcc5a",
            word: "Inside out",
            forms: { adj: "inside-out", adv: "inside out" }
        },
        {
            id: "8818b0a5-d821-43c1-99ae-910a153996db",
            word: "excel",
            forms: { verb: "excel", noun: "excellence", adj: "excellent", adv: "excellently", past: "excelled", pp: "excelled" }
        },
        {
            id: "c2fff742-7cfd-4d24-845d-bdd1079017ad",
            word: "Breed",
            forms: { verb: "breed", noun: "breed", past: "bred", pp: "bred" }
        },
        {
            id: "2ab6ed92-40a4-4f47-8bf0-9003b1030444",
            word: "Ruddy",
            forms: { adj: "ruddy" }
        },
        {
            id: "2c07253b-a996-4c04-95c3-86616b2413cd",
            word: "Sticky",
            forms: { adj: "sticky", noun: "stickiness", verb: "stick" }
        },
        {
            id: "1a59be12-dca3-460f-a461-bc5ae863d8dd",
            word: "Loose",
            forms: { adj: "loose", adv: "loosely", noun: "looseness", verb: "loosen", past: "loosened", pp: "loosened" }
        },
        {
            id: "83a427b1-0362-48ef-94da-3aa2ba3d9c72",
            word: "Mandatory",
            forms: { adj: "mandatory", noun: "mandate", adv: "mandatorily" }
        },
        {
            id: "930d2488-d88b-43ce-848e-44455134e326",
            word: "Intricate",
            forms: { adj: "intricate", noun: "intricacy", adv: "intricately" }
        },
        {
            id: "bb75a76f-5eeb-4f63-8983-bb80edc84aab",
            word: "indicate sth",
            forms: { verb: "indicate", noun: "indication", adj: "indicative", past: "indicated", pp: "indicated" }
        },
        {
            id: "69fa2bce-80fc-439d-8d5e-57e2885af3ba",
            word: "gaze at sth",
            forms: { verb: "gaze", noun: "gaze", past: "gazed", pp: "gazed" }
        },
        {
            id: "500dec4a-f617-48f6-9eb2-a3ac9854253a",
            word: "Toxic",
            forms: { adj: "toxic", noun: "toxicity", adv: "toxically" }
        },
        {
            id: "d4506e84-ba87-4056-8fe4-a511033bb1a4",
            word: "Flammable",
            forms: { adj: "flammable", noun: "flammability" }
        },
        {
            id: "7f39c7f8-34cd-4464-8b69-0375221b8bbe",
            word: "workout",
            forms: { noun: "workout", verb: "work out" }
        }
    ];

    for (const item of updates) {
        const { error } = await supabase
            .from('cards')
            .update({ word_forms: item.forms })
            .eq('id', item.id);
            
        if (error) console.error(`Failed ${item.word}:`, error.message);
    }
    console.log("Batch 3 Complete.");
}

main();
