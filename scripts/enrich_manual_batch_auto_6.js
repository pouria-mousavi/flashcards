
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

const batch = [
  { id: "e85e0984-d621-4f32-8438-e4b7b3986348", examples: ["Traffic sign was blocked.", "Read the traffic sign.", "Obey the traffic sign.", "New traffic sign."] },
  { id: "e4d67935-71b3-4d67-a5c7-3766c1b22a81", examples: ["Drain blocked.", "Drain the swamp.", "Drain cleaner.", "Water goes down the drain."] },
  { id: "155bed0a-3f37-41fa-8cb0-9a1cd96c64a5", examples: ["Occupants of the car.", "Local residents.", "New occupants.", "Residents meeting."] },
  { id: "f0698b3c-023a-43f7-9c0f-fcce96423e5e", examples: ["Drop the anchor.", "Weigh anchor.", "News anchor.", "Anchor the rope."] },
  { id: "154be361-3b6b-4a21-b16d-c97313700d1a", examples: ["Glass panels.", "Solar panels.", "Control panels.", "Remove the panels."] },
  { id: "c27de8c2-889e-4dd8-bdfd-0f844fdcc005", examples: ["Financial constraints.", "Budget constraints.", "Time constraints.", "Free from constraints."] },
  { id: "38a4ea1e-6ec0-4655-866e-bc7b1896d48f", examples: ["Withstand pressure.", "Resist temptation.", "Withstand the storm.", "Resist arrest."] },
  { id: "c4d1d94b-231e-4287-bc6d-478b79307d43", examples: ["Swaying in the wind.", "Trees swaying.", "Swaying opinion.", "Stop swaying."] },
  { id: "4428d17a-eb12-40be-b94a-401cd3eac29f", examples: ["Establish a company.", "Establish facts.", "Establish contact.", "Establish rules."] },
  { id: "9725c9c2-9f4b-4dd3-9ba2-935ec82fc95f", examples: ["Repel the attack.", "Fight infection.", "Repel insects.", "Fight for rights."] },
  { id: "1c200d0a-3a26-4d7d-b771-cb299fe2633a", examples: ["Insert the key.", "Insert a coin.", "Inserted new data.", "Insert here."] },
  { id: "2e3fe667-4ee7-4877-8623-dbb9e9acbd7a", examples: ["Immune system.", "Immune to criticism.", "Immune response.", "Not immune to fines."] },
  { id: "2a8bfef4-5482-495c-b0b0-019baac6faa1", examples: ["Check the archive.", "Archive the file.", "Historical archive.", "Archive footage."] },
  { id: "b3796de8-1fd2-4418-8c0f-7738e71ae196", examples: ["Replicate results.", "Can you replicate it?", "DNA replicates.", "Hard to replicate."] },
  { id: "9e31f276-907d-423a-af5a-1b2a2b2babee", examples: ["Unbiased opinion.", "Unbiased judge.", "Fair and unbiased.", "Unbiased advice."] },
  { id: "fba9d777-3cfc-474e-8c2e-7a3d57928dbe", examples: ["Facet of the problem.", "Many facets.", "A new facet.", "Cut diamond facet."] },
  { id: "c80344e1-e804-4633-bb41-c388bf7b8ae2", examples: ["Under scrutiny.", "Scrutinize the deal.", "Close scrutiny.", "Scrutinize carefully."] },
  { id: "5381a191-3b72-4a9d-bdb4-383a679a1438", examples: ["Test the hypothesis.", "Hypothesize a cause.", "Working hypothesis.", "Scientists hypothesize."] },
  { id: "363aabef-3861-421e-8f66-00be59242c1b", examples: ["Verify the account.", "Need verification.", "Please verify.", "Identity verification."] },
  { id: "fcda0e58-4435-4d85-8d57-5f5b4058fd1d", examples: ["Empirical evidence.", "Empirical study.", "Based on empiricism.", "Empirical data."] },
  { id: "5d12ed8f-798b-4499-99a2-9ecda75c97a1", examples: ["Biased news.", "Unconscious bias.", "Biased against him.", "Show bias."] },
  { id: "4d8e46ad-cae7-4f5f-977c-355a72cb2a20", examples: ["Be objective.", "Lack of objectivity.", "Objective view.", "Main objective."] },
  { id: "a5342fdd-ab27-4d5e-98d4-e7f98fa60f34", examples: ["Message conveyed.", "Conveyed his thanks.", "She conveyed sadness.", "Conveyed by truck."] },
  { id: "1bfd685e-b8f4-4501-be8b-a87a1cb23aab", examples: ["Endowed with talent.", "Endows the university.", "Nature endows.", "Endowed chair."] },
  { id: "0597a9d4-79b5-4e8f-bb60-f3a01429f444", examples: ["Depicted in art.", "He depicted life.", "As depicted here.", "Depicted a scene."] },
  { id: "54950e9c-6747-47d3-a495-996cabeda707", examples: ["Peace and prosperity.", "Enjoy prosperity.", "Economic prosperity.", "Path to prosperity."] },
  { id: "1ebb14b8-0f9e-4e01-801c-0e22e0d80e50", examples: ["Merciless killer.", "God is merciful.", "Merciless sun.", "Be merciful."] },
  { id: "b80e68fe-b5ee-4ee7-9cf0-ee6abe86c2ee", examples: ["Resilient economy.", "Stay resilient.", "Resilient material.", "Kids are resilient."] },
  { id: "798c07fe-cc67-478f-962e-72957eb61328", examples: ["Embodiment of evil.", "Perfect embodiment.", "She is the embodiment.", "Embodiment of grace."] },
  { id: "85e2e739-9e2c-4192-b848-a066b69bbb09", examples: ["Act of defiance.", "In defiance of.", "Shouted in defiance.", "Look of defiance."] },
  { id: "f409d87b-b6ce-4ac5-b182-d4fc9f18aa6b", examples: ["Accurate portrayal.", "Portrayal of women.", "Movie portrayal.", "Media portrayal."] },
  { id: "5e492662-0ff6-499c-a1b1-34c295611f97", examples: ["Don't sit on the fence.", "He sat on the fence.", "Undecided, sitting on the fence.", "Get off the fence."] },
  { id: "671133bc-1223-487e-8cb2-934339b7609e", examples: ["Explore in depth.", "Discuss in depth.", "Study in depth.", "Look in more depth."] },
  { id: "e5431ced-6800-407f-a3f6-00a4a19d0165", examples: ["Cannot condone violence.", "Don't condone it.", "Condone bad behavior.", "Society condones it."] },
  { id: "191386a3-95ab-45b4-8a13-0eadfc788aa7", examples: ["Outlined the plan.", "Briefly outlined.", "Outlined in red.", "As outlined above."] },
  { id: "e678ed77-3efb-441d-9ee8-fcdf6a37887c", examples: ["Make an assertion.", "False assertion.", "Bold assertion.", "His assertion is wrong."] },
  { id: "871ebb8e-9b1d-4636-8c26-a767074f5163", examples: ["Strong condemnation.", "International condemnation.", "Condemnation of the act.", "Face condemnation."] },
  { id: "6ec7d70f-53f4-42d2-86f1-44de987c348f", examples: ["Discursive essay.", "Discursive style.", "Discursive writing.", "Long discursive speech."] },
  { id: "a67edfb0-3d25-4229-b7af-aa752eba28c7", examples: ["Incoherent speech.", "He was incoherent.", "Incoherent mumbling.", "Totally incoherent."] },
  { id: "dcb6d3ac-087c-4072-bd70-09cd8070b04c",
    examples: ["Oral presentation.", "Good presentation.", "Presentation skills.", "Give a presentation."] },
  { id: "015d7041-8e09-45e6-a65c-a5f7bc031843", examples: ["Voice of the narrator.", "First-person narrator.", "Unreliable narrator.", "Narrator says."] },
  { id: "eb74f661-e8f2-49e1-af15-ec4548d2229c", examples: ["Risk assessment.", "Evaluate the cost.", "Assessment of needs.", "Evaluate performance."] },
  { id: "fa00fb8c-741d-4714-86eb-8c4477be0550", examples: ["Main criterion.", "Selection criterion.", "One criterion is...", "Meet the criterion."] },
  { id: "629ffd3f-50ae-4ad6-a24d-2b2b8cb94958", examples: ["To sum up.", "Let me summarize.", "Sum up the main points.", "Summarize the book."] },
  { id: "8aaa696b-4d42-40ae-b149-8b79645599cb", examples: ["With regard to your letter.", "Regarding the issue.", "Concerning your complaint.", "Questions concerning price."] },
  { id: "9d5ab72f-48a1-40c9-953b-bf4bf00db8bc", examples: ["Prior to the war.", "Prior to arrival.", "Just prior to.", "Weeks prior."] },
  { id: "ee67888b-3a84-4aa4-b61e-5e0c15501b25", examples: ["He is old, thus wise.", "Hence the name.", "She got sick, thus failed.", "Money is tight, hence the delay."] },
  { id: "09f13a8f-8619-41ee-ba0e-6d98bdb319c9", examples: ["Has extensive experience.", "Gain extensive experience.", "Extensive experience in sales.", "Requires extensive experience."] },
  { id: "359374f3-c7e1-477e-8b58-8c9b6d38aede", examples: ["In response to your query.", "In reply to the letter.", "Acting in response.", "Said in reply."] },
  { id: "b990e83d-6b83-4ed3-8eae-2681bfdf601d", examples: ["I would be grateful for help.", "Concerning your request.", "Grateful for a reply.", "Concerning the matter."] },
  { id: "e6547f2a-13cb-433a-922a-3d302798dffb", examples: ["Should you require info.", "Contact us should you require help.", "Please ask should you require more.", "Here should you require it."] },
  { id: "b5475b4d-7ad3-45f5-9b6b-f903539cef12", examples: ["Terminate the contract.", "Intention to terminate.", "Terminate employment.", "Terminate the call."] },
  { id: "865aa7d2-a455-46fa-a817-b6877d54f1d7", examples: ["Regret to inform you.", "We regret to say.", "Inform you of the delay.", "Deeply regret."] },
  { id: "03567875-85a3-4f8a-bd74-1c239b159a9f", examples: ["I wish to enquire.", "Enquire about tickets.", "Enquire within.", "Calling to enquire."] },
  { id: "58821cf8-9e6a-4082-a59e-4a8465604121", examples: ["My deepest condolences.", "Accept my condolences.", "Sent condolences.", "Offer condolences."] },
  { id: "61047c91-2686-411b-951d-40516441971c", examples: ["At 5 o'clock or thereabouts.", "Cost $10 or thereabouts.", "In 1990 or thereabouts.", "Meet thereabouts."] },
  { id: "aa7fc4d3-3b3a-4e79-9c62-3a617e840ef5", examples: ["He's getting on for 80.", "It's getting on for midnight.", "She looks getting on for 50.", "Getting on for late."] },
  { id: "7e745a9b-460d-4576-9b8e-b7905fb3b017", examples: ["Fifty-odd people came.", "Thirty-odd years ago.", "Forty-odd dollars.", "Hundred-odd miles."] },
  { id: "c4dc4aed-e80a-417a-a2a5-6c60a50a8579", examples: ["It has something to do with time.", "Is it something to do with math?", "Nothing to do with me.", "Something to do with work."] },
  { id: "7b4d2a51-5854-4e69-abc4-a2fb5fd9a4e5", examples: ["He's kind of depressed.", "Feeling kind of sad.", "Kind of weird.", "It's kind of blue."] },
  { id: "5469497c-6edf-447a-bbfd-ddae1c8cb6f7", examples: ["Round about 6 PM.", "Cost round about $50.", "Happened round about then.", "Round about noon."] },
  { id: "d7d48e2e-de7f-487b-a7f6-25ca9d4a8fe6", examples: ["Something along those lines.", "Thinking along those lines.", "Along the lines of...", "Nothing along those lines."] },
  { id: "45148510-b708-434b-bb84-b1e1a191192d", examples: ["An hour, give or take.", "Give or take a few.", "50 miles give or take.", "Noon, give or take."] },
  { id: "b740db8b-86fb-4e58-b2c5-4f27462ed7fa", examples: ["Stacks of paper.", "Tons of fun.", "Loads of money.", "Bags of time."] },
  { id: "b28778bc-a138-44ff-a5a9-a091a904360e", examples: ["Price is in the region of.", "Somewhere in that region.", "In the region of 100.", "Cost in the region of."] },
  { id: "424f35fa-fc21-4609-8668-c2661ea69d94", examples: ["Thanks all the same.", "It's all the same to me.", "I love him all the same.", "Rainy, but fun all the same."] },
  { id: "97199627-68da-47d9-bf6b-87a0357dcb46", examples: ["To be honest, I hate it.", "Be honest with me.", "To be honest, no.", "Honest opinion."] },
  { id: "aec2f2e2-5aff-451f-8c59-632f3911890a", examples: ["Broadly speaking, yes.", "Different broadly speaking.", "Broadly speaking, it works.", "Categories broadly speaking."] },
  { id: "b8c5c000-1658-4a10-b732-9aa96c1fea8b", examples: ["On the whole, it was good.", "By and large correct.", "On the whole, I agree.", "By and large successful."] },
  { id: "f25575a8-48d2-4b97-bfd9-6ec3f807ac6f", examples: ["Gone down with the flu.", "He's gone down with a cold.", "Gone down with fever.", "She's gone down with it."] },
  { id: "256fe72d-98d2-4e4b-93ef-220594c21a01", examples: ["It sank in finally.", "Let the news sink in.", "Hasn't sank in yet.", "Reality sank in."] },
  { id: "14be3e46-c81c-41ad-9862-66e3c8254e54", examples: ["Shake off the cold.", "Shake off the feeling.", "Can't shake it off.", "Shake off pursuers."] },
  { id: "f69bd0dc-0236-487e-a25b-6c6bbc1b9466", examples: ["He turned up late.", "Showed up at the party.", "Never turned up.", "Look what turned up."] },
  { id: "a78a816f-cb4a-49d9-9f7b-530c9408eb57", examples: ["Bump into an old friend.", "Did you bump into him?", "Bump into trouble.", "Don't bump into the table."] },
  { id: "703b48d7-c135-4db6-a03a-e0577822e88f", examples: ["Missing out on fun.", "Don't miss out on this.", "Missed out on the deal.", "Fear of missing out."] },
  { id: "0f81a45d-6544-43d6-b9b0-dc11b7d0c4e9", examples: ["A problem cropped up.", "Name cropped up.", "Issue cropped up in meeting.", "Something cropped up."] },
  { id: "42189b83-92b6-4c31-a3f9-46fc6cebada6", examples: ["I can get by.", "Get by with little money.", "Just getting by.", "Hard to get by."] },
  { id: "a585528c-e1fb-4034-8c5d-cd85e6b63cdf", examples: ["Made up a story.", "She is made up (happy).", "Made up of three parts.", "Kiss and make up."] },
  { id: "991fb4e0-9eca-4bef-8226-f4de9997768d", examples: ["Take the engine apart.", "Take it to pieces.", "Taken to pieces.", "Take apart the toy."] },
  { id: "b77889fc-5c0f-4a3a-93f2-11124c606896", examples: ["Talk him into going.", "Talked me into it.", "Don't let him talk you into it.", "Can't talk her into it."] },
  { id: "dc7e0d88-1dc4-4a2a-bb28-277896a572d2", examples: ["I was taken in by the scam.", "Don't be taken in.", "Easily taken in.", "He took me in."] },
  { id: "47101c6a-7696-441d-ab32-0d766e061100", examples: ["Do away with the rule.", "Do away with him.", "Done away with old machines.", "Time to do away with it."] },
  { id: "5d3e11b8-1890-4ada-a8a1-05be3b987bd2", examples: ["Talk me out of it.", "Tried to talk him out of it.", "Don't talk me out of it.", "Talked her out of leaving."] },
  { id: "949bf709-86aa-4cfd-931d-cfb9bf294411", examples: ["Make up for lost time.", "Hard to make up for.", "Make up for the mistake.", "Nothing can make up for it."] },
  { id: "4e046698-ca1f-4b76-8274-d04d72d6d63c", examples: ["Own up to the crime.", "She owned up.", "Own up to your mistakes.", "Refused to own up."] },
  { id: "a91dd77c-edad-4742-b92e-de2d403fe472", examples: ["Went red as a beetroot.", "Face red as a beetroot.", "Blushing red as a beetroot.", "Turned red as a beetroot."] },
  { id: "234459d4-1b48-475f-8a33-9785846027ba", examples: ["Be good as gold.", "Child was good as gold.", "Behaved good as gold.", "Good as gold today."] },
  { id: "319a3969-3b00-44f4-a952-4883bd21ad84", examples: ["Face white as a sheet.", "Turned white as a sheet.", "Pale, white as a sheet.", "She went white as a sheet."] },
  { id: "1c1d353d-46d1-408d-b05e-9411b9bb8b21", examples: ["Works like a dream.", "Plan worked like a dream.", "Car runs like a dream.", "It went like a dream."] },
  { id: "51e9c882-f7aa-42fa-9ccf-a1e25365a907", examples: ["He is thin as a rake.", "Looked thin as a rake.", "She's thin as a rake.", "Got thin as a rake."] },
  { id: "5ae6fe6a-4718-4081-a197-3b8d32d09185", examples: ["I'm blind as a bat.", "She is blind as a bat.", "Without glasses, blind as a bat.", "Blind as a bat at night."] },
  { id: "9df5fafa-781a-40af-af87-00548dbf8676", examples: ["He is deaf as a post.", "Grandpa is deaf as a post.", "Are you deaf as a post?", "Deaf as a post without aids."] },
  { id: "f63b00e9-e9ab-4e34-9439-8d42fa29a143", examples: ["Trial and error.", "Learned by trial and error.", "Process of trial and error.", "No trial and error."] }
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
