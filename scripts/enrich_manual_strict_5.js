
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

// Batch 5 (Indices 50-99 of new strict_batch.json)
const batch = [
  { id: "9599f698-5da2-4204-86e4-8c0869a6888c", examples: ["He works 60 hours a week for peanuts.", "I'm not doing this job for peanuts.", "They pay peanuts compared to the industry standard.", "You can't expect quality if you pay peanuts."] },
  { id: "721b46d2-966a-457c-8cd8-d8a1bab6aca4", examples: ["$50 for a sandwich? That's highway robbery!", "Paying that much for parking is highway robbery.", "It's absolute highway robbery what they charge.", "Highway robbery prices."] },
  { id: "1082b92b-1559-487b-ad27-e404487d3a19", examples: ["I got this designer bag for $20; it was a steal.", "At that price, the house is a steal.", "It's a steal, you have to buy it.", "Real estate here is a steal right now."] },
  { id: "24c57fc1-44a4-4ade-b98f-14a0b920a9be", examples: ["Are you serious or just pulling my leg?", "He loves to pull my leg with his stories.", "Stop pulling my leg.", "I thought he was pulling my leg about the promotion."] },
  { id: "2695680c-7eb7-4841-83da-3c38fd688c6e", examples: ["I waited at the restaurant for an hour, but he stood me up.", "She stood him up on their first date.", "Don't stand me up again.", "He got stood up at the altar."] },
  { id: "ffb6b850-a604-4bf7-acb0-b43a939ede1e", examples: ["The movie was boring so we ditched it.", "He ditched class to go to the beach.", "Don't bail on us tonight.", "She bailed at the last second."] },
  { id: "329bf801-69bd-4076-a345-5ea8fc5f6f05", examples: ["That salesman tried to rip me off.", "Don't let them rip you off.", "I feel like I got ripped off.", "He always rips off tourists."] },
  { id: "41941ae2-d61a-49f8-81f6-c1e30ec236f7", examples: ["He tried to pull a fast one on the teacher.", "Don't try to pull a fast one on me.", "The contractor pulled a fast one and left.", "Pulling a fast one with fake ID."] },
  { id: "0f7ed068-4ee5-43a3-a6f2-5b17e59e5926", examples: ["Romeo was head over heels for Juliet.", "I'm head over heels in love with this city.", "She fell head over heels for him.", "Head over heels romance."] },
  { id: "523467c9-b819-49ae-82c6-546c970d01f3", examples: ["Stop flirting with the waiter.", "She was flirting with danger.", "He's always flirting with everyone.", "Just a little harmless flirting."] },
  { id: "b3789ce7-972c-4fb5-a6db-ba2e09818ca9", examples: ["Everyone knows you have a crush on her.", "I have a huge crush on that actor.", "She has a crush on the new guy.", "Childhood crush."] },
  { id: "7a218719-5f83-415f-91dd-ca327dfd4125", examples: ["After ten years, they finally tied the knot.", "They are planning to tie the knot in June.", "I'm not ready to tie the knot.", "Tying the knot in Vegas."] },
  { id: "48116d81-9e00-4281-aca2-6a295391c9c0", examples: ["He tried to hit on me at the bar.", "Stop hitting on my girlfriend.", "She was getting hit on all night.", "Hitting on strangers is awkward."] },
  { id: "d7913146-8956-4f7d-bace-9ec4ebc8ebca", examples: ["He's a social butterfly and talks to everyone.", "She enjoys being a social butterfly.", "Not exactly a social butterfly.", "Transforming into a social butterfly."] },
  { id: "8983dcfd-f4b0-46c3-9970-aa6e7d1c1335", examples: ["Despite his fame, he is very down to earth.", "She's a down to earth person.", "I like him because he's down to earth.", "Keep it down to earth."] },
  { id: "e98f7c29-8716-4405-8df1-932830821bb3", examples: ["Rolling with my squad tonight.", "The whole crew is here.", "My squad goals.", "Partying with the crew."] },
  { id: "2c27751a-6968-45af-8457-f90e6f8d4431", examples: ["She's my BFF forever.", "Call your bestie.", "My bestie knows all my secrets.", "Hanging out with my BFF."] },
  { id: "b708054d-da1d-48e4-923a-5436cf913746", examples: ["His friends call him whipped because he never goes out.", "He is totally whipped.", "Don't be so whipped.", "Whipped by love."] },
  { id: "e87efc10-d06b-4ed5-bddf-5bb0a66b48d8", examples: ["Stop staring, you creep.", "He acts like a weirdo.", "What a creep.", "She thinks you're a weirdo."] },
  { id: "ad2bcee3-4cb1-4995-9a3f-f31c74cb2073", examples: ["That movie was so cheesy and romantic.", "I love cheesy pop songs.", "It sounds cheesy, but I love you.", "Cheesy jokes."] },
  { id: "aa627eca-6d72-49d1-81ff-ad52ec0c0bca", examples: ["That excuse is lame.", "This party is lame.", "Don't give me a lame reason.", "Lame attempt."] },
  { id: "2efc69a3-9787-409b-9944-89aae447df5d", examples: ["That new car is dope.", "Your skills are sick!", "This beat is dope.", "Sick moves, man."] },
  { id: "0ad497f2-64f0-4d34-8504-e98438134491", examples: ["He prefers to be a loner.", "Don't be such a loner.", "The quiet loner in the back.", "Loner lifestyle."] },
  { id: "4bf4864e-67f7-4aca-8e34-4d1ba782b581", examples: ["He got cold feet at the altar.", "I wanted to sing but got cold feet.", "Don't get cold feet now.", "Getting cold feet is normal."] },
  { id: "095ab979-d4d4-465d-9e34-ad7c03035653", examples: ["That video was so cringe.", "I cringe every time I think about it.", "Total cringe moment.", "Don't be cringe."] },
  { id: "f1b6b569-5f0f-460f-acc9-e8dc5b51696f", examples: ["You have to have guts to do that.", "It takes guts to stand up to a bully.", "He has no guts.", "Have guts and try."] },
  { id: "754cab2b-9d70-47ef-aa75-dd4ce2bbc92b", examples: ["She totally killed it on stage!", "You slayed that outfit.", "Go out and kill it.", "Slaying the game."] },
  { id: "6d7bd655-1fba-4ee3-9c5b-08eba3cdeefb", examples: ["I really screwed up this time.", "Don't mess up the presentation.", "She screwed up the recipe.", "Big mess up."] },
  { id: "80629785-d315-4b34-b38c-06ba1574570b", examples: ["This homework is a pain in the neck.", "He can be a real pain in the neck.", "What a pain in the neck.", "Stop being a pain."] },
  { id: "22542a20-842c-4e9c-b9d1-5c4e80074100", examples: ["Those abs are rock hard.", "He's a tough guy, rock hard.", "Rock hard determination.", "Tough cookie."] },
  { id: "7b13ace7-bb3b-4fcb-b3f4-56f7bdbe56a6", examples: ["I just woke up and I'm in a fog.", "Walking around in a fog.", "Her mind was in a fog.", "Clear the fog."] },
  { id: "519ce0e5-824c-4c51-83a5-b4cdeab3354e", examples: ["Driving this car is a piece of cake.", "For him, math is a piece of cake.", "It wasn't exactly a piece of cake.", "Piece of cake job."] },
  { id: "29b34bb9-ba41-46c7-9281-deb0e04372b9", examples: ["He's too much of a chicken to jump.", "Don't be a coward.", "Chicken!", "Cowardly act."] },
  { id: "830ee798-ceaa-406d-9a94-ba010a7c52a9", examples: ["They got absolutely hammered last night.", "He was wasted at the party.", "Don't get hammered.", "Totally wasted."] },
  { id: "733fe06a-0b22-4367-9068-4f1f7dfe0228", examples: ["Look sharp, the boss is coming.", "He is a sharp thinker.", "Stay sharp.", "Sharp dressed man."] },
  { id: "16553878-eec4-46bc-a8b5-5514341b0b61", examples: ["It's hard to quit coffee cold turkey.", "He stopped drinking cold turkey.", "Going cold turkey is dangerous.", "Cold turkey method."] },
  { id: "aaf6402d-2fae-48ec-973e-375577c8afab", examples: ["I'm so hungover I can't move.", "Hungover from the party.", "Worst hungover feeling.", "Never get hungover."] },
  { id: "1ee6e882-dcd9-409b-8bb8-7cfd587dd6a5", examples: ["He coughs like a chain smoker.", "My uncle was a chain smoker.", "Stop being a chain smoker.", "Chain smoker habits."] },
  { id: "74f96b40-9011-49e1-9d2a-921740e73d9c", examples: ["He's a total computer geek.", "Proud to be a nerd.", "Geek squad.", "Nerd culture."] },
  { id: "91c955f4-ffc1-4258-9f52-16badf996039", examples: ["Her closet proves she's a shopaholic.", "Recovering shopaholic.", "Shopaholic problems.", "Don't be a shopaholic."] },
  { id: "9a322a7d-b470-4ad3-b45a-e652f9393cc6", examples: ["Ask him, he's a huge movie buff.", "Classic movie buff.", "Movie buff trivia.", "She's a movie buff."] },
  { id: "ecf0d199-cc5e-4023-ab5b-0e1693cc99fc", examples: ["I need chocolate, I'm a chocoholic.", "Chocoholic dream.", "Confessions of a chocoholic.", "Giving up chocolate for a chocoholic."] },
  { id: "c8ee20f4-4dc0-4758-95db-cc5ffafb8d96", examples: ["He never goes home, he's a workaholic.", "Workaholic lifestyle.", "Don't be a workaholic.", "Recovering workaholic."] },
  { id: "18482954-d974-4b14-a18e-f46103af40b9", examples: ["She was always a shoulder to cry on.", "I need a shoulder to cry on.", "Shoulder to cry on friend.", "Be a shoulder to cry on."] },
  { id: "b9de5b46-8a2c-4400-8e01-a8962fcee1cf", examples: ["He won't eat vegetables, he's a picky eater.", "Toddlers are often picky eaters.", "Picky eater menu.", "Don't be a picky eater."] },
  { id: "e999bba9-bcb6-4bf2-939f-2657993cbae1", examples: ["Don't tell him, he has a big mouth.", "She ruined the surprise with her big mouth.", "Big mouth strikes again.", "Watch your big mouth."] },
  { id: "597a74c6-90d7-4eee-acb1-6fb2f741c8b3", examples: ["As a foodie, I love this restaurant.", "Foodie adventures.", "Gourmet foodie.", "Foodie blog."] },
  { id: "5db76489-a1f6-4170-b0da-21e19e47e3a1", examples: ["I felt like a third wheel on their date.", "Nobody likes being a third wheel.", "Third wheel syndrome.", "Don't be a third wheel."] },
  { id: "a42b9be8-3230-4526-81bf-d9ed37667947", examples: ["She bought the same dress, what a copycat.", "He's just a copycat.", "Copycat crime.", "Don't be a copycat."] },
  { id: "fbe7212d-ee24-491e-8a7f-d1fdea736dce", examples: ["He's a daredevil on that motorcycle.", "Daredevil stunts.", "She's a real daredevil.", "Daredevil attitude."] }
];

async function main() {
    console.log(`Enriching strict batch 5 of ${batch.length} cards...`);
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
