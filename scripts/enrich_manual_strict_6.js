
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

// Batch 6 (Indices 100-149 of new strict_batch.json)
const batch = [
  { id: "fbe7212d-ee24-491e-8a7f-d1fdea736dce", examples: ["\"I can do anything.\" \"Jack of all trades, master of none.\"", "He knows a bit of coding, design, and marketing; a master of none.", "Don't try to be a master of none.", "Being a master of none isn't always bad."] },
  { id: "31584e22-0646-422c-8ba7-c6b67a1baffe", examples: ["He can fix your car and your computer; he's a jack of all trades.", "I need a handyman who is a jack of all trades.", "She's a jack of all trades in the office.", "Being a jack of all trades is useful."] },
  { id: "9669d688-a03b-47f7-a151-770e1f87fab7", examples: ["When I was sad, she lent a sympathetic ear.", "I just need a sympathetic ear, not advice.", "He found a sympathetic ear in his neighbor.", "Thanks for being a sympathetic ear."] },
  { id: "bcbf430d-2393-42e3-b3ca-10464f3d780a", examples: ["You won the trip? You lucky duck!", "He's a lucky dog to have such a great job.", "What a lucky duck.", "I wish I was a lucky dog like him."] },
  { id: "65c3a2e8-3f4e-4e65-a653-ec952e20f9b4", examples: ["Every time I wash my car, it rains. I'm jinxed.", "This project seems jinxed from the start.", "Don't say that, you'll jinx us.", "I feel jinxed today."] },
  { id: "f4c4f1c5-771b-4e64-8c4d-c3ee4a2ada89", examples: ["She creates extra homework for herself; total teacher's pet.", "Nobody likes a teacher's pet.", "He was the teacher's pet in math class.", "Don't be a teacher's pet."] },
  { id: "62027e00-92f4-4f10-b21e-0de946923415", examples: ["He was caught looking through the window like a Peeping Tom.", "The police arrested a Peeping Tom in the neighborhood.", "Don't be a Peeping Tom.", "She felt like someone was being a Peeping Tom."] },
  { id: "386c5843-c8c5-4781-b61b-86e07e4d5d8e", examples: ["He's handsome, rich, and kind; he's a real catch.", "She's a catch, don't let her go.", "Everyone says your new boyfriend is a catch.", "Finding a catch like him is rare."] },
  { id: "c490e7e9-686a-4003-9cbe-c745b5fd2d84", examples: ["The car broke down too? That's all I needed.", "I have a headache, and now this noise. That's all I needed.", "Great, more bills. That's all I needed.", "That's all I needed today."] },
  { id: "5ce77901-d678-4318-9b3d-7ea157826586", examples: ["Why is everything going wrong? Someone must have cast a spell on you.", "I feel like someone cast a spell on me.", "Did a witch cast a spell on you?", "Unlucky day, like someone cast a spell on you."] },
  { id: "d3be7586-4d41-4b7a-b148-071471b7c4cc", examples: ["\"I'm going to be famous.\" \"Famous my foot!\"", "Healthy food my foot; this is full of sugar.", "Expert my foot.", "Innocent my foot."] },
  { id: "dd5ab79b-b452-4397-a810-e3ef67d5d0f8", examples: ["I shouldn't have said we would win; I jinxed it.", "Don't talk about the weather or you'll jinx it.", "I think I put the hex on myself.", "He jinxed the game."] },
  { id: "e14a6b17-a362-4872-aedc-1298353237ed", examples: ["The deal is almost done, knock on wood.", "I've never broken a bone, touch wood.", "Touch wood nothing goes wrong.", "Knock on wood for luck."] },
  { id: "fb5ea449-2aa4-4d7b-9fb8-3e086b5571ce", examples: ["If the house burns down, God forbid, we have insurance.", "God forbid we lose this contract.", "I hope, God forbid, you never face that.", "God forbid anything happens."] },
  { id: "00ea6039-f691-4826-a22c-2cc4739ee7b7", examples: ["So what if they laugh? Who cares?", "I missed the show, but who cares?", "Who cares what people think?", "Who cares about the price?"] },
  { id: "aed8b6e7-fb74-4515-b152-feb6eb36c590", examples: ["If the boss finds out, heaven help us.", "We are lost in the woods, heaven help us.", "Heaven help us if this plan fails.", "Heaven help us all."] },
  { id: "ee816e12-0477-4a00-9040-effa0a8ddd9f", examples: ["This is too hard. To hell with it.", "To hell with the diet, I want cake.", "I said to hell with it and quit.", "To hell with the consequences."] },
  { id: "b1ad8cef-09c4-41b2-9ae2-1c4c241f2484", examples: ["Thank God you are safe.", "Thank goodness it stopped raining.", "We finished on time, thank God.", "Thank goodness for that."] },
  { id: "fcb5cbe9-07ee-4743-bbb9-d2aba02b1c2d", examples: ["You sold the car for $1? Were you dropped on your head?", "He acts like he was dropped on his head.", "What is wrong with you? Dropped on your head?", "She must have been dropped on her head as a baby."] },
  { id: "dd735a3e-197a-4540-8161-8117842f430f", examples: ["I met my neighbor and she talked my ear off.", "Don't let him talk your ear off about politics.", "He can talk your ear off if you let him.", "She talked my ear off all flight."] },
  { id: "97e7e200-2150-4207-b748-66bd927e0214", examples: ["You paid $1000 for that? They took you for a ride.", "Be careful, that mechanic will take you for a ride.", "I think we're being taken for a ride.", "Don't let them take you for a ride."] },
  { id: "893eabf7-f004-4ed1-9123-65809faae3fa", examples: ["I didn't want to go, but she talked me into it.", "He talked me into buying the expensive warranty.", "See if you can talk him into coming.", "I let them talk me into it."] },
  { id: "49f14d4e-37a1-47a4-969e-51bc15e3fe97", examples: ["He wears a winter coat in July; he's got a screw loose.", "Do you have a screw loose?", "I think that dog has a screw loose.", "Must have a screw loose to do that."] },
  { id: "c0968615-d796-4fb3-877a-70de5d09fa9a", examples: ["He tried to pull the wool over my eyes with fake data.", "You can't pull the wool over my eyes.", "She pulled the wool over everyone's eyes.", "Don't let him pull the wool over your eyes."] },
  { id: "82009af5-ea78-40fc-94b5-c871035ddb41", examples: ["We argue about this every day. Let's agree to disagree.", "We agreed to disagree on that topic.", "Can we just agree to disagree?", "Agreeing to disagree is healthy."] },
  { id: "73517acf-f36c-4e54-8376-94746ed10a96", examples: ["I don't actually support the idea, I'm just playing devil's advocate.", "She loves to play devil's advocate in debates.", "Playing devil's advocate helps find flaws.", "Let me play devil's advocate."] },
  { id: "d6fed407-b60a-4f00-a5fb-de23d5c4fd0f", examples: ["\"She's the best singer ever.\" \"I wouldn't go that far.\"", "He's rich, but a billionaire? I wouldn't go that far.", "I wouldn't go that far to say I hate it.", "Maybe dislike, but I wouldn't go that far."] },
  { id: "7e23f3be-1249-4366-a170-3c0529293a60", examples: ["This team needs to get its act together.", "After the failure, he got his act together.", "Get your act together or leave.", "Time to get your act together."] },
  { id: "39fe36a0-e214-4969-8cc1-ef4bcab84a7a", examples: ["I shouted at him in the heat of the moment.", "Decisions made in the heat of the moment are often bad.", "It happened in the heat of the moment.", "Forgive what was said in the heat of the moment."] },
  { id: "230d0e71-a9e7-48fc-ad69-6bdb4430b1c2", examples: ["He's having a bad week, cut him some slack.", "Cut me some slack, I'm trying my best.", "I wish the boss would cut us some slack.", "Cutting some slack wouldn't hurt."] },
  { id: "aa7b42cb-e631-466b-b717-b6e947f32c7a", examples: ["The plot was so confusing I couldn't wrap my head around it.", "I can't wrap my head around why he left.", "Trying to wrap my head around this code.", "Wrap your head around the concept."] },
  { id: "178aef1f-6b2a-463b-9f7b-77d68ada8051", examples: ["Skipping class is a slippery slope to failing.", "Lying is a slippery slope.", "Be careful, it's a slippery slope.", "The decision started a slippery slope."] },
  { id: "e1c8d010-5657-4ebc-8034-cf923e5cede1", examples: ["I forgot my notes, so I'll have to wing it.", "She winged the entire speech and it was great.", "Just wing it.", "Don't wing it, prepare."] },
  { id: "b587f498-d1fb-44a7-8cc2-1ae8880cc3b8", examples: ["His sudden illness threw a wrench in the works.", "Don't throw a wrench in the works.", "This mistake throws a wrench in the works.", "A wrench in the works of our plan."] },
  { id: "6d24635e-361e-4119-b59d-e32a3c0de8f0", examples: ["You think he'll lend you the money? Don't hold your breath.", "I applied for the job, but I'm not holding my breath.", "Don't hold your breath waiting for an apology.", "She's not holding her breath."] },
  { id: "854d5265-f375-4e34-b4de-b2e32882c59d", examples: ["Address the problem now and nip it in the bud.", "We need to nip this rumor in the bud.", "Bad habits should be nipped in the bud.", "Nip it in the bud immediately."] },
  { id: "14f65bd5-3295-4e6c-880e-0fe9dd18f420", examples: ["The question came out of the blue.", "He arrived out of the blue.", "It happened completely out of the blue.", "A call out of the blue."] },
  { id: "a781db7b-0b11-4af3-9509-f4e1bee2b3df", examples: ["The date of the wedding is still up in the air.", "Our travel plans are up in the air.", "Everything is up in the air right now.", "Leaving things up in the air."] },
  { id: "ce58b405-5d0d-4d1c-bc59-68c6ce29b5ce", examples: ["I don't want to burst your bubble, but Santa isn't real.", "She burst his bubble about the job offer.", "Sorry to burst your bubble.", "Bursting bubbles of illusion."] },
  { id: "b2410790-f808-478e-b7ed-3c2c266aaaad", examples: ["Best friends don't stab each other in the back.", "He felt stabbed in the back by his team.", "A stab in the back.", "Don't stab me in the back."] },
  { id: "e492adae-b140-4d24-8d41-aff969790545", examples: ["She was on cloud nine after the proposal.", "Winning made him feel on cloud nine.", "Walking on cloud nine.", "I'm on cloud nine."] },
  { id: "3ca04e37-532b-4ecc-b42c-a9735b69544f", examples: ["The surgery is painful, but you have to bite the bullet.", "I bit the bullet and paid the fine.", "Just bite the bullet.", "Bite the bullet and do it."] },
  { id: "2f4efbfe-513f-4ae6-8e8a-e6c603392942", examples: ["I was explaining it, but I lost my train of thought.", "Don't make me lose my train of thought.", "Lost his train of thought mid-sentence.", "Where was I? I lost my train of thought."] },
  { id: "35a3ea67-4b33-47ad-842b-40bb1b9a859e", examples: ["Tell me the gossip, I'm all ears.", "If you have a solution, I'm all ears.", "The audience was all ears.", "I'm all ears for your story."] },
  { id: "b23bcce0-2bc3-44ee-97f0-ce33061c37ef", examples: ["They pressured him to sign, but he stuck to his guns.", "Stick to your guns if you believe you are right.", "She stuck to her guns.", "Sticking to my guns."] },
  { id: "c0790d62-868e-4ec0-aa7e-b11951e59ca9", examples: ["Laughing at his mistake just added insult to injury.", "Don't add insult to injury.", "To add insult to injury, it started raining.", "Adding insult to injury."] },
  { id: "25815448-039f-4441-a742-92537ff1a5c5", examples: ["He is already upset; don't add fuel to the fire.", "Your comment just added fuel to the fire.", "Adding fuel to the fire of the argument.", "Stop adding fuel to the fire."] },
  { id: "0cf90bbd-4c00-48c7-a20c-0a61ed3d31dc", examples: ["We decided to take the plunge and get married.", "Take the plunge and start your own business.", "She took the plunge.", "Taking the plunge is scary."] },
  { id: "62aacd86-5716-49af-b5a5-ad7e7cf65112", examples: ["I can't put up with this noise anymore.", "She put up with his behavior for years.", "Don't put up with disrespect.", "Putting up with a lot."] },
  { id: "a9659cef-be06-4582-a547-1ac162dada37", examples: ["He calls a spade a spade, even if it hurts.", "I admire her for calling a spade a spade.", "Let's call a spade a spade.", "Calling a spade a spade."] }
];

async function main() {
    console.log(`Enriching strict batch 6 of ${batch.length} cards...`);
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
