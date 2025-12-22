import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function main() {
    console.log("Deep Enrichment Batch 4...");

    const updates = [
        {
            id: "06fda1c8-a43d-422f-aa54-a703f6d022f1",
            word: "Optional",
            forms: { adj: "optional", adv: "optionally", noun: "option", verb: "opt" }
        },
        {
            id: "55d0f824-bbd5-4296-aeb8-a30f04088537",
            word: "stout",
            forms: { adj: "stout", adv: "stoutly", noun: "stoutness" }
        },
        {
            id: "3c2a7f6f-6ada-4653-b7c6-f491a40a79fb",
            word: "Foolhardy",
            forms: { adj: "foolhardy", noun: "foolhardiness", adv: "foolhardily" }
        },
        {
            id: "6fcd8d34-9d47-4dcd-840b-0ecaff627d23",
            word: "Lethal",
            forms: { adj: "lethal", adv: "lethally", noun: "lethality" }
        },
        {
            id: "30380380-cdf3-455b-be71-2239eefe2982",
            word: "deep end",
            forms: { noun: "deep end" }
        },
        {
            id: "14a10095-d5dc-43ac-a637-efab90d6f953",
            word: "Offensive",
            forms: { adj: "offensive", adv: "offensively", noun: "offense", verb: "offend" }
        },
        {
            id: "752a4626-ff73-4ca8-919f-d4cbff787dfe",
            word: "Casual",
            forms: { adj: "casual", adv: "casually", noun: "casualness" }
        },
        {
            id: "45e6536c-2748-41af-bae6-260019f75055",
            word: "Permanent",
            forms: { adj: "permanent", adv: "permanently", noun: "permanence" }
        },
        {
            id: "e9340974-e262-4906-b866-b257d380f7f3",
            word: "Instant",
            forms: { adj: "instant", adv: "instantly", noun: "instant" }
        },
        {
            id: "168e3417-1a8c-4a9d-bc24-8c0355db0cb3",
            word: "Scapegoat",
            forms: { noun: "scapegoat", verb: "scapegoat", past: "scapegoated", pp: "scapegoated" }
        },
        {
            id: "b98ec7b3-f84f-43a6-afd7-2a96f044896b",
            word: "Beneficial",
            forms: { adj: "beneficial", adv: "beneficially", noun: "benefit", verb: "benefit", past: "benefited", pp: "benefited" }
        },
        {
            id: "e87efc10-d06b-4ed5-bddf-5bb0a66b48d8",
            word: "Weirdo / Creep",
            forms: { noun: "weirdo", adj: "weird", adv: "weirdly" }
        },
        {
            id: "1ed7c94a-1f56-4ca9-8d4d-c7765e7e1bc0",
            word: "disorder",
            forms: { noun: "disorder", verb: "disorder", past: "disordered", pp: "disordered", adj: "disorderly" }
        },
        {
            id: "59bcb0ee-255e-4cf5-9400-d11161d980e3",
            word: "agile",
            forms: { adj: "agile", adv: "agilely", noun: "agility" }
        },
        {
            id: "9aceb02d-6843-4d60-b8f2-351d5a4351a6",
            word: "mouth water",
            forms: { adj: "mouth-watering", verb: "mouth water" }
        },
        {
            id: "2a86b598-e555-4093-8173-21efab244d88",
            word: "Gradual",
            forms: { adj: "gradual", adv: "gradually", noun: "gradualness" }
        },
        {
            id: "928bd593-2861-451f-8e08-3cfd12d3799f",
            word: "Conservative",
            forms: { adj: "conservative", adv: "conservatively", noun: "conservation", verb: "conserve", past: "conserved", pp: "conserved" }
        },
        {
            id: "f01d7149-3be7-4ffa-9fbe-05f669d36321",
            word: "supple",
            forms: { adj: "supple", adv: "supply", noun: "suppleness" }
        },
        {
            id: "6b6d008b-553f-4f35-abbd-269ce718cac1",
            word: "Cut someone off",
            forms: { verb: "cut off", past: "cut off", pp: "cut off" }
        },
        {
            id: "4cdc55ab-ef43-4f23-a922-5283ba072625",
            word: "Formal",
            forms: { adj: "formal", adv: "formally", noun: "formality", verb: "formalize", past: "formalized", pp: "formalized" }
        },
        {
            id: "582d9499-af69-4dec-9eed-e09a69f06a6f",
            word: "Nepotism",
            forms: { noun: "nepotism", adj: "nepotistic" }
        },
        {
            id: "af4e7f89-43e5-47cf-9815-4a7b7b55ec97",
            word: "Unconventional",
            forms: { adj: "unconventional", adv: "unconventionally", noun: "unconventionality" }
        },
        {
            id: "db5473eb-8b19-4b13-bbae-27ea8250bdab",
            word: "Get flustered",
            forms: { verb: "fluster", noun: "fluster", past: "flustered", pp: "flustered", adj: "flustered" }
        },
        {
            id: "efd10ec6-8427-4299-9be2-95d0e797016e",
            word: "Splurge",
            forms: { noun: "splurge", verb: "splurge", past: "splurged", pp: "splurged" }
        },
        {
            id: "5b17d2c2-fd5f-4624-ad3d-742bcc19e645",
            word: "Sudden",
            forms: { adj: "sudden", adv: "suddenly", noun: "suddenness" }
        },
        {
            id: "2780cbbd-c367-4c6f-a3da-3d8eda69a6ff",
            word: "Lose the argument",
            forms: { verb: "lose", past: "lost", pp: "lost" }
        },
        {
            id: "1f630f47-63fa-4024-a3c0-7fd5b0f85029",
            word: "Accidental",
            forms: { adj: "accidental", adv: "accidentally", noun: "accident" }
        },
        {
            id: "ef1a8fca-af55-4379-a2ea-8f175fad8787",
            word: "charisma",
            forms: { noun: "charisma", adj: "charismatic", adv: "charismatically" }
        },
        {
            id: "965d4c9d-cda0-491f-9a0e-a252d7b8c9b9",
            word: "Deliberate",
            forms: { adj: "deliberate", adv: "deliberately", noun: "deliberation", verb: "deliberate", past: "deliberated", pp: "deliberated" }
        },
        {
            id: "d3ebb973-eccb-404c-bbb1-50c9ff243d4a",
            word: "sluggish",
            forms: { adj: "sluggish", adv: "sluggishly", noun: "sluggishness" }
        },
        {
            id: "bef24a5b-5aa9-4d69-b69f-6a8b81eb6309",
            word: "Abstract",
            forms: { adj: "abstract", adv: "abstractly", noun: "abstraction", verb: "abstract", past: "abstracted", pp: "abstracted" }
        },
        {
            id: "27439e78-fbce-4ba7-b93d-bbb853dd64b2",
            word: "Venture",
            forms: { noun: "venture", verb: "venture", past: "ventured", pp: "ventured" }
        },
        {
            id: "7c3fea71-f16b-4f7c-afbd-6ab28073355a",
            word: "confide",
            forms: { noun: "confidence", verb: "confide", past: "confided", pp: "confided", adj: "confidential" }
        },
        {
            id: "9e03efd4-20b8-4120-85fe-2e049cc88140",
            word: "Vial",
            forms: { noun: "vial" }
        },
        {
            id: "a6d58083-921f-42fd-8ded-e0bdf8359b38",
            word: "Conventional",
            forms: { adj: "conventional", adv: "conventionally", noun: "convention", verb: "conventionalize" }
        },
        {
            id: "f6c98dad-297b-4c43-bc5c-8ce7e9abbb2a",
            word: "Ire",
            forms: { noun: "ire", adj: "irate" }
        },
        {
            id: "18c83666-4954-4979-a232-4d6450f61f7e",
            word: "stiff",
            forms: { adj: "stiff", adv: "stiffly", noun: "stiffness", verb: "stiffen", past: "stiffened", pp: "stiffened" }
        },
        {
            id: "2915a702-806c-41b1-b74b-b5d7efec947b",
            word: "Authentic",
            forms: { adj: "authentic", adv: "authentically", noun: "authenticity", verb: "authenticate", past: "authenticated", pp: "authenticated" }
        },
        {
            id: "9524dd19-5dd4-4d29-a0f3-783b43461109",
            word: "Artificial",
            forms: { adj: "artificial", adv: "artificially", noun: "artificiality" }
        },
        {
            id: "2905b839-97bd-47e6-86f2-424c15a8f231",
            word: "Natural",
            forms: { adj: "natural", adv: "naturally", noun: "nature", verb: "naturalize", past: "naturalized", pp: "naturalized" }
        },
        {
            id: "3c22cfd9-df6a-466c-8db9-28da70e0fade",
            word: "raked",
            forms: { noun: "rake", verb: "rake", past: "raked", pp: "raked" }
        },
        {
            id: "8c0e1f1f-9a0f-4580-91d1-1d3bfb5ca220",
            word: "Concrete",
            forms: { adj: "concrete", adv: "concretely", noun: "concrete" }
        },
        {
            id: "d11fceba-d7f1-4cd9-9145-43ae96c734fc",
            word: "Primitive",
            forms: { adj: "primitive", adv: "primitively", noun: "primitiveness" }
        },
        {
            id: "ddfc58d2-5c40-4889-ae9c-d776142e921b",
            word: "One-upmanship",
            forms: { noun: "one-upmanship" }
        },
        {
            id: "ac6fc36e-1828-45f0-9d5a-5e137e6e622d",
            word: "devise",
            forms: { noun: "device", verb: "devise", past: "devised", pp: "devised" }
        },
        {
            id: "df888d4f-7d82-4850-a203-45142f565d4a",
            word: "bend",
            forms: { adj: "bent", noun: "bend", verb: "bend", past: "bent", pp: "bent" }
        },
        {
            id: "f232bb54-31f5-47c6-b338-93ff68201e43",
            word: "disclose",
            forms: { noun: "disclosure", verb: "disclose", past: "disclosed", pp: "disclosed" }
        },
        {
            id: "743ccaae-07ae-4eba-bbdc-fb27764d0dbe",
            word: "strenuous",
            forms: { adj: "strenuous", adv: "strenuously", noun: "strenuousness" }
        },
        {
            id: "dc3231d0-53a0-4c38-a768-10554a78dab6",
            word: "Sophisticated",
            forms: { adj: "sophisticated", adv: "sophisticatedly", noun: "sophistication" }
        },
        {
            id: "7a4fb4e0-cec3-4124-aecd-8b2bdfa70e79",
            word: "Weasel out",
            forms: { verb: "weasel out", past: "weaseled out", pp: "weaseled out" }
        },
        {
            id: "c64f69ad-b315-477f-9970-f719e3646028",
            word: "burglar",
            forms: { noun: "burglary", verb: "burgle", past: "burgled", pp: "burgled" }
        },
        {
            id: "a79e1373-9e91-4097-8fdf-3a11962274d3",
            word: "loosen up",
            forms: { verb: "loosen up", past: "loosened up", pp: "loosened up" }
        },
        {
            id: "8073d6db-d67c-485d-ae61-ec6a2b0de503",
            word: "Gossip",
            forms: { noun: "gossip", verb: "gossip", past: "gossiped", pp: "gossiped" }
        },
        {
            id: "15252b7e-58f3-4035-a7d4-fd619d2c91f0",
            word: "stumpy",
            forms: { adj: "stumpy", noun: "stumpiness" }
        },
        {
            id: "35e433e4-7847-4ab7-a714-d56e0325c6dc",
            word: "endowed",
            forms: { adj: "endowed", noun: "endowment", verb: "endow", past: "endowed", pp: "endowed" }
        },
        {
            id: "e22df8cd-5fe1-4187-9434-3cb4eaaf897e",
            word: "handkerchief",
            forms: { noun: "handkerchief" }
        },
        {
            id: "eb58f796-af2d-481b-b224-d6343e3c00e9",
            word: "brimmed",
            forms: { noun: "brim", verb: "brim", past: "brimmed", pp: "brimmed" }
        },
        {
            id: "1e602709-6709-4ce3-9af5-cae3b544395e",
            word: "Greedy",
            forms: { adj: "greedy", adv: "greedily", noun: "greed" }
        },
        {
            id: "37e3a43e-1b96-465e-9639-1c54065a62b7",
            word: "Blunt",
            forms: { adj: "blunt", adv: "bluntly", noun: "bluntness", verb: "blunt", past: "blunted", pp: "blunted" }
        },
        {
            id: "58e0b5af-988e-4a57-be2c-f9f1e4b864ca",
            word: "Take lightly",
            forms: { verb: "take lightly", past: "took lightly", pp: "taken lightly" }
        },
        {
            id: "8d56b93c-378c-477c-9798-94027ee4bf1b",
            word: "Get off scot-free",
            forms: { verb: "get off scot-free", past: "got off scot-free", pp: "gotten off scot-free" }
        },
        {
            id: "b1edff39-15b0-42a8-9de8-13ba891e9704",
            word: "Turn the tables",
            forms: { verb: "turn the tables", past: "turned the tables", pp: "turned the tables" }
        },
        {
            id: "15f6b397-4fc6-46fe-9f53-02f37aff831e",
            word: "dedication",
            forms: { adj: "dedicated", noun: "dedication", verb: "dedicate", past: "dedicated", pp: "dedicated" }
        },
        {
            id: "5d548ec5-5a60-44dd-8daf-8bad052de5eb",
            word: "relentless",
            forms: { adj: "relentless", adv: "relentlessly", noun: "relentlessness" }
        },
        {
            id: "0e8eaa40-2f21-4cdd-a233-b534b98193f0",
            word: "Notwithstanding",
            forms: { adv: "notwithstanding" }
        },
        {
            id: "8f4dbb34-3345-4b5f-a3d4-1312500d9781",
            word: "Hostile",
            forms: { adj: "hostile", adv: "hostilely", noun: "hostility" }
        },
        {
            id: "00425c1c-0414-4c33-891c-d66a39f815fe",
            word: "constant",
            forms: { adj: "constant", adv: "constantly", noun: "constancy" }
        },
        {
            id: "775d51a5-a07d-4b03-a02d-2a12788bc041",
            word: "eavesdrop",
            forms: { noun: "eavesdropper", verb: "eavesdrop", past: "eavesdropped", pp: "eavesdropped" }
        },
        {
            id: "eda71cb6-8da4-4871-b41b-c625991aa096",
            word: "Sentiment",
            forms: { adj: "sentimental", adv: "sentimentally", noun: "sentiment" }
        },
        {
            id: "1a9cc6cb-ffd1-4383-8590-1e8d69cc9cf2",
            word: "recurrent",
            forms: { adj: "recurrent", adv: "recurrently", noun: "recurrence", verb: "recur", past: "recurred", pp: "recurred" }
        },
        {
            id: "8aca4e66-f21b-4615-b074-1dea3cf7ad26",
            word: "Stubborn",
            forms: { adj: "stubborn", adv: "stubbornly", noun: "stubbornness" }
        },
        {
            id: "a077fd6a-2b22-4ff1-995f-cb57954f2a43",
            word: "Hubris",
            forms: { adj: "hubristic", noun: "hubris" }
        },
        {
            id: "81eaa1e5-ef5a-43b7-a771-d3503300cf97",
            word: "Scowling",
            forms: { noun: "scowl", verb: "scowl", past: "scowled", pp: "scowled" }
        },
        {
            id: "b959384b-fb73-41d0-a352-322319f4d71a",
            word: "Heralds",
            forms: { noun: "herald", verb: "herald", past: "heralded", pp: "heralded" }
        },
        {
            id: "352e3f53-553a-45b0-9dfd-ec8f84c4b48c",
            word: "sprint",
            forms: { noun: "sprint", verb: "sprint", past: "sprinted", pp: "sprinted" }
        },
        {
            id: "e275249b-ccd2-4753-a72d-ca682fdb99ee",
            word: "pulls her weight",
            forms: { verb: "pull", past: "pulled", pp: "pulled" }
        },
        {
            id: "eed681c4-b804-4450-a68a-18de73d2cf4e",
            word: "flushed",
            forms: { adj: "flushed", noun: "flush", verb: "flush", past: "flushed", pp: "flushed" }
        },
        {
            id: "df498917-7971-4f20-8929-c3935b07b303",
            word: "subdued",
            forms: { adj: "subdued", verb: "subdue", past: "subdued", pp: "subdued" }
        },
        {
            id: "cc85b5fe-e7af-44f1-9585-efea68056c9d",
            word: "Clean slate",
            forms: { noun: "clean slate" }
        },
        {
            id: "a985249c-adc7-4817-9e57-37e203eddf20",
            word: "view",
            forms: { noun: "view", verb: "view", past: "viewed", pp: "viewed" }
        },
        {
            id: "22322435-7af0-472d-bc7d-f70728374f22",
            word: "lead sb astray",
            forms: { verb: "lead astray", past: "led astray", pp: "led astray" }
        },
        {
            id: "015d7041-8e09-45e6-a65c-a5f7bc031843",
            word: "narrator",
            forms: { noun: "narrator", verb: "narrate", past: "narrated", pp: "narrated", noun2: "narration" }
        },
        {
            id: "a7983650-483a-419e-b322-9a47802cda2a",
            word: "Courtesy",
            forms: { adj: "courteous", adv: "courteously", noun: "courtesy" }
        },
        {
            id: "bf928ac5-c531-4d4a-9f03-a580080a511a",
            word: "rattle",
            forms: { adj: "rattled", noun: "rattle", verb: "rattle", past: "rattled", pp: "rattled" }
        },
        {
            id: "06f7bc57-6860-414f-956d-9eca70880fae",
            word: "rumble",
            forms: { noun: "rumble", verb: "rumble", past: "rumbled", pp: "rumbled" }
        },
        {
            id: "ef18f91d-35a5-4ba4-912a-5effc2c6d2d3",
            word: "rustle",
            forms: { adj: "rustling", noun: "rustle", verb: "rustle", past: "rustled", pp: "rustled" }
        },
        {
            id: "dcb6d3ac-087c-4072-bd70-09cd8070b04c",
            word: "presentation",
            forms: { noun: "presentation", verb: "present", past: "presented", pp: "presented", adj: "presentable" }
        },
        {
            id: "4ac7f231-2b11-49ff-90f2-b371b053c180",
            word: "splash",
            forms: { adj: "splashy", noun: "splash", verb: "splash", past: "splashed", pp: "splashed" }
        },
        {
            id: "d6cabff6-9f0a-4b96-884b-688a9ef744fb",
            word: "impact",
            forms: { noun: "impact", verb: "impact", past: "impacted", pp: "impacted" }
        }
    ];

    for (const item of updates) {
        const { error } = await supabase
            .from('cards')
            .update({ word_forms: item.forms })
            .eq('id', item.id);
            
        if (error) console.error(`Failed ${item.word}:`, error.message);
    }
    console.log("Batch 4 Complete.");
}

main();
