
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

const batch = [
  { id: "eec2736b-7347-4934-bc2c-743db996addc", examples: ["Roll of toilet paper.", "Out of toilet paper.", "Toilet paper holder.", "Buy toilet paper."] },
  { id: "81e2e128-0f9a-41f6-8060-f5f716006d50", examples: ["Pack of wet wipes.", "Clean up with wet wipes.", "Antibacterial wet wipes.", "Use a wet wipe."] },
  { id: "c4054cb3-8de3-4b5e-8789-6278d0cc4717", examples: ["Box of facial tissue.", "Soft facial tissue.", "Use a facial tissue.", "Facial tissue for makeup."] },
  { id: "69a0ab7f-eb51-4ba8-bd81-a853e8a72e41", examples: ["Hit the road divider.", "Concrete road divider.", "Cross the road divider.", "Lane with road divider."] },
  { id: "12255351-3556-49f4-bcb7-0480fe3073eb", examples: ["Slow down for the speed bump.", "Hit a speed bump.", "Install a speed bump.", "High speed bump."] },
  { id: "a19c9b4e-7f15-4fe5-b048-2d14a49ce00e", examples: ["Traffic sign indicates stop.", "Damaged traffic sign.", "Follow the traffic sign.", "New traffic sign."] },
  { id: "58a97c88-06a8-49c5-aea2-644622f2918a", examples: ["Stimulate the economy.", "Stimulate growth.", "Coffee stimulates the brain.", "Hard to stimulate him."] },
  { id: "35c15931-f021-4bec-8ac1-dc0125ae4ba1", examples: ["Need mental stimulation.", "Visual stimulation.", "Provide stimulation.", "Lack of stimulation."] },
  { id: "54788ba1-e93b-4ea3-a525-e6a7a16752c8", examples: ["Retaliatory strike.", "Retaliatory measures.", "Action was retaliatory.", "Fear of retaliatory action."] },
  { id: "f10b74cb-2475-47ab-a391-f8a817005433", examples: ["Fear of retaliation.", "In retaliation for.", "Acted in retaliation.", "Threatened retaliation."] },
  { id: "45688b8d-acbf-4ace-b7bd-c4d1b11f491e", examples: ["Reminiscent of old times.", "Smell is reminiscent.", "Highly reminiscent.", "Style reminiscent of the 90s."] },
  { id: "92285ac3-a608-4ca0-b8e6-da485ed4dee8", examples: ["Reminisce about the past.", "Love to reminisce.", "Sit and reminisce.", "Reminisce with friends."] },
  { id: "488ad48d-f9d5-4e1a-bb66-8dd0a2739f58", examples: ["Childhood reminiscence.", "Writing a reminiscence.", "Lost in reminiscence.", "A vivid reminiscence."] },
  { id: "e9371ac9-4516-4395-94d3-5b0537f7a587", examples: ["Reinforce the wall.", "Reinforce the idea.", "Troops to reinforce.", "Need to reinforce."] },
  { id: "299894f8-ee6b-470a-916b-0818db30e402", examples: ["Positive reinforcement.", "Send reinforcement.", "Reinforcement of rules.", "Steel reinforcement."] },
  { id: "36a5bec3-27d7-4367-a4f7-ce37349ac2e9", examples: ["Quantifiable data.", "Is it quantifiable?", "Quantifiable results.", "Not easily quantifiable."] },
  { id: "ff52304c-c5c2-4303-adab-67c4ced595a5", examples: ["Large quantity.", "Quality over quantity.", "Unknown quantity.", "Buy in quantity."] },
  { id: "fe02b95f-9a2f-4ace-96d5-dc12697d3da6", examples: ["He looked puzzled.", "Puzzled expression.", "I am puzzled.", "Puzzled by the news."] },
  { id: "5deb3304-71b4-40b9-897a-8d335c1b5edf", examples: ["It puzzles me.", "This problem puzzles scientists.", "Don't let it puzzle you.", "What puzzles you?"] },
  { id: "82d5e1fc-b810-49d6-86b4-1acd46a11962", examples: ["Solve a puzzle.", "Jigsaw puzzle.", "It's a puzzle to me.", "Missing piece of the puzzle."] },
  { id: "f1d256cc-31d4-4852-924f-c7097197039e", examples: ["Pure water.", "Pure joy.", "Pure gold.", "Keep it pure."] },
  { id: "bd9d2d5c-d24d-45a0-a2d4-9504bdd58040", examples: ["Purify the water.", "Purify the soul.", "Way to purify.", "Purify gold."] },
  { id: "98b6141b-a2c3-42fc-a1b9-9487a306d37b", examples: ["Water purification.", "Purification process.", "Ritual purification.", "Air purification."] },
  { id: "effa5f31-94b1-4b10-8539-40e0b3069de9", examples: ["Provoke a reaction.", "Don't provoke him.", "Provoke anger.", "Might provoke war."] },
  { id: "7b71b1e3-debd-486b-b8e2-2213da8aefd3", examples: ["Deliberate provocation.", "Reacted to provocation.", "Without provocation.", "Ignore the provocation."] },
  { id: "f4fb9b72-0560-46b3-a25f-5c6f025952b6", examples: ["Possessive husband.", "Possessive pronoun.", "Start being possessive.", "Overly possessive."] },
  { id: "2149201f-21a5-447c-95c9-4d24f32b5d8c", examples: ["Possess a weapon.", "Possess knowledge.", "Demon possessions.", "She possesses talent."] },
  { id: "6a15db35-d099-4c43-8966-7240ca7ffe25", examples: ["Prized possession.", "In his possession.", "Take possession.", "Lose possession."] },
  { id: "70913276-d3b3-440c-af33-7338a0c0d781", examples: ["Opposed to the plan.", "Strongly opposed.", "Two opposed groups.", "He is opposed."] },
  { id: "2c6db816-0507-4da6-a044-e7614389895a", examples: ["Oppose the motion.", "They oppose the war.", "Boldly oppose.", "Oppose unfair laws."] },
  { id: "204d41b5-f85b-48bd-92f1-39cfadcea9c2", examples: ["Strong opposition.", "Political opposition.", "Face opposition.", "In opposition to."] },
  { id: "acc452d7-46af-4e89-920c-08975e5ea087", examples: ["Mixed feelings.", "Mixed nuts.", "Mixed bag.", "Mixed reaction."] },
  { id: "a48dcebf-48b7-48e6-9a1a-7ac27c2d6f8b", examples: ["Mix the ingredients.", "Don't mix them up.", "Mix business with pleasure.", "Oil and water don't mix."] },
  { id: "dc28c6c0-1e6e-4a4d-83ae-f1d78226e866", examples: ["Mixture of oil and water.", "Strange mixture.", "Add the mixture.", "Cake mixture."] },
  { id: "9212c189-4fe1-4b9b-8eab-a02a5d11aec2", examples: ["Justifiable homicide.", "Is it justifiable?", "Justifiable anger.", "Hardly justifiable."] },
  { id: "54fac048-0572-4d0a-89c3-8403cf0eb997", examples: ["Justify your actions.", "Can you justify the cost?", "Hard to justify.", "Justified the means."] },
  { id: "de7c3bf2-4f8d-4f18-b7f3-e21bd2b069eb", examples: ["No justification for it.", "Without justification.", "Moral justification.", "Seek justification."] },
  { id: "71fcaba2-c087-4cfc-8683-af57a4e7460e", examples: ["Intrusive questions.", "Intrusive noise.", "Don't be intrusive.", "Highly intrusive."] },
  { id: "8c2787e9-7384-4313-becc-4f8032a5764b", examples: ["Don't intrude.", "Intrude on privacy.", "Sorry to intrude.", "Intrude into lives."] },
  { id: "ab2246ab-a8cf-410a-9ac9-48424160c3ef", examples: ["Unwelcome intrusion.", "Intrusion of privacy.", "Resent the intrusion.", "Forgive the intrusion."] },
  { id: "b4ae71ee-5495-48ff-a6e8-607213de09c0", examples: ["Indicative of a problem.", "Is this indicative?", "Indicative mood.", "Signs are indicative."] },
  { id: "fe9d6fe9-82c2-407c-9446-d365783cea04", examples: ["Indicate left.", "Signs indicate rain.", "Please indicate.", "Study indicates."] },
  { id: "9d7305d7-a342-49b4-b972-a5aad22153e6", examples: ["Give an indication.", "Clear indication.", "No indication of trouble.", "Early indication."] },
  { id: "0007cd6f-6950-4db6-ace9-29d040e1affd", examples: ["Inclusive resort.", "Inclusive price.", "All-inclusive tour.", "Inclusive society."] },
  { id: "0f9891d4-7658-4921-9437-391389bb2898", examples: ["Price includes tax.", "Include me in.", "Did you include it?", "Include details."] },
  { id: "364b7f13-20f4-4b07-9d90-02782c6cfee6", examples: ["Inclusion of women.", "Social inclusion.", "Exclusion and inclusion.", "Favoured inclusion."] },
  { id: "488e7484-1a33-491d-841e-d9935802bc2c", examples: ["A forgivable mistake.", "Is it forgivable?", "Hardly forgivable.", "Forgivable sin."] },
  { id: "c5a10a56-7577-492e-ad7f-6092e9132e87", examples: ["Please forgive me.", "Forgive and forget.", "Can't forgive him.", "God forgive you."] },
  { id: "13706a34-33e7-4884-ba98-511d19e23cc0", examples: ["Ask for forgiveness.", "Grant forgiveness.", "Seek forgiveness.", "Full forgiveness."] },
  { id: "dd16c933-dc1d-4abf-bb01-bb93ecf59b45", examples: ["Flirtatious smile.", "Being flirtatious.", "Flirtatious behavior.", "She felt flirtatious."] },
  { id: "593bc25f-699e-4edc-a135-78ad70db6c6b", examples: ["Don't flirt with me.", "Flirt with danger.", "He likes to flirt.", "She flirted back."] },
  { id: "07f20d6c-3629-410e-a210-142f7a991d15", examples: ["He is a bit of a flirt.", "Terrible flirt.", "She is a big flirt.", "Enjoyed being a flirt."] },
  { id: "f84405e3-e1b7-452a-8c5c-669c6809b04a", examples: ["Favourable outcome.", "Favourable weather.", "Most favourable.", "Favourable impression."] },
  { id: "e6077cd8-499a-495d-a654-1b3495cbb7fb", examples: ["Favour one side.", "Fortune favours the bold.", "Favour a proposal.", "Do not favour him."] },
  { id: "fbc9861f-65c3-48e2-9da9-dbfc5e01b0e6", examples: ["Do me a favour.", "Small favour.", "In favour of.", "Return the favour."] },
  { id: "337a35e7-e873-4c80-b060-d656f85af507", examples: ["Expose the truth.", "Expose to light.", "Don't expose it.", "Expose corruption."] },
  { id: "34bacfb8-9648-433e-95bc-db3eefd0b555", examples: ["Sun exposure.", "Exposure to radiation.", "High exposure.", "Gain exposure."] },
  { id: "2abc6ddf-6017-493b-b6e4-99e25985d765", examples: ["Exploratory surgery.", "Exploratory talks.", "Exploratory mission.", "Purely exploratory."] },
  { id: "58bfdc27-6772-47f4-95c4-76b619e23379", examples: ["Explore the city.", "Explore new ideas.", "Explore possibilities.", "Let's explore."] },
  { id: "b0a75a44-d4b6-4fbf-a159-845871c04996", examples: ["Space exploration.", "Oil exploration.", "Age of exploration.", "Exploration team."] },
  { id: "6d8e3588-2be0-4485-bfd9-82551b235890", examples: ["Exhaust the supply.", "Car exhaust.", "Exhaust yourself.", "Resources exhausted."] },
  { id: "f1e0c257-ee38-44a8-80ba-4fee7667f555", examples: ["Physical exhaustion.", "Nervous exhaustion.", "Collapse from exhaustion.", "Total exhaustion."] },
  { id: "1983aab2-2844-4c7a-829d-fb0d25dbfa9b", examples: ["Disrupt the meeting.", "Disrupt sleep.", "Don't disrupt class.", "Strike disrupted travel."] },
  { id: "e61c8dba-76b3-429e-819e-c0786de9cf59", examples: ["Cause disruption.", "Major disruption.", "Disruption to service.", "Minimal disruption."] },
  { id: "a2049270-8f10-4fb4-9bcd-b4ee17b70162", examples: ["Descriptive writing.", "Descriptive passage.", "Be descriptive.", "Descriptive words."] },
  { id: "675df223-402d-4443-91c4-ac5a6815c933", examples: ["Describe the scene.", "Words cannot describe.", "Describe him.", "Describe what happened."] },
  { id: "8429d4b1-dd95-40cd-8804-1345329a7bb9", examples: ["Detailed description.", "Fit the description.", "Beyond description.", "Job description."] },
  { id: "4e1cfefd-0d52-4081-ab81-623f03b17b3b", examples: ["Controlled substance.", "Controlled explosion.", "Controlled behaviour.", "Everything is controlled."] },
  { id: "36d80c3a-ee01-4468-b025-7967969c2cae", examples: ["Control the crowd.", "Lose control.", "Take control.", "Control yourself."] },
  { id: "fcc2cda7-8465-4996-a83b-8c571c568ca9", examples: ["Out of control.", "Remote control.", "Gun control.", "Self-control."] },
  { id: "4175006a-932f-4ba9-a40e-2090b3af2899", examples: ["Comparable size.", "Comparable to the original.", "Not comparable.", "Comparable worth."] },
  { id: "fd8d8b0b-4263-4b95-a769-fd65f650375e", examples: ["Compare prices.", "Compare apples and oranges.", "Nothing compares to you.", "Compare notes."] },
  { id: "30bf6dc3-8538-411e-913b-f43139a56907", examples: ["In comparison.", "Make a comparison.", "By comparison.", "Fair comparison."] },
  { id: "6cbf3219-6254-45d9-8233-8e4722fbda00", examples: ["Bent out of shape.", "Bent nail.", "Get bent.", "Bent on destruction."] },
  { id: "576bb0d2-0291-4152-9b3c-1b448a735d8e", examples: ["Bend the knee.", "Bend in the road.", "Round the bend.", "Bend over."] },
  { id: "ac23fcf1-575e-4703-9f23-393ae57aa5eb", examples: ["Authentic food.", "Authentic signature.", "Is it authentic?", "Authentic voice."] },
  { id: "e8673f8f-82ac-4680-ba50-36b2575fe6b1", examples: ["Authenticate the painting.", "Authenticate user.", "Need to authenticate.", "Failed to authenticate."] },
  { id: "899f5afb-bd31-4d4b-a4bb-e5b780d60c09", examples: ["Check authenticity.", "Certificate of authenticity.", "Quest for authenticity.", "Doubt the authenticity."] },
  { id: "f84fce32-4fbe-471d-adff-14f58c09c897", examples: ["Associate with them.", "Associate ideas.", "Business associate.", "I don't associate with weakness."] },
  { id: "57d7baad-1ea3-45e9-b70e-66886c8d334d", examples: ["In association with.", "Football association.", "Memories by association.", "Guilt by association."] },
  { id: "0931236b-f430-4bba-972b-1e68d8e2d7c5", examples: ["Appreciative audience.", "Be appreciative.", "Appreciative smile.", "Appreciative glance."] },
  { id: "805bbeac-344e-44e0-a46d-4c7a2c1ed219", examples: ["I appreciate it.", "Appreciate value.", "Appreciate art.", "Do you appreciate me?"] },
  { id: "0e4273d3-356d-4d56-8bd2-024c8d7e6242", examples: ["Show appreciation.", "In appreciation of.", "Art appreciation.", "Deep appreciation."] },
  { id: "3448ff22-61b1-4193-88ea-32b69d772e16", examples: ["Adjustable strap.", "Fully adjustable.", "Adjustable rate.", "Adjustable seat."] },
  { id: "9f2bd24e-1d86-4626-84b1-c8d89f944252", examples: ["Adjust the volume.", "Adjust to life.", "Hard to adjust.", "Adjust the mirror."] },
  { id: "f93ad183-7c7d-42fe-a029-292c727b07e4", examples: ["Make an adjustment.", "Minor adjustment.", "Adjustment period.", "Adjustment bureau."] },
  { id: "3b872c5f-2bd8-45fd-8031-0d47c380861a", examples: ["Cumulative effect.", "Cumulative interest.", "Cumulative score.", "Effects are cumulative."] },
  { id: "39243a8d-f77a-42fd-8aba-9fd8394cec73", examples: ["Accumulate wealth.", "Dust accumulates.", "Accumulate evidence.", "Debts accumulate."] },
  { id: "28463ecb-9da1-4b11-a1fe-5fe9409dbb0e", examples: ["Accumulation of snow.", "Capital accumulation.", "Slow accumulation.", "Toxic accumulation."] },
  { id: "c4a84d4b-6a6e-4a6c-a365-c1f26b3f002c", examples: ["Voter suppression.", "Suppression of evidence.", "Suppression of rights.", "Fire suppression."] },
  { id: "574581da-9a04-4275-b30a-994ae7f79d13", examples: ["Suppress the news.", "Suppress a laugh.", "Suppress anger.", "Suppress the revolt."] },
  { id: "e98256d0-e147-4daf-bd5e-81527bfab8b5", examples: ["Subtraction problem.", "Addition and subtraction.", "Simple subtraction.", "Do the subtraction."] },
  { id: "b57d2d91-d31b-4e1f-a318-195010c5480c", examples: ["Subtract ten.", "Subtract the cost.", "Add or subtract.", "Subtract marks."] },
  { id: "8bbd2646-54c3-45d8-9cfe-a9997b501995", examples: ["Make a substitution.", "Product substitution.", "Substitution policy.", "Player substitution."] },
  { id: "4b2115aa-ebbc-469c-9594-e00f558363a0", examples: ["Substitute teacher.", "Substitute sugar.", "No substitute for hard work.", "Can I substitute this?"] },
  { id: "0feb6272-708c-4516-8c7d-9ee784de7e09", examples: ["Need reassurance.", "Gave him reassurance.", "Seek reassurance.", "Words of reassurance."] },
  { id: "f3c1c0c3-abc5-4d51-b9a3-5a54ab873e2e", examples: ["Reassure the public.", "Let me reassure you.", "Reassure a child.", "Tried to reassure her."] },
  { id: "5c9b9758-7fe7-49b6-9a51-7c878b269d58", examples: ["Pursuit of happiness.", "Police pursuit.", "In pursuit of.", "Trivial pursuit."] }
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
