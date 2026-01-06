
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

const batch = [
  { id: "e85e0984-d621-4f32-8438-e4b7b3986348", examples: ["Obey the traffic sign.", "Stop at the traffic sign.", "Traffic sign ahead.", "Damaged traffic sign."] },
  { id: "02457a20-c0b2-4cf7-a910-c016e7e8dfde", examples: ["Bright and cheerful room.", "Cheerful disposition.", "Stay cheerful.", "Cheerful greeting."] },
  { id: "4086f1fb-c930-48b5-ae09-8a2c59d9966c", examples: ["Sick and tired of waiting.", "I'm sick and tired of this.", "Sick and tired of arguing.", "Sick and tired."] },
  { id: "2f48cc74-0ee6-47bd-bfe8-d1262fe0db9d", examples: ["Don't push and shove.", "Crowd began to push and shove.", "Push and shove to get in.", "Rough push and shove."] },
  { id: "5e84abc8-040b-418d-9c6c-746deade555a", examples: ["Every bit as good.", "Every bit as violent.", "She is every bit as smart.", "Every bit as difficult."] },
  { id: "d0560d2c-6b94-4506-b8e5-24153cabec79", examples: ["If you don't mind me asking.", "Where are you, if you don't mind me asking?", "Who is he, if you don't mind me asking?", "Subtle, if you don't mind me asking."] },
  { id: "fc4b75c8-37ef-4abf-a919-2d39ee5b04a1", examples: ["Do you by any chance know?", "Happen to know the time?", "By any chance, are you free?", "Do you happen to know him?"] },
  { id: "f0bc51a0-461d-4ce6-9d4c-498635a3b5be", examples: ["Letting her hair down.", "Need to let your hair down.", "Relax and let your hair down.", "She is letting her hair down tonight."] },
  { id: "ee4cadfc-24b0-4ea6-918b-56783f0bd866", examples: ["Too good to be true.", "Sounds too good to be true.", "It was too good to be true.", "Deal is too good to be true."] },
  { id: "0f1bbb19-3fd5-4ede-b89e-6201cdd337df", examples: ["Keep his feet on the ground.", "Stay grounded.", "Keep your feet on the ground.", "He keeps his feet on the ground."] },
  { id: "f35b3309-c780-4a9a-974b-e06a4b105ff5", examples: ["Living in a world of her own.", "In a world of his own.", "She's in a world of her own.", "Lost in a world of her own."] },
  { id: "6cafdd87-2f88-49a1-abd9-8c06dbeb6599", examples: ["It was a foregone conclusion.", "The result is a foregone conclusion.", "Not a foregone conclusion.", "Seems like a foregone conclusion."] },
  { id: "0b6147e7-5b8b-47b7-98af-e3197df4458c", examples: ["Your guess is as good as mine.", "Who knows? Your guess is as good as mine.", "Where is it? Your guess is as good as mine.", "As good as mine."] },
  { id: "4cc60f9e-0bd3-4d4e-ac01-0f9c8aa4a9e5", examples: ["You have to be joking.", "You're kidding me.", "You can't be serious.", "He must be joking."] },
  { id: "7f1c4adc-94ad-489f-8266-6ad3abca406b", examples: ["Feeling under the weather.", "Bit under the weather today.", "She is under the weather.", "Under the weather with a cold."] },
  { id: "7d1fc2f3-8731-4ebe-91b5-803bede9dade", examples: ["My mind went a complete blank.", "Went blank during the exam.", "Name went blank.", "Mind went completely blank."] },
  { id: "a01e72b5-6fea-44fe-ad63-86a2de804ade", examples: ["I could do with a drink.", "Could do with some help.", "Car could do with a wash.", "We could do with a break."] },
  { id: "f44e0fd2-365a-42c8-b06f-a30cf27ffd78", examples: ["In one ear and out the other.", "Goes in one ear and out the other.", "Advice goes in one ear and out the other.", "Listening but in one ear and out the other."] },
  { id: "7f654e28-66d6-4300-9281-b328aeaeb923", examples: ["It's no good worrying.", "No use worrying about it.", "It's no good complaining.", "No use crying."] },
  { id: "3a0c6763-81c2-42be-936b-655d513cbce1", examples: ["Don't be so nosy.", "Nosy neighbor.", "Nosy parker.", "She is very nosy."] },
  { id: "cdb9ff55-577e-41aa-87de-459a1d820f37", examples: ["Posh restaurant.", "Very posh accent.", "Too posh for me.", "Posh clothes."] },
  { id: "eeb238fc-8a57-4942-85e2-b23d22e0f3f3", examples: ["Dodgy character.", "Dodgy deal.", "Car looks dodgy.", "Dodgy stomach."] },
  { id: "238f11a2-7c2c-41db-a939-443feea87bb0", examples: ["He was conned.", "Conned out of money.", "Don't get conned.", "Conned me."] },
  { id: "7d7f1000-3c48-40e9-8923-d50a00f971b5", examples: ["Don't be daft.", "Daft idea.", "He's a bit daft.", "Acting daft."] },
  { id: "5569761b-d6f5-4062-94de-40ab6cb53b9d", examples: ["Caught a bug.", "Stomach bug.", "Flu bug.", "Nasty bug going around."] },
  { id: "fab240b0-5ae8-4d2d-b326-6f9167e7b4f6", examples: ["Have a kip.", "Quick kip.", "Need a kip.", "Kip on the sofa."] },
  { id: "6ce880a7-1442-41a2-8976-4eeeb745f16b", examples: ["I'm totally broke.", "Flat broke.", "Go for broke.", "Broke until payday."] },
  { id: "e1c43fee-8ffb-48ac-9570-f1c714e859f7", examples: ["Our team got thrashed.", "Thrashed the opponent.", "Getting thrashed.", "Hammered and thrashed."] },
  { id: "aa5e8122-48ce-4086-a7b6-466a09b31c1d", examples: ["I'm starving.", "Dying for food, starving.", "Starving to death.", "Absolutely starving."] },
  { id: "0852341f-d1b8-4f71-a440-18ffc21c97ef", examples: ["Got a lot of stick.", "Took some flak.", "Giving me stick.", "Avoid the flak."] },
  { id: "73a04bdd-2ec8-4d9f-a6ca-38db3688332b", examples: ["What a din!", "Stop making a racket.", "Terrible din.", "Deafening racket."] },
  { id: "6c2191c5-0325-4fc8-815a-2bde0c16b4f9", examples: ["Cheers, mate.", "Ta very much.", "Cheers for that.", "Say ta."] },
  { id: "b122dd52-e12d-4811-a6e9-52ffc8616a74", examples: ["Family get-together.", "Small get-together.", "Have a get-together.", "Annual get-together."] },
  { id: "3659263d-85df-4cd7-b771-6588eae89189", examples: ["The cheek of him!", "You have some nerve.", "What a cheek!", "She has the nerve to ask."] },
  { id: "e127ba75-1907-4325-b224-cb58ced0fc73", examples: ["That's a rip-off.", "Total rip-off.", "Don't buy it, it's a rip-off.", "Got ripped off."] },
  { id: "77e9291a-7df9-439f-b1a3-58fbbbf17e87", examples: ["It's such a drag.", "Week is a drag.", "Don't be a drag.", "Main drag."] },
  { id: "ad706843-5512-4936-9af6-8f1d5bbf8da1", examples: ["He is a pain in the neck.", "What a pain.", "Real pain.", "Such a pain."] },
  { id: "6b2e0383-b269-4767-bc8c-7653b3693498", examples: ["Go to the loo.", "Where's the loo?", "Queue for the loo.", "Need the loo."] },
  { id: "8b2f15b3-b640-414b-9e36-2a423b6a8156", examples: ["Lousy weather.", "Had a lousy time.", "Lousy excuse.", "Feel lousy."] },
  { id: "6256621c-1134-4a87-97f6-008d7a4cd65c", examples: ["Five quid.", "Lend me a quid.", "Cost a few quid.", "Make a fast quid."] },
  { id: "9925da38-ba5d-43b4-a8b9-73412d7e04eb", examples: ["He is so stingy.", "Tight-fisted behavior.", "Stop being tight-fisted.", "Stingy with tips."] },
  { id: "396cc85d-29dc-4716-85e3-c587308d8175", examples: ["Vile smell.", "Disgusting habit.", "Vile weather.", "That's disgusting."] },
  { id: "becc2168-bea5-4b72-8dc7-4a23be1fa9d1", examples: ["Stop moaning.", "Always moaning about work.", "Moaning and groaning.", "He's moaning again."] },
  { id: "f6f378d5-a527-4f17-9354-26270a3cadcb", examples: ["Someone nicked my phone.", "Pinched a wallet.", "Who nicked it?", "Get nicked (arrested)."] },
  { id: "21ad432a-e458-4d34-8c76-21cdc3900ee2", examples: ["Nice bloke.", "Some guy told me.", "Funny bloke.", "Ask that guy."] },
  { id: "8bcf118b-3470-4e42-8464-f45f84ee4f5c", examples: ["Time elapsed.", "Years have passed.", "Days gone by.", "Time has elapsed."] },
  { id: "fa1fdc0d-cba1-4705-bdaf-359d76c5e866", examples: ["Prolong the agony.", "Prolong life.", "Prolong the meeting.", "Don't prolong it."] },
  { id: "9403ae8d-4d2d-42e1-b008-753ac7771d58", examples: ["A difficult phase.", "Next stage of the project.", "Just a phase.", "Development stage."] },
  { id: "e87bd7f2-e3cf-4be7-98aa-bd4f8b7a748f", examples: ["After a brief interval.", "Interval between shows.", "At regular intervals.", "During the interval."] },
  { id: "3b3fe806-e4f0-440a-b07f-7dc0be369e6c", examples: ["That was before my time.", "Happened before my time.", "Way before my time.", "Music before my time."] },
  { id: "4dce9e89-e44d-488a-b428-12cb5dc232b0", examples: ["In retrospect, I was wrong.", "With hindsight, it's clear.", "Good in retrospect.", "Easy with hindsight."] },
  { id: "a290987e-bc01-4d99-a374-8343d1161207", examples: ["Changed plans at the last minute.", "Left at the last minute.", "Last minute deal.", "Don't wait until the last minute."] },
  { id: "b68d907d-efbe-423b-a48a-565c4cebe177", examples: ["I'm out of my depth.", "Way out of one's depth here.", "Felt out of his depth.", "Out of depth in math."] },
  { id: "f86bc26c-3cca-46f8-b4c6-0983c7fc1915", examples: ["Party was an unmitigated disaster.", "Total unmitigated disaster.", "Unmitigated disaster from start to finish.", "It was an unmitigated disaster."] },
  { id: "17c5d48d-c412-459f-b763-67e9a4c982ce", examples: ["Managed to scrape through.", "Get through the exam.", "Scrape through with a pass.", "Barely scrape through."] },
  { id: "10e997aa-bdf0-48b6-aaac-858261aaf4f2", examples: ["We are up against it.", "Really up against it now.", "Up against it with time.", "Team is up against it."] },
  { id: "991e3faa-c68f-41bc-aa23-6a2b127e2722", examples: ["He is past it.", "Feeling a bit past it.", "Think I'm past it?", "Not past it yet."] },
  { id: "2357af93-2b55-40f7-9fce-6f5baa2f64ab", examples: ["The movie was a flop.", "Total flop.", "It might flop.", "Big flop."] },
  { id: "53872508-3502-4716-8339-0f231516d106", examples: ["Let's make a go of it.", "She wants to make a go of it.", "Didn't make a go of it.", "Try to make a go of it."] },
  { id: "f2fbec00-413c-4afa-900a-c10f0b75a5a7", examples: ["Fulfil your potential.", "Help him fulfil his potential.", "Failed to fulfil potential.", "Strive to fulfil potential."] },
  { id: "c1421190-c3c3-480b-bd74-618fd18a662d", examples: ["Plan came unstuck.", "Hope it doesn't come unstuck.", "Came unstuck at the end.", "Things came unstuck."] },
  { id: "41c25f4f-f552-45ba-90a5-a442b22ad1d2", examples: ["Resounding victory for the team.", "Won a resounding victory.", "Resounding victory.", "A resounding success."] },
  { id: "f74804d1-eabb-4a58-9749-6119c1bb2b2a", examples: ["Cutting edge technology.", "At the cutting edge.", "Cutting edge design.", "Using cutting edge tools."] },
  { id: "0c814e7e-1581-46d6-b28a-397a557f51e2", examples: ["In mint condition.", "Perfect condition.", "Kept in mint condition.", "Looks mint."] },
  { id: "d2e71c0d-c38b-42d7-ab28-877fca57e471", examples: ["Trace of poison.", "Disappeared without a trace.", "Trace the call.", "Trace elements."] },
  { id: "c988cc68-c9d8-4a2d-9407-699d4e3ee3cd", examples: ["Preserve history.", "Preserve fruit.", "Effort to preserve.", "Preserve peace."] },
  { id: "652b4df3-84a7-49bd-a9f9-57e37ba743c7", examples: ["Falling into decay.", "State of disrepair.", "Tooth decay.", "Urban decay."] },
  { id: "e6512e5b-ba5c-4b4f-9236-2da2b8d0043b", examples: ["Run-down building.", "Dilapidated house.", "Ramshackle hut.", "Area is run-down."] },
  { id: "1f554f4a-e9a7-4e5a-b09f-45ecf26cbd09", examples: ["Renovate the kitchen.", "Plan to renovate.", "Newly renovated.", "Renovate a house."] },
  { id: "e88519ef-b5ef-4294-b908-5ba4c68fb553", examples: ["Formerly known as.", "Previously mentioned.", "She was formerly a teacher.", "Previously owned."] },
  { id: "76dec86c-261e-4c7d-a3d5-79cb0a24eccb", examples: ["Castle in ruins.", "Life in ruins.", "Left in ruins.", "Economy in ruins."] },
  { id: "a584086e-b6e3-4a9b-8a96-484a6e1f1c47", examples: ["Preservation of wildlife.", "Food preservation.", "Historic preservation.", "Self-preservation."] },
  { id: "649e2413-4967-4739-8db9-a1c3f77c4896", examples: ["Mass destruction.", "Cause destruction.", "Destruction of property.", "Path of destruction."] },
  { id: "2a830dc4-572a-457f-b4ec-6a60ac19f03e", examples: ["Extra-terrestrial.", "Ultra-modern.", "Extra-curricular.", "Ultra-violet."] },
  { id: "7221b938-347c-4aba-adc9-2bb335fb582d", examples: ["Body at rest.", "Put your mind at rest.", "At rest now.", "Set it at rest."] },
  { id: "ac6523ed-964e-4946-84f3-0177cae48fd4", examples: ["New perspective.", "From my perspective.", "Keep things in perspective.", "Different perspective."] },
  { id: "8a6a6ee7-ce44-4070-b82e-5e54432428ea", examples: ["Take it in his stride.", "Took the bad news in stride.", "Take change in one's stride.", "Learning to take it in stride."] },
  { id: "396ecb02-8844-4504-977b-3e8b6552044c", examples: ["Dented my confidence.", "Car door is dented.", "Pride was dented.", "Dented helmet."] },
  { id: "1bed0983-ebd2-4e1d-b3f8-86bae220892c", examples: ["TV channel.", "Channel energy.", "English Channel.", "Communication channel."] },
  { id: "002bd435-dfab-4dcf-a4d1-6f858460937a", examples: ["Do it regardless.", "Regardless of cost.", "Carried on regardless.", "Regardless of age."] },
  { id: "b03c7523-fd2b-4da8-972a-dc45ee9cdafa", examples: ["Articulate speaker.", "She is very articulate.", "Hard to articulate.", "Articulate feelings."] },
  { id: "5a215dad-ee90-46b9-aa1c-2b1f40c88aca", examples: ["Don't let it get you down.", "Rain gets her down.", "Work gets me down.", "Nothing gets him down."] },
  { id: "8de8af27-02ee-4fdc-b9da-cc930cbfa5f7", examples: ["High self-esteem.", "Held in high esteem.", "Self-esteem issues.", "Low esteem."] },
  { id: "bf613f5a-0523-4d2b-98fb-b403f7b35537", examples: ["Overcome obstacles.", "Overcome with grief.", "Hard to overcome.", "Overcome fear."] },
  { id: "45e1e798-a846-4b9a-8803-ac6aed33d0c0", examples: ["Tackling the problem.", "Tackling crime.", "Good tackling.", "Start tackling it."] },
  { id: "647612c0-f4c1-406b-a73a-841c51449fd4", examples: ["Confronting the issue.", "Confronting fears.", "Stop confronting him.", "Avoid confronting."] },
  { id: "2b850b70-95e3-40bd-b479-994c470ae74f", examples: ["Exacerbate the situation.", "Don't exacerbate it.", "Drug exacerbated the pain.", "Problems exacerbated."] },
  { id: "d127c26d-7ddd-451c-a6b4-5894ac9015ae", examples: ["Problems arise.", "See what comes up.", "Did anything arise?", "Issues come up."] },
  { id: "f004aeee-96d3-428a-b522-e464f5d90f1e", examples: ["Face up to reality.", "Can't face up to it.", "Face up to facts.", "Hard to face up to."] },
  { id: "a5092bc7-a4e0-4739-87b0-e97e1d686169", examples: ["Symbolic gesture.", "Highly symbolic.", "It's purely symbolic.", "Symbolic meaning."] },
  { id: "f61f8e0f-473d-4b0f-a5d2-05b386662fc9", examples: ["Symbolize peace.", "What does it symbolize?", "Dove symbolizes hope.", "Colors symbolize moods."] },
  { id: "1a77c1a2-9d54-4c78-a082-afebc1b14612", examples: ["Use of symbolism.", "Religious symbolism.", "Rich in symbolism.", "Poetic symbolism."] },
  { id: "86af65b8-c8b4-4691-ba3a-c10413ca29eb", examples: ["Stimulating conversation.", "Stimulating environment.", "Mentally stimulating.", "Find it stimulating."] }
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
