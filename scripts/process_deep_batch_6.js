import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function main() {
    console.log("Deep Enrichment Batch 6...");

    const updates = [
        { id: "6a10ed95-a0c2-466f-a3ba-bafbef6249d6", word: "Deafening", forms: { adj: "deafening", adv: "deafeningly", verb: "deafen", past: "deafened", pp: "deafened" } },
        { id: "d5c68619-9225-4a15-9e35-b073b648436c", word: "Inquisitive", forms: { adj: "inquisitive", adv: "inquisitively", noun: "inquisitiveness" } },
        { id: "3a695088-327c-4eba-9733-57ade8ef813a", word: "Ubiquitous", forms: { adj: "ubiquitous", adv: "ubiquitously", noun: "ubiquity" } },
        { id: "5591a348-3402-4e29-bc30-41846378e4f0", word: "Dazzling", forms: { adj: "dazzling", adv: "dazzlingly", verb: "dazzle", past: "dazzled", pp: "dazzled" } },
        { id: "3c86168e-b4cc-40b6-adba-2e851337375d", word: "Versatility", forms: { adj: "versatile", adv: "versatilely", noun: "versatility" } },
        { id: "d6c241a1-96f7-4fbc-80b4-afbfc8e44bc0", word: "Remorse", forms: { adj: "remorseful", adv: "remorsefully", noun: "remorse" } },
        { id: "24c57fc1-44a4-4ade-b98f-14a0b920a9be", word: "Pull my leg", forms: { verb: "pull", past: "pulled", pp: "pulled" } },
        { id: "f0561fbb-42ef-4ffe-b18b-96ec168ce355", word: "Constituents", forms: { adj: "constituent", noun: "constituent" } },
        { id: "6ab49ce0-19c2-4f4d-969a-07ca3e386f0d", word: "Haughtily", forms: { adj: "haughty", adv: "haughtily", noun: "haughtiness" } },
        { id: "e507d6f6-a9f9-470f-bb63-60d28ace9450", word: "Anonymity", forms: { adj: "anonymous", adv: "anonymously", noun: "anonymity" } },
        { id: "6ab5f5e2-063e-446c-a6cf-4266913ac84d", word: "Indigenous", forms: { adj: "indigenous", adv: "indigenously", noun: "indigeneity" } },
        { id: "0f6286cd-0c8e-484f-ab6b-b605d610c18f", word: "Ambivalent", forms: { adj: "ambivalent", adv: "ambivalently", noun: "ambivalence" } },
        { id: "e62a9c6a-498a-4be5-8ec3-7bbed0140046", word: "cliquey", forms: { adj: "cliquey", noun: "clique" } },
        { id: "35daf9c0-02ed-4c97-8ab5-245b134b7fee", word: "Huff", forms: { adj: "huffy", noun: "huff", verb: "huff", past: "huffed", pp: "huffed" } },
        { id: "1aaf324c-4f3a-4811-a11b-fa38c649a6d9", word: "captivating", forms: { adj: "captivating", noun: "captivation", verb: "captivate", past: "captivated", pp: "captivated" } },
        { id: "4ec98abd-3f68-4c05-8279-e470927e6158", word: "indolent", forms: { adj: "indolent", adv: "indolently", noun: "indolence" } },
        { id: "61a82d49-2c8e-4b98-9e45-1b5a3f5f148c", word: "Behest", forms: { noun: "behest" } },
        { id: "f316feca-8a6d-4577-8c94-fb1d01d40dba", word: "Enticing", forms: { adj: "enticing", adv: "enticingly", verb: "entice", past: "enticed", pp: "enticed" } },
        { id: "2f02ea1c-4d2b-415b-9c89-4079c28e3fa5", word: "Waddling", forms: { noun: "waddle", verb: "waddle", past: "waddled", pp: "waddled" } },
        { id: "81bb653c-35e7-48f4-a5f1-1748562012db", word: "still (motionless)", forms: { adj: "still", adv: "still", noun: "stillness" } },
        { id: "407adc3a-ca8e-408a-84c4-d478f1cf5a61", word: "implement", forms: { adj: "implementable", noun: "implementation", verb: "implement", past: "implemented", pp: "implemented" } },
        { id: "df9cc182-98e1-4647-aabb-7097e6cb749c", word: "leaked", forms: { adj: "leaky", noun: "leak", verb: "leak", past: "leaked", pp: "leaked" } },
        { id: "9cafaeff-d71a-4951-b650-b8c02fc05790", word: "Inquisition", forms: { adj: "inquisitive", noun: "inquisition", verb: "inquire" } },
        { id: "7e41bab6-49ff-43ef-88e4-2b97b16ef800", word: "Muttered", forms: { noun: "mutter", verb: "mutter", past: "muttered", pp: "muttered" } },
        { id: "77c3473b-48a3-46c5-a46a-11a9d6e21718", word: "Pavilion", forms: { noun: "pavilion" } },
        { id: "12fef8aa-52f2-4527-b8c0-266622363c9d", word: "Torrential", forms: { adj: "torrential", noun: "torrent" } },
        { id: "02cd1c21-d8c2-47f8-b265-164bc571b074", word: "Substantially", forms: { adj: "substantial", adv: "substantially", noun: "substance" } },
        { id: "708f6827-42bd-4486-90b5-043cd1e565ae", word: "Frowned", forms: { noun: "frown", verb: "frown", past: "frowned", pp: "frowned" } },
        { id: "555383c4-d6a3-4733-a5aa-c0f20f508f8f", word: "flooding", forms: { noun: "flooding", verb: "flood", past: "flooded", pp: "flooded" } },
        { id: "97bd39d8-ed99-4624-a28c-e3b3ffd4e7ff", word: "Conservation", forms: { noun: "conservation", verb: "conserve", past: "conserved", pp: "conserved" } },
        { id: "cae59ecf-70f9-45c5-8468-34d93d4b7e2c", word: "Banditry", forms: { noun: "bandit" } },
        { id: "36c51975-72be-4c90-9272-8cf54b9d3572", word: "Waning", forms: { adj: "waning", verb: "wane", past: "waned", pp: "waned" } },
        { id: "5e6d091e-858a-4301-8b48-f9f8403fae74", word: "Bomb", forms: { noun: "bomb", verb: "bomb", past: "bombed", pp: "bombed" } },
        { id: "5c2c5bee-def3-4aa3-87b4-d2767bc5d74a", word: "salience", forms: { adj: "salient", noun: "salience" } },
        { id: "74fe2620-86c7-438f-aba7-8c98973cb7fe", word: "Flee", forms: { noun: "flight", verb: "flee", past: "fled", pp: "fled" } },
        { id: "185296a9-aaa3-458b-a419-1f56a75b9117", word: "Slung", forms: { verb: "sling", past: "slung", pp: "slung" } },
        { id: "e678ed77-3efb-441d-9ee8-fcdf6a37887c", word: "assertion", forms: { noun: "assertion", verb: "assert", past: "asserted", pp: "asserted" } },
        { id: "37068f6b-a5b8-40a0-a1b3-0a50b5e2c40d", word: "recede", forms: { noun: "recession", verb: "recede", past: "receded", pp: "receded" } },
        { id: "871ebb8e-9b1d-4636-8c26-a767074f5163", word: "condemnation", forms: { noun: "condemnation", verb: "condemn", past: "condemned", pp: "condemned" } },
        { id: "64dc7585-8105-4a06-bea1-bc6c6749b7aa", word: "monolithic", forms: { adj: "monolithic", noun: "monolith" } },
        { id: "64894ce6-5130-4b19-aad6-37c1b5f6ee67", word: "missed the bus", forms: { verb: "miss", past: "missed", pp: "missed" } },
        { id: "2aec769a-1bdf-4a3f-962b-0202fe1bdfd5", word: "Gutters", forms: { noun: "gutter" } },
        { id: "241d0372-a020-44ff-b966-523c18eb7cf2", word: "break the deadlock", forms: { verb: "break", past: "broke", pp: "broken" } },
        { id: "a54ff740-9bc4-4fa8-a0f4-f2257891597e", word: "Lavish", forms: { adj: "lavish", adv: "lavishly", noun: "lavishness", verb: "lavish", past: "lavished", pp: "lavished" } },
        { id: "7eef7e2c-e7a2-4c4c-a5f3-ea83b99676cf", word: "Frowned", forms: { noun: "frown", verb: "frown", past: "frowned", pp: "frowned" } },
        { id: "cd41cf5d-a020-4658-b52d-78b3d189da4e", word: "spam", forms: { noun: "spam", verb: "spam", past: "spammed", pp: "spammed" } },
        { id: "191386a3-95ab-45b4-8a13-0eadfc788aa7", word: "outlined", forms: { noun: "outline", verb: "outline", past: "outlined", pp: "outlined" } },
        { id: "4747acc1-0bc4-4a67-9f57-a90432e3c9bc", word: "Enticing", forms: { adj: "enticing", adv: "enticingly", verb: "entice", past: "enticed", pp: "enticed" } },
        { id: "b922958d-f9e4-4f4a-911d-5ed26367d353", word: "pool our resources", forms: { verb: "pool", past: "pooled", pp: "pooled" } },
        { id: "e5431ced-6800-407f-a3f6-00a4a19d0165", word: "condone", forms: { verb: "condone", past: "condoned", pp: "condoned" } },
        { id: "5e1ed4cb-78da-4908-b414-4a11baa99a6c", word: "Tyrant", forms: { adj: "tyrannical", noun: "tyrant" } },
        { id: "55df23ed-8827-42d3-846a-05dd7cdca84d", word: "Unyielding", forms: { adj: "unyielding", verb: "yield", past: "yielded", pp: "yielded" } },
        { id: "22dff34a-d84b-49e0-8f42-3150a62eb72c", word: "Lair", forms: { noun: "lair" } },
        { id: "467657aa-5ea2-4462-80ab-c31e76a521b0", word: "eradicate", forms: { noun: "eradication", verb: "eradicate", past: "eradicated", pp: "eradicated" } },
        { id: "51a9a1f5-42dd-44a4-943f-a9c21eac997e", word: "Crass", forms: { adj: "crass", noun: "crassness" } },
        { id: "0f5b1726-69ab-44c0-9e8d-2d1a0c94a999", word: "hack into", forms: { verb: "hack", past: "hacked", pp: "hacked" } },
        { id: "4962520e-5ab8-459e-bb81-182c38fc66bb", word: "be uprooted", forms: { verb: "uproot", past: "uprooted", pp: "uprooted" } },
        { id: "be5c2454-58ad-4774-8b29-bfcd1362fc83", word: "Reputation", forms: { adj: "reputable", noun: "reputation" } },
        { id: "ff6639a7-7f8f-43d2-a082-32a125a4457f", word: "deteriorate", forms: { noun: "deterioration", verb: "deteriorate", past: "deteriorated", pp: "deteriorated" } },
        { id: "45d4ee42-6ef9-44eb-a1a3-17a3e3e8f8d7", word: "interrogation", forms: { noun: "interrogation", verb: "interrogate", past: "interrogated", pp: "interrogated" } },
        { id: "08a74700-4108-4829-af77-dde6f4ffb443", word: "stir", forms: { noun: "stir", verb: "stir", past: "stirred", pp: "stirred" } },
        { id: "12f82455-194f-4fda-9db5-4b25a6c96cd5", word: "restrict", forms: { adj: "restrictive", noun: "restriction", verb: "restrict", past: "restricted", pp: "restricted" } },
        { id: "e5ef57fc-6cb6-40ce-8e80-4f340311fcc7", word: "vaccine", forms: { noun: "vaccination", verb: "vaccinate", past: "vaccinated", pp: "vaccinated" } },
        { id: "0aac5f73-c405-4bab-941e-e4068d4d827d", word: "Forges", forms: { noun: "forge", verb: "forge", past: "forged", pp: "forged" } },
        { id: "5c527863-d2e2-499a-9f62-05d26ae7c29e", word: "Mansion", forms: { noun: "mansion" } },
        { id: "4821e6c5-de8b-405d-b778-2951bd48989e", word: "Incline", forms: { noun: "incline", verb: "incline", past: "inclined", pp: "inclined" } },
        { id: "319e7bb8-ca5e-4a6d-8ecc-4d8245a8e523", word: "Intricate", forms: { adj: "intricate", adv: "intricately", noun: "intricacy" } },
        { id: "fa54f1d8-9e57-4e1b-abaa-56affb5bb798", word: "pewter", forms: { noun: "pewter" } },
        { id: "f409d87b-b6ce-4ac5-b182-d4fc9f18aa6b", word: "portrayal", forms: { noun: "portrayal", verb: "portray", past: "portrayed", pp: "portrayed" } },
        { id: "0992e4a0-0407-4235-a7d7-9ce6cb20af5d", word: "Cramped", forms: { adj: "cramped", verb: "cramp", past: "cramped", pp: "cramped" } },
        { id: "56d72a29-d3f0-4c3e-a495-a59b3d666dd5", word: "Brass", forms: { noun: "brass" } },
        { id: "5286fa6b-73a2-46ee-9e32-2627fbdf0231", word: "Stride", forms: { noun: "stride", verb: "stride", past: "strode", pp: "stridden" } },
        { id: "39d0e725-7b36-4849-b8e3-8b22967cc65d", word: "Haul", forms: { noun: "haul", verb: "haul", past: "hauled", pp: "hauled" } },
        { id: "b99cb505-bd36-4b3c-a1d8-86752604619e", word: "Pounded", forms: { noun: "pound", verb: "pound", past: "pounded", pp: "pounded" } },
        { id: "b78dc0e0-a5f0-41ec-8c21-856fecfd5a2f", word: "proactive", forms: { adj: "proactive", adv: "proactively", noun: "proactivity" } },
        { id: "26144646-f330-483b-876d-60e54db00da6", word: "Munched", forms: { verb: "munch", past: "munched", pp: "munched" } },
        { id: "f0c8d95f-765a-43a7-a73f-52eb1b753729", word: "catch sb out", forms: { verb: "catch", past: "caught", pp: "caught" } },
        { id: "c3566ff4-473e-4e9a-8410-ab19b07a9b52", word: "tighten your belt", forms: { verb: "tighten", past: "tightened", pp: "tightened" } },
        { id: "7422f807-84ef-4f81-b220-b0784ea36ac7", word: "Gullible", forms: { adj: "gullible", adv: "gullibly", noun: "gullibility" } },
        { id: "83f725f6-5391-4838-ae13-2849ee34901f", word: "rummaging", forms: { verb: "rummage", past: "rummage", pp: "rummaged" } },
        { id: "52ea8ac7-e195-4d0e-ae9a-dc9ef00d7374", word: "Musingly", forms: { adv: "musingly", verb: "muse", past: "mused", pp: "mused" } },
        { id: "a276aaef-8128-4449-b07a-c19049c9432b", word: "Rivals", forms: { noun: "rival", verb: "rival", past: "rivalled", pp: "rivalled" } },
        { id: "76abcebf-d45f-4261-907f-e96ab3fb6dde", word: "scrutinize", forms: { noun: "scrutiny", verb: "scrutinize", past: "scrutinized", pp: "scrutinized" } },
        { id: "fcf81480-7a04-4749-a752-0d06ff3fed5f", word: "provocative", forms: { adj: "provocative", adv: "provocatively", noun: "provocation", verb: "provoke" } },
        { id: "798c07fe-cc67-478f-962e-72957eb61328", word: "embodiment", forms: { noun: "embodiment", verb: "embody", past: "embodied", pp: "embodied" } },
        { id: "b8130d06-7df9-41f3-ac23-19bfea7023e4", word: "Pondering", forms: { verb: "ponder", past: "pondered", pp: "pondered" } },
        { id: "85e2e739-9e2c-4192-b848-a066b69bbb09", word: "defiance", forms: { adj: "defiant", adv: "defiantly", noun: "defiance", verb: "defy" } },
        { id: "60750c4f-06d5-45ef-abcf-c25dec8ef92f", word: "Grumbling", forms: { noun: "grumble", verb: "grumble", past: "grumbled", pp: "grumbled" } },
        { id: "12116f8f-44d0-40ca-b637-0ee3761a1d28", word: "Punctuated", forms: { noun: "punctuation", verb: "punctuate", past: "punctuated", pp: "punctuated" } },
        { id: "e43c8df5-5d07-42c6-a386-7b81f1f1c185", word: "therapeutic", forms: { adj: "therapeutic", adv: "therapeutically", noun: "therapy" } }
    ];

    for (const item of updates) {
        const { error } = await supabase
            .from('cards')
            .update({ word_forms: item.forms })
            .eq('id', item.id);
            
        if (error) console.error(`Failed ${item.word}:`, error.message);
    }
    console.log("Batch 6 Complete.");
}

main();
