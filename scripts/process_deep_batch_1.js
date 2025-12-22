import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function main() {
    console.log("Deep Enrichment Batch 1 (1-150)...");

    const updates = [
        {
            id: "275b1b4f-8f22-483e-82d0-617ebe56eedb",
            word: "Conjugate",
            forms: { verb: "conjugate", noun: "conjugation", adj: "conjugated", adv: "conjugately", past: "conjugated", pp: "conjugated" }
        },
        {
            id: "667997b8-33e8-42bb-8aaf-ccafc822ecd4",
            word: "arousal",
            forms: { noun: "arousal", verb: "arouse", adj: "aroused", adv: "arousingly", past: "aroused", pp: "aroused" }
        },
        {
            id: "1819ed4b-95bd-4323-a82c-133cbf91d844",
            word: "chair (a meeting)",
            forms: { verb: "chair", noun: "chair", adj: "chaired", past: "chaired", pp: "chaired" }
        },
        {
            id: "ed7b9d85-01bc-4c1a-9a9e-2856702e64ea",
            word: "Restroom",
            forms: { noun: "restroom" } // Pure noun
        },
        {
            id: "07a6c095-ac59-4eec-8ae5-d22070604cb0",
            word: "Change the subject",
            forms: { verb: "change", noun: "change", adj: "changed", past: "changed", pp: "changed" } // Focus on head verb
        },
        {
            id: "9725c9c2-9f4b-4dd3-9ba2-935ec82fc95f",
            word: "repel/fight",
            forms: { verb: "repel", noun: "repulsion", adj: "repellant", adv: "repellantly", past: "repelled", pp: "repelled" }
        },
        {
            id: "31cb22bb-b9f7-4c78-889d-7c7808273be9",
            word: "Night owl",
            forms: { noun: "night owl" }
        },
        {
            id: "d14deffd-4f5e-4bb6-852f-7cb216c2e68e",
            word: "Insomnia",
            forms: { noun: "insomnia", adj: "insomniac" }
        },
        {
            id: "98e40059-ee92-446d-ade4-fb47a744b5b0",
            word: "imbecile",
            forms: { noun: "imbecile", adj: "imbecilic", adv: "imbecilically" }
        },
        {
            id: "ba7aa671-0674-476b-9659-cb0b15ab3e39",
            word: "parlance",
            forms: { noun: "parlance", adj: "parlous" } 
        },
        {
            id: "d7cc2680-68b1-4810-a869-f5fb1739126d",
            word: "depleted",
            forms: { adj: "depleted", verb: "deplete", noun: "depletion", past: "depleted", pp: "depleted" }
        },
        {
            id: "7e5bebc7-0a36-4d20-94b0-07d3b9740e29",
            word: "advent",
            forms: { noun: "advent", adj: "adventitial" }
        },
        {
            id: "bd0604e9-bc3a-4fac-8695-3b1b01956e72",
            word: "recalcitrant",
            forms: { adj: "recalcitrant", noun: "recalcitrance", adv: "recalcitrantly" }
        },
        {
            id: "ee67888b-3a84-4aa4-b61e-5e0c15501b25",
            word: "thus/hence",
            forms: { adv: "thus" }
        },
        {
            id: "8aaa696b-4d42-40ae-b149-8b79645599cb",
            word: "With regard to",
            forms: { noun: "regard", verb: "regard", past: "regarded", pp: "regarded" }
        },
        {
            id: "4cc7d255-260c-40c0-810c-aff6de7c16e5",
            word: "Catch red-handed",
            forms: { verb: "catch", past: "caught", pp: "caught", noun: "catch" }
        },
        {
            id: "078e2ca4-2302-4e36-ae1a-40729a98c6eb",
            word: "Comprise",
            forms: { verb: "comprise", noun: "comprisal", adj: "comprised", past: "comprised", pp: "comprised" }
        },
        {
            id: "d8d93927-f44d-488f-ba57-9ad6fff7bf34",
            word: "Make ends meet",
            forms: { verb: "make", past: "made", pp: "made" }
        },
        {
            id: "e445efa9-588b-424f-aba7-9fc0b24a0fc3",
            word: "Dodge a bullet",
            forms: { verb: "dodge", noun: "dodge", past: "dodged", pp: "dodged" }
        },
        {
            id: "7336721b-71dc-42ac-be9d-663596a7fafb",
            word: "sacrosanct",
            forms: { adj: "sacrosanct", noun: "sacrosanctity", adv: "sacrosanctly" }
        },
        {
            id: "8cc56c2e-a7a0-4dc3-bcb5-d6e62366d433",
            word: "Make an appointment",
            forms: { verb: "appoint", noun: "appointment", adj: "appointed", past: "appointed", pp: "appointed" }
        },
        {
            id: "0e1e087b-01f3-4e54-8fb1-cefc64834742",
            word: "conceal sth",
            forms: { verb: "conceal", noun: "concealment", adj: "concealed", past: "concealed", pp: "concealed", adv: "concealingly" }
        },
        {
            id: "e043b666-f8db-404e-9bb9-3c08aca92ee9",
            word: "guideline",
            forms: { noun: "guideline", verb: "guide", adj: "guided", past: "guided", pp: "guided" }
        },
        {
            id: "021af7b0-b5e8-44a6-b69b-2a2e9cde80d1",
            word: "solicitor",
            forms: { noun: "solicitor", verb: "solicit", noun_process: "solicitation", adj: "solicitous", past: "solicited", pp: "solicited" }
        },
        {
            id: "a50ca1f5-cc14-4867-8a84-7efe354a0794",
            word: "Contagious",
            forms: { adj: "contagious", noun: "contagion", adv: "contagiously" }
        },
        {
            id: "1fd925fa-06f7-4250-8c01-a91b7cc4e64f",
            word: "Pig-headed",
            forms: { adj: "pig-headed", noun: "pig-headedness", adv: "pig-headedly" }
        },
        {
            id: "9b4bcd87-4af0-4f3b-8ee7-c1f4e6c058ae",
            word: "Scalp",
            forms: { noun: "scalp", verb: "scalp", past: "scalped", pp: "scalped" }
        },
        {
            id: "291041b2-ec8a-4223-bb93-1b08056603f7",
            word: "Bluff",
            forms: { noun: "bluff", verb: "bluff", past: "bluffed", pp: "bluffed" }
        },
        {
            id: "d0c72665-5ca0-49ed-86a3-d6c190adc885",
            word: "Mutter",
            forms: { verb: "mutter", noun: "mutter", past: "muttered", pp: "muttered", adv: "mutteringly" }
        },
        {
            id: "ee7a3d5c-da55-46b0-b2c4-a4a45eac9dd2",
            word: "cater",
            forms: { verb: "cater", noun: "catering", past: "catered", pp: "catered" }
        },
        {
            id: "e3be44eb-6ccf-4061-a6ba-ad8f4fc1716e",
            word: "lure",
            forms: { verb: "lure", noun: "lure", adj: "alluring", past: "lured", pp: "lured", adv: "alluringly" }
        },
        {
            id: "9d7ea8c3-83da-4aeb-8b0e-9031ea93c5ad",
            word: "Side effects",
            forms: { noun: "side effect" }
        },
        {
            id: "0c38efb1-6118-4ac6-8490-a5341e5f7d02",
            word: "Wages",
            forms: { noun: "wage", verb: "wage", past: "waged", pp: "waged" }
        },
        {
            id: "17f07831-e7e5-45a3-b21e-3f35d101c491",
            word: "Fend for oneself",
            forms: { verb: "fend", past: "fended", pp: "fended" }
        },
        {
            id: "0e3ea4ca-425d-4de2-8430-559385d12759",
            word: "dampening",
            forms: { verb: "dampen", noun: "dampening", adj: "damp", adv: "damply", past: "dampened", pp: "dampened" }
        },
        {
            id: "ef2137e7-bfd4-4515-9be2-3a5d35904af3",
            word: "remand sb",
            forms: { verb: "remand", noun: "remand", past: "remanded", pp: "remanded" }
        },
        {
            id: "348fc718-2dab-45f7-96d5-558eea5a287a",
            word: "Sagacious",
            forms: { adj: "sagacious", noun: "sagacity", adv: "sagaciously" }
        },
        {
            id: "fa00fb8c-741d-4714-86eb-8c4477be0550", // duplicate criterion
            word: "criterion",
            forms: { noun: "criterion", adj: "criterial" }
        },
        {
            id: "6d8d96c0-53f5-429d-a3eb-cc4129f63b2b",
            word: "Leverage",
            forms: { noun: "leverage", verb: "leverage", past: "leveraged", pp: "leveraged" }
        },
        {
            id: "b5397414-e109-4d0c-8805-c1a8256ee2f0",
            word: "Apathetic",
            forms: { adj: "apathetic", noun: "apathy", adv: "apathetically" }
        },
        {
            id: "de8274f6-900b-41eb-b69a-5d82b39c1298",
            word: "Repercussion",
            forms: { noun: "repercussion", adj: "repercussive" }
        },
        {
            id: "21b53fad-bc19-458b-b683-f9560fd0b5c7",
            word: "Odour",
            forms: { noun: "odour", adj: "odorous", adv: "odorously", adj_neg: "odorless" }
        },
        {
            id: "dac84b70-c83d-42f3-8d9a-67fe0bad81ea",
            word: "Indispensable",
            forms: { adj: "indispensable", noun: "indispensability", adv: "indispensably" }
        },
        {
            id: "e1254b80-87cc-4e14-a352-0ad4c9bf425d",
            word: "Grapple with",
            forms: { verb: "grapple", noun: "grapple", past: "grappled", pp: "grappled" }
        },
        {
            id: "6ed47d06-f654-4d3f-a57d-c82cb0d7c343",
            word: "Precarious",
            forms: { adj: "precarious", noun: "precariousness", adv: "precariously" }
        },
        {
            id: "a42ecf60-afe5-459d-8d2d-b06b8ce68a6b",
            word: "Unless",
            forms: {} // Conjunction
        },
        {
            id: "6e09e69d-bbf3-4013-b549-61bc85d45337",
            word: "Evaporates",
            forms: { verb: "evaporate", noun: "evaporation", adj: "evaporative", past: "evaporated", pp: "evaporated" }
        },
        {
            id: "f32df88c-1b47-419b-a7b6-8fc379978eb0",
            word: "Timid",
            forms: { adj: "timid", noun: "timidity", adv: "timidly" }
        },
        {
            id: "73271777-4c02-41fa-b280-f2b4fdae66d5",
            word: "Cynical",
            forms: { adj: "cynical", noun: "cynicism", adv: "cynically" }
        },
        {
            id: "fe270e3a-7bc4-404a-9447-f570bba14983",
            word: "gesture",
            forms: { noun: "gesture", verb: "gesture", adj: "gestural", past: "gestured", pp: "gestured" }
        },
        {
            id: "0415becf-be83-4807-b3e4-b060e100b1d8",
            word: "Opaque",
            forms: { adj: "opaque", noun: "opacity", adv: "opaquely" }
        },
        {
            id: "bd4f7b0a-5400-4274-b817-6af707ea6eb4",
            word: "Sabotage",
            forms: { verb: "sabotage", noun: "sabotage", adj: "sabotaged", past: "sabotaged", pp: "sabotaged" }
        },
        {
            id: "5d68d6bf-ae9b-4375-81f8-729d08eb2205",
            word: "self-contained",
            forms: { adj: "self-contained", noun: "self-containment" }
        },
        {
            id: "1ed043de-c0a7-48f6-b032-65846f79d4c0",
            word: "readily",
            forms: { adv: "readily", adj: "ready", noun: "readiness" }
        },
        {
             id: "75496ce7-909b-4d38-9b3d-ba92e1dd7577",
             word: "Integrity",
             forms: { noun: "integrity", adj: "integral", adv: "integrally" }
        },
        {
            id: "ab3aa05c-e1f2-45b4-b861-1012d5ad2e9e",
            word: "Pungent",
            forms: { adj: "pungent", noun: "pungency", adv: "pungently" }
        },
        {
            id: "a9e37bb3-71cc-40a9-8652-d988563f1d5d",
            word: "Cursory",
            forms: { adj: "cursory", adv: "cursorily", noun: "cursoriness" }
        },
        {
            id: "a941156c-7323-4310-b72a-bc81c4a01c87",
            word: "Bullish",
            forms: { adj: "bullish", adv: "bullishly", noun: "bullishness" }
        },
        {
            id: "331f61a5-25f3-47ef-b1f7-228dc3db09b7",
            word: "Outperform",
            forms: { verb: "outperform", noun: "outperformance", past: "outperformed", pp: "outperformed" }
        },
        {
            id: "207e8859-94f6-441a-818c-175968125faa",
            word: "the draft",
            forms: { noun: "draft", verb: "draft", past: "drafted", pp: "drafted" }
        },
        {
            id: "701ce627-740e-4a88-b5cf-82ebc2f49400",
            word: "Reimburse",
            forms: { verb: "reimburse", noun: "reimbursement", past: "reimbursed", pp: "reimbursed" }
        },
        {
            id: "b9ab1579-fc4e-44f9-994e-66d515c036ff",
            word: "Longevity",
            forms: { noun: "longevity", adj: "long", adv: "long" }
        },
        {
            id: "5b648181-702a-45d0-84be-e3c81970eaed",
            word: "rampant",
            forms: { adj: "rampant", noun: "rampancy", adv: "rampantly" }
        },
        {
            id: "58ca8832-9645-422f-9124-7271995fb08d",
            word: "eye contact",
            forms: { noun: "eye contact" }
        },
        {
            id: "0eadf7fd-e61c-44ae-96b0-942b09ad3a98",
            word: "Granted that",
            forms: { verb: "grant", past: "granted", pp: "granted", noun: "grant" }
        },
        {
            id: "48f64eab-86fe-4c34-81a6-4460108ee313",
            word: "Fabricate", // "noun": "fabrication"
            forms: { verb: "fabricate", noun: "fabrication", adj: "fabricated", past: "fabricated", pp: "fabricated" }
        }
    ];

    for (const item of updates) {
        // Merge with existing would be nice, but here we overwrite to ensure consistency for the requested fields
        const { error } = await supabase
            .from('cards')
            .update({ word_forms: item.forms })
            .eq('id', item.id);
            
        if (error) console.error(`Failed ${item.word}:`, error.message);
        // else console.log(`Enriched: ${item.word}`);
    }
    console.log("Batch 1 Complete.");
}

main();
