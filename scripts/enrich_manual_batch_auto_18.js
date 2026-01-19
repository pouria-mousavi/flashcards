
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

const batch = [
  { id: "f206f97e-adaf-4d27-9c48-6a3ae2188b84", examples: ["Stuffed peppers.", "Stuffed with pride.", "Feel stuffed.", "Stuffed toy."] },
  { id: "5c2c5547-e4e4-4fcc-ae45-9dc032caf064", examples: ["Only a handful.", "Handful of dust.", "He's a handful.", "Grab a handful."] },
  { id: "edefe02d-67d9-4620-b91f-85ade1b41536", examples: ["Get the hang of it.", "Starting to get the hang of.", "Never get the hang of.", "Finally got the hang of."] },
  { id: "938957c0-fa62-4187-9803-901fc4a0f235", examples: ["High viscosity oil.", "Measure viscosity.", "Viscosity index.", "Low viscosity."] },
  { id: "5c6c9391-6ebc-4db9-a1dc-ed204ed712f8", examples: ["Covered in soot.", "Black soot.", "Chimney soot.", "Soot particles."] },
  { id: "55ab60b7-96ba-4a33-b468-dd815f036d88", examples: ["Peasants working.", "Medieval peasants.", "Peasants uprising.", "Life of peasants."] },
  { id: "b0b1b934-0843-4025-86e8-999f07fd6dae", examples: ["Get away with murder.", "Can't get away with it.", "Get away with a warning.", "How did he get away with?"] },
  { id: "f86e4bb7-4ba8-438e-99b5-efa6c0e15327", examples: ["Arrogant smile.", "Arrogant tone.", "Don't be arrogant.", "Arrogant behavior."] },
  { id: "56331b5f-c7ff-418e-aca3-27eab85cc610", examples: ["Infiltrate the base.", "Infiltrate the network.", "Spy infiltrate.", "Failed to infiltrate."] },
  { id: "6b71f242-cff4-4dfd-bbf1-b0e0316a0a45", examples: ["Cramped room.", "Feel cramped.", "Cramped conditions.", "Space is cramped."] },
  { id: "76e4440b-84fa-4d16-a386-a6c0eb4510bb", examples: ["Visit occasionally.", "Occasionally smoke.", "Occur occasionally.", "See him occasionally."] },
  { id: "b2844c72-0890-4fc3-938a-644dc865a929", examples: ["Moundlike shape.", "Moundlike hill.", "Looked moundlike.", "Structure was moundlike."] },
  { id: "eef87d06-0d8a-48b6-ae3f-1a0ef70d09b2", examples: ["Deeper in hot water.", "In hot water again.", "Avoid hot water.", "Got me in hot water."] },
  { id: "ec30d37d-8258-4dee-8cf1-21f007f3a56e", examples: ["Challenging task.", "Challenging time.", "Find it challenging.", "Most challenging."] },
  { id: "8f4dbb34-3345-4b5f-a3d4-1312500d9781", examples: ["Hostile environment.", "Hostile forces.", "Hostile takeover.", "Looked hostile."] },
  { id: "1de34a5c-a821-4e86-968a-4869b56dc5e4", examples: ["Disconcerting news.", "Disconcerting silence.", "Find it disconcerting.", "Disconcerting habit."] },
  { id: "9fc2212e-68c3-4cd7-93cc-4acb5945d575", examples: ["Old manor.", "Manor grounds.", "Lord of the manor.", "Visit the manor."] },
  { id: "8a568b27-7c0b-48d3-904a-717588df7da4", examples: ["Smart, not to mention rich.", "Tired, not to mention hungry.", "Cold, not to mention wet.", "Difficult, not to mention expensive."] },
  { id: "8a134a00-6631-41c9-ba25-7b058103741d", examples: ["Put off going.", "Put off by rude staff.", "Put off until later.", "Never put off."] },
  { id: "078e2ca4-2302-4e36-ae1a-40729a98c6eb", examples: ["Comprise the committee.", "Comprise the majority.", "Team comprises.", "Exams comprise."] },
  { id: "b4078c40-f801-4a8e-b924-a0eac08c2d83", examples: ["Skeptical look.", "Remain skeptical.", "Skeptical view.", "Highly skeptical."] },
  { id: "e3dff978-8346-4049-8d22-d4d71138c417", examples: ["It's a far cry from.", "Far cry from reality.", "Far cry from the original.", "Results a far cry from."] },
  { id: "df498917-7971-4f20-8929-c3935b07b303", examples: ["Subdued voice.", "Kept it subdued.", "Subdued celebration.", "Felt subdued."] },
  { id: "43ee0dfb-21a9-4a12-943b-4a56955aaa4d", examples: ["Serious implications.", "Global implications.", "Consider implications.", "Implications of the decision."] },
  { id: "6ed47d06-f654-4d3f-a57d-c82cb0d7c343", examples: ["Precarious ledge.", "In a precarious state.", "Precarious health.", "Situation is precarious."] },
  { id: "d7b6b11e-c5a6-4f53-8a3d-c64239430c6b", examples: ["Steering wheel.", "Steering committee.", "Steering a ship.", "Power steering."] },
  { id: "55297a7d-5e5b-4ded-8fcb-07d22f8bc0b9", examples: ["Altruistic motives.", "Altruistic act.", "Purely altruistic.", "Altruistic behavior."] },
  { id: "6679e34f-31c6-44b4-8c93-f6dde8775746", examples: ["Perpendicular angle.", "Build perpendicular.", "Line is perpendicular.", "Perpendicular position."] },
  { id: "fb231fcf-40a7-46e2-853c-caedb81bcb1c", examples: ["Cleaning smocks.", "Blue smocks.", "Put on smocks.", "Painting smocks."] },
  { id: "ca1a2826-fdc7-4609-8746-4634d6df3e17", examples: ["Spontaneous laughter.", "Spontaneous event.", "Spontaneous recovery.", "Be spontaneous."] },
  { id: "2556181d-2917-409c-94a2-36f68974f2ec", examples: ["Non-committal shrug.", "Non-committal reply.", "Stay non-committal.", "Sounded non-committal."] },
  { id: "8c5735e6-5cc4-4c54-b16e-9b5670bba1ca", examples: ["Chastise the child.", "Chastise for being late.", "Publicly chastise.", "Chastise himself."] },
  { id: "7e5bebc7-0a36-4d20-94b0-07d3b9740e29", of: ["Advent of internet.", "Advent of spring.", "Before the advent.", "New advent."] },
  { id: "57ce0b50-6a12-48c0-92f2-583891e03fed", examples: ["Old rectory.", "Live in the rectory.", "Rectory garden.", "Built a rectory."] },
  { id: "0e46eaf3-a9fe-4e35-ac08-3213ad7498e0", examples: ["Sanctity of the temple.", "Violate sanctity.", "Sanctity of contract.", "Respect the sanctity."] },
  { id: "485e0d75-5170-4f1e-9cb9-3e2aee986825", examples: ["Predatory tactics.", "Predatory lending.", "Predatory fish.", "Predatory nature."] },
  { id: "b642354e-7d6e-48c1-bd19-ba28039bc0b9", examples: ["Drastic reduction.", "Drastic circumstances.", "Take drastic steps.", "Drastic haircut."] },
  { id: "20d211fc-e977-42f6-8f83-8b99ab442122", examples: ["Settle down now.", "Time to settle down.", "Settle down with a family.", "Storm settled down."] },
  { id: "ce7d0352-b959-40a6-8985-32591b6760b0", examples: ["Reluctant acceptance.", "Reluctant witness.", "Reluctant to change.", "Reluctant smile."] },
  { id: "80ef02df-d640-424e-baa6-3f3a8af20933", examples: ["Far be it from me to judge.", "Far be it from me to complain.", "Far be it from me.", "Far be it from me to interfere."] },
  { id: "fe4eee66-e3e7-4929-a1cf-105422539a2a", examples: ["Loss averse strategy.", "Humans are loss averse.", "Loss averse behavior.", "Becoming loss averse."] },
  { id: "123f1860-d333-437e-9077-07fd9da70822", examples: ["Yearn for freedom.", "Yearn for home.", "Yearn to see.", "Yearn for peace."] },
  { id: "7e5ba048-3b54-498d-853c-0c86d434352b", examples: ["Complex problem.", "Complex system.", "Sports complex.", "Inferiority complex."] },
  { id: "f17d6faf-63fa-4148-9dc7-dee16e9bce3a", examples: ["Preach the gospel.", "Don't preach to me.", "Preach peace.", "He loves to preach."] },
  { id: "27656544-e9a2-41c2-89ee-50347bd933b9", examples: ["Bounce back ability.", "He will bounce back.", "Market bounce back.", "Bounce back."] },
  { id: "e600b45d-6f1c-4997-8106-6921714adad1", examples: ["Olfactory bulb function.", "Damage to olfactory bulb.", "Olfactory bulb processes smells.", "Olfactory bulb location."] },
  { id: "e7229f1b-9a8c-4d97-857b-da02a33c9920", examples: ["Stumbled in the dark.", "Stumbled on a rock.", "Stumbled over words.", "Stumbled home."] },
  { id: "2494aae6-2390-4d4d-bf58-ce0efc28ca7e", examples: ["Excuse my naivete.", "Revealed naivete.", "Charming naivete.", "Danger of naivete."] },
  { id: "51484d75-23d6-4c8c-bbaa-c66c8a299ca6", examples: ["Juxtaposition in art.", "Stark juxtaposition.", "Strange juxtaposition.", "Effective juxtaposition."] },
  { id: "b08ae524-a364-40ae-bd88-9cb06ba5f293", examples: ["Competent staff.", "Competent driver.", "Is he competent?", "Feel competent."] },
  { id: "3c2a7f6f-6ada-4653-b7c6-f491a40a79fb", examples: ["Foolhardy mission.", "Foolhardy youth.", "Foolhardy risk.", "Proved foolhardy."] },
  { id: "717b1921-2b61-4548-b59a-eea0c844beaa", examples: ["Cashew fruit.", "Salted cashew.", "Cashew milk.", "Cashew allergy."] },
  { id: "2ac52e37-1eb4-4eaa-ac09-eb4fe1e38767", examples: ["Nibble on cheese.", "Just a nibble.", "Nibble the ear.", "Rat nibble."] },
  { id: "2729eec1-d39f-4a2f-bf51-8510ded30b45", examples: ["Became apparent later.", "Apparent success.", "Apparent contradiction.", "Is it apparent?"] },
  { id: "3cd69be0-acfb-4253-aff6-fbc51a66a860", examples: ["Incur penalty.", "Incur the cost.", "Incur displeasure.", "Incur risk."] },
  { id: "5aa8a8a6-db74-4bb3-83a4-b83366559c32", examples: ["Political patronage.", "Under the patronage.", "Loss of patronage.", "Seek patronage."] },
  { id: "35e75462-d111-4371-b653-070565ff6467", examples: ["Sauntering down the street.", "Sauntering along.", "Stopped sauntering.", "Walked sauntering."] },
  { id: "7e0247e3-c73a-4cf7-bb01-434935a9e6ec", examples: ["Pessimistic view.", "Don't be pessimistic.", "Pessimistic forecast.", "Sound pessimistic."] },
  { id: "5fdaa4d2-9170-4a7b-9ab2-05deccf67d9a", examples: ["Figure out the answer.", "Figure out a way.", "Can't figure out.", "Help figure out."] },
  { id: "31f36bf6-e6b6-4d0d-bc5a-dd3369c9783c", examples: ["Wistful eyes.", "Wistful sigh.", "Feeling wistful.", "Wistful tone."] },
  { id: "1a07889b-cd96-4a40-a9f4-a76e0598d43a", examples: ["Mundane tasks.", "Mundane life.", "Mundane details.", "Mundane existence."] },
  { id: "285ad64f-2ffe-40bb-bb0d-8ad5e56a2c89", examples: ["Essence of the argument.", "Essence of beauty.", "Real essence.", "Vanilla essence."] },
  { id: "7670eabb-0436-4d26-a376-27bc5c196ccb", examples: ["Nondescript building.", "Nondescript man.", "Looked nondescript.", "Total nondescript."] },
  { id: "aa725226-edac-4121-a093-daf667bf2f07", examples: ["Scuttle the ship.", "Scuttle sideways.", "Crab scuttle.", "Scuttle plans."] },
  { id: "0bcefbeb-839d-4174-8399-6df917b18e02", examples: ["Derailing investigation.", "Prevent derailing.", "Risk of derailing.", "Derailing from the topic."] },
  { id: "bd5f028f-b150-4df0-9152-a1835bf09127", examples: ["Take after my father.", "Take after her mother.", "Who do you take after?", "Doesn't take after them."] },
  { id: "d0c72665-5ca0-49ed-86a3-d6c190adc885", examples: ["Don't mutter.", "Mutter complaint.", "Mutter under breath.", "Hear him mutter."] },
  { id: "23c8a2e0-2157-4b46-851c-da4d0516d9ac", examples: ["Act of serendipity.", "Pure serendipity.", "Serendipity found it.", "By serendipity."] },
  { id: "a077fd6a-2b22-4ff1-995f-cb57954f2a43", examples: ["Hubris of the king.", "Downfall caused by hubris.", "Full of hubris.", "Hubris led to ruin."] },
  { id: "ca4182b5-40b8-411a-ba65-0a950c90675a", examples: ["Forlorn hope.", "Looked forlorn.", "Forlorn figure.", "Feel forlorn."] },
  { id: "f4d2dd04-7b9b-4d7c-9c75-5224355740c1", examples: ["Caused a ruckus.", "What's the ruckus?", "Stop that ruckus.", "Big ruckus."] },
  { id: "a5145e8b-d0b7-4e1e-bc56-00ae11d24248", examples: ["Muttered something.", "He muttered.", "Muttered angrily.", "She muttered."] },
  { id: "f18ab9c4-31fe-4032-8c65-c3b17b7d1805", examples: ["Armed rebellion.", "Crush the rebellion.", "Join the rebellion.", "Rebellion spread."] },
  { id: "98320fc7-f304-46d3-9908-b05ec9266b44", examples: ["Gangly youth.", "Gangly legs.", "Gangly walk.", "Looked gangly."] },
  { id: "095ee942-cf24-4c49-8e03-6aba2485220c", examples: ["Complete demolition.", "Demolition of the house.", "Demolition crew.", "Demolition work."] },
  { id: "53840448-fbb1-4cfa-9b3c-ff58e45d2bec", examples: ["Despondent over loss.", "Grow despondent.", "Seem despondent.", "Despondent state."] },
  { id: "1dd3048b-19e8-4112-89ed-7ee38cba7593", examples: ["Renegade cop.", "Renegade faction.", "Go renegade.", "Renegade soldier."] },
  { id: "d685012b-fe99-4cee-8e8f-d9da4c60ad45", examples: ["Driven by ambition.", "Driven person.", "Driven snow.", "Driven to success."] },
  { id: "49018d38-cff3-42c6-a45a-8d0f56c062b1", examples: ["Astringency of the wine.", "Reduce astringency.", "Taste astringency.", "Lemon astringency."] },
  { id: "e1faf7a6-5540-4fff-9f8c-51ffdfa2460f", examples: ["Condemns violence.", "Condemns the action.", "Judge condemns.", "Public condemns."] },
  { id: "7ef1c2c0-838d-410d-a5be-8dda47533fb5", examples: ["Swindle money.", "Big swindle.", "Swindle the elderly.", "Victim of a swindle."] },
  { id: "f955dffa-3a9a-4cb5-86cf-f0cfb75e4e5a", examples: ["Member is subservient.", "Subservient role.", "Become subservient.", "Not subservient."] },
  { id: "b83a8aef-6230-4975-a223-7e1444c5aa6b", examples: ["Oppressive heat.", "Oppressive regime.", "Oppressive silence.", "Feel oppressive."] },
  { id: "a0224e1f-041b-4561-b897-aac467c1037e", examples: ["Soak in water.", "Soak up sun.", "Let it soak.", "Soak the clothes."] },
  { id: "8e87f3e1-4dc0-499b-bb75-7fd6ad357256", examples: ["Feel apprehension.", "Look of apprehension.", "With apprehension.", "Apprehension grew."] },
  { id: "c6a54b6b-ca12-4e8c-bc82-473242b6d3de", examples: ["Animal enclosure.", "Enclosure walls.", "Build an enclosure.", "Safe enclosure."] },
  { id: "f4d034ef-c06d-4843-8ce8-1e2dc97d1113", examples: ["Main protagonist.", "Play the protagonist.", "Unlikely protagonist.", "Protagonist wins."] },
  { id: "64b71898-41e9-4be9-8aa7-cd5b29fe56a7", examples: ["Hurtling through space.", "Hurtling down.", "Car hurtling.", "Hurtling rock."] },
  { id: "54595e52-ef06-49b9-ae51-eb9da6b9bcc3", examples: ["Unadorned style.", "Unadorned truth.", "Unadorned room.", "Simple and unadorned."] },
  { id: "35e1bc95-68db-4804-a67c-233c55a79a08", examples: ["Replied indignantly.", "Looked indignantly.", "Stood up indignantly.", "Indignantly denied."] },
  { id: "fd122b5b-3987-4e3c-9947-e30d8a5a2566", examples: ["Impeccable taste.", "Impeccable manners.", "Impeccable timing.", "Impeccable record."] },
  { id: "98c509de-63c8-4c18-a883-74f62898f978", examples: ["Stab at the meat.", "Take a stab at it.", "Stab at the air.", "Make a stab at."] },
  { id: "667997b8-33e8-42bb-8aaf-ccafc822ecd4", examples: ["Emotional arousal.", "Physical arousal.", "State of arousal.", "High arousal."] },
  { id: "54f52623-2ee4-4ab1-94d2-0d6f48fa17c8", examples: ["Red cloak.", "Wear a cloak.", "Cloak and dagger.", "Under a cloak."] },
  { id: "86549f89-5031-40b6-876f-6851186a11a1", examples: ["Coffee plantation.", "Work on plantation.", "Plantation owner.", "Southern plantation."] },
  { id: "2d19dd44-184d-4315-ac36-f8db36c5f2d4", examples: ["Don't be a prude.", "Act like a prude.", "She's a prude.", "Old prude."] },
  { id: "a1990419-755f-4451-a33c-0cab0aa20f73", examples: ["He is hallucinating.", "Start hallucinating.", "Stop hallucinating.", "Hallucinating vivid things."] },
  { id: "acc96b56-1007-4400-be8d-0674fd496c5c", examples: ["Candid photo.", "Be candid.", "Candid opinion.", "Candid interview."] },
  { id: "10edc051-0764-4eac-bfb0-ad0715f7abad", examples: ["Quintessential example.", "Quintessential British.", "Quintessential hero.", "The quintessential."] },
  { id: "7e2cf614-dfd4-48ca-a9b1-083994978bdd", examples: ["Grueling race.", "Grueling schedule.", "Grueling work.", "Grueling climb."] }
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
