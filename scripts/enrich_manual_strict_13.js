
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

// Batch 13 (Indices 50-99)
const batch = [
  { id: "ac6fc36e-1828-45f0-9d5a-5e137e6e622d", examples: ["She devised a plan.", "Devise a new strategy.", "Cleverly devised.", "Who devised this?"] },
  { id: "a79e1373-9e91-4097-8fdf-3a11962274d3", examples: ["Loosen up before running.", "Let me loosen up first.", "Loosening up exercises.", "Time to loosen up."] },
  { id: "df888d4f-7d82-4850-a203-45142f565d4a", examples: ["Bend your knees.", "She bent down.", "Can you bend this?", "Bend over carefully."] },
  { id: "743ccaae-07ae-4eba-bbdc-fb27764d0dbe", examples: ["That's too strenuous.", "Strenuous exercise.", "A strenuous hike.", "Nothing too strenuous."] },
  { id: "5d548ec5-5a60-44dd-8daf-8bad052de5eb", examples: ["The heat was relentless.", "Relentless pressure.", "A relentless pursuit.", "Relentless rain."] },
  { id: "1a9cc6cb-ffd1-4383-8590-1e8d69cc9cf2", examples: ["A recurrent problem.", "Recurrent nightmares.", "This is recurrent.", "Recurrent theme."] },
  { id: "42d161a1-063a-4ce6-bde6-47256d72c721", examples: ["Alternate between hot and cold.", "We alternate shifts.", "Alternating colors.", "Alternate between tasks."] },
  { id: "352e3f53-553a-45b0-9dfd-ec8f84c4b48c", examples: ["He can sprint fast.", "Sprint to the finish.", "Final sprint.", "Sprinting across the field."] },
  { id: "00425c1c-0414-4c33-891c-d66a39f815fe", examples: ["A constant noise.", "Constant interruptions.", "Constant companion.", "At a constant speed."] },
  { id: "bf928ac5-c531-4d4a-9f03-a580080a511a", examples: ["The cage rattled.", "Keys rattled.", "Rattling sound.", "Wind rattled the window."] },
  { id: "06f7bc57-6860-414f-956d-9eca70880fae", examples: ["I heard a distant rumble.", "Rumble of thunder.", "Stomach rumbled.", "A low rumble."] },
  { id: "ef18f91d-35a5-4ba4-912a-5effc2c6d2d3", examples: ["Leaves rustled in the wind.", "Paper rustling.", "A soft rustle.", "Rustling sounds."] },
  { id: "4ac7f231-2b11-49ff-90f2-b371b053c180", examples: ["Water splashed everywhere.", "Splash of cold water.", "Kids splashing.", "Splashing in puddles."] },
  { id: "1cf0e89c-2557-472a-bfc2-53d036a4027f", examples: ["The car beeped.", "Why is it beeping?", "A loud beep.", "Phone beeped."] },
  { id: "b71fb0ef-1b75-48ef-8208-08bd25f9ecd5", examples: ["A screech of brakes.", "Owl's screech.", "Tires screeched.", "Screeching halt."] },
  { id: "eb22f2de-7fb7-455f-ae8a-98dffa9fdd39", examples: ["She slammed the door.", "Don't slam it.", "Door slammed shut.", "Slammed the book down."] },
  { id: "bde68238-34c1-4083-b68e-fdfac31f9017", examples: ["Shoes squelched in the mud.", "Squelching sound.", "Squelching through mud.", "A squelch noise."] },
  { id: "9f839aa5-f1f7-43a8-8b24-e9f4996393c3", examples: ["The door creaked.", "Creaky floorboards.", "Stairs creaked.", "It creaks at night."] },
  { id: "a9f8abbd-6d9d-4171-8f39-e7a9a38cf801", examples: ["A high-pitched voice.", "High-pitched scream.", "High-pitched sound.", "Too high-pitched."] },
  { id: "3ff93036-1e67-4662-938c-6b984e6901bb", examples: ["The dog barked loudly.", "Barking all night.", "Loud bark.", "Stop barking!"] },
  { id: "17e0c92f-dce6-4b92-b493-be24efc52d28", examples: ["Wolves howled.", "Howling wind.", "Howled with pain.", "A distant howl."] },
  { id: "cc61c2a0-d32a-4518-a043-18c328690ad7", examples: ["The dog growled.", "He growled angrily.", "A low growl.", "Stop growling."] },
  { id: "71776a02-8d17-4047-be01-e421e9d5c73b", examples: ["Bees buzzed around.", "My phone is buzzing.", "Head was buzzing.", "Buzzing sound."] },
  { id: "e28614b7-2c3c-4a86-9758-c8046f4481e9", examples: ["The lion roared.", "Crowd roared.", "Roaring laughter.", "Engine roared."] },
  { id: "214b62d6-054a-4c5b-b9d2-4bc01a75444c", examples: ["The mouse squeaked.", "Squeaky voice.", "Shoes squeak.", "A tiny squeak."] },
  { id: "c01143d0-3a44-4d96-9dd2-cb0f9a3ef8ad", examples: ["The rooster crowed.", "Crowing about success.", "Don't crow about it.", "He was crowing."] },
  { id: "b40ed67b-b965-432a-a9ac-c27123ebcd01", examples: ["The owl hooted.", "Car hooted at me.", "Hoots of laughter.", "Hooting sound."] },
  { id: "964bec77-ba56-4a2c-ac86-3cd5c876065c", examples: ["My eyesight is poor.", "Good eyesight.", "Check your eyesight.", "Failing eyesight."] },
  { id: "10e831c7-26d0-4b5d-88c6-aa47c20460d9", examples: ["Working causes eye strain.", "Reduce eye strain.", "Prevent eye strain.", "Eye strain headache."] },
  { id: "71c47f42-7f81-45ab-bfda-238764974129", examples: ["She felt discomfort.", "Minor discomfort.", "Cause discomfort.", "Physical discomfort."] },
  { id: "66f84681-5523-404e-b7fe-6b84d82cef9f", examples: ["I had blurred vision.", "Vision became blurred.", "Blurred vision symptoms.", "Causes blurred vision."] },
  { id: "fa5cfd91-f55d-4347-968d-53492afebfb8", examples: ["Blink your eyes.", "Without blinking.", "Blink rapidly.", "Didn't blink."] },
  { id: "446b1bb5-e6e6-4ba7-9b94-d40d232155fe", examples: ["Tears rolled down.", "In tears.", "Tears of joy.", "Fighting back tears."] },
  { id: "165b031f-e67f-4bce-8738-9e4c3284f3bf", examples: ["My skin is irritated.", "Irritated eyes.", "Easily irritated.", "Feeling irritated."] },
  { id: "81648ad7-71a0-478c-a968-e7fc6a76f532", examples: ["This will ease the pain.", "Ease your worries.", "Ease the tension.", "Gradually easing."] },
  { id: "9d00181d-2088-458a-b548-9a88a4b91a70", examples: ["Adjust the settings.", "Adjust your tie.", "Easy to adjust.", "Adjusting to changes."] },
  { id: "0cd8fce3-a05b-47c0-90a6-ae1d3a7e3f92", examples: ["Eliminate the risk.", "We must eliminate waste.", "Eliminate distractions.", "Completely eliminated."] },
  { id: "8b885223-6454-4274-9ee0-8607d1cd9b16", examples: ["The glare hurt my eyes.", "Reduce screen glare.", "Sun's glare.", "Glare of headlights."] },
  { id: "53a0adc8-cc99-42f5-ad50-98f72efefd19", examples: ["Keep the soil moist.", "Moist air.", "Slightly moist.", "A moist cake."] },
  { id: "a5812bcf-66de-480a-b316-44522c92ffec", examples: ["She is partially sighted.", "Partially sighted users.", "Help for partially sighted.", "Registered partially sighted."] },
  { id: "69fa2bce-80fc-439d-8d5e-57e2885af3ba", examples: ["She gazed at the stars.", "Gazed lovingly.", "A steady gaze.", "Gazing into the distance."] },
  { id: "3307007c-b243-467c-a616-f8735dda579e", examples: ["A breathtaking view.", "Breathtaking scenery.", "Simply breathtaking.", "Breathtaking beauty."] },
  { id: "d41b3442-5c9c-4d8b-ab8c-f41a4d974db3", examples: ["I could barely hear.", "Barely awake.", "Barely visible.", "Barely made it."] },
  { id: "ea36d3cc-099b-4bda-9320-b6bd64e545a3", examples: ["The mountain is visible.", "Clearly visible.", "Barely visible.", "Visible to all."] },
  { id: "7c9eb894-c7d2-47ad-a146-e827ac1c86b6", examples: ["A haze covered the city.", "Morning haze.", "Heat haze.", "Through the haze."] },
  { id: "bbb8ad68-37f6-4300-aed1-da8c13b6fd1b", examples: ["I can't make it out.", "Hard to make out.", "Could just make out.", "Making out shapes."] },
  { id: "e4fe4b09-7b3a-462c-8408-8bd1f8b146d0", examples: ["The ship came into view.", "Came into sight.", "Nothing in view.", "Coming into view."] },
  { id: "b06f91e9-44b9-4dca-84d1-eeb266b5b8bc", examples: ["Stand still!", "Can't stand still.", "Standing still.", "Hold still."] },
  { id: "4085a6f4-95e9-4bae-a6dd-94894d09fcec", examples: ["She eyed him suspiciously.", "Eyed the food.", "Eying the competition.", "Being eyed."] },
  { id: "32e1d754-ecce-4404-8b21-65b4cb540d1d", examples: ["Proceed warily.", "Looked warily.", "Warily approaching.", "Eyed warily."] }
];

async function main() {
    console.log(`Enriching strict batch 13 of ${batch.length} cards...`);
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
