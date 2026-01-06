
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

// Batch 9 (Indices 50-99 of new strict_batch.json)
const batch = [
  { id: "5b503175-7e75-4ed6-9ad2-89b13713fda0", examples: ["Will this salad keep until tomorrow?", "Bread doesn't keep long.", "The milk won't keep.", "How long will it keep?"] },
  { id: "1aed3780-ac46-4f3e-99a0-e4ee2e5c760c", examples: ["This snack will keep me going until dinner.", "Coffee keeps me going.", "The thought of vacation keeps me going.", "What keeps you going?"] },
  { id: "8c457157-ef07-40ec-a667-ba5931b9e1ca", examples: ["It's hard to put my feelings into words.", "Let me put it this way.", "How should I put this?", "Put it in simpler terms."] },
  { id: "f80a4f3a-eaa4-4e53-ad97-7c4098a30511", examples: ["Don't push yourself too hard.", "Parents push their kids.", "I need to push myself more.", "Pushed to the limit."] },
  { id: "417c9b10-fc70-40a2-ad52-30ee657f5869", examples: ["I'll leave the decision to you.", "Leave it with me.", "Left the cooking to her.", "Leave it to the experts."] },
  { id: "e53f6d7d-5b4f-461e-81c1-82b146a08e1f", examples: ["What time do you make it?", "I make it about five miles.", "I make the total $100.", "What do you make of it?"] },
  { id: "a9245df5-b9d3-4c5f-a41b-7d7c8aa33e59", examples: ["What brings you here today?", "The crisis brought him to power.", "What brings you to town?", "Curiosity brought me here."] },
  { id: "3ae74a6c-9091-4721-834c-37d160253314", examples: ["The phone comes with a charger.", "Does it come with batteries?", "The car comes with leather seats.", "What does it come with?"] },
  { id: "4aba9429-7199-4f9a-87be-74ba45d5cd76", examples: ["The shoes come in three colors.", "It comes in different sizes.", "Does it come in red?", "Comes in many varieties."] },
  { id: "889258eb-c788-4a4b-a500-f14643fb9347", examples: ["Will this do?", "That won't do.", "Any chair will do.", "This will have to do."] },
  { id: "e31b4a9b-b900-4dfe-843c-a197340a4266", examples: ["I need to renew my driving licence.", "Lost my driving licence.", "Driving licence expired.", "Get your driving licence."] },
  { id: "18f4db3e-f594-4823-9c79-439fddb63a5f", examples: ["Bring your birth certificate.", "Order a birth certificate.", "Birth certificate copy.", "Need a birth certificate."] },
  { id: "43b2b321-7900-4940-80ce-cd1007a19cec", examples: ["We need to order spare parts.", "Spare parts for the car.", "Hard to find spare parts.", "Spare parts are expensive."] },
  { id: "2457991f-cfcc-4f98-a2fe-23aa47035fb8", examples: ["A passer-by called the police.", "Random passer-by.", "Asked a passer-by.", "Passing passer-by."] },
  { id: "e9556cc3-c9dc-414a-8c74-e70a49a4b6d1", examples: ["We took a long weekend.", "A long weekend trip.", "Enjoy the long weekend.", "Planning for long weekend."] },
  { id: "bc85408b-5624-4ece-9caf-3a931f87c80e", examples: ["Life expectancy has increased.", "Average life expectancy.", "Higher life expectancy.", "Life expectancy varies."] },
  { id: "7bf90e53-fa9b-4acf-a036-a4c607c41e23", examples: ["Let's take the short cut.", "There's no short cut to success.", "A shortcut through the park.", "Keyboard shortcut."] },
  { id: "f7ec5f7b-3290-4407-9b2e-620ce31ff717", examples: ["Fancy dress party.", "Wearing fancy dress.", "Fancy dress costume.", "What's your fancy dress?"] },
  { id: "5b222a7f-75c0-4050-8a48-750fc87cd6ec", examples: ["Singing a nursery rhyme.", "Classic nursery rhyme.", "Children love nursery rhymes.", "Remember that nursery rhyme?"] },
  { id: "3bebed1b-f986-4989-a72b-9a63ba637d36", examples: ["Lost money on the slot machine.", "Playing fruit machines.", "Slot machine addiction.", "Hit the jackpot."] },
  { id: "9811bd83-de5b-4097-b12e-6d4f72d5c813", examples: ["Who is your next of kin?", "List your next of kin.", "Notify next of kin.", "Next of kin information."] },
  { id: "05133aa7-2da6-4442-b673-64a955571a66", examples: ["A last-minute decision.", "Last-minute changes.", "Last-minute booking.", "Don't leave it last-minute."] },
  { id: "c7eec3dd-6d64-4d1f-82e0-ef71e0ed5a9b", examples: ["The area is very built-up.", "A built-up neighborhood.", "Not too built-up.", "Densely built-up."] },
  { id: "2e83173f-ca8c-4908-a820-20ae24b79daa", examples: ["She looked panic-stricken.", "Panic-stricken passengers.", "Don't get panic-stricken.", "Panic-stricken expression."] },
  { id: "4ebbcdf6-4119-419a-b98c-8e2ea01c83d1", examples: ["Politicians need to be thick-skinned.", "He's very thick-skinned.", "Become thick-skinned.", "Not thick-skinned enough."] },
  { id: "b3834b32-552b-48e3-98fc-101ee18bc54c", examples: ["His attitude is off-putting.", "An off-putting smell.", "Don't find it off-putting.", "Quite off-putting."] },
  { id: "6dc9e9c5-0cab-4fb6-b130-cbeedaac4a79", examples: ["I get tongue-tied when nervous.", "Tongue-tied in interviews.", "Don't be tongue-tied.", "Completely tongue-tied."] },
  { id: "6c8b14b1-24bc-41f3-9954-6bc47d8d6bbb", examples: ["These shoes are completely worn out.", "The tires are worn out.", "Worn out carpet.", "Worn out equipment."] },
  { id: "a3e9c716-c995-4752-ba54-bb4400540399", examples: ["I'm completely worn out after work.", "Feeling worn out.", "Worn out from exercise.", "Worn out exhaustion."] },
  { id: "d66e82f2-2846-48a9-ab4f-252b3e48a067", examples: ["These boots are hard-wearing.", "Hard-wearing material.", "Hard-wearing fabric.", "Built to be hard-wearing."] },
  { id: "39b94a9a-077d-46ad-97ce-61ee86fa3430", examples: ["The noise seems never-ending.", "A never-ending story.", "Never-ending problems.", "Never-ending work."] },
  { id: "ab6a09a6-f043-4dfe-8d3a-a5e58db02d4b", examples: ["Traffic makes me bad-tempered.", "He's always bad-tempered.", "Woke up bad-tempered.", "Bad-tempered boss."] },
  { id: "38983629-c47e-4152-89b6-a2723cc2ffa2", examples: ["Don't be so narrow-minded.", "Narrow-minded thinking.", "A narrow-minded view.", "Narrow-minded people."] },
  { id: "378e2447-5319-42f1-b96f-e6bef5b9a34e", examples: ["The professor is quite absent-minded.", "Absent-minded mistake.", "Being absent-minded.", "Absent-minded professor."] },
  { id: "9677e456-e1f8-4ba9-a9fc-d368315994d1", examples: ["She is single-minded about her career.", "Single-minded determination.", "Single-minded focus.", "Single-minded pursuit."] },
  { id: "354ad7e1-573c-436c-9b2f-296fe3acf6e8", examples: ["The movie was a let-down.", "What a let-down.", "Total let-down.", "Such a let-down."] },
  { id: "32bf5902-b422-4947-995f-202572c2212b", examples: ["He dropped out of college.", "Students drop out.", "Don't drop out.", "She dropped out early."] },
  { id: "2dad1730-4f28-4260-af76-4b587d704f77", examples: ["The turnout was disappointing.", "Voter turnout was high.", "High turnout expected.", "Low turnout."] },
  { id: "90b99f40-1941-429c-8337-549c8aa5bf55", examples: ["There was a shake-up in management.", "Major shake-up coming.", "Corporate shake-up.", "Industry shake-up."] },
  { id: "b384c30c-caa9-4b8e-acd6-3bec6d0d33e8", examples: ["My car broke down on the highway.", "The machine broke down.", "When things break down.", "It will break down eventually."] },
  { id: "b4720f59-fca8-413d-9009-109c2663988c", examples: ["We were held up by traffic.", "Don't hold me up.", "What's holding us up?", "Held up for hours."] },
  { id: "602599c4-541e-4d5d-a3f9-706acdcaa70c", examples: ["Stuck in a tailback.", "Long tailback ahead.", "Highway tailback.", "Avoid the tailback."] },
  { id: "2abfbbdb-1320-4ba6-96ca-01c1291c118b", examples: ["The car was a write-off.", "Total write-off.", "Insurance write-off.", "Complete write-off."] },
  { id: "d7fbce1c-87d3-49dc-8ee0-89ec0c7095f9", examples: ["The break-up was painful.", "After the break-up.", "Handling a break-up.", "Sudden break-up."] },
  { id: "f5af0018-8deb-41ba-9068-e0dc66aecea0", examples: ["It was a major setback.", "Suffering a setback.", "Despite the setback.", "Minor setback."] },
  { id: "44447b1f-88a5-4cbd-8bf8-352c2e892ea4", examples: ["An outbreak of disease.", "Violence outbreak.", "Outbreak of war.", "Preventing an outbreak."] },
  { id: "d548e28f-2063-4c2d-98a1-65a348824eab", examples: ["The initial outlay was high.", "Capital outlay.", "Significant outlay.", "Financial outlay."] },
  { id: "1a7cacdd-6da7-4111-8ffb-963b98c39f12", examples: ["He laid out a lot of money.", "Laying out cash.", "Had to lay out.", "Laying out funds."] },
  { id: "83efaf44-2f17-4069-a3a4-3904915db89c", examples: ["Someone set fire to the building.", "Set fire to the papers.", "Don't set fire to it.", "Kids set fire to trash."] },
  { id: "2473f714-682d-4738-9e25-5da81ff8dd3d", examples: ["The curtains caught fire.", "It could catch fire.", "Paper catches fire easily.", "Something caught fire."] }
];

async function main() {
    console.log(`Enriching strict batch 9 of ${batch.length} cards...`);
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
