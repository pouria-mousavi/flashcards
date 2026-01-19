
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

// Batch 8 (Indices 0-49 of new strict_batch.json)
const batch = [
  { id: "b922958d-f9e4-4f4a-911d-5ed26367d353", examples: ["If we pool our resources, we can buy a boat together.", "Let's pool our resources and share the cost.", "Pooling resources is more efficient.", "We pooled our resources for the project."] },
  { id: "241d0372-a020-44ff-b966-523c18eb7cf2", examples: ["The new proposal helped break the deadlock.", "They finally broke the deadlock after hours of negotiation.", "We need someone to break the deadlock.", "Breaking the deadlock was difficult."] },
  { id: "95623bfc-6f02-4d9a-a0a4-3a50d01cbf00", examples: ["My donation is just a drop in the ocean.", "A few volunteers is a drop in the ocean.", "That money is a drop in the ocean compared to what we need.", "It seems like a drop in the ocean."] },
  { id: "b87f9b51-50c6-4abe-aecb-5ee8afce2814", examples: ["Apply for it; you have nothing to lose.", "I have nothing to lose by trying.", "With nothing to lose, he took the risk.", "She had nothing to lose."] },
  { id: "53f1fc8e-84fe-4a1a-a312-09769a113a0f", examples: ["His victory was a foregone conclusion.", "It's a foregone conclusion that she'll win.", "The result was a foregone conclusion.", "Not a foregone conclusion yet."] },
  { id: "555f11b2-eca4-4ec6-8ba0-5afc979d678f", examples: ["First and foremost, check your safety.", "First and foremost, we need a plan.", "First and foremost, thank you for coming.", "First and foremost, I must apologize."] },
  { id: "ff6639a7-7f8f-43d2-a082-32a125a4457f", examples: ["His health deteriorated rapidly.", "The relationship deteriorated over time.", "Weather conditions deteriorated overnight.", "The situation began to deteriorate."] },
  { id: "45d4ee42-6ef9-44eb-a1a3-17a3e3e8f8d7", examples: ["The interrogation lasted for hours.", "Police conducted an interrogation.", "He broke during the interrogation.", "Intense interrogation techniques."] },
  { id: "f0c8d95f-765a-43a7-a73f-52eb1b753729", examples: ["The detective caught the suspect out with clever questions.", "I tried to catch him out.", "She was caught out by the trick question.", "Catching someone out is satisfying."] },
  { id: "065021e3-1032-462f-8994-11b68a8467d8", examples: ["He felt humiliated in front of his colleagues.", "She was humiliated by the remarks.", "Don't humiliate me.", "A humiliated expression."] },
  { id: "07f38894-2546-4246-bc46-e382740b4123", examples: ["Needless to say, she was upset.", "Needless to say, we agreed.", "Needless to say, it was a success.", "Needless to say, he was late again."] },
  { id: "e43c8df5-5d07-42c6-a386-7b81f1f1c185", examples: ["Gardening can be very therapeutic.", "Music has a therapeutic effect.", "The spa offers therapeutic treatments.", "A therapeutic massage."] },
  { id: "76abcebf-d45f-4261-907f-e96ab3fb6dde", examples: ["Auditors will scrutinize the accounts.", "She scrutinized the document.", "Scrutinizing every detail.", "The report was scrutinized."] },
  { id: "fcf81480-7a04-4749-a752-0d06ff3fed5f", examples: ["His provocative comments started a fight.", "She wore a provocative outfit.", "A provocative statement.", "Don't be provocative."] },
  { id: "869b9136-6cea-40a2-b8e7-b054a4496fa9", examples: ["The donor requested anonymity.", "Online anonymity is valuable.", "Maintaining anonymity is hard.", "Complete anonymity was guaranteed."] },
  { id: "2f2478d0-6038-4d2f-934e-3d35a0d2e4ae", examples: ["The words are not synonymous.", "Love and lust are not synonymous.", "These terms are virtually synonymous.", "Synonymous expressions."] },
  { id: "a618ab2e-0226-4c0d-bd0c-b790bb1c8d7c", examples: ["The word has multiple senses.", "In one sense, it is correct.", "A sense of humor is important.", "Common sense prevails."] },
  { id: "f4f66824-c31b-4f59-901d-5e438b02adab", examples: ["The parts are interchangeable.", "Interchangeable batteries are convenient.", "The words are interchangeable.", "Not always interchangeable."] },
  { id: "1590e105-84af-4413-b915-3ff68377bb59", examples: ["The instructions were ambiguous.", "An ambiguous answer.", "Avoid being ambiguous.", "Ambiguous wording caused confusion."] },
  { id: "874feea2-f035-4bca-8fe8-e66502e845cf", examples: ["How do you interpret this poem?", "The data can be interpreted differently.", "I interpret it as a warning.", "Difficult to interpret."] },
  { id: "18a1e871-bd6b-4964-a5c4-3bd657b85b15", examples: ["Be transparent about your intentions.", "A transparent process.", "The explanation was transparent.", "Transparent communication."] },
  { id: "21f417ac-0ae8-4ef9-b694-dc1c0aca698a", examples: ["The title is self-explanatory.", "This feature is self-explanatory.", "His anger was self-explanatory.", "A self-explanatory diagram."] },
  { id: "798dd82a-5f58-462f-881e-fdb03f606154", examples: ["Please be more precise.", "Precise measurements.", "A precise definition.", "Precise timing is crucial."] },
  { id: "50c511d9-26be-45b8-a2bd-255be7c19456", examples: ["The project is virtually complete.", "It's virtually impossible.", "They virtually disappeared.", "Virtually no difference."] },
  { id: "00c05970-6ccf-420b-a1c1-aea1e2c2a1f7", examples: ["The irony of the situation was clear.", "There was irony in his words.", "A trace of irony.", "Dripping with irony."] },
  { id: "f6ffd594-03c6-4be9-9326-1223f6f3b2a9", examples: ["His voice was full of sarcasm.", "She detected sarcasm in his tone.", "No need for sarcasm.", "Biting sarcasm."] },
  { id: "6ea73df1-2264-4292-8764-6e58769ce148", examples: ["Don't be sarcastic.", "A sarcastic comment.", "His sarcastic reply offended her.", "Sarcastic tone."] },
  { id: "4dd58d8f-5ece-4372-83c0-a16b5763c548", examples: ["The word is used figuratively here.", "A figurative expression.", "Figurative language.", "Speaking figuratively."] },
  { id: "80fb85b6-e4d7-4a31-9b4d-d8349cf96d84", examples: ["Literary magazines publish poetry.", "A literary analysis.", "His literary achievements.", "Literary style."] },
  { id: "78852559-96aa-4fb9-946b-4dc6c1f2a32b", examples: ["She spoke in a disapproving tone.", "A disapproving look.", "Disapproving of his behavior.", "Disapproving comments."] },
  { id: "eccccdcc-a59f-4456-b786-077be98606d7", examples: ["That phrase is old-fashioned.", "Old-fashioned values.", "An old-fashioned dress.", "Considered old-fashioned."] },
  { id: "a2933d11-b361-4f9c-95ee-d2f3c1d2dadc", examples: ["The word is slang for money.", "Street slang.", "Slang terms change quickly.", "Internet slang."] },
  { id: "8941f4a9-3269-4039-91b7-af15af8f138a", examples: ["A pejorative term.", "Pejorative language.", "Used pejoratively.", "Considered pejorative."] },
  { id: "3fd64c4a-e627-4652-876e-9922d8605d83", examples: ["That was an insulting remark.", "Insulting someone's intelligence.", "Highly insulting.", "Insulting behavior."] },
  { id: "bad7249d-b359-4691-9744-fab1009df3e0", examples: ["Stop making fun of me.", "They made fun of his accent.", "Making fun of others is mean.", "Don't make fun of her."] },
  { id: "0d90b80a-9d1b-4f3e-a004-b11bde26843f", examples: ["They poke fun at celebrities.", "Poking fun is different from bullying.", "He poked fun at himself.", "Poking fun gently."] },
  { id: "c7b03e0b-1386-42fa-aa4e-a970c914f34a", examples: ["Don't mock him.", "She mocked his efforts.", "Mocking laughter.", "A mocking tone."] },
  { id: "50aa84ce-700d-45c7-bf9b-0a5430b04581", examples: ["Traffic was crawling.", "The car crawled up the hill.", "Crawling along the freeway.", "Time crawled by."] },
  { id: "4c52dc1f-5d38-4eb8-a1c4-122c9ebfb15c", examples: ["Having second thoughts about the job.", "I'm having second thoughts.", "Second thoughts are normal.", "No second thoughts."] },
  { id: "e3d29585-44a5-47f1-bd52-4fb146b07ee3", examples: ["I'm in two minds about moving.", "She was in two minds.", "Being in two minds is confusing.", "Still in two minds."] },
  { id: "ebc28578-1de0-4a83-bcd7-84122f8a9613", examples: ["How sweet of you to remember.", "That was sweet of him.", "So sweet of her.", "Too sweet."] },
  { id: "f8b7350c-ac0b-438b-aaf7-6730d6be8e6a", examples: ["I'm tied up all morning.", "Sorry, I'm tied up right now.", "He's tied up in meetings.", "Tied up with work."] },
  { id: "67a0343f-e28e-4157-964f-4e539ea5c43d", examples: ["It dawned on me that I was wrong.", "The truth finally dawned on him.", "It dawned on her slowly.", "Dawned on me later."] },
  { id: "e9b46b7a-ee0a-4177-b182-692447cca70b", examples: ["He had an ulterior motive.", "Suspected an ulterior motive.", "Without ulterior motives.", "Hidden ulterior motive."] },
  { id: "76e477c3-8a2c-4235-a3bb-aeaf56ad9408", examples: ["He's a bit thick sometimes.", "Don't be thick.", "Thick as a brick.", "Not that thick."] },
  { id: "6f91d69f-5e2a-4842-b719-463c4a69a0b6", examples: ["Romance was the last thing on my mind.", "Work is the last thing on my mind.", "Sleep was the last thing on my mind.", "Last thing on your mind."] },
  { id: "2769a685-a646-45ea-a473-38abec73fed6", examples: ["How can I get out of this?", "He got out of doing the dishes.", "Getting out of work.", "Can't get out of it."] },
  { id: "79c592c4-783f-469d-8433-2f64fc35192e", examples: ["The explosion sent debris flying.", "The wind sent papers flying.", "Sent him flying.", "Sent everything flying."] },
  { id: "0c564784-38ae-4cbb-8f4f-424897e503a7", examples: ["You're not gonna believe this, but I won.", "You're not gonna believe what happened.", "You're not gonna believe this story.", "You're not gonna believe this."] },
  { id: "a175f012-4f5f-43fc-87cb-a87d161e1aaa", examples: ["I got her to agree.", "Can you get him to help?", "Getting the car to start.", "Got it to work."] }
];

async function main() {
    console.log(`Enriching strict batch 8 of ${batch.length} cards...`);
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
