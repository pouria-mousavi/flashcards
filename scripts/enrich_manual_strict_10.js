
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

// Batch 10 (Indices 100-149)
const batch = [
  { id: "67956932-626c-4f40-ab65-79303b340aa1", examples: ["A fire broke out in the factory.", "The fire broke out at midnight.", "Fire broke out on the third floor.", "When the fire broke out, we evacuated."] },
  { id: "5a132410-8765-48c3-a1fc-df4971bdd201", examples: ["The building is on fire!", "Help! The car is on fire!", "When I arrived, the house was on fire.", "Is the trash can on fire?"] },
  { id: "f81d53e4-de85-4c70-b21b-64dd6e665758", examples: ["The fire spread to neighboring buildings.", "Before we knew it, the fire had spread.", "The fire spread rapidly.", "Wind helped the fire spread."] },
  { id: "e01bc564-14ff-4cbd-acc7-f2408ff95766", examples: ["The car burst into flames after the crash.", "The plane burst into flames.", "Suddenly it burst into flames.", "Don't let it burst into flames."] },
  { id: "cf1c8510-4d46-49c6-9a8f-9e01f1020b97", examples: ["The old barn went up in flames.", "The warehouse went up in flames.", "Years of work went up in flames.", "Everything went up in flames."] },
  { id: "04f87292-2b12-4764-bd3c-48a919385ddc", examples: ["The flames eventually died down.", "Wait for the fire to die down.", "The storm died down.", "The controversy died down."] },
  { id: "2f3ee084-bb5a-44a2-8cfb-8cf19b5f3b13", examples: ["Firefighters put out the fire.", "They managed to put out the blaze.", "It took hours to put out the fire.", "Put out the campfire before leaving."] },
  { id: "3ea6d8cc-c04a-48f4-9fb8-56ad3b22fff3", examples: ["Forest fires devastated the region.", "Summer brings forest fires.", "Forest fires are increasing.", "Preventing forest fires."] },
  { id: "986b1489-0d4e-4379-844b-92cd389b65e4", examples: ["I lit a fire in the fireplace.", "He lit a fire to keep warm.", "She lit a fire outside.", "Don't forget to light a fire."] },
  { id: "e69bfaeb-6767-4163-93dc-f325be8aa40c", examples: ["The fire went out during the night.", "The candle went out.", "Our campfire went out.", "Make sure the fire doesn't go out."] },
  { id: "476164cd-ceb3-4b49-b37f-08f51f02d4af", examples: ["All the lights went out.", "Suddenly the lights went out.", "The power went out.", "The streetlights went out."] },
  { id: "a89987b8-e45c-4033-aa4f-bca247afb680", examples: ["Please put out your cigarette.", "He put out his cigar.", "Put that out immediately.", "She put out her cigarette."] },
  { id: "8c0c24f5-b365-4d74-9d89-381a0b18a16f", examples: ["A fight broke out in the bar.", "Fighting broke out between groups.", "A riot broke out.", "Violence broke out."] },
  { id: "c95c8e43-d6fb-4197-b31a-6ca490cce397", examples: ["She burst into tears when she heard.", "The child burst into tears.", "I almost burst into tears.", "He burst into tears of joy."] },
  { id: "6dda8a39-8f9c-4966-b3ed-e7937c7fd86e", examples: ["The noise died down after midnight.", "Wait for the noise to die down.", "Excitement died down.", "Cheering died down."] },
  { id: "82dded13-871d-49d3-a84c-199272b8174b", examples: ["We had torrential rain all night.", "Torrential rain caused flooding.", "Watch out for torrential rain.", "Torrential rain damaged crops."] },
  { id: "cf992637-ea31-4292-b1cb-62fe33d51875", examples: ["Gale-force winds hit the coast.", "Expect gale-force winds tonight.", "The gale-force winds uprooted trees.", "Gale-force winds are forecast."] },
  { id: "a8632ad6-ac7b-4cad-ba13-62a87fa8a436", examples: ["I had considerable difficulty finding it.", "There was considerable difficulty.", "Considerable difficulty was expected.", "With considerable difficulty, she climbed."] },
  { id: "21747eb6-8aba-4ce5-90a1-53194f0fa4c8", examples: ["The hurricane caused extensive damage.", "Extensive damage to property.", "Extensive damage was reported.", "Assessing the extensive damage."] },
  { id: "abf06d71-57b4-4a93-a773-45287c4c1180", examples: ["He speaks with a strong accent.", "Her strong accent is charming.", "A strong regional accent.", "Strong accent detected."] },
  { id: "c076cc62-f8b8-43c7-b759-2e8d65f1a113", examples: ["It was a great honour to meet her.", "What a great honour!", "The great honour of hosting.", "A great honour indeed."] },
  { id: "e8b0b0f6-69a9-4894-9e9a-10addba24e68", examples: ["She made a real effort to help.", "It takes real effort.", "Put in a real effort.", "A real effort was required."] },
  { id: "cf493427-fbb9-4ae3-b96d-ad02303c068b", examples: ["My main concern is safety.", "What's your main concern?", "Main concern addressed.", "Address the main concern."] },
  { id: "dbf4448d-75d9-4166-8399-3b8fb0b750c1", examples: ["It's nice to see a familiar face.", "Looking for a familiar face.", "A familiar face in the crowd.", "That familiar face again."] },
  { id: "343b2c54-8034-42fb-ba45-4a5ece29ea06", examples: ["Give me a brief summary.", "Here's a brief summary.", "A brief summary follows.", "In brief summary."] },
  { id: "1528ff9f-4139-4323-bb12-e0bfa749522f", examples: ["A classic example of irony.", "This is a classic example.", "Classic example of failure.", "Classic example behavior."] },
  { id: "d0bdc740-4b7d-4554-9039-5457ef03c811", examples: ["The plan faced strong criticism.", "Strong criticism from experts.", "Receiving strong criticism.", "Despite strong criticism."] },
  { id: "16fa5676-fb90-413a-b21c-6a1b4dd4098e", examples: ["The office was in utter chaos.", "Utter chaos ensued.", "Utter chaos everywhere.", "Complete utter chaos."] },
  { id: "97607856-1c84-4ffc-8e36-7cf91b53f469", examples: ["They had a narrow escape.", "That was a narrow escape!", "A narrow escape from death.", "Narrow escape indeed."] },
  { id: "a71be133-e425-4634-8cba-dc90253dc418", examples: ["That building is a real eyesore.", "The sign is an eyesore.", "An eyesore on the street.", "Total eyesore."] },
  { id: "69d5ffc5-3a04-43d7-80f5-bb098ee20909", examples: ["She took offence at his comment.", "Don't take offence.", "No offence intended.", "He took offence easily."] },
  { id: "c84d0e98-9e62-411f-ab85-2098bc3c55ab", examples: ["Let me make it clear.", "I made it clear to him.", "Make it clear that you disagree.", "Make it clear now."] },
  { id: "b2e91966-918e-4ebd-bbc7-341b492b2228", examples: ["I'll do no such thing!", "She did no such thing.", "No such thing happened.", "There's no such thing."] },
  { id: "94c27115-b71d-490e-b6a0-f8639cbac931", examples: ["They reached an agreement.", "Finally reaching agreement.", "Reach agreement soon.", "Trying to reach agreement."] },
  { id: "d0f92d18-2d7b-45af-b081-24581ad1f6d1", examples: ["We face the prospect of layoffs.", "Facing the prospect of failure.", "The prospect of war.", "An exciting prospect."] },
  { id: "08d6099e-b9d7-48f2-a9af-9f1061ff29de", examples: ["They managed to settle the dispute.", "Settle disputes peacefully.", "The dispute was settled.", "Settling the dispute."] },
  { id: "4e32672f-2bdb-44fa-9a04-e4e218a5a657", examples: ["They held him responsible.", "Who do you hold responsible?", "I hold you responsible.", "Held responsible for damages."] },
  { id: "71a1d43a-8166-4ba5-9e8c-726867b5293a", examples: ["I'll take the blame.", "Taking the blame for others.", "Don't take the blame.", "Took the blame unfairly."] },
  { id: "509b2cfd-0907-4a64-9b77-d8c9b82dbba3", examples: ["We've reached the point of no return.", "Reaching a point where...", "At this point.", "Reach that point."] },
  { id: "22879e76-8168-4dea-88de-2aecea2545bd", examples: ["He refused to back down.", "I won't back down.", "Never back down.", "Backing down is wise sometimes."] },
  { id: "0e52b35b-3f01-41ab-9877-a4bceb759e84", examples: ["I agree entirely.", "You are entirely correct.", "Entirely wrong.", "Depends entirely on you."] },
  { id: "fc0d690f-87af-49b9-b0f7-bea7fb287ef0", examples: ["This is entirely different.", "Entirely different approach.", "Entirely different matter.", "Something entirely different."] },
  { id: "c1ba3587-fc4d-4dad-a3ce-b72850f94324", examples: ["I agree entirely with you.", "Do you agree entirely?", "Agree entirely.", "Cannot agree entirely."] },
  { id: "b6899f11-b1d8-4c5d-88de-ee916685887a", examples: ["I'm not entirely sure.", "Not entirely convinced.", "Not entirely true.", "Not entirely happy."] },
  { id: "bfa3b944-878d-43be-93f0-626beb076108", examples: ["His face was reflected in the water.", "The moon reflected on the lake.", "Light reflected off the glass.", "Her image was reflected."] },
  { id: "9eba14fe-4c52-4de3-99e5-f337bf71d3dd", examples: ["She reflected on her past.", "Take time to reflect.", "He reflected deeply.", "Reflecting on the decision."] },
  { id: "c6ed975f-a87d-4092-8343-a9744f20773e", examples: ["Can you count to ten?", "Learning to count.", "Count slowly.", "Count from one to one hundred."] },
  { id: "854343c4-d113-41da-94df-9fe40ac55d1a", examples: ["Count the money carefully.", "Did you count the guests?", "Count the votes.", "Counting the total."] },
  { id: "57945cf6-3057-4c0f-98da-bf5707573c95", examples: ["Does that count?", "Not counting the tax.", "Everything counts.", "This doesn't count."] },
  { id: "4d41d17f-a131-494c-a371-fd662b4cfeac", examples: ["The sponge absorbs water.", "Skin absorbs lotion.", "Absorb the liquid.", "Materials that absorb heat."] }
];

async function main() {
    console.log(`Enriching strict batch 10 of ${batch.length} cards...`);
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
