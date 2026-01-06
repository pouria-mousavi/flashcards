
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

const batch = [
  { id: "ce8654f2-8c79-4d0e-9dc2-cf630fa7be8c", examples: ["Head out soon.", "Let's head out.", "Head out for dinner.", "Time to head out."] },
  { id: "1e9152d9-1619-4120-8347-b37e6a6268aa", examples: ["Advocate for peace.", "Strong advocate.", "Advocate rights.", "He is an advocate."] },
  { id: "61a82d49-2c8e-4b98-9e45-1b5a3f5f148c", examples: ["At his behest.", "Royal behest.", "Ignore the behest.", "By the king's behest."] },
  { id: "fe846cef-92a2-4c23-8c0f-61850161a339", examples: ["Zealous supporter.", "Zealous worker.", "Overly zealous.", "Zealous effort."] },
  { id: "fa4b9a5d-7c4c-48ef-b5fa-f3c538296c9e", examples: ["Awash with cash.", "Awash in color.", "Deck awash.", "Awash with rumors."] },
  { id: "5b648181-702a-45d0-84be-e3c81970eaed", examples: ["Rampant corruption.", "Rampant disease.", "Run rampant.", "Weeds are rampant."] },
  { id: "f0561fbb-42ef-4ffe-b18b-96ec168ce355", examples: ["Serve constituents.", "Angry constituents.", "Meet constituents.", "Constituents voted."] },
  { id: "2a89b9c4-73d7-4889-aa99-97d54efeab6e", examples: ["Live up to expectations.", "Live up to the name.", "Hard to live up to.", "Live up to promise."] },
  { id: "f316feca-8a6d-4577-8c94-fb1d01d40dba", examples: ["Enticing offer.", "Look enchanting and enticing.", "Smell is enticing.", "Enticing prospect."] },
  { id: "2f02ea1c-4d2b-415b-9c89-4079c28e3fa5", examples: ["Waddling duck.", "Waddling toddler.", "Start waddling.", "Fat man waddling."] },
  { id: "e507d6f6-a9f9-470f-bb63-60d28ace9450", examples: ["Protect anonymity.", "Prefer anonymity.", "Internet anonymity.", "Condition of anonymity."] },
  { id: "8db5e7b3-ec8f-4d13-9f67-fc79d4a48c0e", examples: ["She perked up.", "Ears perked up.", "Economy perked up.", "Coffee perked me up."] },
  { id: "cae59ecf-70f9-45c5-8468-34d93d4b7e2c", examples: ["Act of banditry.", "Stop banditry.", "Highway banditry.", "Victim of banditry."] },
  { id: "cf437a44-89d3-46e3-81bb-63a3ea00b3fb", examples: ["Have a good head on your shoulders.", "He has a good head on his shoulders.", "Need a good head on your shoulders.", "She's got a good head on her shoulders."] },
  { id: "3881bce7-4e8f-420d-8671-ee2bcad48d11", examples: ["Lied brazenly.", "Stared brazenly.", "Brazenly ignored rules.", "Acted brazenly."] },
  { id: "0594b2b5-2bf9-409e-84d1-31c0ab43dcce", examples: ["Feel apprehensive.", "Apprehensive about the future.", "Looked apprehensive.", "Growing apprehensive."] },
  { id: "97bd39d8-ed99-4624-a28c-e3b3ffd4e7ff", examples: ["Energy conservation.", "Wildlife conservation.", "Conservation area.", "Conservation of momentum."] },
  { id: "4ec98abd-3f68-4c05-8279-e470927e6158", examples: ["Indolent teenager.", "Feeling indolent.", "Indolent habits.", "Grow indolent."] },
  { id: "37068f6b-a5b8-40a0-a1b3-0a50b5e2c40d", examples: ["Flood waters recede.", "Hairline recede.", "Pain receded.", "Recede into distance."] },
  { id: "9da3fd95-ec72-472c-9ae7-694c271438c4", examples: ["Political intrigue.", "Full of intrigue.", "Cause intrigue.", "Palace intrigue."] },
  { id: "939de1d9-bb1a-4920-9ede-16454806d24d", examples: ["Conferred a title.", "Conferred with colleagues.", "Conferred an honor.", "Conferred privately."] },
  { id: "fb7f3337-788a-4bc6-94e0-5b305963c64f", examples: ["Be frank.", "To be frank.", "Frank discussion.", "Frank admission."] },
  { id: "21c077f0-dab6-4f5a-a8f0-e55ae456c9e6", examples: ["Verify let someone down.", "Don't let someone down.", "Let someone down gently.", "Never let someone down."] },
  { id: "9bf3a9df-3233-4746-86ce-dff5fa147c2d", examples: ["Cut off the supply.", "Feel cut off.", "Cut off jeans.", "Phone cut off."] },
  { id: "da292260-11fc-459e-b645-a8d720b2e82b", examples: ["Highly regarded.", "Regarded as a hero.", "Well regarded.", "Regarded with suspicion."] },
  { id: "4a7833a8-d896-4d3e-899f-c69ec2c625d4", examples: ["Tax incentives.", "Offer incentives.", "Lack of incentives.", "Performance incentives."] },
  { id: "ff9c121a-94ab-4f7c-804d-f2c473d0eb23", examples: ["Voice tailed off.", "Interest tailed off.", "Traffic tailed off.", "Rain tailed off."] },
  { id: "5c2c5bee-def3-4aa3-87b4-d2767bc5d74a", examples: ["Point of salience.", "Low salience.", "Political salience.", "Gain salience."] },
  { id: "9e247c1e-1269-4ead-80f0-53a1c3cc0c1f", examples: ["Cut to the chase.", "Let's cut to the chase.", "Time to cut to the chase.", "Cut to the chase and tell me."] },
  { id: "51a9a1f5-42dd-44a4-943f-a9c21eac997e", examples: ["Crass remark.", "Crass ignorance.", "Crass behavior.", "Don't be crass."] },
  { id: "08d2911c-0553-403f-a3e6-888f2bc4dc99", examples: ["Get through the day.", "Get through the exam.", "Get through to him.", "Get through the work."] },
  { id: "4c16f943-29b9-4ea1-84d3-b624c1f67a8f", examples: ["Call off the wedding.", "Call off the strike.", "Call off the search.", "Call off the deal."] },
  { id: "39d0e725-7b36-4849-b8e3-8b22967cc65d", examples: ["Long haul.", "Haul the boat.", "Heavy haul.", "Haul coal."] },
  { id: "cd65f2fc-9877-427c-8c30-3102a32eb71d", examples: ["Stroll up the street.", "Stroll up to the bar.", "Just stroll up.", "Watch him stroll up."] },
  { id: "74fe2620-86c7-438f-aba7-8c98973cb7fe", examples: ["Flee the country.", "Flee from danger.", "Forced to flee.", "Flee the scene."] },
  { id: "185296a9-aaa3-458b-a419-1f56a75b9117", examples: ["Bag slung over shoulder.", "Slung it across the room.", "Hammock slung between trees.", "Slung casually."] },
  { id: "bf056371-080e-47ff-b9a3-b302bc499eef", examples: ["Soothing music.", "Soothing voice.", "Soothing cream.", "Find it soothing."] },
  { id: "74126b89-7d28-4587-8f45-17c357e24804", examples: ["Rise in homicides.", "Commit homicides.", "Number of homicides.", "Investigate homicides."] },
  { id: "9c8765b9-97d1-4fd5-a448-31d505b82652", examples: ["That guess is spot on.", "Your analysis is spot on.", "It's spot on.", "Timing was spot on."] },
  { id: "0aca1e91-ab2f-4bfe-aa8b-6c7cb9e7a7c4", examples: ["Restrained behavior.", "Feel restrained.", "Restrained applause.", "Physically restrained."] },
  { id: "c3875ac0-7b22-43c1-9126-9a056ade40f7", examples: ["Dreadfully sorry.", "Dreadfully boring.", "Miss you dreadfully.", "Suffered dreadfully."] },
  { id: "3397b049-fc30-4ec9-82b1-030c0147ae6f", examples: ["Pray the rosary.", "Beads of a rosary.", "Holding a rosary.", "Recite the rosary."] },
  { id: "12fef8aa-52f2-4527-b8c0-266622363c9d", examples: ["Torrential rain.", "Torrential downpour.", "Torrential flow.", "Torrential abuse."] },
  { id: "9cafaeff-d71a-4951-b650-b8c02fc05790", examples: ["Spanish Inquisition.", "Face an inquisition.", "Inquisition began.", "History of inquisition."] },
  { id: "197c5e11-75a7-49b3-8a28-bd4f2fc014c4", examples: ["Public clamor.", "Clamor for attention.", "Rising clamor.", "Drown out the clamor."] },
  { id: "4747acc1-0bc4-4a67-9f57-a90432e3c9bc", examples: ["Enticing smell.", "Enticing offer.", "Look enticing.", "Sound enticing."] },
  { id: "1aaf324c-4f3a-4811-a11b-fa38c649a6d9", examples: ["Captivating story.", "Captivating smile.", "Most captivating.", "Found it captivating."] },
  { id: "6b58d6d6-02ed-4f1a-bc20-158e2091dc3f", examples: ["Invariably late.", "Invariably true.", "Almost invariably.", "Result is invariably."] },
  { id: "5c527863-d2e2-499a-9f62-05d26ae7c29e", examples: ["Huge mansion.", "Old mansion.", "Live in a mansion.", "Haunted mansion."] },
  { id: "8242df24-6fc1-482c-85cd-b2ca74f87ae2", examples: ["Forestall the crisis.", "Forestall problems.", "Try to forestall.", "Forestall an attack."] },
  { id: "375fe84a-8440-4caa-8b0c-c6d8d8c71507", examples: ["Brace yourself for bad news.", "Brace yourself for impact.", "Now, brace yourself.", "Brace yourself."] },
  { id: "5e6d091e-858a-4301-8b48-f9f8403fae74", examples: ["Time bomb.", "Drop a bomb.", "Bomb exploded.", "The movie bombed."] },
  { id: "1dced483-c317-467f-b637-f7cd9cca0951", examples: ["Just a smidgen.", "A smidgen of salt.", "Every last smidgen.", "Not a smidgen."] },
  { id: "2136ed9b-4ff3-4e23-a4a9-86f4e813ab42", examples: ["Busy thoroughfares.", "Main thoroughfare.", "Blocked thoroughfares.", "City thoroughfares."] },
  { id: "0aac5f73-c405-4bab-941e-e4068d4d827d", examples: ["Blacksmith forges.", "Forges a relationship.", "Forges a signature.", "Forges ahead."] },
  { id: "792aa52b-7780-48c6-bbfc-9b7241cb9679", examples: ["Amenable to change.", "Amenable to reason.", "Amenable disposition.", "Not amenable."] },
  { id: "e0b2d092-57e3-4bcc-8232-cfc78215b463", examples: ["Never in my life have I thought I'd see this.", "Never in my life have I thought so.", "Something I never in my life have I thought.", "Never in my life have I thought about it."] },
  { id: "47aa2464-d205-46cf-83c6-39e66911c3ab", examples: ["High altar.", "Kneel at the altar.", "Left at the altar.", "Altar cloth."] },
  { id: "fb489422-448e-49f6-a3fa-46d27d12152c", examples: ["Emanating form the source.", "Light emanating.", "Smell emanating.", "Heat emanating."] },
  { id: "dac84b70-c83d-42f3-8d9a-67fe0bad81ea", examples: ["Indispensable tool.", "Become indispensable.", "Indispensable member.", "Absolutely indispensable."] },
  { id: "1196df7b-849a-4d15-9df8-da17e906494b", examples: ["Mince meat.", "Don't mince words.", "Mince pies.", "Mince garlic."] },
  { id: "1baa93fd-0d25-4aa2-9bb3-cc4ccd5ea9d9", examples: ["Public apathy.", "Voter apathy.", "Overcome apathy.", "General apathy."] },
  { id: "26144646-f330-483b-876d-60e54db00da6", examples: ["Munched on an apple.", "Munched happily.", "Munched snacks.", "He munched."] },
  { id: "5286fa6b-73a2-46ee-9e32-2627fbdf0231", examples: ["Stride length.", "Take it in stride.", "Long stride.", "Walk with a stride."] },
  { id: "ae0c5c03-be6a-49cf-a25c-2c1b5c4341a3", examples: ["We are on the right track.", "Get back on the right track.", "On the right track now.", "Keep on the right track."] },
  { id: "83f725f6-5391-4838-ae13-2849ee34901f", examples: ["Rummaging through drawers.", "Rummaging for keys.", "Stop rummaging.", "Caught rummaging."] },
  { id: "c2fff742-7cfd-4d24-845d-bdd1079017ad", examples: ["Rare breed.", "Dog breed.", "Breed of cattle.", "New breed."] },
  { id: "96248552-2e4f-4279-b11b-3cefcba69636", examples: ["Run into a friend.", "Run into trouble.", "Run into debt.", "Run into a wall."] },
  { id: "509ae9fb-e8bd-42ac-bf41-36f066400140", examples: ["Frail health.", "Look frail.", "Frail body.", "Frail elderly."] },
  { id: "64dc7585-8105-4a06-bea1-bc6c6749b7aa", examples: ["Monolithic structure.", "Monolithic culture.", "Monolithic state.", "Appear monolithic."] },
  { id: "54260106-ce27-40b3-8698-6b86d8a9ade7", examples: ["Spontaneous applause.", "Spontaneous decision.", "Spontaneous combustion.", "Be spontaneous."] },
  { id: "54160406-371c-4888-8c5b-9097255e1bb7", examples: ["Don't lose sleep over it.", "Lose sleep over debts.", "Lose sleep over nothing.", "Why lose sleep over this?"] },
  { id: "9611d4a0-1e67-41ee-acf6-7b86a93ca093", examples: ["Subservient role.", "Subservient to him.", "Act subservient.", "Remain subservient."] },
  { id: "81c187ea-c750-4115-bebe-3a4c20c993f9", examples: ["I was over the moon.", "She is over the moon.", "Over the moon about it.", "Absolutely over the moon."] },
  { id: "5a717cd3-a112-405b-923d-fa3db8477ee7", examples: ["Safe harbor.", "Harbor a grudge.", "Harbor fugitive.", "Pearl Harbor."] },
  { id: "0c38efb1-6118-4ac6-8490-a5341e5f7d02", examples: ["Minimum wages.", "Low wages.", "High wages.", "The wages of sin."] },
  { id: "767bd094-aca4-4bae-8795-2cbd934adcbb", examples: ["He is a dark horse.", "She is a dark horse in the race.", "Dark horse candidate.", "Watch the dark horse."] },
  { id: "a54ff740-9bc4-4fa8-a0f4-f2257891597e", examples: ["Lavish lifestyle.", "Lavish gifts.", "Lavish praise.", "Lavish party."] },
  { id: "55df23ed-8827-42d3-846a-05dd7cdca84d", examples: ["Unyielding spirit.", "Unyielding surface.", "Unyielding demand.", "Remain unyielding."] },
  { id: "5fb2fc09-9988-43e3-918a-5ff3e3f0a2f4", examples: ["Stood nonchalantly.", "Walked nonchalantly.", "Asked nonchalantly.", "Acted nonchalantly."] },
  { id: "f48b179a-3bc3-493d-a043-d5a3f0e5e6e0", examples: ["Put someone off their food.", "Don't put someone off.", "His manner put someone off.", "Put someone off the idea."] },
  { id: "319e7bb8-ca5e-4a6d-8ecc-4d8245a8e523", examples: ["Intricate design.", "Intricate pattern.", "Intricate details.", "Intricate plot."] },
  { id: "ec48dec1-25f4-48a4-ac9e-de2ba8803c53", examples: ["Overthrow the government.", "Attempt to overthrow.", "Violent overthrow.", "Plot to overthrow."] },
  { id: "edac268e-cc01-491c-baf5-bcaa2df7a709", examples: ["She is at the top of her game.", "Stay at the top of your game.", "He's at the top of his game.", "Perform at the top of your game."] },
  { id: "e2cdcfe8-1765-45e2-9297-e9ab7831aba0", examples: ["Babbling brook.", "Babbling baby.", "Stop babbling.", "Babbling on about nothing."] },
  { id: "c2e86125-517f-492c-bdc8-9adf318c7181", examples: ["It serves no purpose.", "Does it serve no purpose?", "To serve no purpose at all.", "This rule serves no purpose."] },
  { id: "708f6827-42bd-4486-90b5-043cd1e565ae", examples: ["He frowned.", "She frowned at him.", "Frowned with concentration.", "Teacher frowned."] },
  { id: "02cd1c21-d8c2-47f8-b265-164bc571b074", examples: ["Substantially different.", "Increase substantially.", "Substantially larger.", "Contribute substantially."] },
  { id: "c062d6b8-08d8-4754-b918-0db8466b17be", examples: ["She frowned deeply.", "He frowned in thought.", "Frowned at the news.", "Simply frowned."] },
  { id: "756dcd49-fc0e-409a-937f-2eeb910497dc", examples: ["Austere life.", "Austere monk.", "Austere decor.", "Look austere."] },
  { id: "f4178691-8d99-4f5d-81c9-e0020d4856ed", examples: ["Look of disdain.", "Treat with disdain.", "Disdain for authority.", "Feel disdain."] },
  { id: "4821e6c5-de8b-405d-b778-2951bd48989e", examples: ["Steep incline.", "Incline his head.", "Incline to agree.", "Walk up the incline."] },
  { id: "22dff34a-d84b-49e0-8f42-3150a62eb72c", examples: ["Lion's lair.", "Thieves' lair.", "Go to his lair.", "Hidden lair."] },
  { id: "ea30c189-3f30-474d-92f9-8497468d000f", examples: ["Mouse scurried off.", "Scurried off into the dark.", "He scurried off.", "Quickly scurried off."] },
  { id: "be5c2454-58ad-4774-8b29-bfcd1362fc83", examples: ["Good reputation.", "Bad reputation.", "Build a reputation.", "Ruined reputation."] },
  { id: "2ab6ed92-40a4-4f47-8bf0-9003b1030444", examples: ["Ruddy complexion.", "Ruddy face.", "Ruddy glow.", "Looked ruddy."] },
  { id: "331f61a5-25f3-47ef-b1f7-228dc3db09b7", examples: ["Outperform rivals.", "Outperform the market.", "Strive to outperform.", "Consistently outperform."] },
  { id: "0ef70b87-9540-4ca1-bbf7-abbe54deb67c", examples: ["Confine to bed.", "Confine the problem.", "Confine remarks.", "Solitary confinement."] },
  { id: "8fb1c9e8-2726-49b0-9475-cdbda60df2c6", examples: ["Delicate flower.", "Delicate situation.", "Delicate features.", "Delicate operation."] },
  { id: "0e3ea4ca-425d-4de2-8430-559385d12759", examples: ["Dampening effect.", "Dampening spirits.", "Sound dampening.", "Dampening the noise."] }
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
