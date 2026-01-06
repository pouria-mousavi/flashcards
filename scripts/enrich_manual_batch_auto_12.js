
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

const batch = [
  { id: "814af4bd-f95a-4f86-b5b3-294b2991799f", examples: ["Verify the data.", "Verify your identity.", "Need to verify.", "Independently verified."] },
  { id: "ddde2a34-d63b-4001-a730-95b31147bf21", examples: ["Scrutinize the details.", "Scrutinize every move.", "Scrutinize the budget.", "Carefully scrutinize."] },
  { id: "52cf405c-d8b9-4cc8-8ac8-736a798d3e3a", examples: ["Under scrutiny.", "Public scrutiny.", "Subject to scrutiny.", "Close scrutiny."] },
  { id: "fcd74571-3915-48d6-95c7-d524c7393427", examples: ["Archive the files.", "Archive old emails.", "Digital archive.", "Archive material."] },
  { id: "3f43b820-ea01-4a1f-a606-66e2dcc924db", examples: ["Unconscious bias.", "Political bias.", "Bias against women.", "Eliminate bias."] },
  { id: "573b2596-36fb-40fc-9fbe-d190a864f462", examples: ["Biased opinion.", "Biased usage.", "Heavily biased.", "Biased reporting."] },
  { id: "60f371d3-7aff-45a6-b392-9d797b24f23e", examples: ["Maintain objectivity.", "Lack of objectivity.", "Scientific objectivity.", "Total objectivity."] },
  { id: "d58c844e-fcc4-4e34-a902-62d96efff2a0", examples: ["Objective criteria.", "Be objective.", "Main objective.", "Achieve the objective."] },
  { id: "f06e77ac-7af2-4766-bc4e-f1174fc37535", examples: ["Strong conviction.", "Religious conviction.", "Criminal conviction.", "Lack of conviction."] },
  { id: "c546a9e7-3e2f-4d1d-9445-f0ff4937b1ca", examples: ["Facet of the problem.", "Many facets.", "Important facet.", "New facet."] },
  { id: "fcc436b8-d8f9-4b23-a1c9-717ace22581c", examples: ["British empiricism.", "Logic and empiricism.", "Based on empiricism.", "Philosophy of empiricism."] },
  { id: "bbaaf577-71f9-4c9f-981c-bf17162fc341", examples: ["Empirical evidence.", "Empirical study.", "Empirical data.", "Based on empirical research."] },
  { id: "44db4d1c-f4b5-4978-ba43-cfe00a6da918", examples: ["Natural phenomenon.", "Rare phenomenon.", "Global phenomenon.", "Strange phenomenon."] },
  { id: "10a27017-6754-4784-a0b1-57c08168d40c", examples: ["Hypothetical situation.", "Hypothetical question.", "Purely hypothetical.", "Hypothetical scenario."] },
  { id: "703d8363-e0a7-4357-abb3-8d6638d04856", examples: ["Test the hypothesis.", "Null hypothesis.", "Formulate a hypothesis.", "Support the hypothesis."] },
  { id: "5517223e-849c-42ca-9250-3da25373c6e0", examples: ["Endow with rights.", "Endowed with talent.", "Endow a scholarship.", "Nature endowed him."] },
  { id: "6703b3a4-24e5-4cfc-a6ff-f6b454250009", examples: ["Embody the spirit.", "Embody values.", "Words embody thoughts.", "He embodies evil."] },
  { id: "8d1299a9-b548-4adc-945b-491f48d12a51", examples: ["Show resilience.", "Emotional resilience.", "Build resilience.", "Resilience of the economy."] },
  { id: "31d6c13b-8433-49b5-af7e-06701af47a37", examples: ["Defy odds.", "Defy gravity.", "Defy authority.", "Defy broken expectations."] },
  { id: "183903a8-4dc3-49f4-9cc3-d4a4832b5cca", examples: ["Portray a character.", "Portray as a hero.", "Portray the truth.", "How is he portrayed?"] },
  { id: "271796b3-1f6c-4213-927b-310da60f0541", examples: ["Need companionship.", "Provide companionship.", "Enjoy companionship.", "Loyal companionship."] },
  { id: "e299913d-43db-47b8-90a7-ae5ac985a871", examples: ["Act of betrayal.", "Feel betrayal.", "Sense of betrayal.", "Betrayal of trust."] },
  { id: "e20be336-806c-44bd-ba76-aedfdd55d5eb", examples: ["Expose a lie.", "Expose corruption.", "Expose to light.", "Don't expose it."] },
  { id: "3f624e59-5a4a-43d3-8363-76d0c8e8440a", examples: ["Inherent risk.", "Inherent value.", "Inherent problem.", "Inherent beauty."] },
  { id: "9f88728b-b825-45fa-b965-21fcc70b5dd3", examples: ["Alien culture.", "Alien concept.", "Feel alien.", "Alien life."] },
  { id: "1b6f7b4e-e81c-4568-bedd-8cf864b5c68f", examples: ["Twist of fate.", "Accept your fate.", "Terrible fate.", "Fate decided."] },
  { id: "d8ef2266-aa4c-4a6c-a551-95316b3aa6b4", examples: ["Unlike his brother.", "Not unlike.", "Quite unlike.", "Unlike anything else."] },
  { id: "0660dcea-fb7a-47fd-9ca8-efce2d0a758a", examples: ["Convey a message.", "Convey meaning.", "Convey feelings.", "Hard to convey."] },
  { id: "32b0a3a5-5852-40ed-9fa9-46f5f8d6a05b", examples: ["Pitiful sight.", "Pitiful excuse.", "Pitiful amount.", "Looked pitiful."] },
  { id: "1e000bdb-51f6-48b2-a680-aeb48df14da0", examples: ["Running commentary.", "Social commentary.", "Political commentary.", "No commentary."] },
  { id: "71e3ad29-3578-424f-84b0-84122cff27c4", examples: ["Moment of insanity.", "Pure insanity.", "Plea of insanity.", "Drive me to insanity."] },
  { id: "f61152de-4c1b-42b1-a775-19a95461644b", examples: ["Show mercy.", "Beg for mercy.", "No mercy.", "At the mercy of."] },
  { id: "259c55ab-4416-4bd1-9c84-1ee548378ec5", examples: ["Cause of downfall.", "Rapid downfall.", "Political downfall.", "Lead to downfall."] },
  { id: "91441796-caaf-43c0-b510-4029836c8148", examples: ["Main protagonist.", "Female protagonist.", "Protagonist of the story.", "Play the protagonist."] },
  { id: "aae09dd2-daa4-4657-9998-09afc7af39f6", examples: ["Prosperous year.", "Prosperous nation.", "Prosperous business.", "Grow prosperous."] },
  { id: "d20d5d47-ca26-4529-aa13-2d4a329e11e0", examples: ["Brief synopsis.", "Read the synopsis.", "Synopsis of the plot.", "Write a synopsis."] },
  { id: "2bf8a033-55f8-45fd-a35f-5d7d80fa0d16", examples: ["Don't sit on the fence.", "He likes to sit on the fence.", "Sitting on the fence.", "Decide, don't sit on the fence."] },
  { id: "1078ccd0-7085-4eab-87d8-050612d90a6a", examples: ["Assert authority.", "Assert rights.", "Assert innocence.", "Assert control."] },
  { id: "ed45493c-ae8b-4577-9ddd-841a7cde454c", examples: ["Hypothesize that.", "Scientists hypothesize.", "Difficult to hypothesize.", "Hypothesize a link."] },
  { id: "e033ddcf-d4d4-4169-b7d1-5d7d90ac51e4", examples: ["Condone violence.", "Cannot condone it.", "Condone behavior.", "Never condone."] },
  { id: "a7440e31-6d55-41e4-b49a-187f34ec917a", examples: ["Condemn the attack.", "Condemn to death.", "Strongly condemn.", "Condemn the building."] },
  { id: "d278925f-f415-4442-a099-b8582c387d79", examples: ["Draw a conclusion.", "Reach a conclusion.", "Come to a conclusion.", "In conclusion."] },
  { id: "3bd1150e-d407-4511-b537-72361623bb7f", examples: ["Exemplify the trend.", "Actions exemplify.", "Exemplify the best.", "This case exemplifies."] },
  { id: "77d5e527-e843-4fd5-9698-5b1ef4e585d6", examples: ["Take a stance.", "Tough stance.", "Political stance.", "Change stance."] },
  { id: "edc52ef9-daa4-4674-a3a1-5e8ef371cdd4", examples: ["Adopt a stance.", "Adopt a child.", "Adopt a policy.", "Adopt a new approach."] },
  { id: "c93f89d8-cf86-4cd5-9dfb-43a3425c2a9a", examples: ["Highlight the issue.", "Highlight text.", "Highlight importance.", "Main highlight."] },
  { id: "4f42699c-1fa9-4113-905f-cae923ca4814", examples: ["Explore the city.", "Explore options.", "Explore the world.", "Explore ideas."] },
  { id: "8df14554-8d52-4b8d-9692-ed4b02cacbc1", examples: ["Outline the plan.", "Brief outline.", "Outline drawing.", "Outline main points."] },
  { id: "57a4f010-708a-4dac-8203-92c797e59ac8", examples: ["Narrative structure.", "Control the narrative.", "Personal narrative.", "Grand narrative."] },
  { id: "e157b820-8b31-4496-8061-be6561bf6ad5", examples: ["Cash register.", "Register to vote.", "Formal register.", "Register a complaint."] },
  { id: "3233db4f-dbe4-4514-905c-7d78e29b49a8", examples: ["Stylistic choices.", "Stylistic device.", "Stylistic difference.", "Stylistic change."] },
  { id: "e1d8bf29-a84b-4eb5-bbb2-a24606909877", examples: ["Carrying command.", "Command of English.", "Take command.", "Chain of command."] },
  { id: "f271a8aa-f2ac-414f-bed0-c217282c9439", examples: ["Coherent argument.", "Coherent policy.", "Coherent sentence.", "Lack coherent thought."] },
  { id: "c4719a32-04fc-4e13-b969-9f6d10d0e30f", examples: ["Main criterion.", "Selection criteria.", "Meet criteria.", "Standard criterion."] },
  { id: "77fcc6fc-5617-4ad0-bf0d-2bf76d391e70", examples: ["Summarize the text.", "Summarize main points.", "Briefly summarize.", "Summarize findings."] },
  { id: "d5c97c31-e1be-44ed-b6cd-4f6ce35b84ff", examples: ["Evaluate performance.", "Evaluate the cost.", "Hard to evaluate.", "Evaluate options."] },
  { id: "85d2db17-7b17-4d89-8f1e-d9cb9faab2d8", examples: ["Win the argument.", "Heated argument.", "Valid argument.", "Argument against."] },
  { id: "63ef178c-aaf9-4102-b113-231fca8a6566", examples: ["Discursive essay.", "Discursive style.", "Discursive thought.", "Highly discursive."] },
  { id: "0b4de232-cc2e-4f9a-94e1-cd3473f0acdf", examples: ["Henceforth known as.", "From henceforth.", "Banned henceforth.", "Henceforth illegal."] },
  { id: "26ec9ec5-cb48-4986-b2b7-a74d97069566", examples: ["Hitherto unknown.", "Hitherto neglected.", "Hitherto impossible.", "Hitherto success."] },
  { id: "34375d83-a878-4cde-b2d8-4123bd860fb2", examples: ["In conclusion, I agree.", "State in conclusion.", "Finally, in conclusion.", "Arguments in conclusion."] },
  { id: "c59475cc-8e1e-434d-ba84-c9f021b86064", examples: ["Notwithstanding the weather.", "Notwithstanding his age.", "Rules notwithstanding.", "Valid notwithstanding."] },
  { id: "1d51528b-2c41-495a-87d8-7f4e0683538f", examples: ["Albeit slowly.", "Albeit brief.", "Albeit expensive.", "Albeit true."] },
  { id: "5b451adb-7d61-4f3d-a971-d4d44365d749", examples: ["With regard to your letter.", "In regard to safety.", "Nothing with regard to this.", "Ask with regard to."] },
  { id: "fad24726-bb0a-479e-a8f4-af6057f31d5c", examples: ["Thus far.", "Thus proving.", "He was thus elected.", "Thus ends the story."] },
  { id: "d0b8fad3-3f6a-4de4-ba3d-f2051fe9e9e3", examples: ["In view of the facts.", "In view of recent events.", "Act in view of.", "Succeed in view of."] },
  { id: "4be4d79c-524d-4196-9cb7-1386925c2f06", examples: ["Prior to departure.", "Prior to the meeting.", "Prior to this.", "Week prior to."] },
  { id: "dc8d1339-b839-43ee-b1b0-0a03ab92a059", examples: ["Free sample.", "Blood sample.", "Sample of work.", "Sample the food."] },
  { id: "b9b12a38-8ba7-46cc-a520-96e9534e08c9", examples: ["Plain English.", "Plain vanilla.", "Plain view.", "It is plain to see."] },
  { id: "3d579029-9909-4cfd-a9cc-1c2c4e2cff67", examples: ["Abrupt end.", "Abrupt manner.", "Abrupt departure.", "Abrupt change."] },
  { id: "f4060061-4868-43a4-ba4c-9f23d374d9ce", examples: ["Blunt knife.", "Blunt refusal.", "To be blunt.", "Blunt instrument."] },
  { id: "407fda1c-b966-4bd2-ad1c-5f06608a94da", examples: ["Superfluous hair.", "Superfluous words.", "Superfluous detail.", "Become superfluous."] },
  { id: "1b6e433d-aabc-4746-83fb-538ee6133477", examples: ["Get to the point.", "Keep it to the point.", "Short and to the point.", "Speak to the point."] },
  { id: "f91ec78e-b861-4df9-b90d-14b45d32c4f6", examples: ["Concise summary.", "Be concise.", "Concise history.", "Concise answer."] },
  { id: "95ce9843-46f6-4be7-b354-c070d0dfc911", examples: ["Tone of voice.", "Angry tone.", "Muscle tone.", "Set the tone."] },
  { id: "23e6a933-d40d-4bd4-b3b0-e31112852b9d", examples: ["Spell it out for you.", "Spell out the plan.", "Rules spelled out.", "Don't make me spell it out."] },
  { id: "927373fc-ea59-4eaa-a93e-86de909cb6ca", examples: ["Subject matter expert.", "Complex subject matter.", "Discuss subject matter.", "Subject matter of the course."] },
  { id: "21de8a44-bee7-435d-ab1d-1cd6962e95ec", examples: ["Body of the email.", "Body of evidence.", "Main body.", "Body of the car."] },
  { id: "ac7f9d49-5cf8-4338-a01e-c9ae81b710bf", examples: ["Straightforward answer.", "Simple and straightforward.", "Straightforward task.", "Is it straightforward?"] },
  { id: "872ab582-83ad-4888-b4a9-026e9a0e7566", examples: ["State your name.", "State the facts.", "State of emergency.", "State clearly."] },
  { id: "530b8c98-5c66-4789-a1bc-e83cd09bb575", examples: ["Look forward to meeting.", "Look forward to hearing from you.", "We look forward to it.", "Look forward to seeing you."] },
  { id: "982a9274-ea07-45b6-a690-030df7390745", examples: ["I would be grateful if you could contact me.", "Grateful if you could help.", "Be grateful if you could call.", "Extremely grateful if you could."] },
  { id: "4904dd2d-c228-4a96-b31d-7cc6672041b3", examples: ["Do not hesitate to contact me.", "Please do not hesitate.", "Don't hesitate to ask.", "Hesitate to call."] },
  { id: "6ae3ed5a-86ea-49f9-829c-00c3471be67d", examples: ["Should you require assistance.", "Should you require more information.", "Should you require it.", "We are here should you require."] },
  { id: "a5fec115-d876-4f52-9a46-1e5fea3fd898", examples: ["Draw your attention to.", "May I draw your attention.", "Draw attention to the fact.", "Wish to draw your attention."] },
  { id: "b52fab98-ca80-4c95-89c0-5ee25faa553c", examples: ["As you will see from the report.", "As you will see from the CV.", "See from the attached.", "As you see."] },
  { id: "246d54b2-4440-4bd6-9986-9a0f38f6e588", examples: ["Please find enclosed.", "Find enclosed the check.", "Enclosed with this letter.", "Find enclosed herewith."] },
  { id: "0875d62b-2fe3-486a-a01b-b8475e860624", examples: ["Concerning your order.", "Questions concerning.", "Issues concerning safety.", "Concerning the matter."] },
  { id: "e98d6158-f1c8-4398-b9ec-83b18b4c6510", examples: ["With reference to your invoice.", "Writing with reference to.", "With reference to the job.", "No reference to."] },
  { id: "14f9e0f9-fe76-49d4-8e20-8d57ca1c0f68", examples: ["In reply to your letter.", "Writing in reply to.", "Response in reply to.", "Email in reply to."] },
  { id: "944d2b45-9fde-4d2d-987f-f10bb36e9304", examples: ["Following our conversation.", "Following the meeting.", "Weeks following.", "Immediately following."] },
  { id: "05f0af72-9934-4173-bd79-94adc376baac", examples: ["Further to our call.", "Further to your email.", "Further to discussion.", "Further to the request."] },
  { id: "c2574a24-8547-4830-82e5-6c8dbc4e5c60", examples: ["Accept my condolences.", "Deepest condolences.", "Send condolences.", "Expressions of condolences."] },
  { id: "8fa41b4b-49d7-4070-8925-cd4c1994c398", examples: ["Sincere apologies.", "Sincere thanks.", "Sincere friend.", "To be sincere."] },
  { id: "d90ce789-0057-4a62-b2d6-f9ef61d2a727", examples: ["My sincere condolences.", "Our sincere condolences.", "Offer sincere condolences.", "With sincere condolences."] },
  { id: "6358bec7-29a5-4aa8-bc84-5536a43b959a", examples: ["Appeal for help.", "Appeal for calm.", "Appeal for information.", "Charity appeal."] },
  { id: "271811db-7129-4ffe-a116-919a4a8af4b8", examples: ["In response to your query.", "Response to the attack.", "Act in response to.", "Email in response."] },
  { id: "e48967c6-7688-4f8c-9d5b-e77cd992e80f", examples: ["Delighted to inform you.", "We are delighted to inform.", "Truly delighted.", "Delighted to accept."] },
  { id: "4ce30656-d7af-4de9-a1a6-9173be35653a", examples: ["Regret to inform you.", "We regret to inform.", "Deeply regret.", "Regret to say."] },
  { id: "d25acf0e-d01b-487f-8e6f-da13e64d5f80", examples: ["Enquire whether it is true.", "Write to enquire whether.", "Call to enquire.", "Enquire whether available."] }
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
