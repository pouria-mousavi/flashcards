
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

const batch = [
  { id: "dd8612b6-fe76-4a93-9535-86afe0b3e3bf", examples: ["Use a can opener.", "Electric can opener.", "Broken can opener.", "Need a can opener."] },
  { id: "7b879189-2bd3-4525-9016-325a361afba9", examples: ["Trust your gut feeling.", "I had a gut feeling.", "Gut feeling was right.", "Go with your gut feeling."] },
  { id: "899ea962-98f7-42b2-ac41-9e237e2392cc", examples: ["Cost-effective solution.", "Is it cost-effective?", "More cost-effective.", "Cost-effective method."] },
  { id: "ccde2aef-0f86-4fea-a13a-f3f0d2455836", examples: ["Impromptu speech.", "Impromptu meeting.", "Impromptu party.", "Decision was impromptu."] },
  { id: "391575e6-2c51-4244-b581-86d8b17278c3", examples: ["Hold a grudge.", "Don't bear a grudge.", "Old family grudge.", "Nurse a grudge."] },
  { id: "2d2ea017-d1f5-4abb-8bc5-5112b6c2abe3", examples: ["Joint venture.", "Business venture.", "New venture.", "Risky venture."] },
  { id: "7bf90f84-9479-4472-8c25-4b09a12a1efa", examples: ["Mental bandwidth.", "Network bandwidth.", "Not enough bandwidth.", "Increase bandwidth."] },
  { id: "26459dda-8b4a-4ab6-85f0-28fd57527cab", examples: ["Scientific breakthrough.", "Major breakthrough.", "Make a breakthrough.", "Breakthrough discovery."] },
  { id: "ef413ba2-3d12-4f9b-b3cd-30b3e2e6c282", examples: ["Meeting with stakeholders.", "Key stakeholders.", "Stakeholders agreed.", "Benefit stakeholders."] },
  { id: "09fba4ba-7558-4a77-8a5c-3c6ca0495a08", examples: ["The bottom line is...", "Affect the bottom line.", "Improve the bottom line.", "Focus on the bottom line."] },
  { id: "0201017d-f0ad-4e17-ba58-50d623c4c606", examples: ["Resilient economy.", "Resilient person.", "Remain resilient.", "More resilient."] },
  { id: "00836b31-8646-4d88-937d-d0e76c892121", examples: ["Adapt to change.", "Hard to adapt.", "Adapt quickly.", "Adapt or die."] },
  { id: "baec3ac8-17ba-4d87-aafc-a1e9bcbf0d5b", examples: ["Reach a compromise.", "No compromise.", "Compromise solution.", "Refuse to compromise."] },
  { id: "e52eb3ea-e667-4f80-a201-bacda710d29d", examples: ["Coherent argument.", "Coherent policy.", "Lack coherent strategy.", "Sound coherent."] },
  { id: "480dc2c7-247e-405f-8462-13126c922c46", examples: ["Scarce resources.", "Food was scarce.", "Make yourself scarce.", "Scarce commodity."] },
  { id: "ad8de8b8-5895-4085-a242-461e0cbeb5e5", examples: ["Abundant wildlife.", "Abundant supply.", "Abundant evidence.", "Life is abundant."] },
  { id: "bc2f6a94-21fb-4c89-8406-800a27188f1c", examples: ["Mitigate the risk.", "Mitigate damage.", "Mitigate the effects.", "Plan to mitigate."] },
  { id: "95f2373d-3fa1-4c25-bce5-b20c7b4ff297", examples: ["Avoid ambiguity.", "Full of ambiguity.", "Clarify ambiguity.", "Ambiguity in law."] },
  { id: "c86f60ca-49fa-4d12-b26c-7b570646db93", examples: ["Market liquidity.", "Lack of liquidity.", "Liquidity crisis.", "Improve liquidity."] },
  { id: "a702f8c6-76ae-4f9e-a6f0-6e5197f1a3f1", examples: ["Bearish market.", "Bearish sentiment.", "Feeling bearish.", "Bearish trend."] },
  { id: "0934d551-9a66-45d6-a9b0-a6149e6077da", examples: ["Calculate break-even point.", "Reach break-even point.", "Below break-even point.", "Estimated break-even point."] },
  { id: "fdc5c308-04f2-4a75-b342-98af735c7eb9", examples: ["Outsourcing jobs.", "IT outsourcing.", "Benefits of outsourcing.", "Outsourcing contract."] },
  { id: "9ecffae7-dcaa-49e6-bbdb-29fe3e09db4e", examples: ["High profit margin.", "Low profit margin.", "Increase profit margin.", "Gross profit margin."] },
  { id: "70a00c25-652a-42ad-bd50-b1dc76f99edb", examples: ["Articulate speaker.", "Articulate your thoughts.", "Highly articulate.", "Hard to articulate."] },
  { id: "66a3497d-ddee-4865-be5b-fe869a6c6a8c", examples: ["Scalable business.", "Scalable solution.", "Highly scalable.", "Not scalable."] },
  { id: "a6afa935-7de0-45ad-bf30-b3af259aca08", examples: ["Impeccable behavior.", "Impeccable timing.", "Impeccable taste.", "Look impeccable."] },
  { id: "e6b74d55-3f11-4227-9ec9-e403511a6a04", examples: ["Insidious disease.", "Insidious effect.", "Insidious enemy.", "Insidious growth."] },
  { id: "d644859b-fac2-4f9d-8591-c2d09c362222", examples: ["Cumbersome process.", "Cumbersome equipment.", "Feel cumbersome.", "Too cumbersome."] },
  { id: "dc262bfb-43ff-4fcb-908c-443bc9cbbfcd", examples: ["Meticulous research.", "Meticulous detail.", "Be meticulous.", "Meticulous work."] },
  { id: "48716fef-9486-4fc6-b1d8-25bd16d85b22", examples: ["Evocative music.", "Evocative language.", "Highly evocative.", "Evocative of the past."] },
  { id: "6ab5f5e2-063e-446c-a6cf-4266913ac84d", examples: ["Indigenous people.", "Indigenous species.", "Indigenous language.", "Indigenous culture."] },
  { id: "3a695088-327c-4eba-9733-57ade8ef813a", examples: ["Ubiquitous technology.", "Become ubiquitous.", "Seem ubiquitous.", "Ubiquitous presence."] },
  { id: "4b7a10d1-f12f-4da4-b442-8a5cef5185ca", examples: ["Superfluous information.", "Superfluous words.", "Detail was superfluous.", "Remove superfluous items."] },
  { id: "0f6286cd-0c8e-484f-ab6b-b605d610c18f", examples: ["Ambivalent feeling.", "Ambivalent about it.", "Remain ambivalent.", "Ambivalent attitude."] },
  { id: "2f5f7ad9-375e-4e34-bee5-27f8863941c1", examples: ["Pivotal moment.", "Pivotal role.", "Pivotal decision.", "Pivotal point."] },
  { id: "8077cc6b-0659-4b5e-8555-e610ac7f5957", examples: ["It is a paradox.", "Resolve the paradox.", "Seeming paradox.", "Logical paradox."] },
  { id: "e74f1d73-96bf-4cae-a235-ecaf2263f168", examples: ["Ephemeral beauty.", "Ephemeral nature.", "Ephemeral fame.", "Life is ephemeral."] },
  { id: "253ccf02-62b4-40c6-af7c-2a1843465966", examples: ["Feel empathy.", "Lack of empathy.", "Show empathy.", "Empathy for others."] },
  { id: "b5397414-e109-4d0c-8805-c1a8256ee2f0", examples: ["Apathetic voters.", "Feel apathetic.", "Apathetic response.", "Don't be apathetic."] },
  { id: "3c86168e-b4cc-40b6-adba-2e851337375d", examples: ["Versatility of the tool.", "Show versatility.", "Great versatility.", "Actor's versatility."] },
  { id: "cdfad4e8-7129-4f44-aab4-eeec75f2da17", examples: ["Through perseverance.", "Requires perseverance.", "Perseverance pays off.", "Test of perseverance."] },
  { id: "03e6c383-cff1-4c8c-bb8c-9ba116175227", examples: ["Act of altruism.", "Pure altruism.", "Motivated by altruism.", "Reciprocal altruism."] },
  { id: "75496ce7-909b-4d38-9b3d-ba92e1dd7577", examples: ["Man of integrity.", "Question his integrity.", "Professional integrity.", "Maintain integrity."] },
  { id: "801e3805-d4c7-4977-9274-1fd8e4c13b0b", examples: ["Shrill voice.", "Shrill cry.", "Sounded shrill.", "Shrill tone."] },
  { id: "5591a348-3402-4e29-bc30-41846378e4f0", examples: ["Dazzling light.", "Dazzling performance.", "Dazzling smile.", "Looked dazzling."] },
  { id: "6a10ed95-a0c2-466f-a3ba-bafbef6249d6", examples: ["Deafening noise.", "Deafening silence.", "Deafening roar.", "Become deafening."] },
  { id: "ab3aa05c-e1f2-45b4-b861-1012d5ad2e9e", examples: ["Pungent smell.", "Pungent spices.", "Pungent sauce.", "Taste was pungent."] },
  { id: "0415becf-be83-4807-b3e4-b060e100b1d8", examples: ["Opaque glass.", "Opaque process.", "Finances are opaque.", "Become opaque."] },
  { id: "55bf24e4-6d46-4704-a033-f9a5ec77134e", examples: ["Fragile goods.", "Fragile ego.", "Fragile peace.", "Handle fragile items."] },
  { id: "cbd545da-f522-43e2-87d9-ef43afc8d53a", examples: ["Transparent glass.", "Transparent process.", "Be transparent.", "Transparent lies."] },
  { id: "2fee88dc-d267-43eb-b83e-27c7248feba1", examples: ["Delicate flower.", "Delicate situation.", "Delicate operations.", "Delicate balance."] },
  { id: "98fa00a5-c0e7-4376-bbf3-11f1b24f9f93", examples: ["Coarse sand.", "Coarse language.", "Coarse texture.", "Coarse fabric."] },
  { id: "90942936-20f2-44d7-84c2-593fe2608d4e", examples: ["Clumsy waiter.", "Clumsy mistake.", "Feel clumsy.", "Clumsy attempt."] },
  { id: "f32df88c-1b47-419b-a7b6-8fc379978eb0", examples: ["Timid child.", "Timid knock.", "Don't be timid.", "Timid response."] },
  { id: "d5c68619-9225-4a15-9e35-b073b648436c", examples: ["Inquisitive mind.", "Inquisitive nature.", "Looked inquisitive.", "Inquisitive child."] },
  { id: "c6631526-f07f-4cb9-831f-48eea9ee4e2f", examples: ["Bold decision.", "Bold colors.", "Be bold.", "Bold move."] },
  { id: "27f67876-af32-4f5d-a2a0-becb0bbefe96", examples: ["Cautious optimism.", "Be cautious.", "Cautious approach.", "Cautious driver."] },
  { id: "97fad2f4-e1fc-4515-ab87-1855a5fb0c9a", examples: ["Optimistic view.", "Feel optimistic.", "Cautiously optimistic.", "Optimistic projected."] },
  { id: "4cffae0b-e7b3-448c-9cc9-88a23a89d42c", examples: ["Feel nostalgia.", "Pure nostalgia.", "Wave of nostalgia.", "Nostalgia kick."] },
  { id: "73271777-4c02-41fa-b280-f2b4fdae66d5", examples: ["Cynical view.", "Don't be cynical.", "Cynical smile.", "Cynical world."] },
  { id: "458a62aa-06b7-4b94-9dfa-e38f5a3b5e55", examples: ["Pessimistic thoughts.", "Pessimistic person.", "Sound pessimistic.", "Highly pessimistic."] },
  { id: "ecf3a4f4-d07f-40bd-ae1b-6889631cc6dc", examples: ["Deep regret.", "Regret the decision.", "Live with regret.", "Express regret."] },
  { id: "d6c241a1-96f7-4fbc-80b4-afbfc8e44bc0", examples: ["Feel remorse.", "Show remorse.", "No remorse.", "Overcome with remorse."] },
  { id: "68a230f4-8f00-4c76-bfbd-10e72340ac2a", examples: ["Loathe broccoli.", "I loathe him.", "Loathe to admit.", "Loathe injustice."] },
  { id: "8916ac7d-431b-4b6d-ab27-a3264c6002e6", examples: ["Computer is freezing.", "App keeps crashing.", "Screen freezing.", "System crashing."] },
  { id: "629e4e07-f9c5-4b3c-9a7f-a5ac64a37374", examples: ["Phone is breaking up.", "You are breaking up.", "Breaking up bad.", "Signal breaking up."] },
  { id: "4a573545-f0e7-4aaf-a407-f6491facc69b", examples: ["Put me on hold.", "Put project on hold.", "Put plans on hold.", "Can I put you on hold?"] },
  { id: "de5ae042-54a6-415b-bd8e-85dc7161f28e", examples: ["Drinks are on me.", "It's on me.", "Dinner is on me.", "This round is on me."] },
  { id: "c8cca060-2992-4b39-bfd4-accc83822a06", examples: ["I insist.", "If you insist.", "Insist on paying.", "Insist on truth."] },
  { id: "1a24078c-bb2c-4cd5-818c-12172659c40f", examples: ["Rush hour traffic.", "During rush hour.", "Avoid rush hour.", "Morning rush hour."] },
  { id: "8748d39a-297b-404a-8ab7-eb110765287c", examples: ["Don't flake.", "He bailed on us.", "Friend is a flake.", "Bail on plans."] },
  { id: "484998a4-7849-4fc8-b92a-1fc024719674", examples: ["Blow off steam.", "Blow off the meeting.", "He blew me off.", "Don't blow off work."] },
  { id: "fe1c87f1-31b1-4cd6-b21a-3aa4c3e2003c", examples: ["Traffic is moving slow.", "At least traffic is moving.", "Traffic is moving now.", "Hope traffic is moving."] },
  { id: "12b8582b-89fc-481e-bd75-12d5fc4b7d69", examples: ["Traffic gridlock.", "Complete gridlock.", "Political gridlock.", "Stuck in gridlock."] },
  { id: "39f827c5-d8a8-4223-9c40-5aad27895f9b", examples: ["Back up the car.", "Reverse the vehicle.", "Could not back up.", "Put in reverse."] },
  { id: "ca064a8b-27e2-4640-a881-2944ef63c954", examples: ["Can you parallel park?", "Parallel park the car.", "Hate to parallel park.", "Hard to parallel park."] },
  { id: "6f77c09e-65f4-4c1f-ad41-1a03c9e2f617", examples: ["Take a quick nap.", "Doze off in class.", "Need a nap.", "Doze off watching TV."] },
  { id: "26036a41-1fe4-4e6a-8edf-84a667085e93", examples: ["I'm an early bird.", "Early bird special.", "Early bird gets the worm.", "Not an early bird."] },
  { id: "0ffde16a-8496-4ae2-8553-d1fff91932d0", examples: ["Lose appetite when sick.", "Made me lose appetite.", "Did you lose appetite?", "Completely lose appetite."] },
  { id: "90fccac1-78b8-46f6-a2de-9ecbe4b06e6b", examples: ["Don't oversleep.", "I did oversleep.", "Tendency to oversleep.", "Oversleep and miss work."] },
  { id: "d14deffd-4f5e-4bb6-852f-7cb216c2e68e", examples: ["Suffer from insomnia.", "Mild insomnia.", "Causes insomnia.", "Cure for insomnia."] },
  { id: "31cb22bb-b9f7-4c78-889d-7c7808273be9", examples: ["I am a night owl.", "Night owl lifestyle.", "Night owl habits.", "Being a night owl."] },
  { id: "ed7b9d85-01bc-4c1a-9a9e-2856702e64ea", examples: ["Where is the restroom?", "Use the restroom.", "Public restroom.", "Clean restroom."] },
  { id: "544c468e-7e78-4e2b-b42e-06df3fa7ef60", examples: ["Feel nauseous.", "Nauseous smell.", "Made me nauseous.", "Nauseous journey."] },
  { id: "284a0970-b906-4b8b-855c-c3820bcd582b", examples: ["Milk will expire.", "Food go bad.", "Did it expire?", "Watch it go bad."] },
  { id: "c11180ef-e42c-458f-bec8-ea85b4e723b0", examples: ["Moldy bread.", "Smell moldy.", "Moldy cheese.", "Looks moldy."] },
  { id: "1c6860c9-7a4b-4c4b-93f2-82da3e53726a", examples: ["Need to go on a diet.", "Strict diet.", "Go on a diet tomorrow.", "Best diet."] },
  { id: "41643376-acaf-4224-8292-58bb44ef5c0d", examples: ["Don't overeat.", "Binge eating.", "Tend to overeat.", "Binge watch."] },
  { id: "bc3d07a5-f3ef-432c-b52b-84ef20c6583f", examples: ["Feel dizzy.", "Dizzy spell.", "Looked dizzy.", "Dizzy heights."] },
  { id: "a50ca1f5-cc14-4867-8a84-7efe354a0794", examples: ["Contagious laughter.", "Highly contagious.", "Contagious disease.", "Is it contagious?"] },
  { id: "8cc56c2e-a7a0-4dc3-bcb5-d6e62366d433", examples: ["Make a doctor appointment.", "Make an appointment.", "Miss appointments.", "Appointment time."] },
  { id: "d8870aae-9349-46b2-a324-53181ea69c67", examples: ["Severe pain.", "Acute infection.", "Severe weather.", "Acute angle."] },
  { id: "ccb518e4-4b58-4cdb-a874-ef10b185810d", examples: ["Mild symptoms.", "Mild curry.", "Mild weather.", "Mild interest."] },
  { id: "9d7ea8c3-83da-4aeb-8b0e-9031ea93c5ad", examples: ["Prescription side effects.", "No side effects.", "Common side effects.", "Severe side effects."] },
  { id: "a46cf06d-93b1-4e69-a964-83c810e836c4", examples: ["Get a prescription.", "Fill a prescription.", "Doctor's prescription.", "Prescription glasses."] },
  { id: "2c453ead-97fe-4d64-a1d4-c046193aa079", examples: ["Mundane task.", "Mundane life.", "Mundane job.", "Feeling mundane."] },
  { id: "2a785eb9-6680-4088-ab2c-c082ae8e1880", examples: ["Gullible person.", "Don't be gullible.", "So gullible.", "Gullible tourists."] },
  { id: "afd3eb5b-c990-4b20-b5fa-4bca379137f4", examples: ["It's ironic.", "Ironic twist.", "Ironic smile.", "Life is ironic."] },
  { id: "6f894fb3-c9a8-4d19-a72a-8c1a71d2c04e", examples: ["Looked overjoyed.", "Overjoyed to see you.", "Overjoyed parents.", "Felt overjoyed."] },
  { id: "6bdd6888-14d5-4dfd-a923-63138ef0dc73", examples: ["Bland food.", "Bland taste.", "Bland personality.", "It tasted bland."] }
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
