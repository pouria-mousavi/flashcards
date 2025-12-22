import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function main() {
    console.log("Applying Static Word Forms (Batch 18 - Internal Processing - 200 items)...");

    const updates = [
        // 201-220
        { id: "b06f91e9-44b9-4dca-84d1-eeb266b5b8bc", word: "stand still", forms: {} },
        { id: "4085a6f4-95e9-4bae-a6dd-94894d09fcec", word: "eye sb", forms: { verb: "eye" } },
        { id: "32e1d754-ecce-4404-8b21-65b4cb540d1d", word: "warily", forms: { adv: "warily", adj: "wary" } },
        { id: "e5ce5a0b-1b36-489d-a341-efba6eeed4f0", word: "vanish into thin air", forms: {} },
        { id: "be8cba32-4c52-454c-90ae-93329e362fa4", word: "catch a glimpse", forms: {} },
        { id: "777b6095-2e0c-428b-a294-38aabe01fbd2", word: "catch sight", forms: {} },
        { id: "0a06eee0-3fda-4a07-b362-70cef993cd96", word: "spot sb", forms: { verb: "spot" } },
        { id: "b55a58dd-7a90-4262-9c94-548d49e07af1", word: "massage", forms: { verb: "massage", noun: "massage" } },
        { id: "f0449857-ad07-46c4-9869-3d130c05c6b4", word: "slide", forms: { verb: "slide", noun: "slide" } },
        { id: "5a38e125-7159-475b-873c-f8efbdf21e32", word: "apply pressure", forms: {} },
        { id: "a14cadd6-89c2-4891-904d-3de8c3d1a6a8", word: "stimulate", forms: { verb: "stimulate", noun: "stimulation" } },
        { id: "29830eee-561d-478c-b24a-638ff4965c12", word: "pat", forms: { verb: "pat", noun: "pat" } },
        { id: "1435a2ac-1c56-4260-9dc7-e8068e1d4cd6", word: "pinch", forms: { verb: "pinch", noun: "pinch" } },
        { id: "34d85fb8-f595-4e44-89cd-e5322af2045b", word: "tension", forms: { noun: "tension", adj: "tense" } },
        { id: "12de5e5c-b0a1-4c34-a1e2-a03f2221fb63", word: "squeeze", forms: { verb: "squeeze", noun: "squeeze" } },
        { id: "ead84e5b-7190-4702-904c-59ca0d55cf35", word: "gently", forms: { adv: "gently", adj: "gentle" } },
        { id: "1e7f5c13-ab79-48be-b924-9b8c5db280c6", word: "lightly", forms: { adv: "lightly", adj: "light" } },
        { id: "780667da-1efe-4c3c-8716-a5b149b19877", word: "firmly", forms: { adv: "firmly", adj: "firm" } },
        { id: "36b16fbc-d429-41ae-a400-5d2047665fa9", word: "steadily", forms: { adv: "steadily", adj: "steady" } },
        { id: "8bfa6edd-54b2-4d9a-a342-25d60571bfc3", word: "vigorously", forms: { adv: "vigorously", adj: "vigorous" } },

        // 221-240
        { id: "8a000966-2d6c-410d-b880-c4aa7de71806", word: "delicate flavour", forms: {} },
        { id: "d92edd1b-fbf6-4716-9a51-298b0e377c6a", word: "fragrance", forms: { noun: "fragrance", adj: "fragrant" } },
        { id: "ae7570b1-2039-4aab-aa99-be01804635ac", word: "faint", forms: { adj: "faint", noun: "faintness" } },
        { id: "43ba693b-608a-44c0-adf3-634de6b080cf", word: "appetizing", forms: { adj: "appetizing", verb: "appetize" } },
        { id: "9e3e5476-da6f-42b0-a8b0-34c4d40a895e", word: "tumor", forms: { noun: "tumor" } },
        { id: "7e6e8483-1290-4a4d-b84e-7b02dd60744e", word: "aroma", forms: { noun: "aroma", adj: "aromatic" } },
        { id: "b8b0ba15-68d0-4cad-9eff-c67c925c59c6", word: "insipid", forms: { adj: "insipid" } },
        { id: "f8061c65-7af9-4b38-bf5c-c44a2a62a79c", word: "pungent", forms: { adj: "pungent", noun: "pungency" } },
        { id: "0ab009df-e316-4199-baff-1cb902700eb6", word: "musty", forms: { adj: "musty" } },
        { id: "ff672a5c-7ff9-4526-8b9b-aae2834a9bde", word: "odour", forms: { noun: "odour", adj: "odourless" } },
        { id: "91c25e64-ad4a-4aa2-990f-c92aa2be7e3a", word: "revolting", forms: { adj: "revolting", verb: "revolt" } },
        { id: "2d42eff4-33ae-413b-9a23-febaf4b5ec5d", word: "go off", forms: {} },
        { id: "affea6f1-06ac-4256-a589-0d896527036e", word: "nauseating", forms: { adj: "nauseating", verb: "nauseate" } },
        { id: "6c8930e6-afff-4329-96f4-745f4a1a40b7", word: "stench", forms: { noun: "stench" } },
        { id: "d5f7a874-0c4c-43dc-9ecc-d5b084056197", word: "splitting headache", forms: {} },
        { id: "2c80d6c3-2289-4e3b-ba52-95ea6e67361d", word: "hay fever", forms: { noun: "hay fever" } },
        { id: "854f9625-4314-44ac-a0f0-849724729f0c", word: "mouth ulcers", forms: { noun: "mouth ulcer" } },
        { id: "c7ca9c62-721d-48a3-97ad-1fabe8071a45", word: "dislocate", forms: { verb: "dislocate", noun: "dislocation" } },
        { id: "158dfeba-76e7-4d0b-aaf1-67d03ef3723b", word: "rash", forms: { noun: "rash", adj: "rash" } },
        { id: "caa1556d-630c-4631-87a0-c0a443edc91b", word: "nasty", forms: { adj: "nasty", noun: "nastiness" } },

        // 241-260
        { id: "42b31110-2012-4e1e-93c0-68424844fc05", word: "upset stomach", forms: {} },
        { id: "1e71fd89-28c2-4e1a-a9f3-a59e09c51dca", word: "diarrhoea", forms: { noun: "diarrhoea" } },
        { id: "72608933-acc1-4f33-8350-02b86629b4ef", word: "constipated", forms: { adj: "constipated", noun: "constipation" } },
        { id: "4630ff1e-90e7-40ef-b156-24a211cc3b39", word: "high blood pressure", forms: {} },
        { id: "1da82616-6a2f-4020-a452-217f7ed13f4a", word: "sprain", forms: { verb: "sprain", noun: "sprain" } },
        { id: "98ae9560-6831-416f-bc96-a7f4090d4880", word: "pull a muscle", forms: {} },
        { id: "c7c03f61-ee34-4920-97e8-4dbb04df2787", word: "blister", forms: { noun: "blister", verb: "blister" } },
        { id: "dbe0feae-c821-4198-8d68-3549891ece80", word: "dissolve", forms: { verb: "dissolve", noun: "dissolution" } },
        { id: "08c6d5fe-87d1-427e-9007-aed4c4d003fa", word: "soluble", forms: { adj: "soluble", noun: "solubility" } },
        { id: "fce11f19-5fc0-45fb-b3d7-4d5fb72f67d7", word: "lethargy", forms: { noun: "lethargy", adj: "lethargic" } },
        { id: "551eff4f-3fc0-4ef0-8ea8-453a271f96e0", word: "drowsiness", forms: { noun: "drowsiness", adj: "drowsy" } },
        { id: "e612bfa6-6535-4b56-8519-32d6a72c4bd4", word: "short-term", forms: { adj: "short-term" } },
        { id: "7dd25d54-c4c2-4c59-a265-3fc14381001f", word: "dose", forms: { noun: "dose", verb: "dose" } },
        { id: "3255970a-6826-4f3f-8dd9-db3b75139020", word: "enclosed", forms: { adj: "enclosed", verb: "enclose" } },
        { id: "6bc23e6c-6560-4e88-800a-9c35ed618ee5", word: "leaflet", forms: { noun: "leaflet" } },
        { id: "19c87522-baca-4870-9a3a-dd54ada5c211", word: "cyst", forms: { noun: "cyst" } },
        { id: "49018d38-cff3-42c6-a45a-8d0f56c062b1", word: "astringency", forms: { noun: "astringency", adj: "astringent" } },
        { id: "b8858010-f6da-41ad-a776-79709096dc4b", word: "expiry date", forms: { noun: "expiry date" } },
        { id: "85e05203-2cb9-4f0b-a2e4-ab0fa65e42e6", word: "in excess of", forms: {} },
        { id: "f552f01c-22be-4743-97b9-cc498a449686", word: "spontaneous (ADJ)", forms: { adj: "spontaneous", noun: "spontaneity" } },

        // 261-280
        { id: "2b80cdfd-4d82-4595-af13-943f43e1dc19", word: "spontaneity (N)", forms: { noun: "spontaneity", adj: "spontaneous" } },
        { id: "a2aa55f2-4868-4638-b8a5-859842b5cd50", word: "happy-go-lucky", forms: { adj: "happy-go-lucky" } },
        { id: "c869e720-d2fd-499c-9e42-08870c2be154", word: "down-to-earth", forms: { adj: "down-to-earth" } },
        { id: "a5bb540e-0468-403e-9d64-b82b21c20a7e", word: "chatterbox (INF)", forms: { noun: "chatterbox" } },
        { id: "f43f2534-acf8-4c66-b02c-96f19c3cdec7", word: "passionate", forms: { adj: "passionate", noun: "passion" } },
        { id: "1a1ca1c2-d5dd-4874-97d3-f991896de2ed", word: "give sth a go", forms: {} },
        { id: "38995b6a-befe-4838-984d-f8630c67afb4", word: "within reason", forms: {} },
        { id: "8a96a525-b7a3-421a-9e9b-5fb53bd6f91a", word: "be drawn to", forms: {} },
        { id: "3b3777ab-6ffa-46d6-b903-709f63f85c18", word: "considerate", forms: { adj: "considerate", noun: "consideration" } },
        { id: "c36fde28-9afb-46ff-a08c-09ebaa1721d0", word: "affection", forms: { noun: "affection", adj: "affectionate" } },
        { id: "cf3e8253-9e8c-4899-a493-bc972f75fb92", word: "integrity", forms: { noun: "integrity" } },
        { id: "f21b4f3d-c69c-4023-a6f4-db47304f820e", word: "pretentious", forms: { adj: "pretentious", noun: "pretension" } },
        { id: "201d665d-9e58-4194-8268-6e5bf480dde1", word: "attribute", forms: { noun: "attribute", verb: "attribute" } },
        { id: "3c3059d3-da99-44c0-8f46-0ad8669daedc", word: "What do you make of", forms: {} },
        { id: "dbc26ffb-5f94-48a8-9e0d-01ec06320d64", word: "character", forms: { noun: "character" } },
        { id: "e5d74ee1-bfaf-4b80-b856-a4959d30be1c", word: "quick-witted", forms: { adj: "quick-witted" } },
        { id: "6a2fbe57-2de6-41b8-9885-de2d95669974", word: "shrewd", forms: { adj: "shrewd", noun: "shrewdness" } },
        { id: "fa7a1a38-7732-4b6c-b655-b07029804019", word: "ruthless", forms: { adj: "ruthless", noun: "ruthlessness" } },
        { id: "6c4a08d8-98c6-41f7-b583-2a2feb8218c7", word: "take to sb", forms: {} },
        { id: "a826f919-d2fa-4d39-9b3b-4e0d9ad67591", word: "come across", forms: {} },

        // 281-300
        { id: "5853eb82-cf2c-44d4-ae80-a688b6745051", word: "pushy", forms: { adj: "pushy" } },
        { id: "17ff5111-43a9-4515-8bdb-b1c5981fd72a", word: "conceited", forms: { adj: "conceited", noun: "conceit" } },
        { id: "b6c8769a-be62-460b-b3aa-fe620d2cdc99", word: "strike sb", forms: {} },
        { id: "30a5c34e-e6dd-4239-9c43-29b22864313d", word: "conscientious", forms: { adj: "conscientious", noun: "conscience" } },
        { id: "a60be563-cca9-47fc-81cf-ef2021d34853", word: "trustworthy", forms: { adj: "trustworthy", noun: "trustworthiness" } },
        { id: "2556181d-2917-409c-94a2-36f68974f2ec", word: "non-committal", forms: { adj: "non-committal" } },
        { id: "add56078-e782-4d54-9897-15229404d7a7", word: "get up sb's nose", forms: {} },
        { id: "a4d8976a-57fb-4880-9cc0-748c37d0af6d", word: "on the surface", forms: {} },
        { id: "2e0726c8-5dc1-4347-99c9-5af74103dc24", word: "aloof", forms: { adj: "aloof", noun: "aloofness" } },
        { id: "5087eba2-b7c3-415b-a7b1-3f64ce8f8323", word: "diffident", forms: { adj: "diffident", noun: "diffidence" } },
        { id: "245bf86c-ed37-40cc-bf0d-0bfb35c77660", word: "don't judge a book", forms: {} },
        { id: "72f3ba61-f48e-42fd-8968-30372c26c3f9", word: "trait", forms: { noun: "trait" } },
        { id: "ecdbac10-f7a0-4dea-8a1b-5e1202c656d5", word: "misleading", forms: { adj: "misleading", verb: "mislead" } },
        { id: "eb6ea575-2f8c-4329-9fae-e5b41fbc088a", word: "virtue", forms: { noun: "virtue", adj: "virtuous" } },
        { id: "19f4c7d2-2369-4dc3-995c-f3e48fbd1285", word: "cunning", forms: { adj: "cunning" } },
        { id: "bd3d4595-b8d6-4583-ae3f-1109d840bc42", word: "impulsive", forms: { adj: "impulsive", noun: "impulsiveness" } },
        { id: "85155b2e-c022-4f9b-82c1-923041a2ffb5", word: "naive", forms: { adj: "naive", noun: "naivety" } },
        { id: "8a99cdab-d8e4-4b9f-8a9c-30cb7f0ec49f", word: "sceptical", forms: { adj: "sceptical", noun: "scepticism" } },
        { id: "c7bcfd15-6f81-4601-ac98-fe508fa860d2", word: "ecstatic", forms: { adj: "ecstatic", noun: "ecstasy" } },
        { id: "84c1668d-0057-40fe-8653-3b6abef77a32", word: "jubilant", forms: { adj: "jubilant", noun: "jubilation" } },

        // 301-320
        { id: "a79927a9-fcba-455e-99d5-8b47e983cc82", word: "in tears", forms: {} },
        { id: "5ba62fb3-d87d-42cb-97a3-78fdc876f60a", word: "devastated", forms: { adj: "devastated", verb: "devastate" } },
        { id: "fe5f572b-3a3b-400b-881c-031b9bc35e7e", word: "lose your temper", forms: {} },
        { id: "60260cc2-384a-4d00-94f1-60c38dcf9410", word: "hit the roof", forms: {} },
        { id: "f86b66d1-f178-41b3-ae2a-c80570a91d2d", word: "gutted", forms: { adj: "gutted" } },
        { id: "9a30df8a-0a4e-463c-9708-4ca829cd308b", word: "hysterical", forms: { adj: "hysterical", noun: "hysteria" } },
        { id: "e18925b3-9803-40ea-918d-17969a19979e", word: "stunned", forms: { adj: "stunned", verb: "stun" } },
        { id: "1d681339-a7bb-4a94-b39d-009e5495d921", word: "appalled", forms: { adj: "appalled", verb: "appall" } },
        { id: "45b13e8b-94b6-4cf2-aa6b-0f21cd72253a", word: "desperate", forms: { adj: "desperate", noun: "despair" } },
        { id: "6110e4f3-a1bf-4db8-b221-5b7357c92287", word: "desperation", forms: { noun: "desperation", adj: "desperate" } },
        { id: "833bda63-3fcc-4e0e-a547-ed4a1b8e01f1", word: "desperately", forms: { adv: "desperately", adj: "desperate" } },
        { id: "70a370ee-1c6e-45a5-bee5-91c47294709b", word: "bottle sth up", forms: {} },
        { id: "83203042-7c1f-46f5-969c-16c2b497427b", word: "wear heart on sleeve", forms: {} },
        { id: "a6655922-cd53-4f85-9ca3-f36c5a15e092", word: "lightning never strikes", forms: {} },
        { id: "1c685276-187c-46d3-91d4-2755aa9c7253", word: "Steady on!", forms: {} },
        { id: "ab37c30a-7cc8-4f28-bee4-a2cc26e11b4a", word: "vulnerable", forms: { adj: "vulnerable", noun: "vulnerability" } },
        { id: "4205bfbf-c85e-4f10-9cdc-d0d05f3c38e1", word: "uneasy", forms: { adj: "uneasy", noun: "unease" } },
        { id: "7e2c534f-7be7-4d68-a43f-4b8a2d1a73a4", word: "pour sth out", forms: {} },
        { id: "f71e1b33-22e3-4753-9359-d93fb3d1ab1c", word: "innermost thoughts", forms: {} },
        { id: "0cf63106-1be1-4d30-a516-f4e4c60d7f89", word: "guarded", forms: { adj: "guarded" } },

        // 321-340
        { id: "8daaee34-9bcd-41c0-b5f5-135c4041d1cd", word: "give sth away", forms: {} },
        { id: "d29c043d-abb8-49d6-a004-07f6c6e68c3b", word: "suppress feelings", forms: {} },
        { id: "e11c1c09-fe92-408e-8f1a-c0874eff298b", word: "pent-up", forms: { adj: "pent-up" } },
        { id: "381619cf-4393-4a39-89e5-43c1e8f91dd1", word: "my heart wasn't", forms: {} },
        { id: "d0856b0e-7815-4a35-b3f7-e1a4a8a39a27", word: "didn't have heart", forms: {} },
        { id: "67fcc272-7a92-4cd1-8a05-1d4bbd846710", word: "heart told me", forms: {} },
        { id: "7313fff3-1514-4bbc-b2e5-796b82341670", word: "take dislike", forms: {} },
        { id: "5f9a39b9-4c04-4881-a4ab-841e5f468c0d", word: "hostile", forms: { adj: "hostile", noun: "hostility" } },
        { id: "7d336c39-ce87-4ed6-af8f-452cc9a29d8d", word: "to sb's face", forms: {} },
        { id: "a7156774-446d-49de-91ae-1f5dbe4ef6c3", word: "complimentary", forms: { adj: "complimentary", noun: "compliment" } },
        { id: "09e5b7b6-34ad-4ac8-b04e-1f3326a0cd29", word: "behind sb's back", forms: {} },
        { id: "31eebdc0-a3ea-482c-bac9-2d5b284c3ecc", word: "inevitably", forms: { adv: "inevitably", adj: "inevitable" } },
        { id: "e19cc3f1-4515-4aed-8fcb-12563c0fc399", word: "put a strain", forms: {} },
        { id: "049ac2ae-fcc7-4032-b5cd-a2a07ff01a11", word: "stick up for", forms: {} },
        { id: "46cf99f3-12e9-4bb8-ac17-cc0dbdca2205", word: "as time went by", forms: {} },
        { id: "7e977fdc-985f-4854-ae15-ab73d73d334c", word: "settle down (2)", forms: { verb: "settle down" } },
        { id: "f321da47-ed66-4243-a882-53bca574f555", word: "tough", forms: { adj: "tough", noun: "toughness" } },
        { id: "ee303df8-d740-4b7e-9b27-ba7a11767e30", word: "things", forms: { noun: "things" } },
        { id: "91aaf09d-0a18-4903-8c5b-0c8fd846d636", word: "look up", forms: {} },
        { id: "c4d9aaa9-08ea-4bcd-a329-47195b4ff69a", word: "initially", forms: { adv: "initially", adj: "initial" } },

        // 341-360
        { id: "4525a03b-3dff-46e6-ae81-4cd94a7c2b26", word: "reluctant", forms: { adj: "reluctant", noun: "reluctance" } },
        { id: "7440c8e4-f6fd-44d5-b362-08b6cadafe22", word: "bond", forms: { noun: "bond", verb: "bond" } },
        { id: "9215a21c-f3a3-4e0c-a995-6a3e7db75040", word: "respect (for sb)", forms: { noun: "respect", verb: "respect" } },
        { id: "21de8a44-bee7-435d-ab1d-1cd6962e95ec", word: "body (of letter)", forms: { noun: "body" } },
        { id: "6a5b1665-6c8b-4e15-9e8b-7fb1042d2cda", word: "ups and downs", forms: { noun: "ups and downs" } },
        { id: "94432955-eaec-4773-be0b-8062796e7509", word: "appreciate", forms: { verb: "appreciate", noun: "appreciation" } },
        { id: "c3503bfd-3557-43ca-a69c-13f344684c9d", word: "make a sacrifice", forms: { noun: "sacrifice" } },
        { id: "126e1446-012b-4e19-84ff-624f7720beaf", word: "accept", forms: { verb: "accept", noun: "acceptance" } },
        { id: "8c0ccd8d-0186-43c6-8a00-ccd2ac7abfd3", word: "heroine", forms: { noun: "heroine", noun: "hero" } },
        { id: "f8b3ab48-10f1-45f6-bfcd-728e6aa7ab02", word: "courage", forms: { noun: "courage", adj: "courageous" } },
        { id: "273cef5f-6922-4056-b7e6-0b9862f2bf0c", word: "dignity", forms: { noun: "dignity", adj: "dignified" } },
        { id: "5e080d1b-a097-4321-b516-6e939d2d1e9d", word: "humility", forms: { noun: "humility", adj: "humble" } },
        { id: "9594c23d-4256-4c44-a784-294558a1526b", word: "inspire", forms: { verb: "inspire", noun: "inspiration" } },
        { id: "205585a6-0f38-4b13-8c96-05284569f995", word: "idolize", forms: { verb: "idolize", noun: "idol" } },
        { id: "19f74de2-6d34-4ad9-97e4-898bc500ab21", word: "have a go at", forms: {} },
        { id: "e6a69515-c818-4f29-8a9c-36d475966140", word: "look up to sb", forms: {} },
        { id: "fdf9f4d9-9475-48f3-a27a-e946cf52596d", word: "follow footsteps", forms: {} }
    ];

    for (const item of updates) {
        const formsToUpdate = item.forms || {};

        const { error } = await supabase
            .from('cards')
            .update({ word_forms: formsToUpdate })
            .eq('id', item.id);
            
        if (error) console.error(`Failed ${item.word}:`, error.message);
        else console.log(`Processed: ${item.word}`);
    }
}

main();
