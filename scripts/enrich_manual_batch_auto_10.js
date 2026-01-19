
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

const batch = [
  { id: "25acf507-eba2-4677-b073-8bbf197cfe7b", examples: ["Relatively speaking.", "Relatively small.", "Relatively easy.", "Relatively unknown."] },
  { id: "6a11d385-20fc-408b-8ad7-6f21335ba84d", examples: ["Somewhat different.", "Felt somewhat tired.", "Somewhat confusing.", "Improved somewhat."] },
  { id: "836904ce-b722-4585-91b4-1e841ff4a1ff", examples: ["Primarily designed for.", "Primarily responsible.", "Primarily white.", "Focus primarily on."] },
  { id: "f8210db5-46a5-41f9-a368-25341aa8c553", examples: ["Invariably late.", "Almost invariably.", "Invariably fatal.", "Rules are invariably broken."] },
  { id: "29c58f47-c0aa-471f-b914-0a9ae216ff1b", examples: ["Truly amazing.", "Yours truly.", "Truly sorry.", "A truly great man."] },
  { id: "9a7fe66d-fe9b-46fa-bc50-356ad37af95d", examples: ["Precisely at noon.", "That is precisely my point.", "Precisely measured.", "Remember precisely."] },
  { id: "a35f91f7-74d4-4ad4-88a8-33dfaf98a0f4", examples: ["Simply the best.", "Put simply.", "Simply refused.", "It is simply wrong."] },
  { id: "c851818a-d572-4438-be31-ce22fb3cd9b3", examples: ["Strictly forbidden.", "Strictly speaking.", "Strictly confidential.", "Strictly observed."] },
  { id: "32bd6608-9d33-43dd-9cc7-0f804b6e3ff7", examples: ["Purely coincidental.", "Purely decorative.", "Purely political.", "Acted purely on instinct."] },
  { id: "6d2b320f-7cad-4c4d-abee-56aea9aab301", examples: ["Lost forever.", "Love you forever.", "Gone forever.", "Forever grateful."] },
  { id: "7dc526a5-6906-445f-8635-09cc8d34fb9e", examples: ["Briefly mention.", "Briefly interrupted.", "Briefly famous.", "Discussed briefly."] },
  { id: "1ba90592-fd81-42db-9ded-a7e4b733ca28", examples: ["As far as I'm concerned.", "As far as money is concerned.", "No problem as far as checks are concerned.", "As far as safety is concerned."] },
  { id: "3b4da459-1b65-44b1-989e-9fe92198a9cd", examples: ["Theoretically possible.", "Theoretically sound.", "Theoretically speaking.", "Only theoretically."] },
  { id: "f663e80c-f726-4c03-9274-7b8d427fe531", examples: ["Mentally ill.", "Mentally exhausting.", "Mentally prepared.", "Mentally strong."] },
  { id: "867b462f-d4d4-40e9-a6dc-6ff6d4258a64", examples: ["Physically fit.", "Physically demanding.", "Physically unable.", "Physically impossible."] },
  { id: "721c9e1e-3364-4346-8fc0-c1d4753fc562", examples: ["Technically legal.", "Technically speaking.", "Technically difficult.", "Technically advanced."] },
  { id: "f079e418-b22a-4bd0-af83-b9a64f22360f", examples: ["Involved indirectly.", "Indirectly responsible.", "Indirectly caused.", "Learned indirectly."] },
  { id: "416363b2-9e85-4328-92f1-8c773ca0b35a", examples: ["Officially opened.", "Officially announced.", "Not officially.", "Officially recognized."] },
  { id: "87eaba16-d234-4059-95da-abb1289e7ffc", examples: ["Realistically speaking.", "Think realistically.", "Price realistically.", "Realistically achievable."] },
  { id: "b4f21b05-c3f5-45a3-b64f-f5170caef9a6", examples: ["Socially acceptable.", "Socially active.", "Socially awkward.", "Socially distanced."] },
  { id: "e0a514d0-91f2-42b6-866a-9efae3652bbf", examples: ["Think logically.", "Logically follows.", "Logically sound.", "Argued logically."] },
  { id: "0a9dcbb0-29b6-4b35-be98-8168a3f02329", examples: ["Traditionally held.", "Traditionally made.", "Traditionally served.", "Traditionally viewed."] },
  { id: "ad9a1953-7d9a-4940-a0b1-7ee83dbce404", examples: ["Commercially viable.", "Commercially available.", "Commercially successful.", "Grown commercially."] },
  { id: "b4993b6a-fe58-47d4-bf76-e2dd8e4bb55f", examples: ["Strangely enough.", "Behaving strangely.", "Strangely quiet.", "Strangely familiar."] },
  { id: "d25c915b-07be-4713-be41-0d5cae9b9973", examples: ["Practically impossible.", "Practically empty.", "Practically speaking.", "Used practically."] },
  { id: "e39255f3-e5b7-4f25-9d69-6acefd8deae7", examples: ["Basically the same.", "Basically correct.", "Basically good.", "It is basically fraud."] },
  { id: "47cca31a-f3f9-49a7-81a7-eac50604f71c", examples: ["Naturally occurring.", "Act naturally.", "Naturally gifted.", "Naturally, I agreed."] },
  { id: "1c72fc53-0277-48f8-bf71-b85ec4dc38a7", examples: ["Obviously wrong.", "Obviously fake.", "Stated the obviously.", "Obviously upset."] },
  { id: "04757fd1-fefc-40d2-9904-a1be13905dfa", examples: ["To be perfectly honest.", "To be honest, I don't know.", "Honest answer.", "Be honest."] },
  { id: "c79a1ae8-e2bc-4d92-b750-bbd2fb9340a6", examples: ["Ultimately responsible.", "Ultimately failed.", "Ultimately successful.", "Decision is ultimately yours."] },
  { id: "d7290892-e52b-4baf-969f-f8e756978124", examples: ["Presumably dead.", "Presumably he knows.", "Presumably cheap.", "Presumably innocent."] },
  { id: "bad442aa-43c9-4f55-b585-cdb0241b30b2", examples: ["Apparently true.", "Apparently not.", "Apparently he left.", "Became apparently clear."] },
  { id: "a4335eee-d02a-4f92-b711-ae50ba7507e9", examples: ["Negligible difference.", "Negligible impact.", "Amount is negligible.", "Negligible risk."] },
  { id: "3f14f568-d29e-479d-bab2-ad5b3de1f80f", examples: ["Negligent behavior.", "Grossly negligent.", "Negligent driving.", "Found negligent."] },
  { id: "44926ab9-bb37-477d-a2b0-9d951986b8e9", examples: ["Childish prank.", "Don't be childish.", "Childish delight.", "Childish behavior."] },
  { id: "a5ec98c8-b586-4841-b904-f42622f80bfb", examples: ["Childlike innocence.", "Childlike wonder.", "Childlike quality.", "Childlike trust."] },
  { id: "2b7bcd54-85f8-4a8a-8c82-0533f3bc72b9", examples: ["Worthless junk.", "Felt worthless.", "Worthless check.", "Worthless promise."] },
  { id: "9bb965eb-c9e9-4f96-9e31-29021d7a45a5", examples: ["Invaluable help.", "Invaluable experience.", "Invaluable asset.", "Proved invaluable."] },
  { id: "ec832015-cac7-4be9-bc51-7bb6cee3be4e", examples: ["Hardly comprehensible.", "Mutually comprehensible.", "Make it comprehensible.", "Comprehensible input."] },
  { id: "0ffe1336-b065-4aac-ab5c-f632e8bee141", examples: ["Comprehensive coverage.", "Comprehensive guide.", "Comprehensive study.", "Comprehensive victory."] },
  { id: "5c541ce7-de46-4065-a1a5-ee8ea6f15fa3", examples: ["Exhaustive search.", "Exhaustive list.", "Exhaustive research.", "Make it exhaustive."] },
  { id: "2c3bfe6d-ea7a-4ea2-b573-cdbec8af4d54", examples: ["I am exhausted.", "Exhausted resources.", "Totally exhausted.", "Look exhausted."] },
  { id: "1e9afa2f-7509-4d75-b12a-835d2160f2bb", examples: ["Bare feet.", "Bare essentials.", "Bare room.", "Lay bare."] },
  { id: "0783be98-5a13-4b5b-8004-3f7866d973a4", examples: ["Nude painting.", "Nude beach.", "In the nude.", "Nude photography."] },
  { id: "169640cc-335e-4bb3-9651-be561c4e5891", examples: ["Naked eye.", "Stark naked.", "Half naked.", "Naked truth."] },
  { id: "b1cb703f-9dfa-4019-859c-d2c285eb5147", examples: ["Tasty meal.", "Very tasty.", "Tasty dish.", "Look tasty."] },
  { id: "37708cd0-c89c-4f1e-b45d-6d546a04a0d1", examples: ["Tasteful decor.", "Tasteful nude.", "Tasteful furniture.", "Tasteful choice."] },
  { id: "4d7187db-c8cb-42de-9369-4b7497a25242", examples: ["Conclusive evidence.", "Conclusive proof.", "Conclusive results.", "Lack conclusive proof."] },
  { id: "0aeef11c-016d-4bd3-a91d-218e78e01762", examples: ["Concluding remarks.", "Concluding chapter.", "Concluding stages.", "Concluding sentence."] },
  { id: "4546ac39-2ae0-4600-a6c6-4f7d6cf29a2d", examples: ["Dejected look.", "Feeling dejected.", "Dejected players.", "Walked away dejected."] },
  { id: "16f10406-1cba-4acd-94bf-626283265249", examples: ["Wicked witch.", "Wicked stepmother.", "Wicked smile.", "That's wicked (cool)."] },
  { id: "4f49bd5b-72a2-4dd8-8186-6710801562db", examples: ["Every conceivable way.", "Hardly conceivable.", "Only conceivable explanation.", "Best conceivable."] },
  { id: "176e0b91-0edb-4132-a126-880092e4f4b7", examples: ["Implausible excuse.", "Highly implausible.", "Sounds implausible.", "Implausible story."] },
  { id: "fc3debcb-8558-4089-9482-98fa1aea0f45", examples: ["Bizarre behavior.", "Bizarre twist.", "Truly bizarre.", "Bizarre accident."] },
  { id: "4ff06512-9e33-45a7-86be-a0c44606edc5", examples: ["Looked perplexed.", "Perplexed by the question.", "I am perplexed.", "Perplexed expression."] },
  { id: "18b7d9a1-a65e-4b0f-b775-93d7de3177fe", examples: ["Eminent scientist.", "Eminent domain.", "Eminent scholar.", "Eminent historian."] },
  { id: "5fdf51e2-1867-447e-b197-c6c74d416403", examples: ["Exceptional talent.", "Exceptional circumstances.", "Exceptional quality.", "Truly exceptional."] },
  { id: "20b95802-b594-49e6-a9f1-13f009f93b1c", examples: ["Distinguished career.", "Distinguished guest.", "Looked distinguished.", "Distinguished service."] },
  { id: "2f2b823a-a0da-4890-a585-8dff62229636", examples: ["Under construction.", "Road under construction.", "Site under construction.", "Still under construction."] },
  { id: "bb859c88-ce9c-4a5e-80c7-e36179629564", examples: ["Under investigation.", "Matter under investigation.", "Placed under investigation.", "Remain under investigation."] },
  { id: "16146d3b-38ce-440f-bb98-2052aa34edcb", examples: ["Bereaved family.", "Comfort the bereaved.", "Recently bereaved.", "Bereaved mother."] },
  { id: "c3aef13d-41f7-4ccf-b2e6-9f075360f5df", examples: ["Out of respect for him.", "Silence out of respect.", "Refused out of respect.", "Do it out of respect."] },
  { id: "5ba014d6-7ed6-4872-a724-8c3819133241", examples: ["Remain in office.", "While in office.", "Remove from office.", "Term in office."] },
  { id: "58a9ff39-39be-4270-908d-0bf35e40a03d", examples: ["By means of a ladder.", "By means of force.", "By means of words.", "Escape by means of."] },
  { id: "750804c0-5440-42b4-a153-ea1bbec42b99", examples: ["In possession of drugs.", "Found in possession.", "In possession of facts.", "Valuable possession."] },
  { id: "159266bc-f308-414b-b17d-16f1e4e5d047", examples: ["In memory of.", "Concert in memory of.", "Statue in memory of.", "Dedicated in memory of."] },
  { id: "172faefd-35b5-48dc-a28f-e00ba2b92177", examples: ["Put on hold.", "Life on hold.", "Plans on hold.", "On hold for now."] },
  { id: "dba39b0f-5477-4402-822a-927e9be0b13e", examples: ["Giant steps.", "Giant screen.", "Gentle giant.", "Giant leap."] },
  { id: "79b549a8-5313-473e-a82b-838341a397f4", examples: ["In honour of.", "Dinner in honour of.", "Party in honour of.", "Held in honour."] },
  { id: "b8b5219c-13b2-48c0-b5ec-0f4688e5c653", examples: ["Out of touch with reality.", "Out of touch with friends.", "Feel out of touch.", "He is out of touch."] },
  { id: "2028f3a3-eb9a-4a59-84ba-4b97727670cf", examples: ["At the very least, try.", "Cost at the very least $5.", "At the very least, be polite.", "Stay for an hour at the very least."] },
  { id: "47bdbe8e-4bcb-407f-a76f-e4af0f114f1a", examples: ["Mentioned in passing.", "Saw him in passing.", "Remark made in passing.", "Just in passing."] },
  { id: "cbfb9ee7-2a26-4297-8fe2-8d41238aa7f2", examples: ["In exchange for money.", "Given in exchange.", "Fair exchange.", "Work in exchange for food."] },
  { id: "9107384f-2351-4f76-8856-a3de678483cb", examples: ["Come at once.", "Do it at once.", "All at once.", "Leave at once."] },
  { id: "ca39273c-9275-496e-ab7d-18c033e8e800", examples: ["Cancelled at short notice.", "Arranged at short notice.", "Available at short notice.", "Given short notice."] },
  { id: "ac29c843-4f48-4e46-815a-bd4c131bb7dc", examples: ["Attend without fail.", "He comes without fail.", "Do it without fail.", "Remind me without fail."] },
  { id: "d05a402d-cecf-4a21-9481-ee96e53052dd", examples: ["Single by choice.", "Vegan by choice.", "By choice, not force.", "Did it by choice."] },
  { id: "4179c7c0-ae08-4b52-bd95-2c11d169d6e6", examples: ["On reflection, I agree.", "Decided on reflection.", "Sad upon reflection.", "On reflection, it was good."] },
  { id: "425e85ac-cdb4-4305-95d7-631b677ab7fc", examples: ["On the contrary.", "Quite on the contrary.", "Not ugly, on the contrary.", "Evidence suggests the contrary."] },
  { id: "88300c73-3c14-49fe-a503-c51093c8865b", examples: ["On balance, a good year.", "On balance, I think...", "Weighing it on balance.", "On balance, success."] },
  { id: "e906b6e1-0bd1-4f81-bff5-a6ee0876906c", examples: ["Promoted on merit.", "Judge on merit.", "Win on merit.", "Awarded on merit."] },
  { id: "2520f34d-7000-48ef-baf9-93ba7f169589", examples: ["Reminiscent of the past.", "Smell is reminiscent.", "Highly reminiscent.", "Style reminiscent of old movies."] },
  { id: "de43ffa0-4db2-4c3e-b337-d30f4b4faf01", examples: ["Subservient to her husband.", "Not subservient.", "Make them subservient.", "Subservient role."] },
  { id: "d0059b00-c520-4df7-888b-a35955f6a9a3", examples: ["Dependent on parents.", "Drug dependent.", "Dependent variable.", "Overly dependent."] },
  { id: "04374862-5869-4cde-8868-159e152970c2", examples: ["Reconciled to his fate.", "Reconciled to the loss.", "Become reconciled.", "Not reconciled."] },
  { id: "10972651-1631-4070-9bbc-5a51e9045d08", examples: ["Representative of the group.", "Changes are representative.", "Not representative.", "Representative sample."] },
  { id: "4084080f-bd74-40a7-9ea3-5bc7818c1292", examples: ["Resistant to change.", "Water resistant.", "Heat resistant.", "Resistant to antibiotics."] },
  { id: "c644810e-8932-4fe5-95ab-9cb01fd13746", examples: ["Live with the pain.", "Learn to live with it.", "Can't live with that.", "Hard to live with."] },
  { id: "820d863c-c978-4ea1-9282-3767d8631945", examples: ["Compatible with Windows.", "Not compatible with me.", "Compatible types.", "Fully compatible."] },
  { id: "fc83087e-1ba0-477c-9c80-5a395a892266", examples: ["Stem from ignorance.", "Problems stem from...", "Stems from childhood.", "Violence stems from fear."] },
  { id: "1624b91d-7ac3-47fd-8c50-2f37a2ab5cd0", examples: ["Subject to change.", "Subject to approval.", "Subject to laws.", "Subject to abuse."] },
  { id: "20e10126-c69c-4e6e-8881-d828b0ee2061", examples: ["Intent on winning.", "Intent on destruction.", "Intent on leaving.", "Fully intent."] },
  { id: "c9c3cd22-196b-4027-993c-b6f421120113", examples: ["Embark on a career.", "Embark on a trip.", "Embark on a project.", "Ready to embark."] },
  { id: "24a0f593-e293-4830-b7ee-a66eaab4f5f7", examples: ["Control of the company.", "Loss of control.", "Take control of.", "In control of."] },
  { id: "186f7798-39bf-4f8e-b895-8f8c4eb2c8d1", examples: ["Ban on smoking.", "Total ban on trade.", "Impose a ban.", "Lift the ban."] }
];

async function main() {
    console.log(`Enriching batch of ${batch.length} cards...`);
    for (const item of batch) {
        const { error } = await supabase
            .from('cards')
            .update({ examples: item.examples })
            .eq('id', item.id);
        
        if (error) console.error(`Error updating ${item.id}:`, error.message);
        else console.log(`✅ enriched ${item.id}`);
    }
}

main();
