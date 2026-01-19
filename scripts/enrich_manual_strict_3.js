
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

// Batch 3 from strict_batch.json (Lines 91+ logic)
const batch = [
  { id: "c43f4545-e997-40c3-aab5-bb74358811c6", examples: ["I'm resigning, but keep it just between us.", "Just between us, I think he's lying.", "This is just between us, right?", "Just between us, I hate this place."] },
  { id: "6c653359-86ab-47f2-9596-f9e4225026a7", examples: ["I'm so hungry I could eat a horse.", "Is dinner ready? I could eat a horse.", "After that hike, I could eat a horse.", "He said he could eat a horse."] },
  { id: "e6f40398-3560-49a0-9883-7c8702c28695", examples: ["It is raining cats and dogs outside.", "We can't go out, it's raining cats and dogs.", "Take an umbrella, it's raining cats and dogs.", "Suddenly it started raining cats and dogs."] },
  { id: "ae206775-8e7c-4866-9e6e-c6c74d6b6343", examples: ["Hold your horses, we aren't ready yet.", "Whoa there, hold your horses.", "I told him to hold his horses.", "Hold your horses, let's think this through."] },
  { id: "8805f15d-007f-44a6-aa0e-ad2132646d90", examples: ["That name rings a bell.", "Does the name 'Smith' ring a bell?", "His face rings a bell, but I can't place him.", "It rings a bell, but I'm not sure."] },
  { id: "0e2d3648-8422-4469-82cf-e39a3f2d2562", examples: ["Let's play it by ear and see how we feel.", "We don't have a plan, we'll play it by ear.", "I usually play it by ear.", "Can we just play it by ear?"] },
  { id: "53472099-3142-4328-82ea-9c043006a88e", examples: ["I'm feeling under the weather today.", "He called in sick because he's under the weather.", "A bit under the weather.", "You look under the weather."] },
  { id: "cc54608c-9c6a-48d6-95fb-8288849b3846", examples: ["Break a leg in your performance tonight!", "I told him to break a leg.", "Go out there and break a leg.", "Break a leg!"] },
  { id: "f2c1998e-4a68-450f-a99f-7f5516008b8b", examples: ["To make a long story short, we won.", "Long story short, I got fired.", "Anyway, long story short, we're moving.", "Make a long story short."] },
  { id: "9b3b0821-255e-42c2-841f-885408544e43", examples: ["He let the cat out of the bag about the surprise party.", "Don't let the cat out of the bag.", "Who let the cat out of the bag?", "The secret is out, the cat is out of the bag."] },
  { id: "17b84451-d41c-4384-95e3-855584558223", examples: ["Getting this job was a piece of cake.", "Calculate this? Piece of cake.", "The exam was a piece of cake.", "Not exactly a piece of cake."] },
  { id: "28e08548-c290-410e-a864-152865406080", examples: ["That car cost an arm and a leg.", "I want it, but it costs an arm and a leg.", "College costs an arm and a leg these days.", "Don't pay an arm and a leg."] },
  { id: "84725301-49b8-444a-a400-d66825590924", examples: ["Don't bite off more than you can chew.", "He took three jobs and bit off more than he could chew.", "I think I bit off more than I can chew.", "Be careful not to bite off more than you can chew."] },
  { id: "5575608d-e652-4112-a169-d65297121651", examples: ["Stop beating around the bush and tell me.", "He kept beating around the bush.", "Don't beat around the bush.", "She beat around the bush for an hour."] },
  { id: "a2b09088-251f-4022-ba78-144d8255018a", examples: ["I'm burning the midnight oil to finish this report.", "Exam week means burning the midnight oil.", "He's been burning the midnight oil lately.", "Burn the midnight oil."] },
  { id: "06263004-7128-4422-b94d-986510300088", examples: ["Don't put all your eggs in one basket.", "Invest wisely, don't put all your eggs in one basket.", "He put all his eggs in one basket and lost everything.", "Never put all your eggs in one basket."] },
  { id: "74091555-d36c-482a-a55e-ba4684530064", examples: ["We see eye to eye on most things.", "I don't see eye to eye with my boss.", "They finally see eye to eye.", "Do you see eye to eye?"] },
  { id: "d6528821-9494-4770-8772-564024844611", examples: ["Actions speak louder than words.", "Prove it, actions speak louder than words.", "Remember, actions speak louder than words.", "But actions speak louder than words."] },
  { id: "09908482-1256-4122-8641-fc8448880026", examples: ["Let's call it a day.", "I'm tired, let's call it a day.", "We've done enough, call it a day.", "Time to call it a day."] },
  { id: "44722521-1255-4688-a400-085288151241", examples: ["Please cut me some slack, I'm new here.", "Cut him some slack.", "Can you cut me some slack?", "I wish she would cut me some slack."] },
  { id: "25041014-a900-4100-8451-d41285215004", examples: ["He is on the ball today.", "You need to be on the ball to work here.", "Stay on the ball.", "She's always on the ball."] },
  { id: "88824104-a552-4412-a988-cb8854000185", examples: ["Get your act together or you're fired.", "I need to get my act together.", "He finally got his act together.", "Time to get your act together."] },
  { id: "12520021-d125-4412-a885-c44245100142", examples: ["To make matters worse, it started raining.", "And to make matters worse, I lost my wallet.", "Don't make matters worse.", "Making matters worse."] },
  { id: "00145214-a996-4102-b258-001258844111", examples: ["That's the best thing since sliced bread.", "Smartphone is the best thing since sliced bread.", "He thinks he's the best thing since sliced bread.", "Best thing since sliced bread."] },
  { id: "55520145-d852-4441-a120-d54125852100", examples: ["Don't cry over spilt milk.", "It's done, don't cry over spilt milk.", "No use crying over spilt milk.", "Crying over spilt milk won't help."] },
  { id: "98522014-c521-4100-a541-d85200144510", examples: ["Curiosity killed the cat.", "Don't ask too many questions; curiosity killed the cat.", "Remember, curiosity killed the cat.", "Curiosity killed the cat, but satisfaction brought it back."] },
  { id: "00254100-a552-4011-b256-d84125001452", examples: ["Let sleeping dogs lie.", "Don't bring up that old fight, let sleeping dogs lie.", "I decided to let sleeping dogs lie.", "Best to let sleeping dogs lie."] },
  { id: "77412005-d852-4111-a852-c44125000145", examples: ["I'm feeling under the weather.", "She's a bit under the weather.", "Call in sick if you're under the weather.", "Under the weather today."] },
  { id: "55201441-a852-4100-b552-d52014520014", examples: ["You can't judge a book by its cover.", "He looks mean but he's kind; don't judge a book by its cover.", "Never judge a book by its cover.", "Judge a book by its cover."] },
  { id: "88522014-c552-4102-a541-d52001445100", examples: ["Kill two birds with one stone.", "I can shop and visit mom, killing two birds with one stone.", "He killed two birds with one stone.", "Like killing two birds with one stone."] },
  { id: "729c104e-289b-40f4-a559-994c929a43a8", examples: ["Don't badmouth him.", "She backstabbed her friend.", "Badmouthing behind back.", "Backstabber behavior."] },
  { id: "a52e0002-c958-40a2-b285-d52014451221", examples: ["What makes you tick?", "Understand what makes him tick.", "Know what makes her tick.", "Find out what makes them tick."] },
  { id: "c5521400-b852-4102-a552-d14452001255", examples: ["Catch him red-handed.", "Caught red-handed stealing.", "Red-handed evidence.", "Caught red-handed."] },
  { id: "d5201441-a552-4100-b852-c00125852114", examples: ["Beat the rap.", "Managed to beat the rap.", "Lawyer beat the rap.", "Can't beat the rap."] },
  { id: "12520014-d852-4100-a552-b85200144521", examples: ["It is what it is.", "Accept it, it is what it is.", "Can't change it, it is what it is.", "Situation is what it is."] },
  { id: "88520014-c552-4011-a852-d55201445120", examples: ["Let's split the bill.", "Go Dutch.", "Split the check.", "Pay separately."] },
  { id: "55200144-a852-4100-b552-c12500145210", examples: ["We're even.", "Even steven.", "Now we are even.", "Settled."] },
  { id: "00142552-b852-4100-a552-d52014451200", examples: ["Let me sleep on it.", "Decide tomorrow, sleep on it.", "Sleep on the decision.", "Need to sleep on it."] },
  { id: "44200155-a852-4100-b552-c52014522001", examples: ["I'll get back to you.", "Let me check and get back to you.", "Get back to you later.", "Got back to me."] },
  { id: "99520014-c552-4100-a852-d55201445102", examples: ["It's on me.", "Dinner is on me.", "I'll pay, it's on me.", "Don't worry, it's on me."] }
];

async function main() {
    console.log(`Enriching strict batch 3 of ${batch.length} cards...`);
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
