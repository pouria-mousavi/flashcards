
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

// Batch 12 (Indices 0-49)
const batch = [
  { id: "b842a9d9-1eb7-48fb-957d-b0cc40c58e29", examples: ["She looked frail after her illness.", "My grandmother is quite frail now.", "A frail old man.", "Frail from age."] },
  { id: "6b03f6fc-a76f-42be-9c2c-cae909a8dfa5", examples: ["The doddery old man needed help.", "He became doddery in his old age.", "A bit doddery.", "Doddery and slow."] },
  { id: "9b476e26-1852-4ec6-b1ae-9c55bbfac01a", examples: ["She needs to straighten her hair.", "Straighten your back.", "Straighten the wire.", "Try to straighten it."] },
  { id: "d640b2df-7f95-4252-a612-e76f9b156588", examples: ["Practice is the key to success.", "What's the key to happiness?", "The key to learning.", "Finding the key."] },
  { id: "80b716c4-61b4-4f96-a57b-6a71d54817c8", examples: ["Good lighting enhances the room.", "This cream enhances your skin.", "Enhanced features.", "Enhance the experience."] },
  { id: "52f400d1-2d11-4c27-a640-938eca190d6f", examples: ["Her best feature is her smile.", "A distinctive feature.", "Special features.", "Facial features."] },
  { id: "057fa96a-fa0a-4e83-8fc4-548c1e014691", examples: ["She discreetly left the room.", "Handle it discreetly.", "Discreetly mentioned.", "Done discreetly."] },
  { id: "0e1e087b-01f3-4e54-8fb1-cefc64834742", examples: ["He tried to conceal his anger.", "Concealing the truth.", "Conceal your feelings.", "Hard to conceal."] },
  { id: "e043b666-f8db-404e-9bb9-3c08aca92ee9", examples: ["Follow these guidelines.", "Safety guidelines.", "Clear guidelines.", "General guidelines."] },
  { id: "6ede22be-63c2-44d2-b7ef-a1771112449d", examples: ["Mirrors create an illusion of space.", "Create the illusion of depth.", "An optical illusion.", "Under the illusion."] },
  { id: "3f19846f-7881-4475-814e-61ccded7ba23", examples: ["That dress is very flattering.", "A flattering photo.", "Not very flattering.", "Most flattering."] },
  { id: "24b45add-6d31-40aa-ab5f-4f229fe905fe", examples: ["Don't exaggerate the problem.", "He tends to exaggerate.", "Greatly exaggerated.", "Exaggerate your achievements."] },
  { id: "165829ec-c6cb-4982-9e3f-9ef8ca2ae9ed", examples: ["The bright colors draw attention.", "Don't draw attention to yourself.", "Drawing attention to the issue.", "It draws attention."] },
  { id: "3cd5d88e-00bd-4013-8d0b-d2956ddad0b9", examples: ["He tried to attract her attention.", "Attract attention to the cause.", "Attracting unwanted attention.", "How to attract attention."] },
  { id: "c19a4179-fd8e-4c58-b7fe-c8c672fc5db9", examples: ["Pay attention to the details.", "She doesn't pay attention.", "Not paying attention.", "Pay close attention."] },
  { id: "85c716e5-4e90-4414-a538-c18d59ff3120", examples: ["Don't jump to conclusions.", "Jumping to wrong conclusions.", "Too quick to jump to conclusions.", "Before jumping to conclusions."] },
  { id: "fe270e3a-7bc4-404a-9447-f570bba14983", examples: ["A friendly gesture.", "Hand gestures.", "Made a gesture.", "Simple gesture."] },
  { id: "36ed151e-e101-492a-9a3a-546e1dd669e4", examples: ["He misinterpreted my words.", "Easy to misinterpret.", "Often misinterpreted.", "Don't misinterpret this."] },
  { id: "58ca8832-9645-422f-9124-7271995fb08d", examples: ["Maintain eye contact.", "Avoid eye contact.", "Direct eye contact.", "Making eye contact."] },
  { id: "d7c6f967-0e32-473b-818f-31329d6b6fde", examples: ["That's not necessarily true.", "Not necessarily a bad thing.", "Not necessarily.", "Not necessarily clear."] },
  { id: "5a3f0fc8-6591-4ffd-9f5b-240040913ad0", examples: ["I observed him from afar.", "Observe the rules.", "Scientists observe.", "Carefully observed."] },
  { id: "35689392-5efc-430b-af0e-9a164b36af99", examples: ["A winning combination.", "Unusual combination.", "Perfect combination.", "Strange combination."] },
  { id: "8a5c3377-b51e-4545-a9b7-f71ac23d08cb", examples: ["She displayed great courage.", "Display your work.", "On display.", "Displaying emotion."] },
  { id: "9817903d-5648-4b98-b12e-ffb19bc9fe0d", examples: ["Look out for signs of trouble.", "I'll look out for you.", "Looking out for opportunities.", "Look out for yourself."] },
  { id: "ca9b1f67-dfdd-4f14-bb61-dde8a0d92e6a", examples: ["He went red with embarrassment.", "Her face went red.", "Going red.", "Turned bright red."] },
  { id: "781dff63-d82e-46cd-8057-54c6f4d8e7e7", examples: ["I sweat a lot when exercising.", "Sweating profusely.", "He was sweating.", "Sweating buckets."] },
  { id: "3452d60d-0121-4698-814a-e9d6122860cb", examples: ["Excessive noise bothers me.", "Excessive drinking.", "Excessive force.", "Excessive spending."] },
  { id: "bcb9f755-3666-4a7e-8d27-41687c672d9a", examples: ["Bear in mind that prices vary.", "Bear this in mind.", "Bearing in mind.", "Keep in mind."] },
  { id: "ab9a7cb3-9af5-4785-8818-4dcce0db0462", examples: ["Don't make generalizations.", "Broad generalizations.", "Making generalizations.", "Sweeping generalization."] },
  { id: "651c695d-265e-4cff-a35d-1782302bdc01", examples: ["The title implies danger.", "What does that imply?", "Implying something else.", "It implies failure."] },
  { id: "4f244358-96bb-417c-8614-62440692999c", examples: ["His stubbornness is annoying.", "Pure stubbornness.", "Stubborn to a fault.", "Showing stubbornness."] },
  { id: "34ad10df-df20-4b9a-b949-b2a0167a461e", examples: ["I fancy a pizza tonight.", "She fancies him.", "Do you fancy going out?", "Fancy a drink?"] },
  { id: "18a70bab-ab55-4565-9760-07189d8401fa", examples: ["Stop fiddling with your phone.", "He kept fiddling with his pen.", "Fiddling around.", "Always fiddling."] },
  { id: "566a740e-76f3-42bf-868a-84a431225636", examples: ["She stroked the cat gently.", "Stroke your beard.", "Gently stroking.", "Stroked his hair."] },
  { id: "7dffaaa9-6463-49c1-9f43-43c60d426ed1", examples: ["They were flirting at the bar.", "Stop flirting!", "Flirting with danger.", "Casually flirting."] },
  { id: "04a3de63-49b2-4a8d-81d3-c9f79d8ade5f", examples: ["I crept downstairs quietly.", "Creeping around the house.", "Creep up on someone.", "Crept silently."] },
  { id: "7f28775b-7e7a-4acb-ae11-881b70e2bb56", examples: ["Let's stroll through the park.", "A leisurely stroll.", "Strolling along.", "Evening stroll."] },
  { id: "010590f1-8c69-41e9-b6e9-faf44b520ca0", examples: ["He limped off the field.", "Limping badly.", "Walking with a limp.", "Started to limp."] },
  { id: "412e0670-88c1-49fa-a44e-be89207bd3f8", examples: ["He staggered to the door.", "Staggering under the weight.", "Staggered home.", "Staggering drunk."] },
  { id: "a76a5bab-03b3-49dc-adc9-ff8646ba0d7b", examples: ["We hiked up the mountain.", "Hiking trails.", "Love to hike.", "Went hiking."] },
  { id: "5baf4080-2192-45c6-a427-5e0b3a540656", examples: ["Soldiers were marching.", "March on the street.", "Marching orders.", "March forward."] },
  { id: "d2c46c4f-d2a3-43aa-8b34-c9a983ea846f", examples: ["Dogs chased the ball.", "Police chased the thief.", "Chasing dreams.", "A wild chase."] },
  { id: "3af5ece5-f3b0-4093-b359-4aef894173bc", examples: ["I dashed to the store.", "Make a dash for it.", "Quick dash.", "Dashed away."] },
  { id: "4c9fece7-b00e-410c-81cf-fbae1f3ee573", examples: ["The horse galloped away.", "Galloping across the field.", "At a gallop.", "Full gallop."] },
  { id: "2012d70a-ee56-4c1e-9f1a-201de07ab690", examples: ["They charged at the enemy.", "Bulls charge.", "Charging forward.", "Infantry charge."] },
  { id: "7f39c7f8-34cd-4464-8b69-0375221b8bbe", examples: ["A quick workout.", "Morning workout.", "Intense workout.", "Workout routine."] },
  { id: "f01d7149-3be7-4ffa-9fbe-05f669d36321", examples: ["Yoga keeps you supple.", "Supple leather.", "Stay supple.", "Not very supple."] },
  { id: "59bcb0ee-255e-4cf5-9400-d11161d980e3", examples: ["Cats are very agile.", "Mental agility.", "Agile movements.", "Remarkably agile."] },
  { id: "18c83666-4954-4979-a232-4d6450f61f7e", examples: ["My neck feels stiff.", "Stiff muscles.", "Stiff from sitting.", "A stiff back."] },
  { id: "d3ebb973-eccb-404c-bbb1-50c9ff243d4a", examples: ["I feel sluggish today.", "Sluggish economy.", "A sluggish start.", "Feeling sluggish."] }
];

async function main() {
    console.log(`Enriching strict batch 12 of ${batch.length} cards...`);
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
