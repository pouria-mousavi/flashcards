
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

// Batch 2 from strict_batch.json (Lines 41-90 in logic, but sliced from file)
const batch = [
  { id: "e555be6d-2089-495a-b051-dbf22c93fedc", examples: ["\"You stepped on my foot!\" \"Oops, my bad.\"", "It was my bad, I forgot to call you.", "Sorry about the mess, my bad.", "If we lose this game, it's my bad."] },
  { id: "5fafd1d8-84a5-4674-a75f-a4204f7d3daf", examples: ["That new haircut looks great on you.", "I think red really looks great on you.", "Does this dress look great on me?", "Your smile looks great on you."] },
  { id: "903309ca-40a3-4b4f-a6f4-20f08ed7b45d", examples: ["He's grumpy with everyone today. Don't take it personal.", "It wasn't about you, don't take it personal.", "She criticized the work, not you; don't take it personal.", "Try not to take it personal when he yells."] },
  { id: "ef558917-7540-4785-9655-c461f0f960ff", examples: ["That color really suits you.", "Short hair suits you better.", "Does this tie suit me?", "I think this style suits you perfectly."] },
  { id: "18a4e7ab-c88a-4e94-899d-7f27700e031a", examples: ["You worked hard for this promotion. You deserve it.", "Take a vacation, you deserve it.", "After all that trouble, you deserve it.", "Do I really deserve it?"] },
  { id: "38583854-a18e-4a8e-923f-b42d8c412487", examples: ["\"He's not very handsome.\" \"Well, beauty is in the eye of the beholder.\"", "I think it's ugly, but beauty is in the eye of the beholder.", "Art is subjective; beauty is in the eye of the beholder.", "They say beauty is in the eye of the beholder."] },
  { id: "9f274ebc-9c89-44ae-8ed0-383198488747", examples: ["Suit and tie? You look sharp today!", "He always looks sharp for meetings.", "You need to look sharp for the interview.", "Looking sharp!"] },
  { id: "b8da6b3f-c7ed-4662-be9b-d45a64108d4e", examples: ["Hey man, can you do me a solid and give me a ride?", "Do me a solid and cover my shift.", "I need someone to do me a solid.", "He did me a huge solid last week."] },
  { id: "86753e0d-6926-4a8b-b572-90cfab1d30a5", examples: ["I'm trusting you with this. Don't let me down.", "I promise I won't let you down.", "He let me down again.", "Please don't let the team down."] },
  { id: "e23edae4-0068-4f0e-aacc-cb9a2bfeaaa8", examples: ["I heard about your performance. You rocked it!", "She totally rocked it on stage.", "Go out there and rock it!", "We rocked it."] },
  { id: "0668218c-8919-4b99-a6ff-88dd8b342c23", examples: ["You solved the puzzle in record time. Hats off to you.", "Hats off to the chef for this meal.", "I take my hat off to you.", "Hats off to you for trying."] },
  { id: "dc7151d5-1ab2-45ba-8b7a-8c71a4d6512f", examples: ["Whatever happens, I'm with you till the end.", "We are partners, with you till the end.", "She stayed with him till the end.", "I'm with you till the end of the line."] },
  { id: "42b12fb2-0ba0-4d87-8e78-93530b0df89e", examples: ["You can lean on me whenever you're weak.", "Friends are there to lean on.", "Lean on me if you need support.", "He has no one to lean on."] },
  { id: "71b380e5-cb08-485d-8222-85570be6ca57", examples: ["Don't be scared. I won't leave your side.", "I promise I won't leave your side.", "She stayed and wouldn't leave his side.", "I won't leave your side until you're safe."] },
  { id: "ef054397-6de5-4543-994d-9796c4c5414a", examples: ["Even if the whole world is against you, I stand by you.", "I stand by my decision.", "Will you stand by me?", "She stood by him through everything."] },
  { id: "9edcbb8e-d7a8-4fb9-b224-4b4a82df0dd9", examples: ["We need this deal to go through. I'm counting on you.", "Can I count on you?", "I'm counting on you to be there.", "Don't worry, you can count on me."] },
  { id: "bb5aa297-d2a6-4f17-aaa7-c13938f31266", examples: ["You're dangerous. Stay away from me.", "I told you to stay away from me.", "Stay away from me or I'll call the police.", "Just stay away from me."] },
  { id: "33d0aeac-b76b-4bf8-97a0-87766556b233", examples: ["Rest assured, the problem will be solved.", "You can rest assured that we are working on it.", "Rest assured, your money is safe.", "I want to rest assured."] },
  { id: "98f60100-e012-4ccb-bbb6-5d808c778fcf", examples: ["I won't tell anyone. I give you my word.", "You have my word.", "I give you my word of honor.", "He gave his word that he would return."] },
  { id: "5a98d1d6-25e4-456d-bfee-b629919c66f2", examples: ["\"Stop calculating.\" \"Whatever you say.\"", "Okay boss, whatever you say.", "I'll do whatever you say.", "Whatever you say goes."] },
  { id: "490e8fe2-16fb-438c-a0d4-47218b439140", examples: ["\"We're eating Italian tonight.\" \"Okay, you're the boss.\"", "You decide, you're the boss.", "Whatever you want, you're the boss.", "I guess you're the boss now."] },
  { id: "12498236-2408-4165-b8ca-7bb1ebde8a61", examples: ["I said don't touch me!", "Please don't touch me.", "Don't touch me with those dirty hands.", "Why did you touch me?"] },
  { id: "eaa33531-afd6-4741-b83e-911546ea7d26", examples: ["You're hurting my arm. Let me go!", "Let me go right now!", "He wouldn't let me go.", "Please let me go."] },
  { id: "f209ce3f-12e9-47fd-be2f-17b8cc8df4b0", examples: ["Get out of my house right now!", "I told you to get out.", "Get out and don't come back.", "Just get out!"] },
  { id: "6b215789-2194-4268-ae7d-8c76a96f0bb5", examples: ["You ruined my life. I hate your guts.", "He hates my guts.", "Why do you hate my guts?", "I hate your guts for what you did."] },
  { id: "a81154ed-bf9f-4a6e-ba8c-8527c9c1f77e", examples: ["Please help me, it's a matter of life and death.", "This is a matter of life and death.", "Is it really a matter of life and death?", "Strictly a matter of life and death."] },
  { id: "3fa6e333-9f68-40f7-8a57-9ab47316524b", examples: ["I'm done arguing. Do whatever you want.", "You can do whatever you want.", "Just do whatever you want.", "Fine, do whatever you want."] },
  { id: "9c76556e-627d-435e-9999-d1b4e6d5d40d", examples: ["Frankly my dear, I don't give a damn.", "I don't give a damn what they think.", "Do you give a damn?", "He doesn't give a damn about anything."] },
  { id: "1f6ab1ec-ffd8-4af9-b87c-b895db264f1a", examples: ["Hurry up! Time is money.", "We can't waste all day, time is money.", "Remember, time is money.", "In this business, time is money."] },
  { id: "d5e75ca1-45db-4774-9377-986568e1bdbc", examples: ["Opportunity knocks but once.", "When opportunity knocks, answer the door.", "Opportunity knocks for those who are ready.", "You never know when opportunity knocks."] },
  { id: "f4c07e11-8f65-4a08-8dff-f4ecd0056e47", examples: ["I met my neighbor in Paris! It's a small world.", "Wow, you know him too? It's a small world.", "It's a small world after all.", "Funny how it's a small world."] },
  { id: "76449c3a-cd42-4321-ad3b-26511b6dec7e", examples: ["Don't accept defeat. Nothing is impossible.", "They said it couldn't be done, but nothing is impossible.", "With hard work, nothing is impossible.", "Believing nothing is impossible."] },
  { id: "0455ca58-3c76-4d4a-bb0d-7bb8c07af11c", examples: ["Don't worry about the future. What will be, will be.", "Que sera sera, what will be, will be.", "I can't change it, what will be, will be.", "Just accept that what will be, will be."] },
  { id: "fba6a550-925a-4acb-9fbf-abad759cba6b", examples: ["You're finally here! Well, better late than never.", "I submitted it at the last minute; better late than never.", "He apologized years later, better late than never.", "Better late than never, I guess."] },
  { id: "1463324e-1796-430a-8881-7a5780602684", examples: ["He moved away and stopped calling. Out of sight, out of mind.", "The problem is gone; out of sight, out of mind.", "Is it true, out of sight out of mind?", "I put the candy in the drawer. Out of sight, out of mind."] },
  { id: "6fcb5710-775e-410b-ac4d-2179e4b4600d", examples: ["He looks messy but he's a genius. Don't judge a book by its cover.", "This restaurant looks old, but the food is great. Don't judge a book by its cover.", "Never judge a book by its cover.", "You can't judge a book by its cover."] },
  { id: "3ad02fb3-8fc8-442c-926d-91341702364a", examples: ["Keep playing that scale. Practice makes perfect.", "It takes time, but practice makes perfect.", "They say practice makes perfect.", "Practice makes perfect in language learning."] },
  { id: "dbc35d76-6af4-4f66-aa59-4c80a46e1577", examples: ["Everyone is eating with their hands? Well, when in Rome...", "I tried the local food. When in Rome.", "We should dress like them. When in Rome.", "When in Rome, do as the Romans do."] },
  { id: "a6b84bae-05e6-4289-b2d7-8eadaef6c483", examples: ["I won $50 and spent it all on dinner. Easy come, easy go.", "He lost the money immediately. Easy come, easy go.", "That's how it is with gambling; easy come, easy go.", "Easy come, easy go relationships."] },
  { id: "ec9d2330-1db8-4b1e-abf4-522ec25db784", examples: ["I want to get to the sale first. The early bird catches the worm.", "Wake up! The early bird catches the worm.", "He always arrives first; the early bird catches the worm.", "Remember, the early bird catches the worm."] },
  { id: "c12e4c1e-aed6-44f3-85f9-8a20a843e1da", examples: ["Watch a comedy when you're sad. Laughter is the best medicine.", "They say laughter is the best medicine.", "I need a good laugh; laughter is the best medicine.", "Laughter is the best medicine for stress."] },
  { id: "f79e6037-193a-4cb4-8b64-8dae5f5a4ef3", examples: ["Slow down and measure twice. Haste makes waste.", "Don't rush it, haste makes waste.", "I made a mistake because I hurried. Haste makes waste.", "Haste makes waste in cooking."] },
  { id: "4c7b2142-8d34-4b7d-aac5-8ae4023f04eb", examples: ["My muscles hurt from the gym. No pain, no gain!", "Studying is hard, but no pain, no gain.", "It's tough, but no pain, no gain.", "No pain, no gain works for everything."] },
  { id: "f7e7dc96-eda4-4568-b556-773a41cee1e7", examples: ["Stop promising and start doing. Actions speak louder than words.", "He says he loves me, but actions speak louder than words.", "Show me, don't tell me. Actions speak louder than words.", "Actions speak louder than words in politics."] },
  { id: "04e36bb0-fa5a-43fd-8e5e-58893ca8af31", examples: ["Just tell him the truth. Honesty is the best policy.", "I always teach my kids that honesty is the best policy.", "In the long run, honesty is the best policy.", "Is honesty always the best policy?"] },
  { id: "2bb58c2e-dc1d-42e8-8838-69c51f85d95b", examples: ["I just want some peace and quiet. Silence is golden.", "Sometimes, silence is golden.", "The kids are asleep; silence is golden.", "Silence is golden when you're reading."] },
  { id: "741574ab-c600-4096-a95c-4f51d1d3f12a", examples: ["Okay, we're here. What's the plan?", "So, what's the plan for tonight?", "I need to know, what's the plan?", "Do you have an answer to 'what's the plan?'"] },
  { id: "6b20cc74-9f73-47c5-9ddb-1c03777dad54", examples: ["Read as much as you can. Knowledge is power.", "They keep secrets because knowledge is power.", "Education is key, knowledge is power.", "Knowledge is power in the information age."] },
  { id: "475e191e-26c2-49a6-a4d4-35e0d578ba4d", examples: ["It's Friday night! Let's hit the town and celebrate.", "We hit the town and stayed out all night.", "Ready to hit the town?", "Let's hit the town for New Year's."] },
  { id: "429895a6-73c7-437a-b1fc-b68ffb6fd63a", examples: ["You guys go ahead. I'll catch up with you later.", "I have to work, but I'll catch up with you later.", "Don't wait for me, I'll catch up with you later.", "I'll catch up with you later at the bar."] },
  { id: "dd978cbf-db47-412b-b5fb-03c5da64847d", examples: ["Bags are packed. Let's hit the road before traffic gets bad.", "Time to hit the road.", "We should hit the road early.", "Let's hit the road, Jack."] }
];

async function main() {
    console.log(`Enriching strict batch 2 of ${batch.length} cards...`);
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
