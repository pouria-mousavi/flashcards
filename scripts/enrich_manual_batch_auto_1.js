
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

const batch = [
  { id: "779c56d1-a389-4516-be0d-ddf2f3c7e54b", examples: ["Since 2010, revenue has increased threefold.", "The problem is threefold.", "We need a threefold increase in production.", "There was a threefold rise in cases."] },
  { id: "557878dd-828f-4a30-9174-e286ee32918d", examples: ["Obesity is a major health problem.", "Rates of obesity have risen globally.", "Childhood obesity is a concern.", "Diet and exercise help prevent obesity."] },
  { id: "d63e9b1d-4d93-4380-b742-f63353556e4d", examples: ["The movie's depiction of war was brutal.", "A realistic depiction of daily life.", "Her depiction of the character was flawed.", "This painting is a depiction of spring."] },
  { id: "fc627360-606e-41bf-a76b-b3b243ba52aa", examples: ["The river was full of toxic sludge.", "The car got stuck in the sludge.", "Industrial sludge polluted the lake.", "We waded through the thick sludge."] },
  { id: "1973776b-52c9-4bbf-9b31-4c4bd996ce98", examples: ["The band is in rehearsal for their tour.", "Dress rehearsal starts at 6 PM.", "We need one more rehearsal.", "The play improved after rehearsal."] },
  { id: "781283ae-46fb-4612-ac0e-5c551c484437", examples: ["Ideally, the tax cut will make families better off.", "You'd be better off without him.", "They are better off moving to the city.", "I am better off alone."] },
  { id: "e538882c-1171-487b-acc7-1ddc9ca3bf73", examples: ["She has a legitimate reason for being late.", "Is this a legitimate business?", "It was a legitimate question.", "He is the legitimate heir."] },
  { id: "278db657-c7d7-45c2-99ab-48899b7c1043", examples: ["Stop inflicting pain on yourself.", "They were accused of inflicting suffering.", "Inflicting damage on the enemy.", "The storm is inflicting heavy damage."] },
  { id: "a2f1d868-ba47-4206-8848-9cb9215277a8", examples: ["I don't want to be a burden to you.", "The burden of proof is on the prosecution.", "He carried a heavy burden.", "Financial burden caused stress."] },
  { id: "95ab9cd8-2942-458e-9042-a5027f05922c", examples: ["You can opt out of the newsletter.", "She decided to opt out of the trip.", "Most employees chose to opt out.", "You check the box to opt out."] },
  { id: "3823a30a-9a64-49fa-ac3a-2e2c938f8d5a", examples: ["The area was deemed unsafe.", "I deem it an honor to serve.", "He deemed it necessary to leave.", "The plan was deemed a success."] },
  { id: "535c7ef9-743d-48d9-8c30-f8678f281d64", examples: ["He argued against the religious dogmatists.", "She ignored the political dogmatists.", "Dogmatists refuse to change their minds.", "Don't be a dogmatist."] },
  { id: "a27d8e25-83ff-44d8-b3d1-af7d4f59e79e", examples: ["The dictator was reviled by his people.", "He was a reviled figure.", "They reviled the corrupt politician.", "Being reviled by the media hurt him."] },
  { id: "34a0d829-f02c-47e2-8598-9f13ea7239ac", examples: ["She has such an endearing smile.", "His clumsiness is quite endearing.", "An endearing quality.", "The puppy was very endearing."] },
  { id: "12ae3659-06ff-4219-8bb3-3973170b34ed", examples: ["He is a notorious criminal.", "The city is notorious for traffic.", "A notorious liar.", "She is notorious for being late."] },
  { id: "9ba88484-1969-4268-a6e2-12499d8cf59e", examples: ["It is inconceivable that he lost.", "The idea is utterly inconceivable.", "An inconceivable amount of money.", "For me, failure is inconceivable."] },
  { id: "050917d1-4fcf-466e-9600-5e238828fd5d", examples: ["His story sounds plausible.", "A plausible explanation.", "Is it plausible that aliens exist?", "She gave a plausible excuse."] },
  { id: "04c7166b-48ae-4026-b367-d6e2ba1b4d2f", examples: ["The castle is under attack.", "His reputation is under attack.", "We came under attack at dawn.", "The policy is under attack by critics."] },
  { id: "95c2de90-e4fa-4187-b05b-8cbaeadfcc0b", examples: ["The proposal is still under discussion.", "This matter is under discussion.", "Is the budget under discussion?", "The topic is currently under discussion."] },
  { id: "e33e6161-f931-4f17-a6e1-b556518cd5a3", examples: ["Electricity will electrify the wire.", "Please clarify your statement.", "Can you identify the bird?", "He used a story to exemplify the point."] },
  { id: "fe79bf24-50eb-4042-ba34-0f56b38aa04d", examples: ["We need to modernize the system.", "Let's finalize the deal.", "Trying to socialize more.", "Please itemize the expenses."] },
  { id: "4b9b20c9-33cb-489b-b26d-d727b3f69280", examples: ["The meat is undercooked.", "They are underpaid for their work.", "An undeveloped area.", "The house was unsold for months."] },
  { id: "62263ac0-00ff-4324-89bb-c2093b8f2670", examples: ["Helping underprivileged children.", "He came from an underprivileged background.", "Programs for the underprivileged.", "Providing education to the underprivileged."] },
  { id: "8962ba7e-f673-424a-af7f-4435d606e38e", examples: ["Don't overemphasize the risks.", "Don't overload the socket.", "The truck was overloaded.", "He tends to overemphasize small details."] },
  { id: "2af725dc-48af-4543-a029-3f2b0f8c85d2", examples: ["He took an overdose of pills.", "Drug overdose is dangerous.", "Don't overdose on vitamins.", "She survived the overdose."] },
  { id: "114c7a35-c0ae-4856-9150-392fe28c37f2", examples: ["That movie is overrated.", "I think he is an overrated actor.", "The restaurant was overrated.", "Don't buy the overrated product."] },
  { id: "06a342f9-b512-42da-81dc-0ec09316148a", examples: ["She was prescribed anti-depressants.", "Taking anti-depressants for anxiety.", "Side effects of anti-depressants.", "He stopped taking his anti-depressants."] },
  { id: "6b68f422-c128-48d2-874e-114088cc33fe", examples: ["Install anti-virus software.", "Support anti-racism movements.", "An anti-drugs policy.", "Anti-virus protection is essential."] },
  { id: "14a822e1-1b33-4e35-9171-8c6f9776e734", examples: ["Cars depreciate over time.", "The currency depreciated rapidly.", "Don't depreciate his efforts.", "Equipment depreciates in value."] },
  { id: "234bbfef-af2c-473f-9855-7a9359efe204", examples: ["They want to decentralize power.", "The news might destabilize the region.", "I drink decaffeinated coffee.", "Decentralize the management."] },
  { id: "25c53159-7ec1-42d7-8112-08d38ff71e83", examples: ["The village became depopulated.", "War depopulated the area.", "A depopulated landscape.", "The disease depopulated the herd."] },
  { id: "1b854791-6a26-4b62-95aa-16b2d2ec4db2", examples: ["He had to rewrite the essay.", "Trying to reinvent herself.", "Let me retell the story.", "Reconstruct the crime scene."] },
  { id: "99eaf3f3-78b7-4615-b1f4-56d4a99b816d", examples: ["We stopped to refuel.", "Refuel the airplane.", "Need to refuel my energy.", "The car needs to refuel soon."] },
  { id: "bd0070dc-bbec-4a3a-9423-721a2bea9112", examples: ["It was an ill-advised decision.", "An ill-advised comment.", "Going there was ill-advised.", "Avoid the ill-advised plan."] },
  { id: "3e9bd860-4db2-4542-8326-9d13adf324cd", examples: ["The animal was ill-treated.", "He claimed he was ill-treated.", "Ill-treated prisoners.", "Don't let them be ill-treated."] },
  { id: "707d4dda-3b7a-4c28-bf9b-c10cf58897d9", examples: ["The problems are interrelated.", "Everything is interrelated.", "Interrelated events.", "Our economies are interrelated."] },
  { id: "73238396-a356-41ed-af2c-e0190ceaa9ad", examples: ["We are all interdependent.", "An interdependent relationship.", "Global trade is interdependent.", "Systems are mutually interdependent."] },
  { id: "b33269fb-fbeb-4297-9e8c-b9f637c96938", examples: ["Don't mistreat animals.", "He tends to mistreat his staff.", "Did they mistreat you?", "Never mistreat a friend."] },
  { id: "c5dd6f7f-35b8-4d67-b325-967af1ffe764", examples: ["Don't misinform the public.", "I was misinformed about the time.", "He tried to misinform us.", "Sorry if I misinformed you."] },
  { id: "79d8c40e-918c-4924-aeba-99e50129c1b7", examples: ["Doctors can misdiagnose symptoms.", "He was misdiagnosed with flu.", "Don't misdiagnose the problem.", "Likely to misdiagnose the issue."] },
  { id: "d717ebb9-47f4-419b-b051-6e3a7e4b94ee", examples: ["I seem to have mislaid my keys.", "She mislaid her phone.", "Don't mislay important papers.", "He often mislays his glasses."] },
  { id: "a26ccbf6-9c95-4c85-83ed-b205731ac3be", examples: ["They mismanaged the funds.", "Don't mismanage your time.", "The project was mismanaged.", "He mismanaged the team."] },
  { id: "54e5667e-3df8-42a8-a987-c08fc0337301", examples: ["I love DIY projects.", "A DIY repair job.", "He is good at DIY.", "Buy a DIY kit."] },
  { id: "505cc71b-6098-455a-964f-4647f9195b36", examples: ["She needs some TLC.", "The house needs a little TLC.", "Give your car some TLC.", "Prepared with TLC (Tender Loving Care)."] },
  { id: "74fb5aa0-6128-4287-a994-75dd9abd46f5", examples: ["He has a high IQ.", "What is your IQ score?", "An IQ test.", "Intelligence isn't just IQ."] },
  { id: "5a64263d-786b-4e69-b6cc-8ece109a75d1", examples: ["What is your ETA?", "The ETA is 5 PM.", "Send me your ETA.", "ETA: 10 minutes."] },
  { id: "1546dc3b-37e4-4fd5-b0df-f104b7f5dd3b", examples: ["The company HQ is in London.", "Contact HQ for orders.", "Report to HQ.", "They moved to a new HQ."] },
  { id: "2fd701ec-7478-40a7-8bba-f68e68fa5aab", examples: ["That joke wasn't very PC.", "Political Correctness (PC).", "He tries to be PC.", "Is it PC to say that?"] },
  { id: "152c7206-2abb-46aa-977c-46f569325883", examples: ["She is the CEO of the company.", "The CEO made a statement.", "Meeting with the CEO.", "He became CEO last year."] },
  { id: "abff8caa-687b-492e-a262-6f1755e9cc2e", examples: ["Captured on CCTV.", "CCTV cameras are everywhere.", "Check the CCTV footage.", "Installed a new CCTV system."] }
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
