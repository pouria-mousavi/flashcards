
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

// Batch 7 (Indices 150-199 of new strict_batch.json)
const batch = [
  { id: "f0be0805-a437-457a-a84f-6d2b4d6eee4d", examples: ["You made a mistake, now you have to face the music.", "He didn't study, so he has to face the music.", "Time to face the music.", "Facing the music is hard."] },
  { id: "55055822-45b2-4fba-a39b-34201804b46f", examples: ["The teacher turned a blind eye to the cheating.", "Don't turn a blind eye to injustice.", "He turned a blind eye.", "Turning a blind eye is wrong."] },
  { id: "7ead090c-3fbe-4c9c-bb5a-398e214a611e", examples: ["When the WiFi stopped, he blew a fuse.", "Don't blow a fuse over something small.", "She blew a gasket.", "Blew a fuse completely."] },
  { id: "655428ad-f5d1-46c1-8570-2dcfcc3c4663", examples: ["I'm not your guinea pig for testing makeup.", "He felt like a guinea pig in the study.", "Don't treat me like a guinea pig.", "Guinea pig experiment."] },
  { id: "2f2f9466-08c9-4957-bc08-df109382b224", examples: ["I look up to my father.", "She needs someone to look up to.", "He's a role model I look up to.", "Looking up to heroes."] },
  { id: "8dbb9727-72bb-4af1-9b33-ffe1626ef0f3", examples: ["Don't look down on people with less money.", "She looks down on everyone.", "Looking down on others is rude.", "He felt looked down on."] },
  { id: "f519df80-3c95-42cd-9889-7e84735bf976", examples: ["Everyone bought that stock, so I jumped on the bandwagon.", "Don't just jump on the bandwagon.", "Jumping on the bandwagon is easy.", "She jumped on the bandwagon late."] },
  { id: "89b3d6ae-5948-4668-a220-335fc715c870", examples: ["Missing the train was a blessing in disguise.", "Her rejection was a blessing in disguise.", "Truly a blessing in disguise.", "Blessing in disguise moment."] },
  { id: "261ce809-2d9c-4491-928f-2e8a71b1043d", examples: ["I stuck my neck out for you.", "Don't stick your neck out if you're not sure.", "He stuck his neck out to save me.", "Sticking my neck out."] },
  { id: "d45b1cd4-9e54-4f47-95f4-2e97b81e6874", examples: ["She organizes everything; she has a finger in every pie.", "He wants a finger in every pie.", "Having a finger in every pie makes him busy.", "Finger in every pie manager."] },
  { id: "d3fd3ece-76ec-425a-bf3f-4324072470d7", examples: ["He told the teacher; he's a stool pigeon.", "Don't be a snitch.", "The gang hated the stool pigeon.", "Stool pigeon behavior."] },
  { id: "da509d31-74cf-4529-a7ec-8cc255cd96b6", examples: ["Mr. Know-it-all thinks he's always right.", "Don't be a know-it-all.", "She hates know-it-alls.", "Know-it-all attitude."] },
  { id: "8888a4e6-810b-439f-a8b7-9a729e112533", examples: ["The debate is over; don't beat a dead horse.", "Discussing this again is beating a dead horse.", "Stop beating a dead horse.", "Beating a dead horse is useless."] },
  { id: "6cfe7138-68c8-4e16-bfdf-d89a2b3f93db", examples: ["It took a week to get into the swing of things.", "Finally got into the swing of things.", "Get into the swing of things quickly.", "Hard to get into the swing of things."] },
  { id: "ad9824d3-05e5-4e0d-95c0-da51a930ed2a", examples: ["The new intern is learning the ropes.", "Show him the ropes.", "Learning the ropes takes time.", "I know the ropes."] },
  { id: "303d8acf-1590-443e-aa16-6b21fb68f6c0", examples: ["Complaining about your parents is biting the hand that feeds you.", "Don't bite the hand that feeds you.", "He bit the hand that fed him.", "Biting the hand that feeds you is ungrateful."] },
  { id: "c352431a-f762-40c0-84f1-5c1af559f8b0", examples: ["I slept like a log last night.", "He sleeps like a log.", "Sleeping like a log is great.", "Slept like a log through the storm."] },
  { id: "98cab451-fa00-44cf-a479-d07648e631ff", examples: ["The celebrity tried to keep a low profile.", "Keep a low profile at the meeting.", "He kept a low profile to avoid trouble.", "Keeping a low profile is smart."] },
  { id: "fd8cd8dc-e1a4-442d-ba0c-e68047c5f44c", examples: ["She let the cat out of the bag.", "Who let the cat out of the bag?", "Don't let the cat out of the bag.", "The cat is out of the bag."] },
  { id: "8ed4b4fd-dc53-492e-8261-eb464e9060db", examples: ["He stood in the rain and looked like a drowned rat.", "Wet like a drowned rat.", "Feeling like a drowned rat.", "Drowned rat appearance."] },
  { id: "e6693069-985f-4d83-bef0-272363a5b176", examples: ["I'm just pulling your leg.", "He loves pulling my leg.", "Stop pulling my leg.", "She was pulling your leg."] },
  { id: "8b147488-c318-4dc8-92c0-9a23c1d0bde1", examples: ["Dip a toe in to test the waters.", "Testing the waters before investing.", "Let's test the waters first.", "Tested the waters."] },
  { id: "71dcae71-b6a5-493b-8a66-d301b5b730b6", examples: ["If you fail, you'll have egg on your face.", "He had egg on his face after the mistake.", "Don't get egg on your face.", "Total egg on face moment."] },
  { id: "9b13f72a-c604-4dcb-8874-7e9f4a05a6ae", examples: ["Waiting for the call, I was on pins and needles.", "She's on pins and needles.", "Living on pins and needles.", "On pins and needles with anxiety."] },
  { id: "79da45d4-0f13-48f8-92bb-8007affa57b7", examples: ["He threw his partner under the bus.", "Don't throw me under the bus.", "Thrown under the bus by the boss.", "Throwing people under the bus."] },
  { id: "5289a3e4-371c-4ea6-a52e-fb091d53c00f", examples: ["He wants success handed to him on a silver platter.", "Life isn't handed on a silver platter.", "Handed on a silver platter.", "Silver platter treatment."] },
  { id: "52cb4ff0-c1a2-44e1-b6ab-438f6d7b55a2", examples: ["I have butterflies in my stomach.", "Butterflies in my stomach before the date.", "Getting butterflies in my stomach.", "Butterflies in stomach feeling."] },
  { id: "93f238cc-48d4-4aa4-8b38-2280bf9da3dc", examples: ["Keep your ear to the ground for news.", "He kept his ear to the ground.", "Keeping an ear to the ground.", "Ear to the ground strategy."] },
  { id: "1873a985-fd90-4ccb-85fa-c8d1563a2ef2", examples: ["The room was topsy-turvy.", "Everything went topsy-turvy.", "Topsy-turvy world.", "A topsy-turvy day."] },
  { id: "da326be2-017a-4e3c-8f14-687f174837ca", examples: ["Don't burn bridges when you leave.", "He burned his bridges.", "Burning bridges is unwise.", "Never burn bridges."] },
  { id: "195fb9c2-ae35-4561-90a0-d782493fd870", examples: ["I did my part, now the ball is in your court.", "The ball is in your court.", "Ball is in his court.", "Leaving the ball in your court."] },
  { id: "f570dc68-06ae-44b5-ad36-e95606228aab", examples: ["He'll apologize when pigs fly.", "That will happen when pigs fly.", "When pigs fly!", "Waiting for pigs to fly."] },
  { id: "ae9e44b6-58c4-4bce-b70d-ad353e68523a", examples: ["Don't interrupt me.", "Sorry to interrupt.", "He always interrupts.", "Interrupting is rude."] },
  { id: "2113728b-2925-4a50-94fd-eff271ffd500", examples: ["I'll get there by hook or by crook.", "Win by hook or by crook.", "By hook or by crook he succeeded.", "Must finish by hook or by crook."] },
  { id: "a6f518c1-1c83-45cf-9b97-03534207bdc1", examples: ["Don't take your eye off the ball.", "He took his eye off the ball and lost.", "Taking eye off the ball is dangerous.", "Keep your eye on the ball."] },
  { id: "07a6c095-ac59-4eec-8ae5-d22070604cb0", examples: ["Let's change the subject.", "Don't change the subject.", "Changing the subject awkwardly.", "He changed the subject."] },
  { id: "d8d93927-f44d-488f-ba57-9ad6fff7bf34", examples: ["Struggling to make ends meet.", "They can barely make ends meet.", "Making ends meet is hard.", "To make ends meet."] },
  { id: "4f23316e-dbfd-4f7f-b51a-8952155e1001", examples: ["Sorry to rain on your parade.", "Don't rain on my parade.", "He rained on everyone's parade.", "Raining on the parade."] },
  { id: "1fd925fa-06f7-4250-8c01-a91b7cc4e64f", examples: ["He is so pig-headed.", "Don't be pig-headed.", "Pig-headed refusal.", "Acting pig-headed."] },
  { id: "e445efa9-588b-424f-aba7-9fc0b24a0fc3", examples: ["You really dodged a bullet there.", "Dodging a bullet.", "I dodged a bullet.", "Bullet dodged."] },
  { id: "81bb653c-35e7-48f4-a5f1-1748562012db", examples: ["Stand still.", "The air was still.", "Sit still.", "Still water."] },
  { id: "807453bd-744d-4a03-8bbf-7f3e83a13b1b", examples: ["Better still.", "harder still.", "Fast, but faster still.", "Even still."] },
  { id: "37574f2f-49ac-4abd-a975-83eb8d0e4e69", examples: ["It was raining; still, we went out.", "He is old; still, he runs.", "I'm tired; still, I must work.", "Still, it's good."] },
  { id: "df9cc182-98e1-4647-aabb-7097e6cb749c", examples: ["The news leaked.", "Information was leaked.", "Leaked documents.", "Secret leaked."] },
  { id: "555383c4-d6a3-4733-a5aa-c0f20f508f8f", examples: ["People flooding in.", "Flooding boundaries.", "Letters flooding the office.", "Flooding with requests."] },
  { id: "a1129913-9470-486d-af64-8ab89faa8ef6", examples: ["Under the microscope.", "Put his life under the microscope.", "Examined under the microscope.", "Living under the microscope."] },
  { id: "3c69fbfb-3e40-4cce-835a-cc5e246b6fd8", examples: ["An old friend called.", "Meeting an old friend.", "He's an old friend.", "Old friends reuse."] },
  { id: "64894ce6-5130-4b19-aad6-37c1b5f6ee67", examples: ["I missed the bus.", "He missed the bus.", "Don't miss the bus.", "Missed the bus again."] },
  { id: "bd878fe5-5033-4f3c-b7b9-11de3b125d7d", examples: ["It is highly unlikely.", "Highly unlikely event.", "Success is highly unlikely.", "Most highly unlikely."] },
  { id: "6e8dc356-4d63-4c55-b412-85ab942db3b5", examples: ["Torrential rainfall damaged the roof.", "Torrential rainfall expected.", "Heavy torrential rainfall.", "Caught in torrential rainfall."] },
  { id: "682293b8-d7a1-4182-bff8-6e24bc581acb", examples: ["She needs constant care.", "Giving constant care.", "Constant care unit.", "Requiring constant care."] }
];

async function main() {
    console.log(`Enriching strict batch 7 of ${batch.length} cards...`);
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
