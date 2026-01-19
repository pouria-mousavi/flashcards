
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

const batch = [
  { id: "ecf3a4f4-d07f-40bd-ae1b-6889631cc6dc", examples: ["Deep regret.", "Regret the error.", "No regrets.", "Live without regret."] },
  { id: "d6c241a1-96f7-4fbc-80b4-afbfc8e44bc0", examples: ["Show remorse.", "Feel remorse.", "No remorse.", "Full of remorse."] },
  { id: "68a230f4-8f00-4c76-bfbd-10e72340ac2a", examples: ["I loathe spinach.", "Loathe to admit.", "She loathes him.", "Do you loathe it?"] },
  { id: "8916ac7d-431b-4b6d-ab27-a3264c6002e6", examples: ["Computer freezing.", "App keeps crashing.", "Screen freezing up.", "System crashing constantly."] },
  { id: "629e4e07-f9c5-4b3c-9a7f-a5ac64a37374", examples: ["Audio breaking up.", "You're breaking up.", "Signal breaking up.", "Call breaking up."] },
  { id: "4a573545-f0e7-4aaf-a407-f6491facc69b", examples: ["Put on hold.", "Can I put you on hold?", "Wait on hold.", "Stuck on hold."] },
  { id: "de5ae042-54a6-415b-bd8e-85dc7161f28e", examples: ["It's on me.", "Lunch is on me.", "Drinks are on me.", "This one's on me."] },
  { id: "1a24078c-bb2c-4cd5-818c-12172659c40f", examples: ["Rush hour traffic.", "Avoid rush hour.", "Morning rush hour.", "Stuck in rush hour."] },
  { id: "8748d39a-297b-404a-8ab7-eb110765287c", examples: ["Don't flake on me.", "He bailed last minute.", "She is a flake.", "Going to bail."] },
  { id: "484998a4-7849-4fc8-b92a-1fc024719674", examples: ["Blow off steam.", "Blow off the party.", "He blew me off.", "Don't blow it off."] },
  { id: "c8cca060-2992-4b39-bfd4-accc83822a06", examples: ["I must insist.", "She insisted on paying.", "If you insist.", "Why do you insist?"] },
  { id: "fe1c87f1-31b1-4cd6-b21a-3aa4c3e2003c", examples: ["Traffic is moving now.", "Traffic is moving slow.", "At least traffic is moving.", "Is traffic moving?"] },
  { id: "12b8582b-89fc-481e-bd75-12d5fc4b7d69", examples: ["Traffic gridlock.", "Complete gridlock.", "City gridlock.", "Stuck in gridlock."] },
  { id: "39f827c5-d8a8-4223-9c40-5aad27895f9b", examples: ["Back up the car.", "Put it in reverse.", "Can you back up?", "Reverse out."] },
  { id: "ca064a8b-27e2-4640-a881-2944ef63c954", examples: ["Parallel park here.", "Can't parallel park.", "Learn to parallel park.", "Perfectly parallel park."] },
  { id: "6f77c09e-65f4-4c1f-ad41-1a03c9e2f617", examples: ["Take a nap.", "Doze off on the sofa.", "Need a quick nap.", "Dozed off immediately."] },
  { id: "26036a41-1fe4-4e6a-8edf-84a667085e93", examples: ["I'm an early bird.", "Early bird special.", "Not an early bird.", "Wake up early bird."] },
  { id: "90fccac1-78b8-46f6-a2de-9ecbe4b06e6b", examples: ["Don't oversleep.", "I accidentally overslept.", "Tendency to oversleep.", "Might oversleep."] },
  { id: "0ffde16a-8496-4ae2-8553-d1fff91932d0", examples: ["Lose your appetite.", "Made me lose my appetite.", "Did you lose appetite?", "Complete loss of appetite."] },
  { id: "d14deffd-4f5e-4bb6-852f-7cb216c2e68e", examples: ["Suffers from insomnia.", "Chronic insomnia.", "Cure for insomnia.", "Insomnia keeps me up."] },
  { id: "31cb22bb-b9f7-4c78-889d-7c7808273be9", examples: ["Ordering late, night owl.", "I'm a night owl.", "Night owl hours.", "Radio night owl."] },
  { id: "ed7b9d85-01bc-4c1a-9a9e-2856702e64ea", examples: ["Use the restroom.", "Where is the restroom?", "Public restroom.", "Go to the restroom."] },
  { id: "544c468e-7e78-4e2b-b42e-06df3fa7ef60", examples: ["Feel nauseous.", "Smell made me nauseous.", "Nauseous stomach.", "Feeling a bit nauseous."] },
  { id: "284a0970-b906-4b8b-855c-c3820bcd582b", examples: ["Milk will expire.", "Meat went bad.", "Has it expired?", "Don't let it go bad."] },
  { id: "c11180ef-e42c-458f-bec8-ea85b4e723b0", examples: ["Moldy bread.", "Smells moldy.", "Moldy cheese.", "Looks moldy."] },
  { id: "1c6860c9-7a4b-4c4b-93f2-82da3e53726a", examples: ["Go on a diet.", "Start a diet.", "Strict diet.", "Diet plan."] },
  { id: "41643376-acaf-4224-8292-58bb44ef5c0d", examples: ["Don't overeat.", "Binge eating.", "Tendency to overeat.", "Binge watch TV."] },
  { id: "bc3d07a5-f3ef-432c-b52b-84ef20c6583f", examples: ["Feel dizzy.", "Getting dizzy.", "Dizzy spell.", "Looked dizzy."] },
  { id: "a50ca1f5-cc14-4867-8a84-7efe354a0794", examples: ["Contagious laughter.", "Is it contagious?", "Highly contagious.", "Contagious disease."] },
  { id: "8cc56c2e-a7a0-4dc3-bcb5-d6e62366d433", examples: ["Make an appointment.", "Missed appointment.", "Doctor appointment.", "Cancel appointment."] },
  { id: "d8870aae-9349-46b2-a324-53181ea69c67", examples: ["Severe headache.", "Acute pain.", "Severe weather.", "Acute phase."] },
  { id: "ccb518e4-4b58-4cdb-a874-ef10b185810d", examples: ["Mild symptoms.", "Mild flavor.", "Mild weather.", "Mild criticism."] },
  { id: "9d7ea8c3-83da-4aeb-8b0e-9031ea93c5ad", examples: ["Nasty side effects.", "No side effects.", "List of side effects.", "Experience side effects."] },
  { id: "a46cf06d-93b1-4e69-a964-83c810e836c4", examples: ["Fill the prescription.", "Doctor's prescription.", "Prescription drugs.", "Need a prescription."] },
  { id: "2c453ead-97fe-4d64-a1d4-c046193aa079", examples: ["Mundane tasks.", "Mundane existence.", "Mundane job.", "Life feels mundane."] },
  { id: "2a785eb9-6680-4088-ab2c-c082ae8e1880", examples: ["Don't be gullible.", "Gullible tourist.", "He is so gullible.", "Gullible people."] },
  { id: "afd3eb5b-c990-4b20-b5fa-4bca379137f4", examples: ["It's ironic.", "Ironic twist.", "Isn't it ironic?", "Tragically ironic."] },
  { id: "6f894fb3-c9a8-4d19-a72a-8c1a71d2c04e", examples: ["Overjoyed to hear.", "She was overjoyed.", "Feel overjoyed.", "Overjoyed parents."] },
  { id: "6bdd6888-14d5-4dfd-a923-63138ef0dc73", examples: ["Bland food.", "Bland taste.", "Bland personality.", "It's a bit bland."] },
  { id: "70721e9d-d48c-4e3b-b94c-fc48a10392ad", examples: ["Cramped room.", "Feel cramped.", "Cramped muscles.", "Space is cramped."] },
  { id: "4e4b8e57-d90c-4581-a80c-f78cd0e3fab1", examples: ["Steep hill.", "Steep price.", "Steep learning curve.", "Too steep."] },
  { id: "e364b0e7-3a22-4e11-aeda-0624cd48d3ca", examples: ["Smooth surface.", "Smooth sailing.", "Smooth skin.", "Smooth transition."] },
  { id: "82272214-2f8b-4490-bc27-37e200f4f1cb", examples: ["Sharp knife.", "Sharp turn.", "Sharp mind.", "Look sharp."] },
  { id: "de1ded1c-4261-4b6d-ab91-440bcc043119", examples: ["Soundproof room.", "Walls are soundproof.", "Soundproof booth.", "Make it soundproof."] },
  { id: "97c8d817-7859-4ff1-a2c1-54cfb7ffd6ce", examples: ["Cut his teeth on.", "Where I cut my teeth.", "Cut her teeth in rough neighborhood.", "Cut your teeth early."] },
  { id: "9304c634-e177-4aac-a353-f9351ddbe663", examples: ["Don't sit on your hands.", "Just sat on his hands.", "Sat on my hands.", "Crowd sat on its hands."] },
  { id: "73a7a4a8-daa8-4b74-a4fc-1e5167893668", examples: ["Mountain out of a molehill.", "Don't make a mountain out of a molehill.", "Making a mountain out of a molehill.", "It's just a molehill."] },
  { id: "f7c5fab7-64b8-436c-9734-2421c1a2f669", examples: ["Play cat and mouse.", "Game of cat and mouse.", "Cat and mouse game.", "Playing cat and mouse."] },
  { id: "8b0708a2-2118-40a6-b8b7-db0b7c284185", examples: ["Go the extra mile.", "Willing to go the extra mile.", "He went the extra mile.", "Always go the extra mile."] },
  { id: "38fc6b6d-3fbd-4886-a205-03856d3101a9", examples: ["Throw caution to the wind.", "Threw caution to the wind.", "Don't throw caution to the wind.", "Decided to throw caution to the wind."] },
  { id: "6b6d008b-553f-4f35-abbd-269ce718cac1", examples: ["Cut him off.", "Cut off in traffic.", "Bartender cut him off.", "Don't cut me off."] },
  { id: "bb8c04f5-e7e4-498b-90a0-996f21b34492", examples: ["Keep your cool.", "Lost his cool.", "Couldn't keep my cool.", "Stay calm and keep your cool."] },
  { id: "5e7ac4cc-8019-4a8a-a7ed-6bd05174f4e9", examples: ["Did it go according to plan?", "Nothing went according to plan.", "Go according to plan.", "Plan didn't work."] },
  { id: "a6c98170-cb57-402d-878e-4d907148fa00", examples: ["Got cold feet.", "Don't get cold feet.", "Groom got cold feet.", "Cold feet at the altar."] },
  { id: "59987e10-51db-43b3-9e42-981a76456d58", examples: ["Get the hang of it.", "Finally got the hang of.", "Cant get the hang of.", "Easy to get the hang of."] },
  { id: "83a1834d-5d98-40e4-a5f3-c817b37bfcd6", examples: ["Taken for a ride.", "Don't be taken for a ride.", "He took me for a ride.", "We were taken for a ride."] },
  { id: "7a4fb4e0-cec3-4124-aecd-8b2bdfa70e79", examples: ["Weasel out of it.", "Don't try to weasel out.", "He weaseled out.", "Weasel out of responsibility."] },
  { id: "baea2677-a351-45ac-8e3d-462656e52046", examples: ["You sound like a broken record.", "Like a broken record.", "Stop being a broken record.", "Same old broken record."] },
  { id: "84f7bf03-3220-4f44-a786-daf6a18ed240", "examples": ["Don't lose your head.", "I lost my head.", "Panic and lose one's head.", "She lost her head."] },
  { id: "58e0b5af-988e-4a57-be2c-f9f1e4b864ca", examples: ["Don't take it lightly.", "Take warnings lightly.", "He takes nothing lightly.", "Cannot be taken lightly."] },
  { id: "1c88fc1a-7f92-4f06-a263-ad2fb730f47e", examples: ["Stop splitting hairs.", "You are splitting hairs.", "No need to split hairs.", "Splitting hairs over details."] },
  { id: "168e3417-1a8c-4a9d-bc24-8c0355db0cb3", examples: ["Made a scapegoat.", "Scapegoat for the team.", "Looking for a scapegoat.", "Don't use me as a scapegoat."] },
  { id: "3eec35ef-8f7b-4661-b214-6c9524f45d09", examples: ["He is a wolf in sheep's clothing.", "Wolf in sheep's clothing behavior.", "Beware the wolf in sheep's clothing.", "Looks innocent but is a wolf."] },
  { id: "35adae77-c5e4-4929-99d5-eb99ac45c774", examples: ["Knack for fixing things.", "Have a knack for it.", "Knack for languages.", "Lost the knack."] },
  { id: "001b24dd-9407-49f0-976a-5029226330cd", examples: ["Blow it out of proportion.", "Don't exaggerate.", "Exaggerate the truth.", "Blew it out of proportion."] },
  { id: "28590cac-d3c4-4854-8507-74c9d95f2cc9", examples: ["Call his bluff.", "It was just a bluff.", "Bluff your way through.", "Don't bluff."] },
  { id: "1ea405a5-66ec-4569-8605-44cad95c1465", examples: ["Give them leverage.", "Don't give him ammo.", "Used as leverage.", "Give ammo to the enemy."] },
  { id: "582d9499-af69-4dec-9eed-e09a69f06a6f", examples: ["Accused of nepotism.", "Rampant nepotism.", "Nepotism in the company.", "Hire via nepotism."] },
  { id: "f4cb63ff-e030-46c5-9dc9-c44a826fa6dd", examples: ["Stop showing off.", "Like to brag.", "He's just showing off.", "Brag about money."] },
  { id: "b1edff39-15b0-42a8-9de8-13ba891e9704", examples: ["Turn the tables.", "Tables have turned.", "Turn the tables on him.", "Finally turn the tables."] },
  { id: "37e3a43e-1b96-465e-9639-1c54065a62b7", examples: ["Be blunt.", "Blunt answer.", "Straightforward approach.", "To be blunt."] },
  { id: "1e602709-6709-4ce3-9af5-cae3b544395e", examples: ["Greedy for money.", "Don't be greedy.", "Greedy corporation.", "Greedy eyes."] },
  { id: "8073d6db-d67c-485d-ae61-ec6a2b0de503", examples: ["Office gossip.", "Love to gossip.", "Spread gossip.", "Hear any gossip?"] },
  { id: "ba2b8a23-04b5-4a79-9c83-bcbc68f26fbf", examples: ["Keeping up with the Joneses.", "Don't keep up with the Joneses.", "Tired of keeping up with the Joneses.", "Trap of keeping up with the Joneses."] },
  { id: "e9783082-7928-4a88-892d-4d624000e7fd", examples: ["Don't nag me.", "She nags him.", "Constant nag.", "Stop nagging."] },
  { id: "f509f431-d323-4ee2-a288-0878f5fda0c2", examples: ["Take the bread out of his mouth.", "Don't take the bread out of my mouth.", "Stealing jobs takes bread out of mouths.", "Would you take the bread out of their mouths?"] },
  { id: "9b234aa9-fab7-4e48-a486-9d23732b8434", examples: ["Quit stalling.", "Drag one's feet.", "Don't drag your feet.", "Stalling for time."] },
  { id: "efd10ec6-8427-4299-9be2-95d0e797016e", examples: ["Splurge on shoes.", "Go ahead and splurge.", "Big splurge.", "Splurge a little."] },
  { id: "2780cbbd-c367-4c6f-a3da-3d8eda69a6ff", examples: ["Lose the argument.", "Admit you lost the argument.", "Don't lose the argument.", "Sure to lose the argument."] },
  { id: "8aca4e66-f21b-4615-b074-1dea3cf7ad26", examples: ["Stubborn mule.", "Don't be stubborn.", "Headstrong child.", "Stubborn refusal."] },
  { id: "34dbc898-6a70-4bae-ae6b-4b9ab7d0a742", examples: ["Ungrateful child.", "Don't be ungrateful.", "Ungrateful attitude.", "Seem ungrateful."] },
  { id: "9e9cb03a-dc97-449f-b315-c8f4d0c3bfe4", examples: ["He is the teacher's pet.", "Act like a teacher's pet.", "Playing favorites.", "Teacher's pet gets A's."] },
  { id: "db5473eb-8b19-4b13-bbae-27ea8250bdab", examples: ["Don't get flustered.", "She got flustered.", "Easily flustered.", "Looked flustered."] },
  { id: "3bd6b2d8-2f1c-4060-98c6-c8c8f38da6e6", examples: ["Sneaky tactic.", "Underhanded move.", "Don't be sneaky.", "Sneaky suspicion."] },
  { id: "739c3f4f-66eb-4c70-98b4-9b7bed762e03", examples: ["Brush it off.", "Brush him off.", "Brushed off the comment.", "Don't just brush it off."] },
  { id: "2c00444d-201c-4e61-8316-f1905a1449cc", examples: ["Rain on my parade.", "Don't rain on his parade.", "Rain on someone's parade.", "Rained on the parade."] },
  { id: "25ae23cb-d731-4eee-ad63-fa4c604d1fc1", examples: ["That's a tall tale.", "Telling tall tales.", "Pure fabrication.", "Sounded like a tall tale."] },
  { id: "823b47b3-9be5-410d-a023-4372515afde1", examples: ["Not in the mood.", "Are you in the mood?", "In the mood for food.", "Wasn't in the mood."] },
  { id: "2f7866ef-6b58-4eb8-8803-2aed8255cdd3", examples: ["Brown-nosing the boss.", "Stop brown-nosing.", "He's a suck up.", "Sucking up to him."] },
  { id: "fb9c8e3f-c431-48fb-9993-1f20078d74b8", examples: ["Cover up the crime.", "Gloss over details.", "Don't gloss over it.", "Attempted cover up."] },
  { id: "8d56b93c-378c-477c-9798-94027ee4bf1b", examples: ["Got off scot-free.", "Get off scot-free.", "Walked away scot-free.", "Not scot-free."] },
  { id: "ddfc58d2-5c40-4889-ae9c-d776142e921b", examples: ["Game of one-upmanship.", "Constant one-upmanship.", "Tired of one-upmanship.", "One-upmanship at work."] },
  { id: "f410aac7-3bcb-4941-9ed8-c642cb429326", examples: ["Total chaos.", "Went haywire.", "Chaos ensues.", "System went haywire."] },
  { id: "0366283b-afd4-4893-a3d8-63d1b40e18b6", examples: ["At the expense of others.", "Joke at my expense.", "Profit at the expense of.", "At the expense of health."] },
  { id: "0e8eaa40-2f21-4cdd-a233-b534b98193f0", examples: ["Notwithstanding the evidence.", "Problems notwithstanding.", "Notwithstanding the delay.", "Advice notwithstanding."] },
  { id: "d1137b1f-8209-4a15-a250-dd9ab2ad1f28", examples: ["I hereby declare.", "Hereby accepted.", "We hereby agree.", "Hereby authorized."] },
  { id: "e44e7a4b-53c0-48bd-9828-008350debfb4", examples: ["Henceforth known as.", "From henceforth.", "Banned henceforth.", "Henceforth and forever."] },
  { id: "28c280f0-cf6d-4573-826d-c5ebee4c72b5", examples: ["In the event of fire.", "In the event of delay.", "Plan for the event of.", "In the event that."] },
  { id: "5e82972e-f307-4b07-90f5-b87a5e6db5a2", examples: ["Happened simultaneously.", "Simultaneously press.", "Work simultaneously.", "Run simultaneously."] },
  { id: "8e8d4ad5-63be-43be-9769-ce7ac50cad77", examples: ["Subsequently arrested.", "Subsequently died.", "Subsequently revealed.", "Occurred subsequently."] }
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
