
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

const batch = [
  { id: "00ec828b-7135-4ed0-ab82-1643f57e671d", examples: ["Sign the lease.", "Lease expires soon.", "Short-term lease.", "Renew the lease."] },
  { id: "bcd6c65f-b91c-45bc-96f1-77e44d6052e6", examples: ["Terminate the contract.", "Terminate employment.", "Terminate the pregnancy.", "Terminate the call."] },
  { id: "2b2305b6-d6db-4346-9ba8-daf2f62972dd", examples: ["Good intention.", "No intention of leaving.", "Malicious intention.", "With the intention of."] },
  { id: "8f500026-d384-4280-9183-bc64be79b33a", examples: ["I inform you that.", "Regret to inform you that.", "Pleased to inform you that.", "Inform you that he left."] },
  { id: "3538868c-fab5-4168-ae66-2cb1ab210def", examples: ["Prevention is better than cure, they say.", "Remember, prevention is better than cure.", "Focus on prevention is better than cure.", "Believe that prevention is better than cure."] },
  { id: "1ddd2f33-2cfe-48c9-bf4e-b43ecd4d68c0", examples: ["Enjoy it, you're only young once.", "Take risks, you're only young once.", "You're only young once, so travel.", "Remember you're only young once."] },
  { id: "627c5763-5af7-4e0f-9c4c-a0321c3ba466", examples: ["Live and let live attitude.", "Policy of live and let live.", "Just live and let live.", "I believe in live and let live."] },
  { id: "f08bc237-f78a-4349-920c-934e25030f4a", examples: ["Better safe than sorry.", "Checked it twice, better safe than sorry.", "Wear a helmet, better safe than sorry.", "Taking an umbrella, better safe than sorry."] },
  { id: "552aff4e-683b-4be7-a4b9-46695415a1c6", examples: ["Arrived late, but better late than never.", "Better late than never.", "Finished it finally, better late than never.", "Apologized, better late than never."] },
  { id: "84cade54-b0dd-4d26-a596-98c314f1e10a", examples: ["Beauty is only skin-deep.", "Looks fade, beauty is only skin-deep.", "Remember, beauty is only skin-deep.", "Character matters, beauty is only skin-deep."] },
  { id: "c9ea9698-cb6b-4c97-b953-d97109677f0a", examples: ["Help your family, charity begins at home.", "Charity begins at home.", "Don't ignore your own, charity begins at home.", "Charity begins at home, but doesn't end there."] },
  { id: "4440112f-f663-4e40-80f1-0b89169d5402", examples: ["An eye for an eye leaves everyone blind.", "Believed in an eye for an eye.", "Justice is not an eye for an eye.", "Took an eye for an eye."] },
  { id: "1294176f-7453-46c4-9034-9bc1dc8dc842", examples: ["Show me, actions speak louder than words.", "Actions speak louder than words.", "Don't just say it, actions speak louder than words.", "Prove it, actions speak louder than words."] },
  { id: "7edc5221-4971-4a9b-978d-4b5812c267c6", examples: ["Family comes first, blood is thicker than water.", "Blood is thicker than water.", "Loyalty to kin, blood is thicker than water.", "Remember blood is thicker than water."] },
  { id: "7f6b18ba-8b01-4c6d-b4f1-acb2042a0c18", examples: ["Let's work together, two heads are better than one.", "Two heads are better than one.", "Brainstorming proving two heads are better than one.", "Ask for help, two heads are better than one."] },
  { id: "d55d751c-9e8b-48b8-b14f-a955d30893b8", examples: ["Revenge is wrong, two wrongs don't make a right.", "Two wrongs don't make a right.", "Don't hit back, two wrongs don't make a right.", "Two wrongs don't make a right."] },
  { id: "17b2f99f-ba08-4dea-b5a3-6289f1f7baa2", examples: ["Machiavellian belief that the end justifies the means.", "Does the end justify the means?", "The end justifies the means.", "Unethical if the end justifies the means."] },
  { id: "db0bda80-5429-4a15-8e41-89d9d8b646b8", examples: ["Haven't heard, no news is good news.", "No news is good news.", "Assume they are fine, no news is good news.", "Waiting and hoping no news is good news."] },
  { id: "1b3a223c-b139-42f2-99ae-431449fdb351", examples: ["Keep trying, practice makes perfect.", "Practice makes perfect.", "Rehearse again, practice makes perfect.", "Skill comes because practice makes perfect."] },
  { id: "9b8e8730-b718-4c14-b24f-fbef1b83fb33", examples: ["Don't bring it up, let sleeping dogs lie.", "Let sleeping dogs lie.", "Avoid trouble, let sleeping dogs lie.", "Best to let sleeping dogs lie."] },
  { id: "a6655922-cd53-4f85-9ca3-f36c5a15e092", examples: ["Unlucky, lightning never strikes twice.", "Lightning never strikes twice.", "Don't worry, lightning never strikes twice.", "Lightning never strikes twice in the same place."] },
  { id: "8b84067e-4b8d-4611-b8bc-0e5066c335da", examples: ["He is ugly but love is blind.", "Love is blind.", "They say love is blind.", "Love is blind to faults."] },
  { id: "762a819e-f7d5-47e7-80bd-c1342f6a3272", examples: ["Money talks.", "In this town, money talks.", "Money talks, bullshit walks.", "Money talks louder."] },
  { id: "c922b1b5-a66e-40fa-99a0-2d85bcdb46c0", examples: ["Hypocrite, that's the pot calling the kettle black.", "Pot calling the kettle black.", "Talk about messy, pot calling the kettle black.", "It's the pot calling the kettle black."] },
  { id: "ecc18401-86c3-4a02-b630-f284445b6fce", examples: ["Met him in Paris, it's a small world.", "It's a small world.", "You know him too? It's a small world.", "Truly a small world."] },
  { id: "f1923a03-718a-4f58-84b4-2c0384bba8dd", examples: ["Moved away, out of sight, out of mind.", "Out of sight, out of mind.", "Forgot him, out of sight, out of mind.", "Out of sight, out of mind."] },
  { id: "ef3429fb-7cfa-4fad-b1bf-e59e23f000ac", examples: ["How is it going? So far, so good.", "So far, so good.", "Project is fine, so far, so good.", "So far, so good."] },
  { id: "83cc13e2-63b6-4baf-a934-907107b32993", examples: ["Come along, the more the merrier.", "The more the merrier.", "Invited everyone, the more the merrier.", "Party time, the more the merrier."] },
  { id: "aa3cd31b-b928-4e65-bc7c-7ef1d1d8b1b3", examples: ["Quit smoking, easier said than done.", "Easier said than done.", "Finding a job is easier said than done.", "That's easier said than done."] },
  { id: "b75d5a71-f5c1-40eb-a1f9-88d3f6f7a2a9", examples: ["Won't trust him again, once bitten, twice shy.", "Once bitten, twice shy.", "Cautious now, once bitten, twice shy.", "Once bitten, twice shy."] },
  { id: "61dbdc82-3eaa-4592-886b-8c37c93e482a", examples: ["Might rain, you can never tell.", "You can never tell with him.", "You can never tell what will happen.", "Luck changes, you can never tell."] },
  { id: "e823de10-6e7d-4f85-816a-486e8b4f8836", examples: ["Tickets are first come, first served.", "First come, first served basis.", "Seats are first come, first served.", "First come, first served."] },
  { id: "86cf174f-c668-4b69-b4f3-21054a50b254", examples: ["It won't fail, famous last words.", "Famous last words.", "He said he was safe, famous last words.", "Famous last words."] },
  { id: "e8e48f9b-0a98-44e0-8f45-36e0e8c4c458", examples: ["Was it a cat or something of that sort?", "Something of that sort.", "He is a doctor or something of that sort.", "Need a hammer or something of that sort."] },
  { id: "226061cd-628d-4625-81b8-e617db3767f8", examples: ["Is he sick or something?", "Do you want tea or something?", "Or something like that.", "Forgot his name or something."] },
  { id: "e509bed5-0553-45d5-b784-2c04189cf826", examples: ["Thirty-odd people.", "Twenty-odd years.", "Forty-odd days.", "Hundred-odd dollars."] },
  { id: "8cedbc1e-dfcb-4e0e-a4a6-36265a1bddc4", examples: ["Where is my stuff?", "Good stuff.", "Pack your stuff.", "Do your stuff."] },
  { id: "f7ea7c33-9f40-45a6-8b88-361ad2a939af", examples: ["Cost £50, give or take.", "Give or take a few days.", "Give or take an inch.", "An hour, give or take."] },
  { id: "5b56e697-5fd9-4f72-9938-172a88ced678", examples: ["We will manage somehow.", "Somehow or other we made it.", "Escaped somehow.", "Somehow he knew."] },
  { id: "3f5d1f52-472b-4019-a539-eeb5c03adeb4", examples: ["Kind of tired.", "It's kind of strange.", "What kind of car?", "Kind of like a dog."] },
  { id: "32c32d2a-6cac-43b9-a232-cd099b22f2e2", examples: ["Something to do with work.", "Has something to do with fees.", "Nothing to do with me.", "It's something to do with the engine."] },
  { id: "72b9477a-6ec4-46a6-bdcf-1ba95dde1cf7", examples: ["Cost in the region of $100.", "Somewhere in the region of 50 people.", "Worth in the region of a million.", "In the region of 5%."] },
  { id: "65c137d8-b0a1-4257-b2b0-29b5ce811b47", examples: ["Stacks of work.", "Stacks of money.", "Stacks of time.", "Got stacks of books."] },
  { id: "ec6fcbd0-b0f3-4075-87b8-3b4f76a0b34e", examples: ["Born in 1990 or thereabouts.", "Cost £10 or thereabouts.", "Meet at 5 or thereabouts.", "Located in London or thereabouts."] },
  { id: "41e039e1-ad28-4a55-ac4d-3a81dd2b972c", examples: ["Anyway, as I was saying.", "I don't care anyway.", "It's raining, anyway let's go.", "Anyway, enough about me."] },
  { id: "97b6d756-9659-4f65-bf0f-db5728e9e449", examples: ["As I was saying, it's late.", "As I was saying before.", "As I was saying.", "Interrupted me, but as I was saying."] },
  { id: "bc7c8d46-2082-4e41-9919-e976e0d829f8", examples: ["At any rate, I tried.", "Well, at any rate.", "At any rate, it's over.", "Cheap, at any rate."] },
  { id: "fa018e7b-218d-41db-b473-ce5805290c4c", examples: ["In any case, take it.", "Won't go in any case.", "In any case, be careful.", "True in any case."] },
  { id: "5aa95822-be73-4476-80dc-67b0127f8238", examples: ["By and large, it is good.", "By and large, I agree.", "Accurate by and large.", "Success by and large."] },
  { id: "e586ba74-11bc-4c8a-8c6d-b15d40d64704", examples: ["As a matter of fact, I did.", "No, as a matter of fact.", "As a matter of fact, he is here.", "Interesting, as a matter of fact."] },
  { id: "d7be2eaf-b676-4e22-b1e3-c6655f93b090", examples: ["He is old, even so, he works.", "Raining, even so we went.", "Hard, even so I tried.", "Even so, I like it."] },
  { id: "e4799f1c-d19c-4863-912d-65a59a0b564b", examples: ["It's true that he lied.", "It's true, I saw it.", "While it's true, it doesn't matter.", "It's true."] },
  { id: "91eae5b0-8221-4a78-bb47-6fe479a1e2a1", examples: ["We can walk, alternatively take a bus.", "Alternatively, we can wait.", "Alternatively proposed.", "Use butter or alternatively oil."] },
  { id: "ff98dd7c-a430-47b6-be1b-b8e745ef255a", examples: ["As for me, I'm staying.", "As for the money, forget it.", "As for him.", "Good food, as for the service..."] }
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
