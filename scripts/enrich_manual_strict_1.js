
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

const batch = [
  { id: "d87c7414-0815-4953-9d2e-f825ff2ac44a", examples: ["\"You look beautiful today.\" \"Oh stop, you're too kind.\"", "Thank you for the gift, you're too kind.", "He offered to help move, he's too kind.", "You're too kind to say that."] },
  { id: "4cca6fed-fd06-47b6-984f-c4c6fb7144c5", examples: ["(Holding the door open) \"After you.\"", "Please, after you, I insist.", "Ladies first? No, after you.", "After you, sir."] },
  { id: "53d8af93-3681-42ab-9037-2c11d2f38108", examples: ["All these compliments are making me blush.", "Stop it, you're making me blush.", "She's making me blush with that praise.", "You're making me blush in front of everyone."] },
  { id: "911b9843-f873-4177-b87e-cd2b786b3b5f", examples: ["Don't leave yet. Stick around for the party.", "I'll stick around until you're done.", "Why don't you stick around for dinner?", "He decided to stick around a bit longer."] },
  { id: "47dfd690-6ff6-4dde-a2c6-4a686512c64a", examples: ["When is dinner ready? I'm starving.", "I haven't eaten all day, I'm starving.", "Let's grab a burger, I'm starving.", "Are you hungry? I'm starving."] },
  { id: "c822935d-25f6-4ac4-899e-f97e351b8e7a", examples: ["I'm really craving pizza right now.", "Pregnant women often say 'I'm craving pickles'.", "I'm craving something sweet.", "Sudden urge, I'm craving sushi."] },
  { id: "640ddf63-c5fa-48f7-8b48-f660e5b7078b", examples: ["I can't eat another bite. I'm stuffed.", "Thanks for the meal, I'm stuffed.", "I ate too much and now I'm stuffed.", "Are you still hungry? No, I'm stuffed."] },
  { id: "4c684601-a52b-4f5e-9bea-dabc56fd7bed", examples: ["(Drinking cold water on a hot day) Ah, that hit the spot.", "That hot soup really hit the spot.", "A nap would hit the spot right now.", "This burger hit the spot."] },
  { id: "f9d539df-ddfd-47e5-ab6b-69542e40261e", examples: ["Have you tried sushi? I'm crazy about it.", "She's crazy about him.", "I'm not exactly crazy about this idea.", "Fans are crazy about the new album."] },
  { id: "e2859986-f0af-425a-8d4e-ce212bd02171", examples: ["Double shift today. I'm absolutely wrecked.", "I'm beat; I'm going to bed.", "After the marathon, I was wrecked.", "Work was hard, I'm beat."] },
  { id: "51239955-c619-4b76-9bcf-3849ec1a867b", examples: ["Keep away from him; he's pissed off about losing the game.", "I'm so pissed off right now.", "Don't get pissed off.", "Why are you pissed off?"] },
  { id: "a7c9b1aa-c500-42a8-abf1-2cde5aa673ce", examples: ["Do you want to go dancing? \"Nah, I'm not in the mood.\"", "I'm not in the mood for jokes.", "Just leave me alone, I'm not in the mood.", "Not in the mood to cook."] },
  { id: "acdf87ce-d78d-43f2-84dd-0982d668b880", examples: ["The way he treats people makes me sick.", "Violence makes me sick.", "Eating that much sugar makes me sick.", "It makes me sick to see this mess."] },
  { id: "0d53228c-d743-4821-9a01-08f75dd3f099", examples: ["When he insulted my mom, I just lost it.", "She lost it and started screaming.", "Don't lose it over something small.", "I almost lost it during the meeting."] },
  { id: "ab01b90a-2432-47bd-b70a-ad7105ef452f", examples: ["The baby hasn't stopped crying for hours. I'm at the end of my rope.", "I'm at the end of my rope with this job.", "Patience is gone, I'm at the end of my rope.", "He's at the end of his rope."] },
  { id: "d236825b-88f6-493f-9160-fdf8384970ec", examples: ["I'm fed up with this traffic every single day.", "She's fed up with his lies.", "I'm fed up, I quit.", "Are you fed up yet?"] },
  { id: "7e50cb1e-c035-48b8-b3e1-3da66eabdfb4", examples: ["Okay, you win. I give up.", "Don't give up so easily.", "I give up, what's the answer?", "Never give up."] },
  { id: "3609e7d4-5e1c-4191-92a1-e3182cc91817", examples: ["Stop screaming! I can't take it anymore!", "This noise, I can't take it anymore.", "I can't take it anymore, I'm leaving.", "Stress is too much, I can't take it."] },
  { id: "169b5bfa-6aa0-442a-8416-560d11b63606", examples: ["I used to be sad about the breakup, but now I'm over it.", "Are you over it yet?", "Get over it.", "I'm completely over it."] },
  { id: "f336e179-d1b2-4d23-81bb-aba5214f8166", examples: ["It's been a month since she left. I miss her terribly.", "I miss him terribly.", "Do you miss me?", "Miss you terribly."] },
  { id: "d975b463-fd44-44f3-b536-044153434a13", examples: ["Her singing was so good it gave me goosebumps.", "This scary movie gives me goosebumps.", "Cold wind gave me goosebumps.", "That story gave me goosebumps."] },
  { id: "caaa2434-f35a-486a-bfb6-0ce432771491", examples: ["That movie was so beautiful, it moved me to tears.", "His speech moved me to tears.", "Moved to tears by the kindness.", "It moved her to tears."] },
  { id: "55a1487f-92bc-4b86-aba1-8f66e15b3549", examples: ["Hearing about his accident really bummed me out.", "Bad news bummed me out.", "Don't let it bum you out.", "It bums me out when it rains."] },
  { id: "d7d5a965-1fbe-473e-8d33-9fe9a49eddb6", examples: ["Don't sneak up on me like that! It scared the hell out of me.", "The crash scared the hell out of me.", "Scared the hell out of everyone.", "That mask scared the hell out of me."] },
  { id: "704fb8c4-7bab-4cf9-9659-f094c4b02928", examples: ["The special effects in that movie blew my mind.", "This theory will blow your mind.", "It totally blew my mind.", "Her talent blows my mind."] },
  { id: "8fd557ca-e68e-4073-b9e4-439c16146bb1", examples: ["I was taken aback by his sudden rudeness.", "She was taken aback by the price.", "Taken aback by the question.", "Don't be taken aback."] },
  { id: "40055b04-aea0-468e-b124-6000a5c0d753", examples: ["When I heard the news, I was absolutely floored.", "Floored by the surprise party.", "I was floored to see him there.", "Her generosity floored me."] },
  { id: "6f32f7f1-28b5-4fc2-91bb-82a845614561", examples: ["Wait, explain that again. I'm lost.", "I'm lost, can you help?", "This map is confusing, I'm lost.", "Totally lost in this conversation."] },
  { id: "22e9c1a2-33ef-41ee-bf23-39c7123c25a4", examples: ["When she walked in wearing that dress, my jaw dropped.", "My jaw dropped at the sight.", "His jaw dropped when he won.", "Jaw-dropping performance."] },
  { id: "34a730bd-27cb-4323-aec2-e4da9f728965", examples: ["Suddenly it dawned on me that I had left the oven on.", "It finally dawned on me.", "Has it dawned on you yet?", "It dawned on her that he was lying."] },
  { id: "cf70ac35-22e0-4e69-96f6-96689b6b37dc", examples: ["If you think I'm going to agree to that, you're out to lunch.", "He's totally out to lunch.", "You must be out to lunch.", "Is he out to lunch?"] },
  { id: "ba5f7e3d-684d-44ae-a7bc-5ff76aca7142", examples: ["He explained it three times before the penny finally dropped.", "Wait for the penny to drop.", "The penny dropped eventually.", "Oh, now the penny dropped."] },
  { id: "483061ff-a6d7-4183-b465-a4d928624109", examples: ["Why is everyone laughing? I don't get it.", "I just don't get it.", "Do you get it?", "I don't get the joke."] },
  { id: "98a0c55c-f0a0-4ba0-ac6a-94f49baa0427", examples: ["\"How did he escape?\" \"It beats me.\"", "Beats me why he did that.", "That beats me.", "Who knows? Beats me."] },
  { id: "f275a918-070a-4eec-9ee7-7c29c80836db", examples: ["If the boss finds out, we're screwed.", "We are totally screwed.", "Screwed without a plan.", "Don't say we're screwed."] },
  { id: "669b9cd6-4f1f-4990-ad78-133aaaed0d84", examples: ["I locked my keys in the car. What a mess.", "This room is a mess.", "Clean up this mess.", "What a mess you made."] },
  { id: "73f71bd7-2e5f-46dd-81ec-edaa05ecc469", examples: ["This idea is nuts!", "That guy is totally bonkers.", "Are you nuts?", "It drives me bonkers."] },
  { id: "ed308e63-9bae-4c9f-9761-bfb1d679b272", examples: ["Quit your job with no backup plan? Have you lost your marbles?", "He must have lost his marbles.", "I think I've lost my marbles.", "Lost her marbles completely."] },
  { id: "0a317b8c-342b-404e-b738-8ca998bbd473", examples: ["I forgot to study for the final. I'm doomed.", "We are doomed!", "Doomed to fail.", "Not necessarily doomed."] },
  { id: "14e2e33d-19be-4615-988a-c2b6ac102aa0", examples: ["You look tired. No offense meant, just concerned.", "No offense meant, but I disagree.", "I hope no offense was meant.", "No offense."] }
];

async function main() {
    console.log(`Enriching strict batch of ${batch.length} cards...`);
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
