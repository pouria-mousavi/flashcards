
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

const batch = [
  { id: "732c56f0-df1d-4dd7-94d8-0e275576e83a", examples: ["Take over the company.", "Take over driving.", "Let me take over.", "Rebels take over."] },
  { id: "1cc5980b-0ac2-42b9-8e4d-4225ada87093", examples: ["Software piracy.", "Victim of piracy.", "Combat piracy.", "Piracy on the high seas."] },
  { id: "4b6d3ceb-e292-445f-855b-fa951e7ae087", examples: ["Job prospect.", "Prospect of war.", "Exciting prospect.", "No prospect of success."] },
  { id: "6f0dec1d-a0f0-4ca5-929d-2a9c222c763c", examples: ["He nodded.", "Nodded in agreement.", "She nodded safely.", "Just nodded."] },
  { id: "bc478ca9-506d-4741-aed7-9abcdd914b26", examples: ["It is expensive, mind you.", "Mind you, I tried.", "Mind you, it's not easy.", "He is nice, mind you."] },
  { id: "f1c9447a-584a-4788-be9b-7094d184204b", examples: ["Keen interest.", "Keen eye.", "Keen to help.", "Not very keen."] },
  { id: "2d17be45-5540-40f0-8f84-05a99651f947", examples: ["Ushered into the room.", "Ushered to a seat.", "Ushered him out.", "Waiters ushered guests."] },
  { id: "2b6890d1-a6ce-4e4d-899e-da37773da2a9", examples: ["King was beheaded.", "Beheaded the traitor.", "Publicly beheaded.", "Sentence to be beheaded."] },
  { id: "bc27f1e3-4485-4ce9-8da1-951bc5cc92b4", examples: ["Restrained anger.", "Restrained crowd.", "Physically restrained.", "Remain restrained."] },
  { id: "ee7a3d5c-da55-46b0-b2c4-a4a45eac9dd2", examples: ["Cater for a wedding.", "Cater to needs.", "Cater for all tastes.", "Who will cater?"] },
  { id: "21b53fad-bc19-458b-b683-f9560fd0b5c7", examples: ["Strong odour.", "Unpleasant odour.", "Body odour.", "Odour of gas."] },
  { id: "1d36d273-2e90-4cfa-aa0d-a0b7afe01f15", examples: ["Swore solemnly.", "Declared solemnly.", "Walked solemnly.", "Looked solemnly."] },
  { id: "6e09e69d-bbf3-4013-b549-61bc85d45337", examples: ["Water evaporates.", "Hope evaporates.", "Money evaporates.", "Heat evaporates."] },
  { id: "27439e78-fbce-4ba7-b93d-bbb853dd64b2", examples: ["Joint venture.", "Business venture.", "Venture capital.", "Risky venture."] },
  { id: "c796ac55-f0eb-45fe-8f07-9ecb038eb1b1", examples: ["Slumped in chair.", "Shoulders slumped.", "Slumped to the floor.", "Economy slumped."] },
  { id: "eb58f796-af2d-481b-b224-d6343e3c00e9", examples: ["Tears brimmed.", "Brimmed with joy.", "Glass brimmed over.", "Brimmed hat."] },
  { id: "69d47b5d-8444-4756-94cd-4db42eba89a8", examples: ["Outer garment.", "Wore a garment.", "Fold the garment.", "Garment industry."] },
  { id: "f81f1328-6dd1-462a-ae64-7cf29b1fbbbb", examples: ["Frugal meal.", "Frugal lifestyle.", "Be frugal.", "Frugal with money."] },
  { id: "55c259a3-a897-4d6a-b355-585e2890ba23", examples: ["Political malcontent.", "Group of malcontents.", "Malcontent worker.", "Feeling malcontent."] },
  { id: "e55bdec0-99c9-4c60-99c4-49beb9291a95", examples: ["Huddled together.", "Huddled in the corner.", "Huddled mass.", "Sheep huddled."] },
  { id: "35e433e4-7847-4ab7-a714-d56e0325c6dc", examples: ["Endowed with charm.", "Endowed funds.", "Well endowed.", "Nature endowed her."] },
  { id: "4bc7d92b-a9c2-4204-bf42-65d03690a5fc", examples: ["Stocky build.", "Short and stocky.", "Stocky legs.", "Stocky fellow."] },
  { id: "88cc45c2-316a-4cf0-b825-0b8d7611a474", examples: ["Strangle the victim.", "Strangle hold.", "Strangle the economy.", "Tried to strangle."] },
  { id: "2dbb143d-f4a1-4f45-aac0-827d0b12dcd8", examples: ["Look after the baby.", "Look after yourself.", "Look after the house.", "Who will look after?"] },
  { id: "7eef7e2c-e7a2-4c4c-a5f3-ea83b99676cf", examples: ["She frowned.", "Frowned at the mess.", "Teacher frowned.", "Frowned with worry."] },
  { id: "af281fe1-7609-4168-897f-429aad1ec9fd", examples: ["Scrawny chicken.", "Scrawny arm.", "Looked scrawny.", "Too scrawny."] },
  { id: "3093e46e-e423-44af-bca6-63f1429e3dab", examples: ["Member of nobility.", "Russian nobility.", "Nobility of spirit.", "Married into nobility."] },
  { id: "26d9b1cd-9463-4728-9478-d7bd248685bd", examples: ["I couldn't care less.", "He couldn't care less.", "Literally couldn't care less.", "Acted like he couldn't care less."] },
  { id: "9479a3c3-7f4c-442e-b632-f6b86c211aa3", examples: ["Latest craze.", "Dance craze.", "Fitness craze.", "Just a craze."] },
  { id: "776764e0-342b-4848-b03a-2a9a8546255a", examples: ["Carry on working.", "Carry on luggage.", "Keep calm and carry on.", "Don't carry on like that."] },
  { id: "afe84084-618a-456d-915d-ef09e1942805", examples: ["Debts pile up.", "Leaves pile up.", "Work starts to pile up.", "Let it pile up."] },
  { id: "2fc00d34-b248-475d-b836-69b7dfff2f97", examples: ["Smiled ruefully.", "Admitted ruefully.", "Looked ruefully.", "Sighed ruefully."] },
  { id: "68f61561-3d65-45c7-ac40-61d001244eeb", examples: ["Ask the bank teller.", "Work as a bank teller.", "Bank teller window.", "Robbed the bank teller."] },
  { id: "8077d39b-ad23-4dd6-a225-e928ec08d9de", examples: ["Stepped tentatively.", "Suggested tentatively.", "Tentatively planned.", "Touched it tentatively."] },
  { id: "43a45fbb-86d8-42f3-a4d4-0c5b2c9aaeeb", examples: ["Soothe the baby.", "Soothe the pain.", "Soothe nerves.", "Cream to soothe."] },
  { id: "1c453e78-e492-43c3-a2dc-6b94373c3728", examples: ["Mercantile trade.", "Mercantile spirit.", "Mercantile exchange.", "Mercantile class."] },
  { id: "7ec9060b-7884-4beb-b957-9aede4ab2fdb", examples: ["Run into problems.", "Run into an old friend.", "Run into debt.", "Run into a wall."] },
  { id: "31d9ce1c-a1bf-4d5a-8f24-b6c984253193", examples: ["Eerie silence.", "Eerie feeling.", "Eerie glow.", "Sounded eerie."] },
  { id: "775d51a5-a07d-4b03-a02d-2a12788bc041", examples: ["Don't eavesdrop.", "Eavesdrop on conversation.", "Caught eavesdropping.", "Tendency to eavesdrop."] },
  { id: "aa187213-3434-4965-8e52-bbeda2289abd", examples: ["Secret sect.", "Religious sect.", "Leave the sect.", "Sect leader."] },
  { id: "348fc718-2dab-45f7-96d5-558eea5a287a", examples: ["Sagacious advice.", "Sagacious leader.", "Look sagacious.", "Sagacious old man."] },
  { id: "c64f69ad-b315-477f-9970-f719e3646028", examples: ["Caught the burglar.", "Burglar alarm.", "Burglar broke in.", "Masked burglar."] },
  { id: "a7983650-483a-419e-b322-9a47802cda2a", examples: ["Common courtesy.", "Do me the courtesy.", "Courtesy of the hotel.", "Show courtesy."] },
  { id: "9b480281-d41b-49f4-b89b-0fb4a3680ab0", examples: ["Safe harbor.", "Harbor lights.", "Enter the harbor.", "Harbor master."] },
  { id: "c6c09b6e-b065-4549-b525-276bf1676dec", examples: ["Skimpy dress.", "Skimpy meal.", "Skimpy details.", "Too skimpy."] },
  { id: "920365c1-cc92-4b14-9ba2-5467e2c1558d", examples: ["Prerequisite for the job.", "Is language a prerequisite?", "Meet the prerequisite.", "No prerequisite needed."] },
  { id: "737a6e93-85ec-4c39-9c89-4e821f89f3d6", examples: ["Moment of levity.", "Treat with levity.", "Add some levity.", "Unwelcome levity."] },
  { id: "63e30267-b18e-448d-a8df-7a37eb54567b", examples: ["Black sheep of the family.", "Feel like a black sheep.", "He is the black sheep.", "Every family has a black sheep."] },
  { id: "646e5d7d-da17-46e9-a93e-a0cf5f817a39", examples: ["Riffling through papers.", "Riffling the cards.", "Heard riffling.", "Riffling pages."] },
  { id: "7d19e3ae-26ba-49a3-a636-c3506cf44202", examples: ["Abundance of food.", "Life in abundance.", "Abundance of caution.", "Great abundance."] },
  { id: "1a28e7e1-0b99-4217-8fea-d2fdf1b53824", examples: ["Loud gulp.", "Took a gulp.", "Gulp of air.", "Gulp of water."] },
  { id: "423e94cd-a85e-44ac-b63b-775e8b59ab49", examples: ["Get used to it.", "Hard to get used to.", "Get used to the cold.", "Eventually get used to."] },
  { id: "c0eee5dc-696e-4ccf-bb36-c9e650a73a05", examples: ["Wrinkle-nosed expression.", "Wrinkle-nosed disgust.", "She looked wrinkle-nosed.", "Cute wrinkle-nosed kid."] },
  { id: "8686e509-32b3-4b6b-872b-2398c26824ed", examples: ["I bet you win.", "Place a bet.", "Safe bet.", "Lose a bet."] },
  { id: "6da25448-cda3-418c-83e8-128029554c58", examples: ["Timid animal.", "Timid steps.", "Feel timid.", "Not timid at all."] },
  { id: "b642354e-7d6e-48c1-bd19-ba28039bc0b9", examples: ["Drastic measures.", "Drastic change.", "Do something drastic.", "Drastic action."] },
  { id: "8a134a00-6631-41c9-ba25-7b058103741d", examples: ["Put off the decision.", "Put off by the smell.", "Put off the meeting.", "Don't be put off."] },
  { id: "f86e4bb7-4ba8-438e-99b5-efa6c0e15327", examples: ["Arrogant man.", "Arrogant attitude.", "Don't be arrogant.", "Sounded arrogant."] },
  { id: "a077fd6a-2b22-4ff1-995f-cb57954f2a43", examples: ["Sheer hubris.", "Punished for hubris.", "Political hubris.", "Act of hubris."] },
  { id: "b959384b-fb73-41d0-a352-322319f4d71a", examples: ["Heralds of spring.", "Heralds the arrival.", "Two heralds.", "Heralds of doom."] },
  { id: "9fc2212e-68c3-4cd7-93cc-4acb5945d575", examples: ["Lord of the manor.", "Country manor.", "Manor house.", "Buy a manor."] },
  { id: "9e12b245-7352-4fba-adb5-2402c9989d78", examples: ["Gregarious person.", "Gregarious nature.", "Gregarious crowd.", "Feeling gregarious."] },
  { id: "b4078c40-f801-4a8e-b924-a0eac08c2d83", examples: ["Skeptical about it.", "Look skeptical.", "Highly skeptical.", "Skeptical audience."] },
  { id: "e3dff978-8346-4049-8d22-d4d71138c417", examples: ["A far cry from home.", "Far cry from the truth.", "It's a far cry from perfect.", "Far cry from what I expected."] },
  { id: "df498917-7971-4f20-8929-c3935b07b303", examples: ["Subdued lighting.", "Subdued mood.", "Seem subdued.", "Subdued colors."] },
  { id: "2556181d-2917-409c-94a2-36f68974f2ec", examples: ["Non-committal answer.", "Remained non-committal.", "Non-committal grunt.", "Be non-committal."] },
  { id: "275b1b4f-8f22-483e-82d0-617ebe56eedb", examples: ["Conjugate the verb.", "Learn to conjugate.", "Conjugate pairs.", "Conjugate correctly."] },
  { id: "55ab60b7-96ba-4a33-b468-dd815f036d88", examples: ["Poor peasants.", "Peasants in the field.", "Peasants revolt.", "Life of peasants."] },
  { id: "6679e34f-31c6-44b4-8c93-f6dde8775746", examples: ["Perpendicular lines.", "Perpendicular to the wall.", "Stand perpendicular.", "Perpendicular height."] },
  { id: "fb231fcf-40a7-46e2-853c-caedb81bcb1c", examples: ["Art smocks.", "Wear smocks.", "Dirty smocks.", "Artists in smocks."] },
  { id: "6a274855-94a9-4093-a962-44c167f6811e", examples: ["Velvety skin.", "Velvety texture.", "Velvety voice.", "Feel velvety."] },
  { id: "ca1a2826-fdc7-4609-8746-4634d6df3e17", examples: ["Spontaneous combustion.", "Spontaneous trip.", "Spontaneous reaction.", "Be spontaneous."] },
  { id: "56331b5f-c7ff-418e-aca3-27eab85cc610", examples: ["Infiltrate the enemy.", "Infiltrate the group.", "Spy infiltrate.", "Try to infiltrate."] },
  { id: "938957c0-fa62-4187-9803-901fc4a0f235", examples: ["High viscosity.", "Low viscosity.", "Viscosity of oil.", "Measure viscosity."] },
  { id: "0e46eaf3-a9fe-4e35-ac08-3213ad7498e0", examples: ["Sanctity of life.", "Sanctity of marriage.", "Respect sanctity.", "Sanctity of the home."] },
  { id: "485e0d75-5170-4f1e-9cb9-3e2aee986825", examples: ["Predatory pricing.", "Predatory animal.", "Predatory behavior.", "Predatory bird."] },
  { id: "0bcefbeb-839d-4174-8399-6df917b18e02", examples: ["Derailing the train.", "Derailing plans.", "Keep from derailing.", "Conversation derailing."] },
  { id: "42a574d8-b6c1-43df-bec0-c3127144ccfe", examples: ["Distinct smell.", "Distinct possibility.", "Distinct voice.", "Become distinct."] },
  { id: "edc2fe3f-d4b4-4072-87fa-4c07dafc56f1", examples: ["Balance the ledger.", "Ledger book.", "Entry in the ledger.", "Keep a ledger."] },
  { id: "ce7d0352-b959-40a6-8985-32591b6760b0", examples: ["Reluctant hero.", "Reluctant to go.", "Reluctant agreement.", "Seem reluctant."] },
  { id: "e901c794-12a6-4bf6-bf67-7a6c1401aa51", examples: ["Ominous sign.", "Ominous silence.", "Ominous cloud.", "Sound ominous."] },
  { id: "61c9a057-47b1-4492-8998-957888ac4adb", examples: ["Crumpling paper.", "Face crumpling.", "Crumpling to the floor.", "Hear crumpling."] },
  { id: "095ee942-cf24-4c49-8e03-6aba2485220c", examples: ["Demolition site.", "Scheduled for demolition.", "Demolition derby.", "Complete demolition."] },
  { id: "6ed47d06-f654-4d3f-a57d-c82cb0d7c343", examples: ["Precarious position.", "Precarious balance.", "Precarious living.", "Look precarious."] },
  { id: "2494aae6-2390-4d4d-bf58-ce0efc28ca7e", examples: ["Political naivete.", "Youthful naivete.", "Sheer naivete.", "Show naivete."] },
  { id: "27656544-e9a2-41c2-89ee-50347bd933b9", examples: ["Bounce back quickly.", "Economy will bounce back.", "Bounce back from defeat.", "Ability to bounce back."] },
  { id: "05b0e007-f344-4f1c-a7ac-b8a252ed2598", examples: ["Fledgling bird.", "Fledgling company.", "Fledgling democracy.", "Fledgling career."] },
  { id: "285ad64f-2ffe-40bb-bb0d-8ad5e56a2c89", examples: ["Essence of life.", "In essence.", "Capture the essence.", "Time is of the essence."] },
  { id: "53840448-fbb1-4cfa-9b3c-ff58e45d2bec", examples: ["Feel despondent.", "Despondent mood.", "Look despondent.", "Despondent fans."] },
  { id: "97f5b0ce-cf20-4438-a98a-fb71d38c1bd3", examples: ["Take it easy.", "Just take it easy.", "I'll take it easy.", "Take it easy on him."] },
  { id: "f206f97e-adaf-4d27-9c48-6a3ae2188b84", examples: ["Stuffed animal.", "Stuffed shirt.", "Feel stuffed.", "Stuffed peppers."] },
  { id: "9285c32e-e35e-444b-8f1c-2a3a440168c3", examples: ["Perpetual motion.", "Perpetual fear.", "Perpetual student.", "Perpetual calendar."] },
  { id: "51484d75-23d6-4c8c-bbaa-c66c8a299ca6", examples: ["Strange juxtaposition.", "Juxtaposition of colors.", "Juxtaposition of ideas.", "Create a juxtaposition."] },
  { id: "b08ae524-a364-40ae-bd88-9cb06ba5f293", examples: ["Competent worker.", "Competent authority.", "Feel competent.", "Highly competent."] },
  { id: "3c2a7f6f-6ada-4653-b7c6-f491a40a79fb", examples: ["Foolhardy attempt.", "Foolhardy decision.", "Don't be foolhardy.", "Foolhardy courage."] },
  { id: "5c2c5547-e4e4-4fcc-ae45-9dc032caf064", examples: ["Handful of nuts.", "He is a handful.", "Only a handful.", "Handful of people."] },
  { id: "717b1921-2b61-4548-b59a-eea0c844beaa", examples: ["Cashew nut.", "Eat a cashew.", "Cashew butter.", "Roasted cashew."] },
  { id: "eef87d06-0d8a-48b6-ae3f-1a0ef70d09b2", examples: ["Land in hot water.", "He is in hot water.", "Get into hot water.", "In hot water with boss."] },
  { id: "2729eec1-d39f-4a2f-bf51-8510ded30b45", examples: ["Apparent reason.", "Became apparent.", "Apparent heir.", "For no apparent reason."] },
  { id: "3cd69be0-acfb-4253-aff6-fbc51a66a860", examples: ["Incur debt.", "Incur wrath.", "Incur expenses.", "Incur a loss."] }
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
