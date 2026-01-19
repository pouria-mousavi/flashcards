
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

const batch = [
  { id: "28590cac-d3c4-4854-8507-74c9d95f2cc9", examples: ["Just a bluff.", "Called his bluff.", "Bluff your way.", "Don't bluff me."] },
  { id: "1ea405a5-66ec-4569-8605-44cad95c1465", examples: ["Give them ammo.", "Don't give him leverage.", "Used as leverage.", "Political ammo."] },
  { id: "582d9499-af69-4dec-9eed-e09a69f06a6f", examples: ["Accused of nepotism.", "Clear nepotism.", "Benefit from nepotism.", "Fight nepotism."] },
  { id: "f4cb63ff-e030-46c5-9dc9-c44a826fa6dd", examples: ["Stop bragging.", "Showing off his car.", "Don't show off.", "Likes to brag."] },
  { id: "001b24dd-9407-49f0-976a-5029226330cd", examples: ["Don't exaggerate.", "Exaggerate the truth.", "Blew it out of proportion.", "Tendency to exaggerate."] },
  { id: "b1edff39-15b0-42a8-9de8-13ba891e9704", examples: ["Turn the tables.", "Tables have turned.", "Turn the tables on him.", "Finally turn the tables."] },
  { id: "1e602709-6709-4ce3-9af5-cae3b544395e", examples: ["Greedy man.", "Don't be greedy.", "Greedy for power.", "Eating greedily."] },
  { id: "37e3a43e-1b96-465e-9639-1c54065a62b7", examples: ["Be blunt.", "Blunt answer.", "Straightforward advice.", "To be blunt."] },
  { id: "8073d6db-d67c-485d-ae61-ec6a2b0de503", examples: ["Don't gossip.", "Spread gossip.", "Office gossip.", "Love to gossip."] },
  { id: "ba2b8a23-04b5-4a79-9c83-bcbc68f26fbf", examples: ["Keeping up with the Joneses.", "Tired of keeping up with the Joneses.", "Don't keep up with the Joneses.", "Stop keeping up with the Joneses."] },
  { id: "2780cbbd-c367-4c6f-a3da-3d8eda69a6ff", examples: ["You lost the argument.", "Don't lose the argument.", "Accept you lost the argument.", "Sure to lose the argument."] },
  { id: "e9783082-7928-4a88-892d-4d624000e7fd", examples: ["Stop nagging.", "She nags him.", "Don't be a nag.", "Constant nagging."] },
  { id: "f509f431-d323-4ee2-a288-0878f5fda0c2", examples: ["Take the bread out of his mouth.", "Stealing jobs takes bread out of mouths.", "Don't take the bread out of my mouth.", "Refuse to take the bread out of their mouths."] },
  { id: "9b234aa9-fab7-4e48-a486-9d23732b8434", examples: ["Stop stalling.", "Dragging his feet.", "Don't drag your feet.", "Stalling for time."] },
  { id: "efd10ec6-8427-4299-9be2-95d0e797016e", examples: ["Splurge on a meal.", "Go ahead and splurge.", "Big splurge.", "Splurge today."] },
  { id: "8aca4e66-f21b-4615-b074-1dea3cf7ad26", examples: ["Stubborn refuse.", "Don't be stubborn.", "Headstrong decisions.", "Stubborn as a mule."] },
  { id: "9e9cb03a-dc97-449f-b315-c8f4d0c3bfe4", examples: ["He is the teacher's pet.", "Playing favorites.", "Teacher's pet behavior.", "Don't be a teacher's pet."] },
  { id: "3bd6b2d8-2f1c-4060-98c6-c8c8f38da6e6", examples: ["Sneaky move.", "Underhanded tactics.", "Don't be sneaky.", "Sneaky suspicion."] },
  { id: "db5473eb-8b19-4b13-bbae-27ea8250bdab", examples: ["Got flustered.", "Don't get flustered.", "Easily flustered.", "Looked flustered."] },
  { id: "34dbc898-6a70-4bae-ae6b-4b9ab7d0a742", examples: ["Ungrateful wretch.", "Don't be ungrateful.", "Seem ungrateful.", "Ungrateful child."] },
  { id: "2c00444d-201c-4e61-8316-f1905a1449cc", examples: ["Don't rain on my parade.", "Rained on his parade.", "Rain on someone's parade.", "Sorry to rain on your parade."] },
  { id: "739c3f4f-66eb-4c70-98b4-9b7bed762e03", examples: ["Brush it off.", "Brush him off.", "Brushed off the criticism.", "Just brush off."] },
  { id: "823b47b3-9be5-410d-a023-4372515afde1", examples: ["Not in the mood.", "Are you in the mood?", "In the mood for pizza.", "Clearly not in the mood."] },
  { id: "25ae23cb-d731-4eee-ad63-fa4c604d1fc1", examples: ["Telling a tall tale.", "Pure fabrication.", "Sounded like a tall tale.", "Is it a tall tale?"] },
  { id: "2f7866ef-6b58-4eb8-8803-2aed8255cdd3", examples: ["Stop sucking up.", "Brown-nosing the boss.", "He's just brown-nosing.", "Don't brown-nose."] },
  { id: "fb9c8e3f-c431-48fb-9993-1f20078d74b8", examples: ["Cover up the truth.", "Gloss over mistakes.", "Don't gloss over it.", "Big cover up."] },
  { id: "8d56b93c-378c-477c-9798-94027ee4bf1b", examples: ["Get off scot-free.", "Got off scot-free.", "Walk away scot-free.", "He shouldn't get off scot-free."] },
  { id: "ddfc58d2-5c40-4889-ae9c-d776142e921b", examples: ["Constant one-upmanship.", "Tired of one-upmanship.", "Corporate one-upmanship.", "Game of one-upmanship."] },
  { id: "f410aac7-3bcb-4941-9ed8-c642cb429326", examples: ["Chaos broke out.", "Haywire system.", "Engine went haywire.", "Total chaos."] },
  { id: "e44e7a4b-53c0-48bd-9828-008350debfb4", examples: ["Henceforth illegal.", "Known henceforth as.", "Banned henceforth.", "Henceforth declared."] },
  { id: "0366283b-afd4-4893-a3d8-63d1b40e18b6", examples: ["At the expense of his health.", "Joke at my expense.", "Profit at the expense of others.", "At the expense of quality."] },
  { id: "0e8eaa40-2f21-4cdd-a233-b534b98193f0", examples: ["Notwithstanding the cost.", "Delays notwithstanding.", "Notwithstanding his age.", "Advice notwithstanding."] },
  { id: "d1137b1f-8209-4a15-a250-dd9ab2ad1f28", examples: ["I hereby certify.", "Hereby granted.", "We hereby declare.", "Hereby resolve."] },
  { id: "28c280f0-cf6d-4573-826d-c5ebee4c72b5", examples: ["In the event of rain.", "In the event of emergency.", "Plan for the event of.", "In the event that it fails."] },
  { id: "5e82972e-f307-4b07-90f5-b87a5e6db5a2", examples: ["Occurred simultaneously.", "Press simultaneously.", "Run simultaneously.", "Speak simultaneously."] },
  { id: "8e8d4ad5-63be-43be-9769-ce7ac50cad77", examples: ["Subsequently fired.", "Subsequently died.", "Subsequently discovered.", "He subsequently left."] },
  { id: "1fef3300-dc6f-49a5-acbd-afcdfb864530", examples: ["Not necessarily true.", "Don't necessarily agree.", "Necessarily imply.", "Is it necessarily bad?"] },
  { id: "c8fc2e33-ef05-49e2-9481-f61b1e81474a", examples: ["Provided that you pay.", "Provided that it rains.", "Go, provided that.", "I will help provided that."] },
  { id: "90c11e30-b109-4636-bbb4-f81c64694824", examples: ["In stark contrast to.", "Stark contrast between.", "Stands in stark contrast.", "Stark contrast to his words."] },
  { id: "4df9ea51-084f-48bb-950e-5613a7a1f23b", examples: ["In lieu of flowers.", "Take cash in lieu of.", "In lieu of notice.", "Act in lieu of."] },
  { id: "c5efc470-7abb-49b7-97f9-6accf2bb3e00", examples: ["In light of events.", "In light of the evidence.", "Reconsider in light of.", "In light of this."] },
  { id: "ddf6f0f8-098f-45bc-b1e0-f56c456ae80e", examples: ["Regardless of cost.", "Carry on regardless of.", "Regardless of the outcome.", "Regardless of age."] },
  { id: "a26da607-86c6-4f24-b275-289b5714ba37", examples: ["Living on the razor's edge.", "On the razor's edge.", "Situation on the razor's edge.", "Razor's edge of disaster."] },
  { id: "0fe2053b-22d7-475f-b609-a367763fa73c", examples: ["To the extent that I can.", "True to the extent that.", "To the extent that it helps.", "Agreed to the extent that."] },
  { id: "cc85b5fe-e7af-44f1-9585-efea68056c9d", examples: ["Start with a clean slate.", "Wipe the slate clean.", "A clean slate.", "Need a clean slate."] },
  { id: "97f94282-5661-4f45-a892-91f51d8469f0", examples: ["At a crossroads.", "Career at a crossroads.", "Standing at a crossroads.", "Face a crossroads."] },
  { id: "a9e1090c-12e8-4c4d-9767-29196350ba62", examples: ["Left in limbo.", "Project in limbo.", "Stuck in limbo.", "Limbo state."] },
  { id: "724fb805-550c-43cf-b0c8-d26ad64085b6", examples: ["It was a shot in the dark.", "Taking a shot in the dark.", "Blind shot in the dark.", "Total shot in the dark."] },
  { id: "4ce6f0f9-88da-4bb2-b9a6-20a0f8a89ef1", examples: ["Calm before the storm.", "Enjoy the calm before the storm.", "Quiet like the calm before the storm.", "It's the calm before the storm."] },
  { id: "e24673a7-f231-4c12-99a4-723081a0ea48", examples: ["Stick to your guns.", "He stuck to his guns.", "Stick into one's guns.", "Have to stick to one's guns."] },
  { id: "b759313d-823d-4e1d-ad7e-60db916d1b65", examples: ["Don't jump the gun.", "He jumped the gun.", "Jump the gun on the announcement.", "Ready to jump the gun."] },
  { id: "03da89c8-8468-4567-97c2-4d10af1f36a5", examples: ["Throw a wrench in the works.", "Threw a wrench in our plans.", "Don't throw a wrench in.", "Big wrench in the works."] },
  { id: "3add2b1d-d076-444f-83fb-28220fa54efe", examples: ["Set the record straight.", "Let me set the record straight.", "Time to set the record straight.", "Set the record straight about."] },
  { id: "f653e233-4b56-44d4-b90e-10284ffc8a95", examples: ["Didn't lift a finger.", "Won't lift a finger to help.", "Lift a finger.", "Too lazy to lift a finger."] },
  { id: "c93773e3-8ea4-4cf9-a949-9080da000025", examples: ["Step on his toes.", "Don't step on anyone's toes.", "Stepped on my toes.", "Careful not to step on toes."] },
  { id: "a5f9d4c1-c0c3-45e2-8925-274372c68366", examples: ["Scrape the bottom of the barrel.", "Scraping the bottom of the barrel.", "Really scraping the bottom of the barrel.", "Bottom of the barrel choice."] },
  { id: "232d4c22-6752-4ded-9dc9-a3301e11c771", examples: ["Take it to heart.", "Don't take it to heart.", "Took the criticism to heart.", "She takes everything to heart."] },
  { id: "a510d9b0-4853-4540-ac34-43ec6e710114", examples: ["Fly off the handle.", "Don't fly off the handle.", "He flew off the handle.", "Easy to fly off the handle."] },
  { id: "da85882d-2f2c-4f0b-bbe4-edbd6ca3a9df", examples: ["Let's get it over with.", "Get it over with quickly.", "Just get it over with.", "Dreading it, want to get it over with."] },
  { id: "cdc86124-a596-4c77-aeb2-35a7606ae937", examples: ["Don't badmouth him.", "She backstabbed me.", "Badmouthing the boss.", "Backstabber friend."] },
  { id: "2b02c2c4-27c3-415a-92e2-aeb2ae2e867e", examples: ["Sweep it under the rug.", "Swept under the rug.", "Don't sweep problems under the rug.", "Tried to sweep under the rug."] },
  { id: "b3a1a1ce-cc29-4213-9159-ac41d9cfce5e", examples: ["Flex your muscles.", "Company flexing its muscles.", "Time to flex muscles.", "Show off and flex muscles."] },
  { id: "33433a15-f127-44a5-83a7-dcec1e4ad08b", examples: ["Don't have the guts.", "Have the guts to say it.", "Takes guts.", "Did he have the guts?"] },
  { id: "3fddc242-04b1-4981-99d2-8264300bd37f", examples: ["Know what makes him tick.", "Understand what makes someone tick.", "What makes you tick?", "Find out what makes her tick."] },
  { id: "4cc7d255-260c-40c0-810c-aff6de7c16e5", examples: ["Caught red-handed.", "Catch him red-handed.", "Caught stealing red-handed.", "Red-handed evidence."] },
  { id: "47c00140-57d8-4412-9f74-bef73f8155bf", examples: ["Beat the rap.", "Managed to beat the rap.", "Can't beat the rap.", "Lawyer helped beat the rap."] },
  { id: "17f07831-e7e5-45a3-b21e-3f35d101c491", examples: ["Fend for yourself.", "Left to fend for themselves.", "Learn to fend for oneself.", "Capable of fending for himself."] },
  { id: "d5dd41a4-e3a0-45c1-8770-cc3ad7219bfb", examples: ["Has a finger in every pie.", "Keep a finger in every pie.", "Finger in every pie.", "He wants a finger in every pie."] },
  { id: "9c15d916-db23-4337-ad91-a76855929037", examples: ["Handed on a silver platter.", "Want it on a silver platter.", "Life on a silver platter.", "Not handed on a silver platter."] },
  { id: "02056d9d-085b-4553-8ef0-0472538cb7fb", examples: ["Kill two birds with one stone.", "Killing two birds with one stone.", "Like to kill two birds with one stone.", "Plan kills two birds with one stone."] },
  { id: "6fb4182d-dfac-4b99-b09e-e35989818d51", examples: ["Unavoidable delay.", "Accident was unavoidable.", "Conclusion is unavoidable.", "Seem unavoidable."] },
  { id: "291041b2-ec8a-4223-bb93-1b08056603f7", examples: ["It's a bluff.", "Call his bluff.", "Don't bluff.", "He is bluffing."] },
  { id: "f612a4a2-d6df-42c3-85b1-d4c2fac5e03a", examples: ["Political scandal.", "In absolute disgrace.", "Caused a scandal.", "Bring disgrace."] },
  { id: "fb799a5e-94bc-49e7-8fdc-9411c944e798", examples: ["What a coincidence!", "Pure coincidence.", "By coincidence.", "Strange coincidence."] },
  { id: "3129f0ec-005c-453c-8840-ba83153df6e4", examples: ["Service disruption.", "Causing disruption.", "Major disruption.", "Disruption to travel."] },
  { id: "b64036eb-e655-4322-8d9b-d5e9199735b2", examples: ["High probability.", "What are the odds?", "Against all odds.", "Probability of success."] },
  { id: "63bc75ca-10c7-46d4-a585-735d950b5bd8", examples: ["Just a slip of the tongue.", "Freudian slip of the tongue.", "Embarrassing slip of the tongue.", "Pardon the slip of the tongue."] },
  { id: "ad433547-bf46-421e-8763-d342fbeb2905", examples: ["Make an exception.", "No exception.", "Without exception.", "Exceptional case."] },
  { id: "a42ecf60-afe5-459d-8d2d-b06b8ce68a6b", examples: ["Unless you go.", "Not unless.", "Unless it rains.", "I won't unless you do."] },
  { id: "5009f70e-13b6-4440-9ea3-58986bbf644e", examples: ["No sooner had he left than.", "No sooner had I sat down.", "No sooner had we arrived.", "No sooner said than done."] },
  { id: "cf2e5678-2407-4bf8-9d4e-4ccd1ae33931", examples: ["I doubt that he will come.", "I doubt that it's true.", "I highly doubt that.", "Do you doubt that?"] },
  { id: "4047c3fe-253b-4be5-ba8c-524737b7e473", examples: ["Political expediency.", "For the sake of expediency.", "Matter of expediency.", "Choose expediency."] },
  { id: "a941156c-7323-4310-b72a-bc81c4a01c87", examples: ["Bullish market.", "Bullish on the stock.", "Feeling bullish.", "Bullish trend."] },
  { id: "a9e37bb3-71cc-40a9-8652-d988563f1d5d", examples: ["Cursory glance.", "Cursory look.", "Cursory inspection.", "Give a cursory check."] },
  { id: "7e905d55-25c3-45c1-9b71-98728dee53d1", examples: ["No signal here.", "Phone has no reception.", "Lost reception.", "Bad signal."] },
  { id: "0f1e1b7a-94b9-4e13-9f9b-4a4237d28a0d", examples: ["Stuck in traffic.", "Late because stuck in traffic.", "Always stuck in traffic.", "Get stuck in traffic."] },
  { id: "a227e1b8-9cb3-4094-8df2-bb2a2b9976bd", examples: ["Run out of battery.", "My phone ran out of battery.", "About to run out of battery.", "Don't run out of battery."] },
  { id: "b1c1e985-6926-4194-bfdb-ba1dfde3d4bf", examples: ["What's done is done.", "Missed the boat.", "Don't miss the boat.", "Accept what's done is done."] },
  { id: "e3307e3d-8c7e-491e-b786-07119be342ba", examples: ["Inasmuch as I can.", "True inasmuch as.", "Agreed inasmuch as.", "Inasmuch as it helps."] },
  { id: "defbdfe8-5a61-465a-ab52-c2334fdfa709", examples: ["Going bust.", "Company going bust.", "Fear of going bust.", "Went bust."] },
  { id: "0a97ae11-b0e0-4dbd-ad47-819fa4cb93cb", examples: ["What's the story?", "So what's the story?", "Tell me the story.", "What's the story with him?"] },
  { id: "115461f9-5158-453b-aa8c-531a3f8bd6c8", examples: ["What have you been up to?", "Hey, what have you been up to?", "So what have you been up to recently?", "Ask what he's been up to."] },
  { id: "d3732cb0-d79d-4977-bdcc-422e378164ed", examples: ["Tell me something I don't know.", "Yeah, tell me something I don't know.", "Come on, tell me something I don't know.", "Old news, tell me something I don't know."] },
  { id: "c5f9e1cf-0986-4be9-95f6-988e2757b580", examples: ["Count me out.", "If he goes, count me out.", "I'm busy, count me out.", "You can count me out."] },
  { id: "0f82f1ef-b0f4-450b-930e-451b099bd461", examples: ["I'm down.", "I'm game.", "Are you down?", "Sure, I'm game."] },
  { id: "0629c60a-2f0d-46ca-a16e-4c789c242c7f", examples: ["Give it to me straight.", "Don't lie, give it to me straight.", "Just give it to me straight.", "I can handle it, give it to me straight."] },
  { id: "7fcdbca3-d052-4e88-84eb-c54e2383aa82", examples: ["Count me in.", "I'm going, count me in.", "Count me in for dinner.", "You can count me in."] },
  { id: "143fa84c-f3d6-4ccb-bd52-3e09a6f6b1d0", examples: ["Cut to the chase.", "Let's cut to the chase.", "Cut to the chase and tell me.", "Stop stalling, cut to the chase."] },
  { id: "73947944-a814-49a1-a8db-850c2697e234", examples: ["Take it easy.", "Just take it easy.", "I need to take it easy.", "Tell him to take it easy."] },
  { id: "b7a14d9a-c48b-4d27-9f20-9d64d4a5971d", examples: ["Hold your horses.", "Whoa, hold your horses.", "Hold your horses, we're not ready.", "Just hold your horses a minute."] }
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
