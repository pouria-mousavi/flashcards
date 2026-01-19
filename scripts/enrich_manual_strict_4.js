
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

// Batch 4 (Start of new strict_batch.json)
const batch = [
  { id: "5eb3208d-323e-4706-a39e-f86b561b83fc", examples: ["We accidentally broke the vase; if mom finds out, we're done for.", "The engine failed mid-flight; they thought they were done for.", "Run! If he catches us, we're done for.", "Without that map, we are completely done for."] },
  { id: "763ccc6d-cac1-4ae6-bc3d-dfd5952f3fec", examples: ["Please accept my apologies for the late response.", "My apologies, I seem to have mistaken you for someone else.", "I offer my apologies for the inconvenience caused.", "My apologies, I cannot attend the meeting."] },
  { id: "d9f69489-dc60-47f1-886e-d2aed10bb557", examples: ["The sunset here is breathtaking; I really wish you were here.", "We are having a blast at the party, wish you were here.", "It's not the same without you, wish you were here.", "Sending you a postcard saying 'wish you were here'."] },
  { id: "4c75a54d-a8e6-4ee6-831f-1ed47e9ccc93", examples: ["You found my lost wallet! God bless you.", "God bless you for your kindness.", "(After sneezing) God bless you.", "May God bless you and keep you safe."] },
  { id: "24eb082b-39ff-4d48-b917-29e4fb772f8a", examples: ["You keep mentioning his past mistakes. Where are you going with this?", "I don't understand your point; where are you going with this?", "Where are you going with this line of questioning?", "Tell me straight, where are you going with this?"] },
  { id: "fac6ebec-499e-416f-b67e-8b68ebb6135f", examples: ["We don't have all day, so please get to the point.", "Stop beating around the bush and get to the point.", "I wish he would just get to the point.", "Can you get to the point of this story?"] },
  { id: "8e0fd8f3-4143-4100-a7c6-31a84cc6f283", examples: ["He missed three deadlines. In other words, he's fired.", "She refused to answer. In other words, she's guilty.", "The project is over. In other words, we failed.", "In other words, I quit."] },
  { id: "5f802e34-2857-43e2-ad5e-c692d9e5f434", examples: ["I heard he might resign, but don't quote me on that.", "Prices might drop next week, but don't quote me on that.", "I think it's open until 9, but don't quote me on that.", "She said she likes him, but don't quote me on that."] },
  { id: "3b66b514-45bb-4b84-8783-f0aa8019d564", examples: ["Rumor has it that they are secretly married.", "Rumor has it she's moving to New York.", "Rumor has it the boss is retiring.", "I don't believe it, but rumor has it he won the lottery."] },
  { id: "215e6e5a-decb-4a9a-ac10-5f09de07d0f6", examples: ["Word on the street is that a new mall is being built.", "Word on the street is you're the best lawyer in town.", "Is it true? Word on the street says you're leaving.", "Word on the street involves a big scandal."] },
  { id: "a0994f45-336c-45a2-bf7b-11bad8732e95", examples: ["It was just a scratch, not a broken leg. Don't exaggerate.", "I told you a million times! Okay, maybe I exaggerate.", "He tends to exaggerate his achievements.", "Don't exaggerate the problem, it's solvable."] },
  { id: "4facd917-0cc0-4698-a236-52bb2febf7c6", "examples": ["Let's drop the subject; I don't want to argue.", "I don't want to argue with you anymore.", "I'm too tired, I don't want to argue.", "Please, I don't want to argue in front of the kids."] },
  { id: "98e55338-03b9-4ea1-84b5-9df1a0830eeb", examples: ["It's a small mistake, please don't make a scene.", "She started screaming and made a scene.", "Don't make a scene in public.", "He made a scene when they refused his card."] },
  { id: "3b753cbe-d87e-41bc-817c-c87f90c14893", examples: ["He was rude, but it's over now. Let it go.", "You can't change the past, just let it go.", "I decided to let it go for the sake of peace.", "She couldn't let it go and kept arguing."] },
  { id: "c652f61f-33a0-4f65-ae9d-5db06596c001", examples: ["I said I was sorry, but he won't let it go.", "Why won't you let it go?", "She's still angry and won't let it go.", "He won't let it go until he gets an apology."] },
  { id: "1b33e63d-1ffd-4603-b161-a8a1ddeaa117", examples: ["You've been whining all day. Give it a rest.", "Give it a rest, nobody is listening.", "I wish he would give it a rest about politics.", "Just give it a rest already!"] },
  { id: "842d4ac0-4acc-4837-a236-dc0416aca483", examples: ["\"Sorry I'm late.\" \"No worries, it's all good.\"", "Don't stress about it, it's all good.", "We fixed the issue, it's all good now.", "Hey man, it's all good."] },
  { id: "fa58153e-d854-4663-9e08-bafadcc1d93c", examples: ["I was only teasing you. Can't take a joke?", "Lighten up, can't you take a joke?", "He got angry because he can't take a joke.", "You need a sense of humor if you can't take a joke."] },
  { id: "83642800-3c81-4b0c-afe3-cfe3ae327c6c", examples: ["Stop complaining and man up.", "You need to man up and take responsibility.", "He told him to man up and face his fears.", "Man up, it's just a scratch."] },
  { id: "54edfff9-9f80-423d-af48-6ce9070a78ca", examples: ["I know it's tough, but hang in there.", "Hang in there, help is on the way.", "She's hanging in there despite the illness.", "Just hang in there a little longer."] },
  { id: "98fb298c-00f5-4a01-ac0f-456df89a1ffb", examples: ["You're hysterical! Pull yourself together.", "He needs to pull himself together before the speech.", "I took a deep breath to pull myself together.", "Pull yourself together man!"] },
  { id: "39df9585-2817-4f71-a73e-2b5af1338a0d", examples: ["You blocked his attack? Nice move.", "That was a nice move securing that client.", "Nice move on the chessboard.", "Impressive, nice move."] },
  { id: "51408ff7-4a27-45c6-a317-7dfdb2242222", examples: ["Who left the ice cream in the sun? What a bright idea.", "Going hiking in a storm, what a bright idea.", "(Sarcastic) What a bright idea that was.", "Actually, that really is a bright idea!"] },
  { id: "6572b5ea-60cc-4453-a322-906dd0db6ba4", examples: ["\"I just won the lottery!\" \"No way!\"", "No way, I don't believe you.", "There is no way he finished that fast.", "No way am I doing that."] },
  { id: "639bc553-443d-4270-9e34-c9737441900c", examples: ["People living on Mars? What a world.", "So much kindness in tragic times. What a world.", "Technology is amazing, what a world.", "What a world we live in."] },
  { id: "a0fdf501-50d6-466d-8a42-fe8982d22a1f", examples: ["A parking ticket for being one minute late? You gotta be kidding me.", "You lost the keys again? You gotta be kidding me.", "You gotta be kidding me, this is insane.", "He wants a raise? You gotta be kidding me."] },
  { id: "d696912d-4959-4ae7-b84f-c14b7e132ded", examples: ["He quit his job to travel the world. Can you believe it?", "Can you believe it? It's snowing in July.", "I won first prize, can you believe it?", "Can you believe it took them three hours?"] },
  { id: "5113e9bc-9bbd-4cea-bbbe-5834813fe513", examples: ["The quiet kid became a rockstar. Who would have thought?", "It actually worked! Who would have thought?", "Who would have thought pizza could be healthy?", "Who would have thought she knew how to fly a plane?"] },
  { id: "27d1351f-694e-4b44-85ed-5bf26044f1a0", examples: ["Don't give up, I have faith in you.", "I know you can do it, I have faith in you.", "She has faith in you to lead the team.", "I have faith in you, son."] },
  { id: "d9437185-2470-4a2a-9f56-bca566f8e133", examples: ["Do you think they will win? Not a chance.", "There is no chance of rain today.", "Not a chance I'm eating that.", "Does he have a chance? Not a chance."] },
  { id: "6d1fcfb7-eb69-4f45-a02a-a467be4a4e31", examples: ["The crowd is going to go nuts when the band starts.", "Don't go nuts, it's just a small scratch.", "My dog goes nuts when the mailman comes.", "She went nuts over the new shoes."] },
  { id: "e7e80467-9779-46fb-91c5-5a980967eaa2", examples: ["He went ballistic when he saw the bill.", "My mom is going to go ballistic if I'm late.", "The boss went ballistic over the mistake.", "Don't go ballistic, let me explain."] },
  { id: "f988fadd-3066-4cc2-b322-e201bec81dd7", examples: ["The police played cat and mouse with the suspect.", "It's a game of cat and mouse.", "Tired of playing cat and mouse.", "Cat and mouse chase."] },
  { id: "2d1523a4-5611-4e85-b8eb-b826a317dad8", examples: ["Technically it's blue-green, not teal. You're splitting hairs.", "Stop splitting hairs and focus on the main point.", "I don't want to split hairs, but facts differ.", "Splitting hairs over pennies."] },
  { id: "734ae188-63d8-4c5e-9e4c-edcfd06059e3", examples: ["He reads five books a week; he's a bookworm.", "She was a bookworm in school.", "Ask the bookworm for the answer.", "Bookworm preference."] },
  { id: "5d4aa834-ec0a-4cf9-b859-6c8ec8a76ae3", examples: ["He forgot his own name? What an airhead.", "She acts like an airhead but is smart.", "Don't be an airhead.", "Total airhead moment."] },
  { id: "9c9409d9-055b-44cf-b425-d802600a94f6", examples: ["I wanted to ask her out but chickened out.", "Don't chicken out now.", "He chickened out of the bungee jump.", "I never chicken out."] },
  { id: "80fe31d3-2f30-4688-8993-10c2ca7cc511", examples: ["I lost my phone and started to freak out.", "Don't freak out.", "She freaked out when she saw the spider.", "Freaking out completely."] },
  { id: "ae088d92-0a4d-4952-84f8-309846cd74cb", examples: ["Stop asking personal questions, you busybody.", "She's a busybody who knows everyone's business.", "Don't be a busybody.", "Neighborhood busybody."] },
  { id: "1757c122-a26f-4917-9edd-c15d63aaa023", examples: ["My neighbor is a chatterbox.", "Little chatterbox in class.", "She's such a chatterbox.", "Quiet down chatterbox."] },
  { id: "5a88eac7-4a40-4fb9-84c5-a82c1ecdc3ae", examples: ["He's a go-getter who never gives up.", "We need a go-getter for this role.", "She's a real go-getter.", "Go-getter attitude."] },
  { id: "2fc53fa6-9deb-41cb-9c07-e5680dc0fecc", examples: ["He sat on the sofa all day like a couch potato.", "Don't be a couch potato.", "I feel like a couch potato today.", "Couch potato lifestyle."] },
  { id: "fbc4debd-5aac-4e5e-b513-862e61ed1826", examples: ["Don't be a wet blanket, have some fun.", "He's such a wet blanket.", "She acted like a wet blanket.", "No wet blankets allowed."] },
  { id: "4bd5f0d4-fa00-47d2-8bae-81e8e743e2a2", examples: ["I can't lend you money, I'm broke.", "Completely broke until payday.", "He went broke gambling.", "Being broke is tough."] },
  { id: "933e186f-610a-47f7-80bf-88cf358c7dea", examples: ["He buys a new car every month, he's loaded.", "Her family is loaded.", "I wish I was loaded.", "Loaded with cash."] },
  { id: "1a859046-c448-4a90-8e79-be7a8921ee9e", examples: ["Buy the good coffee, don't be a cheapskate.", "He's a notorious cheapskate.", "Stop being a cheapskate.", "Cheapskate behavior."] },
  { id: "238bb399-4c31-47be-a31f-88883d7058de", examples: ["He acts nice but gossips about you; he's two-faced.", "I hate two-faced people.", "She is so two-faced.", "Don't be two-faced."] },
  { id: "255eda63-2f62-4db6-9d81-f036a53b5eff", examples: ["That price is a rip-off.", "Don't buy it, it's a rip-off.", "Total rip-off.", "What a rip-off."] },
  { id: "104731ab-dfba-41f3-a483-d03ee9f49e2d", examples: ["He tried to grease the official's palm.", "Greasing palms to get ahead.", "You can't grease my palm.", "Grease someone's palm."] },
  { id: "b3bd37d1-8a93-423d-96a8-24c2a0eeecc5", examples: ["Pay me in cold hard cash.", "I want cold hard cash.", "Cold hard cash only.", "Nothing beats cold hard cash."] }
];

async function main() {
    console.log(`Enriching strict batch 4 of ${batch.length} cards...`);
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
