
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

const batch = [
  { id: "e102660d-77c8-472b-8a1a-42dc089d892d", examples: ["He is socially inept.", "Inept handling of the situation.", "An inept leader.", "Feel inept at sports."] },
  { id: "7d213dbf-58cb-43dd-9e2a-f3d2f1d80e1e", examples: ["Induce labor.", "Drugs can induce sleep.", "Nothing could induce him to stay.", "Induce a reaction."] },
  { id: "93084393-3af2-4d1e-b8ca-d024bc76fa65", examples: ["Under coercion.", "Obtained by coercion.", "No coercion was used.", "Coercion is illegal."] },
  { id: "8884b34f-ed6b-41b5-8221-a0815939a487", examples: ["The plan was a literal nonstarter.", "It's a nonstarter for us.", "Proved to be a nonstarter.", "This idea is a nonstarter."] },
  { id: "63a055d3-cb8d-40c3-bcdf-f75686ce9fdc", examples: ["A benign tumor.", "Benign neglect.", "He seemed benign.", "Benign environment."] },
  { id: "dbcfd051-a42d-4aa4-9c21-5369673c7a3c", examples: ["Objected strenuously.", "Work strenuously.", "Denied it strenuously.", "Strenuously exercised."] },
  { id: "3970159a-d523-4f4e-b9f1-febbe9894334", examples: ["Inferior quality.", "Feel inferior.", "Inferior to the original.", "Inferior rank."] },
  { id: "47c695f4-0ee2-42b0-b4cd-71899f356ca4", examples: ["A complete novice.", "Novice driver.", "Novice at chess.", "Novice mistake."] },
  { id: "d97ac926-8714-42cb-8f3d-f7f666501ef7", examples: ["Don't deride his efforts.", "Deride the idea.", "They derided him.", "Deride authority."] },
  { id: "38dc1d1d-076f-4e8f-b202-45f1cae3b039", examples: ["My daily mantra.", "Repeat the mantra.", "A new mantra for success.", "Chanted a mantra."] },
  { id: "e28347ca-b625-4c44-ad48-7e54ed3f516d", examples: ["Problems stem from lack of money.", "Does it stem from childhood?", "Stem from ignorance.", "Stem from a misunderstanding."] },
  { id: "22b6826c-117e-448f-983b-21f7cdea44ba", examples: ["Increased threefold.", "Threefold purpose.", "Threefold increase.", "Problem is threefold."] },
  { id: "7698138f-43b3-461e-a585-82da3c48f612", examples: ["Accurate depiction.", "Graphic depiction.", "Depiction of violence.", "Depiction in the movie."] },
  { id: "a53b48dc-0c93-4135-b0f7-f5d37dc0f286", examples: ["Specifically or implicitly.", "She implicitly trusted him.", "Agreed implicitly.", "Implicitly understood."] },
  { id: "87be58ed-c071-4498-83b2-c375036d3b3f", examples: ["Strive for excellence.", "Strive to be better.", "We strive to please.", "Strive against odds."] },
  { id: "b33ef6bb-9bb7-49c4-9e67-f32fc9437c28", examples: ["Toxic sludge.", "Thick sludge.", "Wade through sludge.", "Industrial sludge."] },
  { id: "49f1d1a6-7d24-43eb-b441-ca41dfc8c2e2", examples: ["Unsavory character.", "Unsavory reputation.", "Unsavory incident.", "Avoid unsavory places."] },
  { id: "0c0872b0-9dc1-4653-98ef-716bf5e4518c", examples: ["Carbon emission.", "Emission standards.", "Reduce emissions.", "Emission test."] },
  { id: "02f37372-e772-4d1b-9cfb-0c0229ec0180", examples: ["Reputable company.", "Highly reputable.", "Is he reputable?", "Reputable source."] },
  { id: "78f536b3-ed93-4671-904e-ad9da84eddd7", examples: ["Prominent figure.", "Prominent politician.", "Prominent nose.", "Prominent place."] },
  { id: "08f09273-f04c-4e25-bcc5-a70f35d7d1b2", examples: ["Modest house.", "Be modest.", "Modest success.", "He is very modest."] },
  { id: "36cde6ee-8aee-4617-beed-616f8730cfd0", examples: ["Distinguished guest.", "Distinguished career.", "Looked distinguished.", "Very distinguished."] },
  { id: "84154027-c53c-4369-b099-59c5f0a0f508", examples: ["High-profile case.", "High-profile job.", "High-profile event.", "High-profile celebrity."] },
  { id: "3a94b3e3-f981-4d2c-8f5e-41c0bddbdfd5", examples: ["Self-made millionaire.", "Self-made man.", "Self-made success.", "He is self-made."] },
  { id: "44c5d1a8-4b5b-4c76-a340-531cdbc40b2a", examples: ["Respected leader.", "Highly respected.", "Respected opinion.", "Deeply respected."] },
  { id: "6f5b5737-3e0b-4f71-ad2e-e6877b467f81", examples: ["Influential person.", "Influential book.", "Highly influential.", "Influential friends."] },
  { id: "b13c23f5-d295-413b-8e38-25453c241ea8", examples: ["Elite athlete.", "Elite forces.", "Join the elite.", "Social elite."] },
  { id: "e4540061-f4b1-4e94-9a3f-ce2a06648da7", examples: ["Working-class hero.", "Working-class family.", "Working-class neighborhood.", "Proud to be working-class."] },
  { id: "1440eda4-67a4-41cd-ac2c-684e2c2d4638", examples: ["Upper-class lifestyle.", "Upper-class family.", "Upper-class accent.", "Born upper-class."] },
  { id: "8f4d934f-ed7b-4a62-9ee6-963afd2427c5", examples: ["Middle-class values.", "Middle-class family.", "Growing middle-class.", "Middle-class suburb."] },
  { id: "143a024b-0342-4eef-bb34-a37ffaf294af", examples: ["Well-off family.", "They are well-off.", "Better off.", "Well-off neighborhood."] },
  { id: "c6659aca-d6f2-4c3e-b632-45c632648228", examples: ["Privileged background.", "Privileged life.", "Feel privileged.", "Privileged information."] },
  { id: "ed186f45-fdbb-4020-8230-d32b313ef19a", examples: ["Affluent society.", "Affluent neighborhood.", "Affluent customers.", "Grew up affluent."] },
  { id: "7c852eab-54e4-40c6-9846-ff411a49012d", examples: ["A massive sinkhole appeared.", "Swallowed by a sinkhole.", "Sinkhole caused damage.", "Repair the sinkhole."] },
  { id: "6190a9e7-da7d-4fff-8597-7b230a30a2cc", examples: ["Caught in a dust storm.", "Mars dust storm.", "Dust storm warning.", "Blinding dust storm."] },
  { id: "e5e0d10e-eb3d-44da-b3da-545e12d36c1c", examples: ["Heavy hail storm.", "Damaged by hail storm.", "Hail storm warning.", "Caught in a hail storm."] },
  { id: "fbc1d7c5-3d9f-4967-b605-55bc0a189b68", examples: ["Wildfire spreading.", "California wildfire.", "Contain the wildfire.", "Wildfire smoke."] },
  { id: "2e3366d3-f6da-44ba-be45-2e6fea2e5ba3", examples: ["Severe drought.", "Drought conditions.", "Caused by drought.", "End the drought."] },
  { id: "43cb1f8d-fcca-4a19-96f1-4e32325276b4", examples: ["Avalanche warning.", "Triggered an avalanche.", "Buried by avalanche.", "Avalanche dog."] },
  { id: "099bd49f-546c-4b96-8aa3-f92ebc4fc452", examples: ["Landslide victory.", "Caused a landslide.", "Blocked by landslide.", "Landslide risk."] },
  { id: "9dd1d172-b334-46ab-b217-342ffaeeb7d6", examples: ["Major volcanic eruption.", "Predict volcanic eruption.", "After the volcanic eruption.", "Volcanic eruption zone."] },
  { id: "876f379c-2df0-43f8-a5ab-aa88eb3cf8e9", examples: ["Tsunami warning.", "Hit by a tsunami.", "Tsunami wave.", "Devastating tsunami."] },
  { id: "85293eae-2aac-4271-821a-f715364335f5", examples: ["Big earthquake.", "Earthquake drill.", "Earthquake damage.", "Survived the earthquake."] },
  { id: "3e8823ff-9411-400d-a8d0-45bf49f360da", examples: ["Flash flood.", "Flood warning.", "Flood waters.", "House was flooded."] },
  { id: "8a971d68-47d9-4c9b-9c3b-5db17170fe7f", examples: ["Linen suit.", "Crisp linen.", "Linen tablecloth.", "Wash the linen."] },
  { id: "8f4ac0e5-0d8e-45e7-bb8b-6a5845dbb937", examples: ["Blue velvet.", "Velvet dress.", "Soft as velvet.", "Red velvet cake."] },
  { id: "f953241e-fcd5-4f55-8961-f95eb616407c", examples: ["100% cotton.", "Cotton shirt.", "Cotton candy.", "Pick cotton."] },
  { id: "816ad1f8-03f9-4852-9b2b-4996b434e40c", examples: ["Satin sheets.", "Satin dress.", "Smooth satin.", "Pink satin."] },
  { id: "3279517e-a667-42b7-99d2-61e80899035c", examples: ["Silk tie.", "Pure silk.", "Silk scarf.", "Smooth as silk."] },
  { id: "6d65285f-8240-42f9-bf59-90e678b86b22", examples: ["Leather jacket.", "Genuine leather.", "Leather shoes.", "Smell of leather."] },
  { id: "739be054-0011-49ea-ae8c-767b56897727", examples: ["Blue suede shoes.", "Suede jacket.", "Faux suede.", "Clean the suede."] },
  { id: "aa0feb0e-8261-4d4c-b151-4141b2914546", examples: ["Denim jeans.", "Denim jacket.", "Faded denim.", "Double denim."] },
  { id: "c83e916d-c116-4e91-ae86-43d670a631fc", examples: ["Feeling numbness.", "Numbness in toes.", "Numbness and tingling.", "Cause numbness."] },
  { id: "165baf1c-0527-4d4e-b2f6-d12ce0f4c023", examples: ["Stop itching.", "Severe itching.", "Itching powder.", "Itching all over."] },
  { id: "e8919577-2d7a-4b78-8821-75eb865f94aa", examples: ["Feeling nausea.", "Nausea and vomiting.", "Morning nausea.", "Cause nausea."] },
  { id: "852e4518-01dc-46a9-9b3c-d3b174a1121a", examples: ["Morning stiffness.", "Muscle stiffness.", "Joint stiffness.", "Reduce stiffness."] },
  { id: "05206fda-569d-4ea1-9bd5-07fa2ec32634", examples: ["Viral infection.", "Fight infection.", "Ear infection.", "Spread infection."] },
  { id: "089baec0-85d3-49cb-995b-64a7aa37324b", examples: ["Skin irritation.", "Eye irritation.", "Minor irritation.", "Cause irritation."] },
  { id: "bb9f4ad6-4f40-4b97-9183-90a98ad639be", examples: ["Severe diarrhea.", "Have diarrhea.", "Diarrhea symptoms.", "Traveler's diarrhea."] },
  { id: "0abcc860-7ecf-455d-ab92-63c7fb7b4e81", examples: ["Chronic constipation.", "Relieve constipation.", "Constipation relief.", "Cause constipation."] },
  { id: "9062e5be-1d12-47d8-9b99-a512f4345ab0", examples: ["Reduce inflammation.", "Chronic inflammation.", "Joint inflammation.", "Signs of inflammation."] },
  { id: "c6471ad2-3c59-48eb-9e11-fdc565fbc5d6", examples: ["Shabby chic.", "Shabby clothes.", "Shabby treatment.", "Looks a bit shabby."] },
  { id: "682de2c4-58b5-4e8e-90c6-aafec559428f", examples: ["Worn-out shoes.", "Completely worn-out.", "Worn-out tires.", "Looking worn-out."] },
  { id: "32f0b228-ad30-426b-97d5-5f83b6e0334b", examples: ["Torn shirt.", "Torn muscle.", "War-torn country.", "Torn between choices."] },
  { id: "3af57105-d4ed-444d-a995-02ac420c7719", examples: ["Broken window.", "Broken heart.", "Broken promise.", "Broken English."] },
  { id: "a5b35504-3ec9-486d-82d0-ae5434895e40", examples: ["Second-hand car.", "Second-hand clothes.", "Second-hand smoke.", "Buy second-hand."] },
  { id: "98aa9c90-4dcc-4f70-8348-fc498dcab26a", examples: ["Brand new car.", "Looks brand new.", "Smell of brand new.", "Brand new toys."] },
  { id: "663f6c3f-f4e5-450b-9dde-ad074615e527", examples: ["Meet in person.", "Tell him in person.", "Better in person.", "Apply in person."] },
  { id: "f6cb1f4a-d0fc-403a-93ae-c0cb741a82c1", examples: ["Expect nothing in return.", "In return for help.", "What do I get in return?", "Love in return."] },
  { id: "565082e8-9bca-4d60-8874-38eb6c402bc0", examples: ["Talk in private.", "Keep it in private.", "Meet in private.", "In private life."] },
  { id: "885eb758-4a0c-4d37-9bc3-b49eae22cf32", examples: ["Skills in demand.", "High in demand.", "Always in demand.", "Product is in demand."] },
  { id: "6a34151b-d70e-48a7-af58-f889143a305c", examples: ["Died in vain.", "Tried in vain.", "All in vain.", "Not in vain."] },
  { id: "cc8fb3b7-2026-45fd-a7e2-425d3b14de97", examples: ["Friend in need.", "Help those in need.", "In need of repair.", "Are you in need?"] },
  { id: "a16c5d3e-9449-4e6a-b088-ef258c89a6d5", examples: ["Liver damage.", "Chicken liver.", "Liver failure.", "Healthy liver."] },
  { id: "f6ad3200-282a-43f3-ab1d-e0189f028d34", examples: ["Stomach ache.", "Empty stomach.", "Stomach ulcer.", "Butterflies in stomach."] },
  { id: "f99ca299-5b35-4386-bea1-b888099ed158", examples: ["Small intestine.", "Large intestine.", "Intestine blockage.", "Clean intestine."] },
  { id: "e2dc8555-afa4-4d92-bd79-3a112dac2637", examples: ["Full bladder.", "Bladder infection.", "Bladder control.", "Empty bladder."] },
  { id: "1e04603d-5bfe-4e84-9396-644e2225684b", examples: ["Broken heart.", "Heart attack.", "Heart beat.", "Open heart surgery."] },
  { id: "ea2b921f-0ce1-4448-b6d2-bea6ad44d5d8", examples: ["Kidney stone.", "Kidney failure.", "Donate a kidney.", "Kidney transplant."] },
  { id: "b4b2a34b-8b69-48da-89e0-b4d2e56a8f61", examples: ["Collapsed lung.", "Lung cancer.", "Lung capacity.", "Iron lung."] },
  { id: "50c79312-a5ee-48f2-bb55-ab3dfdfe041f", examples: ["Brain drain.", "Brain tumor.", "Use your brain.", "Brain dead."] },
  { id: "531ad8fc-1eb0-4a9c-98f8-7c30c259c9a4", examples: ["Remove a wart.", "Plantar wart.", "Wart remover.", "Wart on finger."] },
  { id: "183bd30b-430b-4e51-845d-066d15df2795", examples: ["Large birthmark.", "Red birthmark.", "Birthmark on arm.", "Remove birthmark."] },
  { id: "3399e05c-a480-4e53-98cd-080eee75845a", examples: ["Remove skin tag.", "Skin tag removal.", "Itchy skin tag.", "Common skin tag."] },
  { id: "f68e2cd1-fa98-4cd6-8462-50065326725f", examples: ["Beauty mole.", "Cancerous mole.", "Check the mole.", "Mole on cheek."] },
  { id: "19c87522-baca-4870-9a3a-dd54ada5c211", examples: ["Sebaceous cyst.", "Remove the cyst.", "Cyst burst.", "Painful cyst."] },
  { id: "9e3e5476-da6f-42b0-a8b0-34c4d40a895e", examples: ["Benign tumor.", "Brain tumor.", "Shrink the tumor.", "Remove the tumor."] },
  { id: "99dc5d85-e595-4916-ad4b-e12452968696", examples: ["Don't be hotheaded.", "Hotheaded mood.", "Hotheaded reaction.", "He is hotheaded."] },
  { id: "8b704488-efb2-43cc-821a-b2c3dc82ad0e", examples: ["Two-faced liar.", "She is two-faced.", "Two-faced friend.", "Don't be two-faced."] },
  { id: "da1eb149-7803-4e2e-8ffd-7ae13a84f95b", examples: ["Big-headed arrogant.", "Don't get big-headed.", "He is big-headed.", "Big-headed attitude."] },
  { id: "e7eccea7-075f-470b-b083-84f56ff65c27", examples: ["She is soft-hearted.", "Soft-hearted person.", "Too soft-hearted.", "A soft-hearted fool."] },
  { id: "6c49473d-147e-460a-8991-e494eaef7fae", examples: ["Sharp-tongued woman.", "He is sharp-tongued.", "Sharp-tongued reply.", "Beware her sharp tongue."] },
  { id: "edf04b32-2ca2-4acb-9b4f-1acc485f1ed8", examples: ["Pigheaded refusal.", "He is pigheaded.", "Don't be pigheaded.", "Pigheaded stubbornness."] },
  { id: "8af5bfe6-2a85-443a-8723-4e5cd063d6e1", examples: ["Wilted flowers.", "Wilted spinach.", "Looks wilted.", "The plant wilted."] },
  { id: "93477249-1d3a-4944-8348-58900b0fe952", examples: ["Stale bread.", "Stale air.", "Jokes are stale.", "Stale cake."] },
  { id: "d48ac178-765a-4596-bfba-a282e3fa613f", examples: ["Sprouted potatoes.", "Seeds sprouted.", "Sprouted grains.", "Newly sprouted."] },
  { id: "0249fc25-00f8-4687-a496-3466bde0fbde", examples: ["Withered hand.", "Withered plant.", "Hope withered.", "Withered away."] },
  { id: "045bd643-aa05-48ff-b2d8-4ff89c1b6fa1", examples: ["Overripe banana.", "Overripe fruit.", "Smell of overripe.", "Mushy and overripe."] },
  { id: "fa8857f3-2522-433a-b7dd-7692c615fac2", examples: ["Buy sanitary pads.", "Change sanitary pad.", "Sanitary pad disposal.", "Box of sanitary pads."] },
  { id: "0018c3b9-7989-445f-a18e-c457b3e37aaf", examples: ["Box of Q-tips.", "Clean ears with Q-tips.", "Q-tips for makeup.", "Don't use Q-tips inside ear."] }
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
