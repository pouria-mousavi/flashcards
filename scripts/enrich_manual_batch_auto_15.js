
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

const batch = [
  { id: "d74cdc90-26bf-43f9-8ef7-6c3f1481617d", examples: ["Gratified by different response.", "Felt gratified.", "Gratified to hear.", "Deeply gratified."] },
  { id: "013cdc22-c9bf-44ed-8a42-43a5f573b328", examples: ["Looked with apprehension.", "Feeling of apprehension.", "Growing apprehension.", "Apprehension about the future."] },
  { id: "ec6d91bd-1313-44af-be64-f682e4256b0c", examples: ["Keep your chin up.", "Told him to keep his chin up.", "Just keep your chin up.", "Hard to keep your chin up."] },
  { id: "5e6c0333-ea03-4d5e-a9bf-0245b4c8a056", examples: ["It's a dead ringer for him.", "She is a dead ringer for her mom.", "Dead ringer for the original.", "Looks like a dead ringer."] },
  { id: "26a38ef6-1323-4875-b595-0b71b143a619", examples: ["Cocky attitude.", "Don't get cocky.", "Cocky young man.", "He grinned cocky."] },
  { id: "823c0909-7a97-4a24-93c7-c2a1ba9cd1ff", examples: ["I noticed him.", "She noticed the change.", "Noticed a smell.", "Barely noticed."] },
  { id: "899238a5-4453-458c-8a7a-aea5f2e26e32", examples: ["Deplorable conditions.", "Deplorable behavior.", "In a deplorable state.", "Simply deplorable."] },
  { id: "c443720a-2d7a-4585-a0f9-353b28db880a", examples: ["Smiled tentatively.", "Asked tentatively.", "Tentatively agreed.", "Stepped tentatively."] },
  { id: "ed9703fc-2664-43d1-ad3e-8b6ef92b7114", examples: ["Voice cracked.", "Mirror cracked.", "Code cracked.", "Cracked under pressure."] },
  { id: "35daf9c0-02ed-4c97-8ab5-245b134b7fee", examples: ["Left in a huff.", "In a huff.", "Don't get in a huff.", "She's in a huff."] },
  { id: "09d18b01-1f56-4139-9d06-e4c2f2329e0b", examples: ["Turn down the music.", "Turn down the offer.", "Turn down the bed.", "Turn down the heat."] },
  { id: "0d61635e-c5b7-451a-b64a-f40fb6f73bb8", examples: ["Snuck out.", "Snuck up on me.", "Snuck inside.", "Snuck a cookie."] },
  { id: "004ffcdf-4efe-4fe0-853f-0752cb4a0d3b", examples: ["Break in the shoes.", "Break in the house.", "Don't break in.", "Break in conversation."] },
  { id: "656c33eb-8fa0-478b-a793-e0d886d6cc03", examples: ["Brace for impact.", "Leg brace.", "Brace yourself.", "Brace the wall."] },
  { id: "3fce410b-b0dd-4fcf-b61f-a99b9ac45fa7", examples: ["Don't give up.", "Give up smoking.", "Give up hope.", "Never give up."] },
  { id: "bdc5f846-ab58-4b19-90da-e7839ab9f171", examples: ["Spoke sternly.", "Looked at him sternly.", "Warned sternly.", "Sternly corrected."] },
  { id: "09f8efd2-c722-4ef9-ac0f-1c2396650fb3", examples: ["Squirmed in his seat.", "Squirmed away.", "Made me squirm.", "Worm squirmed."] },
  { id: "f429652e-1882-4deb-b055-d6375def0b44", examples: ["Feel self-conscious.", "Self-conscious about weight.", "Looked self-conscious.", "Made him self-conscious."] },
  { id: "7a8a31f3-b3f1-4504-bcae-f3891154b6b5", examples: ["Pervasive smell.", "Pervasive influence.", "Pervasive problem.", "Became pervasive."] },
  { id: "24a6dc8b-2beb-4dc2-afdb-3198388c3d33", examples: ["Product endorsement.", "Official endorsement.", "Give endorsement.", "Seek endorsement."] },
  { id: "b99cb505-bd36-4b3c-a1d8-86752604619e", examples: ["Heart pounded.", "Pounded on the door.", "Head pounded.", "Pounded the pavement."] },
  { id: "30a46673-187f-4d51-bd16-966956159120", examples: ["Shafts of light.", "Mine shafts.", "Elevator shafts.", "Shafts of wheat."] },
  { id: "242d42a7-26da-4229-9dff-23d8fad4d37d", examples: ["Stemming the flow.", "Stemming from fear.", "Stemming the bleeding.", "Problems stemming from."] },
  { id: "55d0f824-bbd5-4296-aeb8-a30f04088537", examples: ["Stout man.", "Stout stick.", "Stout defense.", "Drink stout."] },
  { id: "4d84d9da-f46b-48dd-8b8c-834adb0756df", examples: ["Delicate fabric.", "Delicate skin.", "Delicate matter.", "Delicate balance."] },
  { id: "3963d7a0-213d-4b21-b6a5-1a73d1a38720", examples: ["Ambiguous answer.", "Ambiguous ending.", "Remain ambiguous.", "Highly ambiguous."] },
  { id: "a18c5723-9779-4ed2-8b4a-1f6a9b845360", examples: ["Grate cheese.", "Grate on nerves.", "Fire grate.", "Metal grate."] },
  { id: "fa54f1d8-9e57-4e1b-abaa-56affb5bb798", examples: ["Pewter mug.", "Made of pewter.", "Pewter plate.", "Pewter jewelry."] },
  { id: "4223beef-234d-4d29-a488-01fb53909a33", examples: ["Reserved seat.", "Reserved manner.", "Feel reserved.", "Reserved parking."] },
  { id: "52ea8ac7-e195-4d0e-ae9a-dc9ef00d7374", examples: ["Said musingly.", "Looked musingly.", "Stared musingly.", "Spoke musingly."] },
  { id: "27fbfb66-937d-4921-8a12-6bd92b33fec0", examples: ["Squander money.", "Squander opportunity.", "Don't squander it.", "Squander talent."] },
  { id: "5c0d582e-9157-4e07-8824-24a79af43515", examples: ["Tedious job.", "Tedious journey.", "Tedious process.", "Became tedious."] },
  { id: "659514c7-259e-4a1c-9149-4c18419692d5", examples: ["Just humor me.", "Please humor me.", "Decided to humor me.", "She humored me."] },
  { id: "6147836f-b395-4700-9790-cd4d4101ddaf", examples: ["Go over the details.", "Go over to his house.", "Go over the limit.", "Go over it again."] },
  { id: "2614cfe8-9fb5-4c6f-a7ce-895166c2a0ee", examples: ["Keep your ears open for news.", "Keep your ears open.", "Just keep your ears open.", "Keep your ears open and mouth shut."] },
  { id: "53cb6bd0-8e1f-4d1e-bc8f-617f277f2f0d", examples: ["Stock the pantry.", "Kitchen pantry.", "Food in the pantry.", "Pantry shelf."] },
  { id: "6e02147d-5479-46cc-83e1-8972980331f2", examples: ["Spike in prices.", "Spike the drink.", "Metal spike.", "Volleyball spike."] },
  { id: "e3be44eb-6ccf-4061-a6ba-ad8f4fc1716e", examples: ["Lure them in.", "Fishing lure.", "The lure of money.", "Use bait to lure."] },
  { id: "916a12b8-c18f-4172-a019-3e746bb3ffbc", examples: ["Lumpy mattress.", "Lumpy gravy.", "Feel lumpy.", "Lumpy pillow."] },
  { id: "2473f1e6-7502-4838-ba09-754ab2c30c3f", examples: ["Look into the matter.", "Look into my eyes.", "Look into buying.", "Will look into it."] },
  { id: "7336721b-71dc-42ac-be9d-663596a7fafb", examples: ["Sacrosanct tradition.", "Nothing is sacrosanct.", "Held as sacrosanct.", "Sacrosanct rule."] },
  { id: "ba7aa671-0674-476b-9659-cb0b15ab3e39", examples: ["Common parlance.", "In legal parlance.", "Local parlance.", "Modern parlance."] },
  { id: "59fbc936-7779-448f-9ce5-91e98b05823d", examples: ["Evaluate the implication.", "By implication.", "Serious implication.", "Implication of guilt."] },
  { id: "8c3ddd21-a10b-473a-a079-86961e407012", examples: ["Sit on a stool.", "Bar stool.", "Milking stool.", "Three-legged stool."] },
  { id: "eda644ce-a0d2-43e4-9c62-f9da27c129de", examples: ["Sun shone brightly.", "Moon shone.", "Eyes shone.", "Light shone."] },
  { id: "9d692135-3765-4b91-bd5a-676df964e8d7", examples: ["Scrap the car.", "Scrap the plan.", "Piece of scrap.", "Sell for scrap."] },
  { id: "77c3473b-48a3-46c5-a46a-11a9d6e21718", examples: ["Cricket pavilion.", "Summer pavilion.", "Meet at the pavilion.", "Hospital pavilion."] },
  { id: "64c6435c-037b-4eda-a225-9e4c001bdb2c", examples: ["Flicked the switch.", "Flicked it away.", "Flicked his hair.", "Flicked through a book."] },
  { id: "8c389811-a434-4670-9f87-e60b862d7572", examples: ["Big bruise.", "Bruise easily.", "Ego bruise.", "Purple bruise."] },
  { id: "07304aff-ad4f-49b2-aac0-9697930b62bc", examples: ["It felt less like flying.", "Felt like falling.", "Sensation of flying.", "Dream of flying."] },
  { id: "b2ab6d88-f463-44a0-9483-a1ebd9dada5e", examples: ["Practical solution.", "Be practical.", "Practical joke.", "Practical skills."] },
  { id: "08a74700-4108-4829-af77-dde6f4ffb443", examples: ["Stir the soup.", "Create a stir.", "Don't stir.", "Stir fry."] },
  { id: "1541dd32-8b30-478e-9c8d-6b7f96793309", examples: ["Look forward to it.", "Look forward to the weekend.", "Something to look forward to.", "Don't look forward to."] },
  { id: "94d76895-2b5d-4e79-a00c-2beb8aaaf250", examples: ["Treated with flippancy.", "Sheer flippancy.", "Regret flippancy.", "Moment of flippancy."] },
  { id: "c9c5d8ef-c1bc-4b71-86dc-8410b22aec03", examples: ["Appeal against verdict.", "Mass appeal.", "Appeal to reason.", "Lose appeal."] },
  { id: "86f88b37-2495-414b-9467-3961ddc85fd7", examples: ["Lest we forget.", "Fear lest he fall.", "Worried lest she succeed.", "Run lest you be caught."] },
  { id: "2aec769a-1bdf-4a3f-962b-0202fe1bdfd5", examples: ["Clean the gutters.", "Lying in the gutter.", "Rain gutters.", "Gutter press."] },
  { id: "72d9654c-47ab-4d15-bbdd-efffacfacbba", examples: ["Exacerbated the problem.", "Pain exacerbated.", "Situation exacerbated.", "Exacerbated by stress."] },
  { id: "12420da9-193e-4458-a9f3-f75d4ef39d3b", examples: ["Follow through on promise.", "Good follow through.", "Must follow through.", "Failed to follow through."] },
  { id: "12116f8f-44d0-40ca-b637-0ee3761a1d28", examples: ["Punctuated by silence.", "Punctuated with laughs.", "Punctuated equilibrium.", "Well punctuated."] },
  { id: "5ccf608b-843f-4f69-b270-eaeab818f1ff", examples: ["Suppressed anger.", "Suppressed evidence.", "Suppressed laugh.", "Suppressed immune system."] },
  { id: "cca9887a-14a9-477a-9aea-236ab32b9980", examples: ["Loom large.", "Mountains loom.", "Threats loom.", "Machines loom."] },
  { id: "99222d66-8276-42a9-8628-68632be68a9e", examples: ["Pale ale.", "Drink ale.", "Pint of ale.", "Ginger ale."] },
  { id: "9d2c4387-ad74-43d2-a7ce-539fd1bead21", examples: ["Fluid movement.", "Fluid situation.", "Drink fluids.", "Brake fluid."] },
  { id: "1e6ffb79-3311-4912-9e01-edae8e0736eb", examples: ["Unstoppering the bottle.", "Unstoppering emotion.", "Slowly unstoppering.", "Unstoppering the vial."] },
  { id: "630863d9-3738-4bf1-95ee-f7b1578ca9b7", examples: ["Semiautonomous region.", "Semiautonomous car.", "Semiautonomous robot.", "Become semiautonomous."] },
  { id: "c2b06211-5112-45b8-80ca-bcb092f0b81a", examples: ["Ingenious idea.", "Ingenious device.", "Ingenious solution.", "Look ingenious."] },
  { id: "20fff2c6-1687-4343-89e1-5632f8c07f02", examples: ["Provide illumination.", "Bright illumination.", "Spiritual illumination.", "Book illumination."] },
  { id: "271908ae-1c53-43f4-b667-dbfc3667290d", examples: ["Wipe out the enemy.", "Wipe out debt.", "Surfer wipe out.", "Don't wipe out."] },
  { id: "2b05ce9d-e73d-4789-8739-25edc3c003d1", examples: ["Face the consequence.", "Of no consequence.", "Serious consequence.", "As a consequence."] },
  { id: "e94e8aea-206e-4080-9294-de63e2086ddb", examples: ["It is a con.", "Con artist.", "Pros and cons.", "He conned me."] },
  { id: "913381cc-25c8-415a-b402-f0f35e301bbf", examples: ["Contemplating life.", "Contemplating a move.", "Sat contemplating.", "Contemplating suicide."] },
  { id: "c226df1e-196b-46eb-974e-eb31bb0cbd23", examples: ["Wandering around.", "Wandering mind.", "Wandering star.", "Found wandering."] },
  { id: "b5942134-7224-437f-acb8-58130ad84ccf", examples: ["Wistful look.", "Wistful smile.", "Feel wistful.", "Wistful memory."] },
  { id: "6ab49ce0-19c2-4f4d-969a-07ca3e386f0d", examples: ["Spoke haughtily.", "Looked haughtily.", "Replied haughtily.", "Dismissed haughtily."] },
  { id: "4e854474-c23b-4788-8df9-94b9b00d191e", examples: ["Feel lethargic.", "Lethargic response.", "Lethargic economy.", "Too lethargic."] },
  { id: "7eb661e9-609f-4db5-a35a-6a767f717f93", examples: ["Embark on a journey.", "Embark on a ship.", "Embark on a career.", "Ready to embark."] },
  { id: "9b4bcd87-4af0-4f3b-8ee7-c1f4e6c058ae", examples: ["Itchy scalp.", "Dry scalp.", "Scalp massage.", "Scalp treatment."] },
  { id: "e15a6aae-3e9d-41e8-8f4f-f4bbf5f075cd", examples: ["Controversial topic.", "Controversial decision.", "Controversial figure.", "Highly controversial."] },
  { id: "fd3001d0-fa59-47bd-9ee8-c03029fea0e5", examples: ["Toppling the regime.", "Toppling over.", "Statue toppling.", "Toppling the king."] },
  { id: "db83a79d-a924-4e47-ace4-5b1662742c32", examples: ["Secluded spot.", "Secluded life.", "Secluded beach.", "Keep it secluded."] },
  { id: "3ca0a2b3-f8bb-4e38-838c-4b81fe501af0", examples: ["Playful bantering.", "Stop bantering.", "Bantering tone.", "Bantering back and forth."] },
  { id: "60750c4f-06d5-45ef-abcf-c25dec8ef92f", examples: ["Stop grumbling.", "Stomach grumbling.", "Grumbling about work.", "Constant grumbling."] },
  { id: "1f8ee303-b675-4522-b1ea-a3d5cd3d5f76", examples: ["Nonetheless true.", "Tired, nonetheless happy.", "Difficult, nonetheless done.", "He went nonetheless."] },
  { id: "56d72a29-d3f0-4c3e-a495-a59b3d666dd5", examples: ["Brass band.", "Brass instrument.", "Top brass.", "Made of brass."] },
  { id: "4b3ea6c9-c0f5-4268-80d4-82d16b3d68db", examples: ["Like two peas in a pod.", "We are like two peas in a pod.", "Look like two peas in a pod.", "Just like two peas in a pod."] },
  { id: "39e2c9b1-b66b-42cc-bd33-8928c9bb63a0", examples: ["I loathe it.", "Loathe violence.", "She loathes him.", "Come to loathe."] },
  { id: "79d5b463-0edd-4cfa-94b4-a1851bb35f5e", examples: ["Remnant of the past.", "Last remnant.", "Fabric remnant.", "Remnant population."] },
  { id: "a33759e2-aaef-4e3a-a202-7e73bb8d9903", examples: ["Darn it, I forgot.", "Oh, darn it.", "Darn it all.", "Darn it, why?"] },
  { id: "bba88cfa-e2a9-4015-9fa2-e3d8c48a8b97", examples: ["Fall flat on your face.", "Project fell flat on its face.", "Don't fall flat on your face.", "He fell flat on his face."] },
  { id: "5f241d8d-36dd-42c1-8633-b29a5571882b", examples: ["Impose rules.", "Impose tax.", "Don't mean to impose.", "Impose his will."] },
  { id: "dc3ba584-59d4-41a4-8e4b-2362b5866706", examples: ["What makes it tick?", "Find out what makes it tick.", "Understand what makes him tick.", "See what makes it tick."] },
  { id: "fda79643-10ad-4c3e-81fe-daafa40d0645", examples: ["Portly gentleman.", "Portly figure.", "Look portly.", "Became portly."] },
  { id: "9551e3f9-2cf5-4d67-87ba-b5d7199a975c", examples: ["Boost confidence.", "Boost the economy.", "Boost signal.", "Give a boost."] },
  { id: "5f61378b-5359-48f4-bf56-f84db64e9480", examples: ["Witch's cauldron.", "Bubbling cauldron.", "Cauldron of soup.", "Cauldron of unrest."] },
  { id: "ba86c95d-f666-4e38-a703-2ec61a246885", examples: ["Tainted meat.", "Tainted reputation.", "Tainted love.", "Become tainted."] },
  { id: "bd0604e9-bc3a-4fac-8695-3b1b01956e72", examples: ["Recalcitrant child.", "Recalcitrant attitude.", "Proved recalcitrant.", "Recalcitrant problem."] },
  { id: "9ccaf003-240d-4740-837d-d33fc28ae4e6", examples: ["Illegal substance.", "Lack of substance.", "Substance abuse.", "Sticky substance."] },
  { id: "cb13826d-7c02-47e9-81ed-b6acde3ffae8", examples: ["Endowed with beauty.", "Well endowed.", "Endowed university.", "Endowed chair."] },
  { id: "7be0101c-6f62-43ef-82ad-5477f1316505", examples: ["Be proactive.", "Proactive approach.", "Proactive measures.", "Take proactive steps."] }
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
