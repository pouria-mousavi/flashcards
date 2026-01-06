
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

const batch = [
  { id: "5e6cbdd9-52c0-471e-abab-42cbd9555477", examples: ["Need toilet paper.", "Toilet paper roll.", "Buy toilet paper.", "Soft toilet paper."] },
  { id: "56c7ffdf-a533-4032-bd09-f280c47b15fa", examples: ["Pursue a career.", "Pursue happiness.", "Police pursue the suspect.", "Pursue a goal."] },
  { id: "07bb4ac5-a6b3-4aa4-99b6-e91ad62cbdf4", examples: ["Marriage proposal.", "Business proposal.", "Accept the proposal.", "Draft a proposal."] },
  { id: "f678923d-a568-4d9b-b2c4-8e050bc358c4", examples: ["Propose a toast.", "He proposed to her.", "Propose a plan.", "What do you propose?"] },
  { id: "cb919e7c-5737-4594-9e96-00213690d73d", examples: ["Proceed with caution.", "May we proceed?", "Proceed to the gate.", "How to proceed?"] },
  { id: "f2f2996d-c50e-442a-ae5b-a2e39b2601e6", examples: ["Use the photocopier.", "Photocopier is jammed.", "Colour photocopier.", "Fix the photocopier."] },
  { id: "e02b2597-26f8-4432-9391-980b457cb0ed", examples: ["Photocopy the document.", "Need a photocopy.", "Make a photocopy.", "Photocopy machine."] },
  { id: "8767cf1c-5959-49cf-a7bd-c668a6045792", examples: ["Self-indulgence.", "Treat as an indulgence.", "Chocolate is my indulgence.", "Forgive the indulgence."] },
  { id: "d9ce4c15-c0a3-4f32-b06c-81bc1b571212", examples: ["Indulge yourself.", "Indulge in sweets.", "Don't indulge him.", "Indulge a fantasy."] },
  { id: "fa7e993a-a7ed-41b0-91a5-ec1b59404911", examples: ["It is an imposition.", "Sorry for the imposition.", "Resent the imposition.", "Tax imposition."] },
  { id: "b0ce416b-6638-424c-ac10-4619843f4b48", examples: ["Impose restrictions.", "Don't impose.", "Impose a fine.", "Impose your will."] },
  { id: "a5ff499c-6637-43bf-a931-54c2758e2f2f", examples: ["Port of embarkation.", "Embarkation card.", "Time of embarkation.", "Wait for embarkation."] },
  { id: "672c051f-2aa3-4cf9-855d-b5052e5c1679", examples: ["Embark on a journey.", "Embark on a career.", "Ship embarked.", "Ready to embark."] },
  { id: "01efc5b5-87a3-43d0-af40-aaba1c494179", examples: ["Traffic diversion.", "Create a diversion.", "Need a diversion.", "Welcome diversion."] },
  { id: "7222e30f-3b68-4690-8eec-aef9ea51b098", examples: ["Divert funds.", "Divert attention.", "Traffic diverted.", "Divert the river."] },
  { id: "464d55f4-b493-42c9-9fd2-a91878e5858e", examples: ["Image distortion.", "Sound distortion.", "Distortion of facts.", "Severe distortion."] },
  { id: "a3ccfd29-8707-4f56-a05c-d0e04251ba97", examples: ["Distort the truth.", "Face distorted.", "Distort reality.", "Don't distort my words."] },
  { id: "12fe44cc-b801-4025-ae4e-39eff808ce5a", examples: ["Detection rate.", "Avoid detection.", "Early detection.", "Metal detection."] },
  { id: "410fb046-a1f5-413e-85bc-abee18b3ac54", examples: ["Detect a leak.", "Detect a signal.", "Hard to detect.", "Detect fraud."] },
  { id: "b1b4cda2-e212-4910-8d60-fb31697e2ab2", examples: ["Detention center.", "After-school detention.", "In detention.", "Detention without trial."] },
  { id: "93a9373e-4cbe-490f-a36f-fe6bb0baf946", examples: ["Detained by police.", "Detain a suspect.", "Don't further detain you.", "Detained at customs."] },
  { id: "823ec7bd-ff9f-48d4-b5f8-2469d6f976ea", examples: ["Desertion from army.", "Charge of desertion.", "Mass desertion.", "Feeling of desertion."] },
  { id: "1cb478e6-07c9-4369-8c6b-ec18f0e7ca12", examples: ["Desert the army.", "Desert a family.", "Don't desert me.", "Villages deserted."] },
  { id: "b56f801a-53f0-4cbf-82a7-65dec5d29145", examples: ["Contribute money.", "Contribute to society.", "Contribute ideas.", "Factors contribute."] },
  { id: "73b1fd52-fe34-4037-9303-4063c9311aed", examples: ["Violent confrontation.", "Avoid confrontation.", "Face confrontation.", "Direct confrontation."] },
  { id: "f844b47b-ffe7-4275-a6ff-3250b15dc9a2", examples: ["Confront the issue.", "Confront your fears.", "He confronted me.", "Confront with evidence."] },
  { id: "76692389-a96d-4869-8623-ddfb341f2453", examples: ["Compilation album.", "Make a compilation.", "Code compilation.", "Data compilation."] },
  { id: "e9b42432-cb73-43ac-a363-a25b03908678", examples: ["Compile a list.", "Compile data.", "Code compiles.", "Compile evidence."] },
  { id: "ee78b362-e9a8-4e4d-8e3a-ab23d1e1d9ec", examples: ["Resource allocation.", "Budget allocation.", "Asset allocation.", "Fair allocation."] },
  { id: "c625b093-a591-4c7e-bf66-5089f761827a", examples: ["Allocate funds.", "Allocate time.", "Allocate resources.", "Seats allocated."] },
  { id: "093c023a-1288-48f4-955f-f13b545b83d0", examples: ["Acquire knowledge.", "Acquire a company.", "Acquire skills.", "Acquired taste."] },
  { id: "cb3dee69-7bd0-4b4f-ac7e-058e58ef9e8e", examples: ["Great accomplishment.", "Sense of accomplishment.", "Proud accomplishment.", "Lifetime accomplishment."] },
  { id: "d76067a8-e001-4a92-a097-1706ba56df5a", examples: ["Accomplish a goal.", "Mission accomplished.", "Hard to accomplish.", "Accomplish tasks."] },
  { id: "6982ff10-4353-442b-9104-24017ebc195d", examples: ["Act of wickedness.", "Pure wickedness.", "Punish wickedness.", "Wickedness of man."] },
  { id: "4922759d-a659-45d8-99f3-166d1a6ef2b7", examples: ["Poor visibility.", "High visibility.", "Visibility is low.", "Visibility zero."] },
  { id: "a686a78e-e62c-47f7-8ac7-afbf9836b242", examples: ["Visible stars.", "Visible signs.", "Highly visible.", "Barely visible."] },
  { id: "c05827da-6c6f-495e-97be-6e028c24e183", examples: ["Avoid triviality.", "Discuss triviality.", "Focus on triviality.", "Mere triviality."] },
  { id: "d563c906-13e3-47b2-b321-c504f48dbfd6", examples: ["Transparency in government.", "Lack of transparency.", "Full transparency.", "Glass transparency."] },
  { id: "8be1da3e-5233-4749-a68f-04de8efd0c0c", examples: ["Subtlety of flavor.", "Missed the subtlety.", "Act with subtlety.", "Nuance and subtlety."] },
  { id: "73dbf3bb-7aca-4a0d-ab77-a0ee5a7edb8d", examples: ["Total subservience.", "Demand subservience.", "Woman subservience.", "Subservience to rules."] },
  { id: "b5c34b6f-5897-48e5-aa33-9c4bba5ffc9b", examples: ["Subservient role.", "Be subservient.", "Subservient to him.", "Act subservient."] },
  { id: "c607e29f-2919-4204-8e9b-259199904ad1", examples: ["Kindred spirit.", "Spirit of the law.", "Team spirit.", "Holy Spirit."] },
  { id: "d13f254a-5e27-470f-8b64-19a7ae93f8bb", examples: ["Spiritual leader.", "Spiritual journey.", "Spiritual growth.", "Spiritual needs."] },
  { id: "f02b30b2-00d7-42a8-9347-fc19ca15c17b", examples: ["Intellectual snobbery.", "Pure snobbery.", "Dislike snobbery.", "Inverse snobbery."] },
  { id: "1d8fe28f-9be9-4083-a61e-ab3c44fb2a4a", examples: ["Snobbish attitude.", "Don't be snobbish.", "Snobbish people.", "Sound snobbish."] },
  { id: "b8ef6d2d-bc17-484f-ba6f-131504cb6c54", examples: ["Total secrecy.", "In secrecy.", "Swear to secrecy.", "Top secrecy."] },
  { id: "f3a2d532-2887-41d4-b911-b35f7f6dc134", examples: ["Secretive person.", "Being secretive.", "Secretive nature.", "Act secretive."] },
  { id: "90e47482-7b69-4af6-86e7-bc3ea06adcd2", examples: ["Scandalous behavior.", "Scandalous rumors.", "Scandalous dress.", "Absolutely scandalous."] },
  { id: "dea86db8-d541-4808-896f-81e7652b51cf", examples: ["Political ruthlessness.", "Act with ruthlessness.", "Ruthlessness of war.", "She showed ruthlessness."] },
  { id: "539a4234-eaad-4046-be75-fd8d2826e4b8", examples: ["Proportionate response.", "Proportionate to income.", "Not proportionate.", "Directly proportionate."] },
  { id: "f3691f63-1075-492b-88b0-5d232b9950b5", examples: ["Precision instrument.", "Precision engineering.", "With precision.", "Surgical precision."] },
  { id: "d8878554-9c85-4c43-ae1e-b6167a595a38", examples: ["Public nudity.", "Frontal nudity.", "Movie contains nudity.", "Nudity laws."] },
  { id: "90f7c12e-2bb6-4cc1-835f-3afec46d4a2a", examples: ["Gained notoriety.", "Global notoriety.", "Infamous notoriety.", "Seek notoriety."] },
  { id: "bc1bd4e0-7eb0-4394-91e2-e424f695d2ca", examples: ["Return to normality.", "Semblance of normality.", "Normality resumed.", "Sense of normality."] },
  { id: "ec7df519-9019-41ba-9ed4-3c99b92a9d0d", examples: ["Normal behavior.", "Back to normal.", "Above normal.", "It is normal."] },
  { id: "c36bb46e-bed8-416d-b92b-22d27cc27272", examples: ["Net neutrality.", "Political neutrality.", "Maintain neutrality.", "Swiss neutrality."] },
  { id: "ac445bfa-8f0c-4196-9144-46e1f72f2bd7", examples: ["Scenes of jubilation.", "Great jubilation.", "Shouts of jubilation.", "Jubilation in the crowd."] },
  { id: "60f0173a-70bc-48f0-a62f-a064aa90d104", examples: ["Mass hysteria.", "Calm the hysteria.", "Sheer hysteria.", "Hysteria broke out."] },
  { id: "03e31d95-c58b-4c26-8c83-13cad9db6eee", examples: ["Candle flame.", "Burst into flame.", "Flame war.", "Blue flame."] },
  { id: "5241f794-0784-4c6e-9e51-ef5d12acce79", examples: ["Highly flammable.", "Flammable liquid.", "Flammable material.", "Not flammable."] },
  { id: "e09d8439-4dfd-4e81-917e-ca676b2ce4c7", examples: ["Breed familiarity.", "Familiarity with the subject.", "Sense of familiarity.", "Too much familiarity."] },
  { id: "4105f4ff-0287-4300-a490-68a2326be196", examples: ["Familiar face.", "Look familiar.", "Sound familiar.", "Become familiar."] },
  { id: "5e30ac40-e3d3-41ee-b6e2-550cb826d76e", examples: ["Faithful friend.", "Faithful dog.", "Remain faithful.", "Faithful copy."] },
  { id: "c1c85656-8050-4f20-b6b3-ceb3ce87e9af", examples: ["Feel elation.", "Sense of elation.", "Pure elation.", "With elation."] },
  { id: "e1a5f13c-cf1c-44c1-a476-4d99ff624156", examples: ["I was elated.", "Elated by the news.", "Feeling elated.", "She looked elated."] },
  { id: "5e9ed073-b1c4-4cfb-ae2e-289d8ebcbf27", examples: ["Pure ecstasy.", "In ecstasy.", "Drug ecstasy.", "Scream in ecstasy."] },
  { id: "03b5769c-6f31-4426-a72b-a3eef9e3d1ce", examples: ["Ecstatic crowd.", "Ecstatic fan.", "I am ecstatic.", "Ecstatic reunion."] },
  { id: "2a986f8b-bd38-47bf-a9bd-81b276f0a6ad", examples: ["Avoid distraction.", "Constant distraction.", "Welcome distraction.", "Driven to distraction."] },
  { id: "61c24cd7-f933-45b8-b5e8-0c03147cb606", examples: ["Get distracted.", "Easily distracted.", "Looked distracted.", "Don't be distracted."] },
  { id: "c74341f3-c78e-4e9e-bf24-f65a2b7b5274", examples: ["Use your discretion.", "At your discretion.", "Absolute discretion.", "Parental discretion."] },
  { id: "17bac4a9-63b9-4712-92d3-30d141ea22d1", examples: ["Be discreet.", "Discreet inquiry.", "Discreet distance.", "Act discreet."] },
  { id: "19f6b0de-fe64-4b1e-8585-8b6ccb57c818", examples: ["Animal cruelty.", "Cruelty to children.", "Act of cruelty.", "Cruelty free."] },
  { id: "88ad6829-88cb-4a8e-8cc9-bcc7fbb652ac", examples: ["Cruel world.", "Cruel joke.", "Don't be cruel.", "Cruel fate."] },
  { id: "6acdd1b6-7633-481d-9c6f-4a246eaca7cb", examples: ["Conciseness is key.", "Value conciseness.", "Brevity and conciseness.", "For conciseness."] },
  { id: "0b81767d-8351-4db5-b753-70471c11699c", examples: ["Software compatibility.", "Compatibility test.", "Check compatibility.", "Compatibility issue."] },
  { id: "be40ebe0-6b88-41a2-bdbb-1a2f4f61ad61", examples: ["Compatible with Mac.", "Compatible couple.", "Not compatible.", "Compatible donor."] },
  { id: "d8f096a7-02f6-4921-a089-c2b873e3046e", examples: ["Total chaos.", "Chaos erupted.", "Into chaos.", "Controlled chaos."] },
  { id: "e42aad24-ac0c-4bae-958c-ed65f2eb3135", examples: ["Chaotic scene.", "Chaotic traffic.", "Bit chaotic.", "Chaotic life."] },
  { id: "bfe46d53-4204-4358-94d0-7876daa79f71", examples: ["Appreciate bluntness.", "Excuse my bluntness.", "Spoke with bluntness.", "Shocking bluntness."] },
  { id: "a72677f8-6ff7-4563-96cb-378e24fb96cd", examples: ["Bereavement leave.", "Recent bereavement.", "Suffered a bereavement.", "Coping with bereavement."] },
  { id: "48adbf3e-cde6-4329-884b-81e01fbfc805", examples: ["Pay attention.", "Attract attention.", "Center of attention.", "Attention span."] },
  { id: "5364ca2a-8ccb-4ad6-9770-646bf2176070", examples: ["Attentive audience.", "Be attentive.", "Attentive service.", "Attentive listener."] },
  { id: "ee9b3a40-165b-4cdf-b097-a579a212ce9d", examples: ["Coffee aroma.", "Sweet aroma.", "Aroma of spices.", "Pleasant aroma."] },
  { id: "7c42e8fd-a9dd-46dd-8628-a75ff09b78e9", examples: ["Aromatic herbs.", "Aromatic coffee.", "Highly aromatic.", "Aromatic compounds."] },
  { id: "1b7b6265-f01e-45a8-8b0c-0d4d1c179bec", examples: ["Anonymous donor.", "Remain anonymous.", "Anonymous letter.", "Anonymous source."] },
  { id: "e98c352f-bffb-4b8d-8b9d-c4fe807ccd9a", examples: ["Social alienation.", "Feeling of alienation.", "Alienation from friends.", "Political alienation."] },
  { id: "f64fbc23-3400-454e-bfca-867107f9ec8e", examples: ["Feel alienated.", "Alienated youth.", "Alienated from family.", "Become alienated."] },
  { id: "160f73b1-0b8f-4326-bba3-b0ca24c4c856", examples: ["In addition to.", "Welcome addition.", "Latest addition.", "Math addition."] },
  { id: "c87589f8-6e30-4800-8d2f-1c56f564c16e", examples: ["Drug addiction.", "Phone addiction.", "Treat addiction.", "Fight addiction."] },
  { id: "6d0ae1ec-5a4a-4ad6-bdbc-35ad22a4ea58", examples: ["Addicted to coffee.", "Addicted to drugs.", "Become addicted.", "Totally addicted."] },
  { id: "4ceef086-7ff8-4edd-a26c-b32332ded113", examples: ["Collateral damage in war.", "Cause collateral damage.", "Avoid collateral damage.", "High collateral damage."] },
  { id: "644a497d-dbee-45c6-bb04-00d0dbfe3f54", examples: ["Hit by friendly fire.", "Friendly fire incident.", "Friendly fire kills.", "Avoid friendly fire."] },
  { id: "96b515bd-f31a-43f3-8acf-cf2e282d5b6f", examples: ["Help yourself to cake.", "Help yourself to drinks.", "Help yourself.", "Don't help yourself."] },
  { id: "aa69c4d0-c6ac-4936-95d6-5d9002a56800", examples: ["He is not exactly bright.", "She's not exactly bright.", "Not exactly bright idea.", "Dog is not exactly bright."] },
  { id: "898b4392-7001-47b9-8caf-507a919e4472", examples: ["Had to let him go.", "Let her go (fire).", "Let the bird go.", "Won't let him go."] },
  { id: "b6abe019-d93c-4e22-a961-c5ca494cff2b", examples: ["Corporate downsizing.", "Victim of downsizing.", "Downsizing the house.", "Face downsizing."] },
  { id: "6979b063-be24-4717-8604-cabd25ed5f10", examples: ["Put the cat to sleep.", "Put the dog to sleep.", "Had to put it to sleep.", "Put him to sleep."] },
  { id: "4ccc2b62-3e6f-41db-b302-adafab6643c9", examples: ["He passed away.", "Passed away peacefully.", "Recently passed away.", "Grandmother passed away."] }
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
