
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

const batch = [
  { id: "2903455b-c42e-48d1-bfce-4071c5919c3a", examples: ["Distinguished career.", "Distinguished guest.", "Looked distinguished.", "Distinguished soldier."] },
  { id: "3d3311dc-b5e9-4d82-a0c0-f0b346efc7ee", examples: ["Timid child.", "Timid knock.", "Timid voice.", "Don't be timid."] },
  { id: "bcf318aa-6ddd-4352-afc0-dba8198460f7", examples: ["Come down hard on crime.", "Teacher came down hard on him.", "Police came down hard.", "Come down hard on cheaters."] },
  { id: "9d156f05-3eaa-44db-a207-eea95cb01c3b", examples: ["Arrived in one piece.", "Car is in one piece.", "Want you back in one piece.", "Survived in one piece."] },
  { id: "b3f0114b-d83f-4062-8445-545ee762eac8", examples: ["Count on me.", "Count on his support.", "Can't count on him.", "Count on it raining."] },
  { id: "3203970f-3f0c-4a47-8116-8a347d4f2e13", examples: ["Act of mindlessness.", "Sheer mindlessness.", "Mindlessness of violence.", "Avoid mindlessness."] },
  { id: "98fe43ce-268f-4802-b7c9-a67fdaf83956", examples: ["Wrap up the meeting.", "Wrap up the gift.", "Wrap up warm.", "Let's wrap up."] },
  { id: "fb7d7018-60b4-4865-99ee-7f02b17f3475", examples: ["Volatile market.", "Volatile temper.", "Volatile situation.", "Volatile liquid."] },
  { id: "2f0ddbe8-eb24-4958-86d7-fec6fab6ea11", examples: ["Duck away from the punch.", "Duck away quickly.", "Saw him duck away.", "Duck away into the alley."] },
  { id: "30f4b623-4fea-4c52-905c-f6c809038a55", examples: ["Vicarious pleasure.", "Live vicariously.", "Vicarious thrill.", "Vicarious suffering."] },
  { id: "75f20b04-0569-4833-9247-97a027e2b5d9", examples: ["Walking cane.", "Sugar cane.", "Lean on a cane.", "Cane chair."] },
  { id: "7e41bab6-49ff-43ef-88e4-2b97b16ef800", examples: ["Muttered under breath.", "He muttered an apology.", "Muttered complaints.", "Muttered to himself."] },
  { id: "da42d956-2acc-4f8c-9360-0efa342a4b5e", examples: ["Myopic view.", "Myopic policy.", "Physically myopic.", "Myopic strategy."] },
  { id: "ac9dd4b5-91ca-4cf6-becb-0e9e5088cd97", examples: ["Intrusive questions.", "Intrusive thoughts.", "Intrusive behavior.", "Feel intrusive."] },
  { id: "67854b82-8b1d-4764-9967-db83782a3593", examples: ["Devoted father.", "Devoted fan.", "Devoted to duty.", "Devoted his life."] },
  { id: "3656de27-11fd-4107-922f-04558cc42653", examples: ["Act of defiance.", "In defiance of orders.", "Look of defiance.", "Show defiance."] },
  { id: "893329d8-8cae-4350-8139-c5c36c42e9ce", examples: ["Back to square one.", "We are back to square one.", "Project back to square one.", "Go back to square one."] },
  { id: "3f96d3eb-277e-4e79-952f-ee4a4b685c51", examples: ["Farsighted decision.", "Farsighted leader.", "Farsighted vision.", "Be farsighted."] },
  { id: "d62ee130-caa6-42d7-8a72-ca44adb36601", examples: ["Missed by a mile.", "Better by a mile.", "Won by a mile.", "Off by a mile."] },
  { id: "23a9b281-e9c2-4fab-8edc-5bdf1ee9d58a", examples: ["Plausible excuse.", "Plausible explanation.", "Sounds plausible.", "Highly plausible."] },
  { id: "ed9a1403-4f76-42a1-8040-f978ebd3d812", examples: ["Sword sheaths.", "Nerve sheaths.", "Knife sheaths.", "Put in sheaths."] },
  { id: "d7cc2680-68b1-4810-a869-f5fb1739126d", examples: ["Depleted resources.", "Depleted energy.", "Ozone layer depleted.", "Feel depleted."] },
  { id: "74c8482d-ad83-4963-8f8b-d6b4371282dc", examples: ["Don't doze off.", "Doze off in class.", "Start to doze off.", "Doze off watching TV."] },
  { id: "8e5f72dd-0d33-4888-8dc2-89943bf1f2e1", examples: ["Loud snort.", "Snort of laughter.", "Pig's snort.", "He gave a snort."] },
  { id: "687d9cd7-d522-49ec-a11f-4b4dc56ee465", examples: ["Tactile sensation.", "Tactile learner.", "Tactile feedback.", "Tactile surface."] },
  { id: "1ed043de-c0a7-48f6-b032-65846f79d4c0", examples: ["Readily available.", "Readily agree.", "Readily accessible.", "Readily admitted."] },
  { id: "72191c4f-5523-4c41-aeff-5481a91628e8", examples: ["Can I walk you home?", "Offer to walk you home.", "Let me walk you home.", "Safe to walk you home?"] },
  { id: "36c51975-72be-4c90-9272-8cf54b9d3572", examples: ["Moon is waning.", "Interest waning.", "Power waning.", "Waning influence."] },
  { id: "928bd593-2861-451f-8e08-3cfd12d3799f", examples: ["Conservative estimate.", "Conservative party.", "Conservative clothes.", "Socially conservative."] },
  { id: "ebb14727-9885-448e-99de-061cc630157e", examples: ["Try out the car.", "Try out for the team.", "Try out a new idea.", "Give it a try out."] },
  { id: "31811898-9f3d-4955-894f-1a71558765f2", examples: ["Market sluggishness.", "Mental sluggishness.", "Overcome sluggishness.", "Feel sluggishness."] },
  { id: "e29982b2-2dd9-44ca-b0bf-34bdd4ff4d3e", examples: ["Did he show up?", "Show up on time.", "Didn't show up.", "Show up late."] },
  { id: "f6c98dad-297b-4c43-bc5c-8ce7e9abbb2a", examples: ["Provoke ire.", "Full of ire.", "Draw his ire.", "Public ire."] },
  { id: "5b8ffc88-fb01-4444-891a-6bf2261f5450", examples: ["Regress to the mean.", "Scores regress to the mean.", "Tend to regress to the mean.", "Inevitably regress to the mean."] },
  { id: "f0066d95-4b96-4425-9fb4-81ebdb17956e", examples: ["Toiled all day.", "Toiled in the fields.", "Toiled for years.", "He toiled away."] },
  { id: "3c22cfd9-df6a-466c-8db9-28da70e0fade", examples: ["Raked the leaves.", "Raked in money.", "Raked the soil.", "Raked his face."] },
  { id: "3f5aad19-e63a-47ea-b5f7-dcbc1eface05", examples: ["Put off the meeting.", "Don't put off till tomorrow.", "Put off making a decision.", "Put me off my dinner."] },
  { id: "3cbbfc21-52ed-4d9b-b233-857c2d2fafa9", examples: ["Condensation on windows.", "Cloud condensation.", "Water condensation.", "Condensation forms."] },
  { id: "12a01906-7c59-4e7b-84a6-8390195c6e0e", examples: ["Eloquent speaker.", "Eloquent speech.", "Wax eloquent.", "Eloquent silence."] },
  { id: "9915a61e-a54f-4953-9d88-f80fa08660c5", examples: ["Lean on someone for support.", "Don't lean on someone too much.", "Lean on a friend.", "Need someone to lean on."] },
  { id: "28f5d33c-9411-4004-ac56-97de11a82433", examples: ["Fed up with work.", "I'm fed up with this.", "Fed up with waiting.", "Fed up with lies."] },
  { id: "737a8786-dd2d-4b53-92af-3591ab389be0", examples: ["Too late, the damage is done.", "Accept that the damage is done.", "The damage is done now.", "Can't fix it, the damage is done."] },
  { id: "9e03efd4-20b8-4120-85fe-2e049cc88140", examples: ["Vial of poison.", "Glass vial.", "Fill the vial.", "Small vial."] },
  { id: "e4265b81-0554-418c-9680-1c2b02422887", examples: ["Triumph over evil.", "Great triumph.", "Shout in triumph.", "Moment of triumph."] },
  { id: "77ad4f28-c958-49b3-9bda-ddf62d83dab0", examples: ["Welding metal.", "Welding helmet.", "Arc welding.", "Strong welding."] },
  { id: "c7849676-8399-495c-8370-c75647db1673", examples: ["Scorched earth.", "Scorched by fire.", "Sun scorched.", "Scorched grass."] },
  { id: "c0b6d44c-bf4a-4e1a-ab9b-836fe9d7fb40", examples: ["Tenement-lined streets.", "Tenement-lined city.", "Poor tenement-lined area.", "Walked through tenement-lined alleys."] },
  { id: "7c8b6c93-d2c4-433c-b1a0-e67be20153a6", examples: ["Call off the dogs.", "Call off the event.", "Decided to call off.", "He called it off."] },
  { id: "3ae8f188-7666-4d5f-9dff-624a47da2528", examples: ["Tentative steps.", "Tentative agreement.", "Tentative plan.", "Smile was tentative."] },
  { id: "0f1f8174-306a-4bcd-a216-0061a522b1da", examples: ["False modesty.", "Modesty forbids me.", "Show modesty.", "Lack of modesty."] },
  { id: "77d35138-e4ec-4f7d-a6d1-c8ca366015cf", examples: ["Garden hoe.", "Use a hoe.", "Hoe the weeds.", "Sharp hoe."] },
  { id: "2ef64328-6dd8-4a46-89f3-56c3dbaf6a64", examples: ["Steel mills.", "Cotton mills.", "Run of the mill.", "Mills closed down."] },
  { id: "c6e75468-68ce-4888-8c15-a2557433f771", examples: ["Outgoing personality.", "Outgoing president.", "Outgoing mail.", "Friendly and outgoing."] },
  { id: "93ffed31-547d-4294-831d-7b8f52c6b6c5", examples: ["I was intrigued.", "Intrigued by the idea.", "Looked intrigued.", "Sounded intrigued."] },
  { id: "880474f7-e13c-454a-a538-74cca5aa2f44", examples: ["Fast gait.", "Limping gait.", "Steady gait.", "Horse's gait."] },
  { id: "d654e379-0f59-42da-bf3e-bb86bc2b40a2", examples: ["Flower wilted.", "Courage wilted.", "Wilted in the heat.", "Lettuce wilted."] },
  { id: "7156125f-8fac-4590-99a5-7f0d1b68fcc0", examples: ["Pulled it apart completely.", "Pulled the engine apart.", "Pulled the argument apart.", "He pulled it apart."] },
  { id: "9dc45fd3-987d-4b2f-a8f9-b1817b69fe89", examples: ["Take a gamble.", "Gamble responsibly.", "Big gamble.", "Gamble on horses."] },
  { id: "484a9b16-d134-4de6-b550-f5a7c9621cc3", examples: ["It's as clear as day.", "Instruction is as clear as day.", "Meaning is as clear as day.", "Success as clear as day."] },
  { id: "1c685276-187c-46d3-91d4-2755aa9c7253", examples: ["Steady on!", "Whoa, steady on.", "Steady on with the wine.", "Told him to steady on."] },
  { id: "b66564ff-fe6a-4d96-8995-3387171e4c5c", examples: ["Pummeled by rain.", "Pummeled the opponent.", "Waves pummeled the shore.", "Got pummeled."] },
  { id: "fb970b8c-530e-47e2-aa2f-3e85e1b9d4a9", examples: ["Smell lingered.", "Lingered in the doorway.", "Lingered for hours.", "Hope lingered."] },
  { id: "e443fc65-0b4c-4d6a-b263-cb0cc9b16461", examples: ["Tempers flared.", "Nostrils flared.", "Fire flared up.", "Pants flared."] },
  { id: "d5a879ea-c2ed-42d7-8fec-ab35ffca2b03", examples: ["Chin jutted out.", "Rock jutted out.", "Jutted out into the sea.", "Shelf jutted out."] },
  { id: "ccbda56f-e2b4-4818-b0f8-dd847bc6452a", examples: ["Braise the beef.", "Slow braise.", "Braise in wine.", "Braise vegetables."] },
  { id: "749e7ec5-7aaf-4826-ba4a-192ba2d95512", examples: ["Laced with poison.", "Laced shoes.", "Laced with irony.", "Drink laced."] },
  { id: "81eaa1e5-ef5a-43b7-a771-d3503300cf97", examples: ["Scowling face.", "Start scowling.", "Scowling at me.", "Stop scowling."] },
  { id: "46eddf95-cec7-49bd-8873-d8c6db7d8af3", examples: ["Fortify the castle.", "Fortify with vitamins.", "Fortify yourself.", "Walls to fortify."] },
  { id: "9bbb9f40-7a23-401c-979d-8156953c9aa0", examples: ["Sit on the patio.", "Patio furniture.", "Outdoor patio.", "Brick patio."] },
  { id: "1c887c02-70d6-4c41-b215-fc1f615d2b2f", examples: ["Bring up a child.", "Bring up the issue.", "Don't bring up the past.", "Bring up dinner."] },
  { id: "75f790ea-6acd-4d91-91d4-792de7978f26", examples: ["Turns out he was right.", "Turns out it's raining.", "It turns out well.", "As it turns out."] },
  { id: "8ad15974-14f8-453e-8a7f-4bb819dd6ee1", examples: ["Engine sputtered.", "Sputtered nonsense.", "Candle sputtered.", "He sputtered angrily."] },
  { id: "2fc635cd-aef7-44d1-903f-b7d8a8f432db", examples: ["Walk on cobblestones.", "Old cobblestones.", "Cobblestones street.", "Uneven cobblestones."] },
  { id: "15252b7e-58f3-4035-a7d4-fd619d2c91f0", examples: ["Stumpy legs.", "Stumpy tail.", "Short and stumpy.", "Stumpy fingers."] },
  { id: "d25a2ad3-03e0-4f0e-84ce-7b2839cf629c", examples: ["I do not give a damn.", "Frankly, I don't give a damn.", "He doesn't give a damn.", "Don't give a damn about it."] },
  { id: "8f4994db-e7bb-4e0a-9ba2-078d0da2caf8", examples: ["Struggle to make ends meet.", "Hard to make ends meet.", "Make ends meet somehow.", "Salary helps make ends meet."] },
  { id: "ede6a589-166a-4834-9fce-8559300a6702", examples: ["Enjoy solitude.", "Live in solitude.", "Moment of solitude.", "Solitude of the mountains."] },
  { id: "df75a92b-ab03-4e3e-8c92-90be1be4b8f9", examples: ["Go astray.", "Lead astray.", "Bullet went astray.", "Plans went astray."] },
  { id: "e22df8cd-5fe1-4187-9434-3cb4eaaf897e", examples: ["Silk handkerchief.", "Blow nose in handkerchief.", "Wave handkerchief.", "Pocket handkerchief."] },
  { id: "556d794f-f16e-4c38-8fe6-d6a770b87bf4", examples: ["Rampant inflation.", "Rampant speculation.", "Rampant growth.", "Run rampant."] },
  { id: "dab5217c-0ddb-4138-b7b9-87be1956b72c", examples: ["You are on thin ice.", "Skating on thin ice.", "Walking on thin ice.", "Organization on thin ice."] },
  { id: "08757d81-7b6c-4f6f-954c-0b818eba581a", examples: ["Julienne carrots.", "Cut into julienne.", "Julienne strips.", "Vegetable julienne."] },
  { id: "d230b604-4215-43a7-829f-bce929a7c412", examples: ["Scrawny cat.", "Scrawny boy.", "Look scrawny.", "Scrawny neck."] },
  { id: "d08fc9ab-6251-4ef7-a8f6-81b8307ab457", examples: ["Scattered showers.", "Scattered papers.", "Scattered thoughts.", "Widely scattered."] },
  { id: "9da87876-9624-40ad-af5e-840f766b73ec", examples: ["Devour the food.", "Devour a book.", "Flames devour.", "Lion devours prey."] },
  { id: "947dc114-ab33-4365-aa9f-73129cdde415", examples: ["Stiff neck.", "Stiff drink.", "Bored stiff.", "Stiff competition."] },
  { id: "e8e98537-9ea7-4001-86b6-1466a5eb5893", examples: ["Startle the horse.", "Don't startle me.", "Easy to startle.", "Sudden noise will startle."] },
  { id: "930d2488-d88b-43ce-848e-44455134e326", examples: ["Intricate carving.", "Intricate network.", "Intricate system.", "Intricate machinery."] },
  { id: "5e1ed4cb-78da-4908-b414-4a11baa99a6c", examples: ["Cruel tyrant.", "Rule like a tyrant.", "Overthrow the tyrant.", "Petty tyrant."] },
  { id: "866b09cc-c38c-4681-a7d8-bee80a9f24b7", examples: ["Startling discovery.", "Startling news.", "Look startling.", "Startling difference."] },
  { id: "2eb04285-80d1-48a5-9b43-8d74ff901e2d", examples: ["Crested the hill.", "Crested wave.", "Crested bird.", "Flood crested."] },
  { id: "e3faa7c9-348b-47d5-8f43-2c19ca69cb54", examples: ["Gracious host.", "Gracious living.", "Be gracious.", "Gracious smile."] },
  { id: "a42a10a6-e94c-4495-bce5-08cd807eaf69", examples: ["Live in a hovel.", "Dirty hovel.", "Poor hovel.", "Small hovel."] },
  { id: "cd468551-2736-4d9d-8244-cf6c0066e3e4", examples: ["Oblivious to danger.", "Totally oblivious.", "Seem oblivious.", "Oblivious to the fact."] },
  { id: "920365c1-cc92-4b14-9ba2-5467e2c1558d", examples: ["Prerequisite course.", "No prerequisite.", "meet prerequisite.", "Necessary prerequisite."] },
  { id: "aa187213-3434-4965-8e52-bbeda2289abd", examples: ["Religious sect.", "Join a sect.", "Radical sect.", "Sect member."] },
  { id: "eb58f796-af2d-481b-b224-d6343e3c00e9", examples: ["Eyes brimmed with tears.", "Brimmed with confidence.", "Cup brimmed over.", "Brimmed hat."] },
  { id: "a44a5943-7269-48d8-9112-2d54075d27e5", examples: ["Crept up stairs.", "Crept away.", "Fear crept in.", "Cat crept."] },
  { id: "30068416-43bc-4f3d-a602-5348981054c0", examples: ["Gruff voice.", "Gruff exterior.", "Sounded gruff.", "Gruff reply."] },
  { id: "f6ae7094-59ef-4637-a475-693fe8a3a10d", examples: ["Remain composed.", "Look composed.", "Composed music.", "Composed of atoms."] }
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
