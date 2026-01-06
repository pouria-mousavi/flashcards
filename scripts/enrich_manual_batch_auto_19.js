
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

const batch = [
  { id: "bbeb803b-4127-4ec3-abf1-ec5fec644868", examples: ["That got quiet.", "It's rather quiet.", "Kept quite quiet.", "Quiet evening."] },
  { id: "acc96b56-1007-4400-be8d-0674fd496c5c", examples: ["Candid camera.", "Candid shot.", "Be candid with me.", "Candid response."] },
  { id: "64b71898-41e9-4be9-8aa7-cd5b29fe56a7", examples: ["Hurtling along.", "Hurtling towards disaster.", "Bus hurtling.", "Debris hurtling."] },
  { id: "ca4182b5-40b8-411a-ba65-0a950c90675a", examples: ["Forlorn hope.", "Looked forlorn.", "Forlorn cry.", "Left forlorn."] },
  { id: "c9503d75-0928-43e9-84fd-68bd1211bcb1", examples: ["He shrugged.", "Shrugged shoulders.", "Shrugged it off.", "She shrugged indifferent."] },
  { id: "b18cba10-eb0a-47e0-b919-3c476f87505f", examples: ["Chatted amiably.", "Smiled amiably.", "Agreed amiably.", "Walked amiably."] },
  { id: "5760718d-c0be-4f2d-a688-7b686d2e930b", examples: ["Ubiquitous computing.", "Ubiquitous presence.", "Seem ubiquitous.", "Become ubiquitous."] },
  { id: "4b3d26f0-87f0-4da1-845d-ebdbf9bc5407", examples: ["Seek patronage.", "Under royal patronage.", "Patronage of the arts.", "Political patronage."] },
  { id: "f4d034ef-c06d-4843-8ce8-1e2dc97d1113", examples: ["Title protagonist.", "Female protagonist.", "Protagonist of the story.", "Sympathetic protagonist."] },
  { id: "5658a251-bfd9-4e08-9a52-7e8d2be9d05f", examples: ["Sheer cliffs.", "Sheer luck.", "Sheer nonsense.", "Sheer fabric."] },
  { id: "f4b63d1c-c703-4056-a9aa-bcff7bb5ec3f", examples: ["Elicit a response.", "Elicit information.", "Elicit sympathy.", "Failed to elicit."] },
  { id: "0ec7ee60-0b70-440b-a3cb-d2b46c0a0d7c", examples: ["Sloppy work.", "Sloppy handwriting.", "Sloppy kiss.", "Don't be sloppy."] },
  { id: "c257bf9c-3c2d-4cb0-a7fe-32105cd82399", examples: ["Hand in homework.", "Hand in resignation.", "Hand in the keys.", "Must hand in."] },
  { id: "c6a54b6b-ca12-4e8c-bc82-473242b6d3de", examples: ["Enclosure act.", "Secure enclosure.", "Bear enclosure.", "Letter enclosure."] },
  { id: "06ebe114-9129-4dcf-96e4-75369a9afaf2", examples: ["In a predicament.", "Solve the predicament.", "Awkward predicament.", "Facing a predicament."] },
  { id: "c67d7aea-b590-441a-90e0-b14cf8a6f316", examples: ["Produce saliva.", "Swallow saliva.", "Dog's saliva.", "Saliva test."] },
  { id: "a22fc544-bfa7-4a21-b728-501cc174fd70", examples: ["Release on parole.", "break parole.", "Parole officer.", "Denied parole."] },
  { id: "23c8a2e0-2157-4b46-851c-da4d0516d9ac", examples: ["Happy serendipity.", "Moment of serendipity.", "Life is serendipity.", "Found by serendipity."] },
  { id: "942a5df5-9b14-4e28-a60b-31687b865fc6", examples: ["Whereupon he left.", "Whereupon she laughed.", "Paused, whereupon.", "Agreed, whereupon."] },
  { id: "04619f11-4dd8-483b-a3a8-64203a027b28", examples: ["Crept in quietly.", "Crept up on him.", "Shadows crept.", "Crept out of bed."] },
  { id: "7e2cf614-dfd4-48ca-a9b1-083994978bdd", examples: ["Grueling test.", "Grueling journey.", "Grueling training.", "Grueling matchup."] },
  { id: "7e5bebc7-0a36-4d20-94b0-07d3b9740e29", examples: ["Second advent.", "Advent of war.", "Advent calendar.", "Welcome the advent."] },
  { id: "68f63483-0e03-4469-b942-00102e36f51c", examples: ["Chronic indecisiveness.", "Overcome indecisiveness.", "Costly indecisiveness.", "Showed indecisiveness."] },
  { id: "fad4af3e-901a-43a1-ae8f-8a859dced710", examples: ["Optimistic outlook.", "Feel optimistic.", "Optimistic forecast.", "Remain optimistic."] },
  { id: "0ec8ae90-a8a9-4050-93bd-4d8a477c74d5", examples: ["Scrambling for cover.", "Scrambling eggs.", "Scrambling up the hill.", "Voice scrambling."] },
  { id: "235b44c9-fbff-493a-911e-10e2dd43ea52", examples: ["Human fallibility.", "Admit fallibility.", "Proof of fallibility.", "Fallibility of memory."] },
  { id: "8cb5b1e7-c089-4115-be5b-de69df76318b", examples: ["Crowd dispersed.", "Clouds dispersed.", "Police dispersed rioters.", "Seeds dispersed."] },
  { id: "d0c72665-5ca0-49ed-86a3-d6c190adc885", examples: ["Don't mutter.", "Mutter to yourself.", "Heard a mutter.", "Mutter obscenities."] },
  { id: "f4d2dd04-7b9b-4d7c-9c75-5224355740c1", examples: ["Raise a ruckus.", "Noisy ruckus.", "What a ruckus.", "Keep the ruckus down."] },
  { id: "2b9f9692-5a7e-4509-8f57-99a0ad68fe06", examples: ["Nurture talent.", "Nature vs nurture.", "Nurture a plant.", "Nurture hope."] },
  { id: "a5145e8b-d0b7-4e1e-bc56-00ae11d24248", examples: ["Muttered low.", "Muttered a curse.", "She muttered.", "He muttered."] },
  { id: "98320fc7-f304-46d3-9908-b05ec9266b44", examples: ["Gangly teenager.", "Gangly movements.", "Tall and gangly.", "Gangly arms."] },
  { id: "a0224e1f-041b-4561-b897-aac467c1037e", examples: ["Soak the beans.", "Soak in the tub.", "Get a good soak.", "Rain will soak you."] },
  { id: "d685012b-fe99-4cee-8e8f-d9da4c60ad45", examples: ["Driven by fear.", "Driven mad.", "Driven piles.", "He is driven."] },
  { id: "49018d38-cff3-42c6-a45a-8d0f56c062b1", examples: ["Mouth puckering astringency.", "Astringency of tea.", "Remove astringency.", "High astringency."] },
  { id: "7ef1c2c0-838d-410d-a5be-8dda47533fb5", examples: ["Attempt to swindle.", "Swindle out of savings.", "Uncover a swindle.", "Insurance swindle."] },
  { id: "f955dffa-3a9a-4cb5-86cf-f0cfb75e4e5a", examples: ["Subservient attitude.", "Women were subservient.", "Subservient position.", "Remain subservient."] },
  { id: "b83a8aef-6230-4975-a223-7e1444c5aa6b", examples: ["Oppressive humid.", "Oppressive laws.", "Oppressive atmosphere.", "Find it oppressive."] },
  { id: "eed681c4-b804-4450-a68a-18de73d2cf4e", examples: ["Face flushed.", "Toilet flushed.", "Flushed with success.", "Looked flushed."] },
  { id: "35e1bc95-68db-4804-a67c-233c55a79a08", examples: ["Said indignantly.", "Replied indignantly.", "Stared indignantly.", "Snorted indignantly."] },
  { id: "10edc051-0764-4eac-bfb0-ad0715f7abad", examples: ["Quintessential movie.", "Quintessential experience.", "Be stereotypical and quintessential.", "Quintessential dish."] },
  { id: "fd122b5b-3987-4e3c-9947-e30d8a5a2566", examples: ["Impeccable service.", "Impeccable English.", "Room was impeccable.", "Look impeccable."] },
  { id: "7fdcabe3-fa38-4445-9b3f-709ae53ddbdb", examples: ["Police patrol.", "Patrol the border.", "On patrol.", "Night patrol."] },
  { id: "86549f89-5031-40b6-876f-6851186a11a1", examples: ["Cotton plantation.", "Sugar plantation.", "Plantation house.", "Work on plantation."] },
  { id: "2d19dd44-184d-4315-ac36-f8db36c5f2d4", examples: ["Such a prude.", "Called him a prude.", "Prude behavior.", "Not a prude."] },
  { id: "a1990419-755f-4451-a33c-0cab0aa20f73", examples: ["Is he hallucinating?", "Hallucinating from fever.", "Stop hallucinating.", "Hallucinating voices."] },
  { id: "2dc8f245-282b-4b0c-a819-6a0411bcfb9d", examples: ["Face paled.", "She paled.", "Paled in comparison.", "Paled at the news."] },
  { id: "456e76f5-a93e-4dd4-9f52-ebb51b78c714", examples: ["Murky water.", "Murky past.", "Murky depths.", "Details are murky."] },
  { id: "1db82164-b9a9-46de-a5af-37753c1ee44e", examples: ["Pull yourself together man.", "I must pull myself together.", "Tried to pull myself together.", "Tell him to pull himself together."] },
  { id: "d76e994e-5c5f-493e-9837-f1a397ae9ed2", examples: ["Make up for lost time.", "Make up for it.", "Can't make up for.", "Try to make up for."] },
  { id: "ebaab407-c339-43ca-be4e-b2ccb2a2ac8a", examples: ["Law firms.", "Business firms.", "Firms merged.", "Small firms."] },
  { id: "12cb9c4f-a869-40d1-9371-d7652964f40f", examples: ["Strode across the room.", "Strode confidently.", "Strode out.", "He strode."] },
  { id: "d60a4439-6fdb-4a42-8c45-ad0a2f0373a3", examples: ["Precursor to war.", "Chemical precursor.", "Important precursor.", "Serve as precursor."] },
  { id: "8e3b01b6-9c2b-4ad1-a088-5174cc38ffeb", examples: ["Meticulous care.", "Meticulous planning.", "Meticulous attention.", "Be meticulous."] },
  { id: "62de8545-8663-4625-b51b-f97c9a05ece4", examples: ["Obligator must pay.", "Joint obligator.", "Become obligator.", "Rights of obligator."] },
  { id: "e5d51ad9-5d19-4b9a-91cf-2c86312c637a", examples: ["Apprentice wizard.", "Plumber's apprentice.", "Apprentice contract.", "As an apprentice."] },
  { id: "bd5f028f-b150-4df0-9152-a1835bf09127", examples: ["Takes after dad.", "Takes after mom.", "Who does he take after?", "Takes after no one."] },
  { id: "1dd3048b-19e8-4112-89ed-7ee38cba7593", examples: ["Renegade pilot.", "Renegade tribe.", "Renegade nature.", "Hunt the renegade."] },
  { id: "b8130d06-7df9-41f3-ac23-19bfea7023e4", examples: ["Pondering the question.", "Pondering fate.", "Sat pondering.", "Worth pondering."] },
  { id: "db7869cc-15a0-49ca-94c8-1a207521618a", examples: ["Common rabble.", "Rabble rouser.", "Part of the rabble.", "Ignore the rabble."] },
  { id: "92e4459f-4b81-4fa1-9dcd-856940ee650d", examples: ["Retronasal olfaction.", "Retronasal smell.", "Retronasal flavor.", "Describe retronasal."] },
  { id: "667997b8-33e8-42bb-8aaf-ccafc822ecd4", examples: ["Sexual arousal.", "Arousal level.", "Causes arousal.", "Signs of arousal."] },
  { id: "54595e52-ef06-49b9-ae51-eb9da6b9bcc3", examples: ["Unadorned speech.", "Unadorned beauty.", "Leave it unadorned.", "Plain and unadorned."] },
  { id: "eae16b71-2f8d-4191-b79a-9adb005a97bd", examples: ["Morning mist.", "Thick mist.", "Mist clearing.", "Lost in mist."] },
  { id: "8e87f3e1-4dc0-499b-bb75-7fd6ad357256", examples: ["Wait with apprehension.", "Apprehension turns to relief.", "Full of apprehension.", "Sense of apprehension."] },
  { id: "e1faf7a6-5540-4fff-9f8c-51ffdfa2460f", examples: ["Condemns the attack.", "Condemns him.", "Report condemns.", "Everyone condemns."] },
  { id: "4b28d6d6-069b-4e9c-9d5e-79e8a40290ba", examples: ["Hollywood glamour.", "Add some glamour.", "Glamour model.", "Lost its glamour."] },
  { id: "17371966-4906-450d-a6cc-8d639adfef1c", examples: ["Leave a calling card.", "His calling card.", "Digital calling card.", "Unique calling card."] },
  { id: "a32bbccc-dc38-4c12-a37b-647976d4e0bc", examples: ["French aristocracy.", "Member of aristocracy.", "Wealthy aristocracy.", "Fall of aristocracy."] },
  { id: "bdad399f-3669-400f-813b-81241318d96c", examples: ["Put up with it.", "Put up with him.", "Can't put up with.", "Hard to put up with."] },
  { id: "d3945ca8-d2d4-46e5-9c43-2b021cf646f4", examples: ["Can't walk, let alone run.", "Let alone afford it.", "Wouldn't hurt a fly, let alone a person.", "Hard to read, let alone understand."] },
  { id: "bb185a7c-487c-4084-a409-9187cb828eee", examples: ["It is beyond your control.", "A force beyond your control.", "Situation beyond your control.", "Accept what is beyond your control."] },
  { id: "0783d8e9-04de-4f46-b063-ca0050f39ba8", examples: ["Worthwhile cause.", "Worthwhile effort.", "Make it worthwhile.", "Prove worthwhile."] },
  { id: "a4e1311e-2070-488c-afdd-607877412a07", examples: ["Conjugate Latin verbs.", "Difficult to conjugate.", "Conjugate acid.", "Conjugate base."] },
  { id: "1173d555-902e-4ecf-92c2-6195409afc07", examples: ["Refurbish the house.", "Refurbish furniture.", "Plan to refurbish.", "Newly refurbish."] },
  { id: "88afdf16-d15f-4654-b819-b9645cec3291", examples: ["Attempt to strangle.", "Strangle the opposition.", "Strangle weeds.", "Don't strangle."] },
  { id: "8876c744-5ec7-434b-9c28-96bd9014731c", examples: ["Daily drudgery.", "Escape drudgery.", "Domestic drudgery.", "Pure drudgery."] },
  { id: "54f52623-2ee4-4ab1-94d2-0d6f48fa17c8", examples: ["Black cloak.", "Invisibility cloak.", "Cloak of secrecy.", "Wrapped in a cloak."] },
  { id: "bc442529-6247-4c59-914a-5af31769530f", examples: ["Pair of slacks.", "Wear slacks.", "Iron these slacks.", "Grey slacks."] },
  { id: "9bba2a63-e312-46ba-96d8-dd98dea69345", examples: ["In remembrance of him.", "Do this in remembrance of me.", "Service in remembrance of.", "Held in remembrance of."] },
  { id: "98c509de-63c8-4c18-a883-74f62898f978", examples: ["Stab at the answer.", "Stab at the dark.", "Stab at painting.", "Have a stab at."] },
  { id: "23aa1037-b094-44ef-ade9-61964297916b", examples: ["Attend a congress.", "Member of Congress.", "Party congress.", "Medical congress."] },
  { id: "20054a0a-1489-4d99-a7a6-0fe99987d7b3", examples: ["Stopped abruptly.", "Left abruptly.", "Ended abruptly.", "Turned abruptly."] },
  { id: "832f6dd3-25e1-48e5-8194-f87de6b1ac09", examples: ["Memorable occasion.", "Memorable trip.", "Make it memorable.", "Truly memorable."] },
  { id: "85f4c954-0880-4604-8d58-1aa353e98ec6", examples: ["Slice up the pie evenly.", "Slice up the pie for dessert.", "Let's slice up the pie.", "Slice up the pie carefully."] },
  { id: "62146f46-7977-4c9f-9803-be34e3bec2bd", examples: ["Heated debate.", "Open to debate.", "Win the debate.", "Debate club."] },
  { id: "4d64c2f1-9059-438a-98ac-604d8651ccfa", examples: ["Tenacious grip.", "Tenacious defense.", "Tenacious reporter.", "Be tenacious."] },
  { id: "4218609e-75fc-4682-8cd2-0070b05d1bac", examples: ["Shirk responsibility.", "Don't shirk responsibility.", "He shirks responsibility.", "Accused of shirking responsibility."] },
  { id: "956c372b-33dc-405d-889d-34286da1539b", examples: ["War atrocity.", "Commit an atrocity.", "Shocking atrocity.", "Atrocity crimes."] },
  { id: "17f655be-1538-4f22-9e79-c0c623d9ed1d", examples: ["None whatsoever.", "No doubt whatsoever.", "Nothing whatsoever.", "Any reason whatsoever."] },
  { id: "66347c78-1867-4624-a60d-3619e398e7f5", examples: ["End the charade.", "It's a charade.", "Play charades.", "Cruel charade."] },
  { id: "398a8808-ac92-4202-a41d-1d4b311c1ef9", examples: ["That's a bummer.", "It's a real bummer.", "Oh, that's a bummer.", "What a bummer."] },
  { id: "d89a26f8-8824-4d20-b879-395a76339d7b", examples: ["Leaping into action immediately.", "Saw him leaping into action.", "Ready for leaping into action.", "Leaping into action to save."] },
  { id: "27d547c6-2da5-4b77-8901-74560457aff6", examples: ["Camp concentration.", "Lose concentration.", "Deep concentration.", "Concentration of wealth."] },
  { id: "03998000-29ab-4d24-ac15-2d87ef2249f0", examples: ["Financial incentive.", "Great incentive.", "No incentive.", "Incentive program."] },
  { id: "17d42a50-f857-4c5a-982d-6670664a08b7", examples: ["Soothing voice.", "Soothing bath.", "Find it soothing.", "Soothing words."] },
  { id: "55843edc-da78-4f76-809f-721e9a3fe6ee", examples: ["Crouch down.", "Defensive crouch.", "Crouch low.", "Make him crouch."] },
  { id: "91e59bfb-9799-46f6-9d4d-96ecf4e7458d", examples: ["Possession of controlled substance.", "List of controlled substances.", "Is it a controlled substance?", "Prescribe controlled substance."] },
  { id: "85796349-e6ec-45bd-be9c-d55ed1889205", examples: ["Resist temptation.", "Give in to temptation.", "Great temptation.", "Temptation to steal."] },
  { id: "33310ff8-2c91-48b9-aaf6-8080dea4c5f4", examples: ["Fouling up the plan.", "Fouling up the engine.", "Stop fouling up.", "Keeps fouling up."] }
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
