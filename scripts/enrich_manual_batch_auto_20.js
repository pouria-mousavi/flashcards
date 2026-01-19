
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

const batch = [
  { id: "23aa1037-b094-44ef-ade9-61964297916b", examples: ["Attend the congress.", "Member of Congress.", "Congress agreed.", "World congress."] },
  { id: "9bba2a63-e312-46ba-96d8-dd98dea69345", examples: ["In remembrance of.", "Do this in remembrance.", "Service of remembrance.", "Statue in remembrance."] },
  { id: "4218609e-75fc-4682-8cd2-0070b05d1bac", examples: ["Shirk your duty.", "Don't shirk responsibility.", "Shirk work.", "Tendency to shirk."] },
  { id: "d0868119-e750-4c69-8a46-7fb55e206e4e", examples: ["Feel nostalgia.", "Wave of nostalgia.", "Nostalgia for the past.", "Pure nostalgia."] },
  { id: "62146f46-7977-4c9f-9803-be34e3bec2bd", examples: ["Public debate.", "Debate the issue.", "Win the debate.", "Heated debate."] },
  { id: "1173d555-902e-4ecf-92c2-6195409afc07", examples: ["Refurbish the flat.", "Plan to refurbish.", "Refurbish old furniture.", "Newly refurbish."] },
  { id: "20054a0a-1489-4d99-a7a6-0fe99987d7b3", examples: ["Stopped abruptly.", "Left abruptly.", "Ended abruptly.", "Turned abruptly."] },
  { id: "85f4c954-0880-4604-8d58-1aa353e98ec6", examples: ["Slice up the pie.", "Slice up the onions.", "Slice up the territory.", "Slice up for serving."] },
  { id: "bfe81b7b-a10b-4bcf-a4cc-b9086934c1ce", examples: ["Sighed contentedly.", "Smiled contentedly.", "Purred contentedly.", "Sat contentedly."] },
  { id: "bdad399f-3669-400f-813b-81241318d96c", examples: ["Put up with noise.", "Can't put up with him.", "Put up with a lot.", "Hard to put up with."] },
  { id: "d3945ca8-d2d4-46e5-9c43-2b021cf646f4", examples: ["Can't stand him, let alone love him.", "Can't walk, let alone run.", "No money for food, let alone luxury.", "Hard to see, let alone read."] },
  { id: "bb185a7c-487c-4084-a409-9187cb828eee", examples: ["Circumstances beyond your control.", "It's beyond your control.", "Events beyond your control.", "Nothing beyond your control."] },
  { id: "0783d8e9-04de-4f46-b063-ca0050f39ba8", examples: ["Worthwhile investment.", "Make it worthwhile.", "Prove worthwhile.", "Is it worthwhile?"] },
  { id: "a4e1311e-2070-488c-afdd-607877412a07", examples: ["Conjugate the verb.", "Learn to conjugate.", "Conjugate acid.", "Conjugate pair."] },
  { id: "8876c744-5ec7-434b-9c28-96bd9014731c", examples: ["Endless drudgery.", "Life of drudgery.", "Escape the drudgery.", "Daily drudgery."] },
  { id: "bc442529-6247-4c59-914a-5af31769530f", examples: ["Wear slacks.", "Pair of slacks.", "Grey slacks.", "Iron the slacks."] },
  { id: "88afdf16-d15f-4654-b819-b9645cec3291", examples: ["Strangle the victim.", "Strangle the economy.", "Try to strangle.", "Strangle hold."] },
  { id: "832f6dd3-25e1-48e5-8194-f87de6b1ac09", examples: ["Memorable day.", "Memorable performance.", "Make it memorable.", "Truly memorable."] },
  { id: "4d64c2f1-9059-438a-98ac-604d8651ccfa", examples: ["Tenacious grip.", "Tenacious character.", "Be tenacious.", "Tenacious defense."] },
  { id: "956c372b-33dc-405d-889d-34286da1539b", examples: ["Commit an atrocity.", "War atrocity.", "Witness an atrocity.", "Terrible atrocity."] },
  { id: "17f655be-1538-4f22-9e79-c0c623d9ed1d", examples: ["No reason whatsoever.", "None whatsoever.", "Nothing whatsoever.", "No doubt whatsoever."] },
  { id: "66347c78-1867-4624-a60d-3619e398e7f5", examples: ["Keep up the charade.", "It's just a charade.", "End the charade.", "Play charades."] },
  { id: "398a8808-ac92-4202-a41d-1d4b311c1ef9", examples: ["That's a bummer.", "Real bummer.", "Such a bummer.", "What a bummer."] },
  { id: "d89a26f8-8824-4d20-b879-395a76339d7b", examples: ["Leaping into action.", "Saw him leaping into action.", "Ready for leaping into action.", "Without leaping into action."] },
  { id: "27d547c6-2da5-4b77-8901-74560457aff6", examples: ["Loss of concentration.", "Deep concentration.", "Camp concentration.", "Scientific concentration."] },
  { id: "03998000-29ab-4d24-ac15-2d87ef2249f0", examples: ["Added incentive.", "Give an incentive.", "No incentive to work.", "Financial incentive."] },
  { id: "17d42a50-f857-4c5a-982d-6670664a08b7", examples: ["Soothing music.", "Soothing voice.", "Soothing effect.", "Find it soothing."] },
  { id: "55843edc-da78-4f76-809f-721e9a3fe6ee", examples: ["Crouch down low.", "Defensive crouch.", "Make him crouch.", "In a crouch."] },
  { id: "91e59bfb-9799-46f6-9d4d-96ecf4e7458d", examples: ["List of controlled substances.", "Possession of controlled substance.", "Prescribe controlled substance.", "Illegal controlled substance."] },
  { id: "85796349-e6ec-45bd-be9c-d55ed1889205", examples: ["Resist temptation.", "Face temptation.", "Yield to temptation.", "Avoid temptation."] },
  { id: "33310ff8-2c91-48b9-aaf6-8080dea4c5f4", examples: ["Fouling up the works.", "Keep fouling up.", "Stop fouling up.", "Fouling up everything."] },
  { id: "19558472-9b71-48f4-a3d6-e6504de3e239", examples: ["Soldering iron.", "Soldering wire.", "Soldering the joint.", "Learn soldering."] },
  { id: "fd3467eb-c77c-4847-b369-3a184e26ee59", examples: ["Conjugate regular verbs.", "Conjugate irregular verbs.", "Difficult to conjugate.", "Conjugate correctly."] },
  { id: "f44fe249-07f8-4677-a513-d219eb185099", examples: ["Prodigal son.", "Return of the prodigal.", "Prodigal spending.", "Prodigal habits."] },
  { id: "c286ce35-1b7a-4a58-ad56-b97c6bde74b7", examples: ["Pink parasol.", "Under a parasol.", "Carry a parasol.", "Sun parasol."] },
  { id: "8facf25d-4ed1-4283-a723-fa572ddf3b0b", examples: ["The one to which I refer.", "One to which it belongs.", "One to which we go.", "Select the one to which."] },
  { id: "6d779718-e75c-40fc-9bf5-0a9e67764650", examples: ["Public backlash.", "Fear a backlash.", "Backlash against the policy.", "Face a backlash."] },
  { id: "98e40059-ee92-446d-ade4-fb47a744b5b0", examples: ["Act like an imbecile.", "You imbecile!", "Total imbecile.", "Don't be an imbecile."] },
  { id: "6accd548-c30e-4212-adbf-978ad09cd58c", examples: ["Sing praise.", "High praise.", "Worthy of praise.", "Praise the Lord."] },
  { id: "81b68ff8-48ad-4cd8-ab24-794c492c1ad6", examples: ["Get rid of it.", "Want to get rid of.", "Get rid of him.", "Can't get rid of."] },
  { id: "fe2036b5-2598-4fa6-a70f-565d7f61ec1a", examples: ["Endured pain.", "Endured hardship.", "He endured.", "Endured the cold."] },
  { id: "61cd1f29-a048-4677-b111-8baf16b6bd92", examples: ["Scraggly beard.", "Scraggly dog.", "Look scraggly.", "Scraggly hair."] },
  { id: "a47248c5-457d-465f-8360-8c5cf178e95d", examples: ["Associative property.", "Associative memory.", "Associative learning.", "Associative law."] },
  { id: "0abae22e-a15f-4311-867f-8bcfc4157926", examples: ["He is an introvert.", "Total introvert.", "Introvert personality.", "Being an introvert."] },
  { id: "b9ab1579-fc4e-44f9-994e-66d515c036ff", examples: ["Longevity of life.", "Increase longevity.", "Secret to longevity.", "Product longevity."] },
  { id: "d5c33ff0-a10e-47ac-a839-ec21c5262bf9", examples: ["Economic recession.", "Deep recession.", "Cause a recession.", "Recession fears."] },
  { id: "75d6d8c2-93a7-4e47-82db-dddadc9fb76a", examples: ["Reluctant to leave.", "Reluctant agreement.", "Seem reluctant.", "Reluctant hero."] },
  { id: "38e3e8c7-785c-4689-a3b4-728979cb4ad3", examples: ["Cramped quarters.", "Feel cramped.", "Cramped style.", "Cramped space."] },
  { id: "76ff569d-e5f5-40e9-be4a-9378b0d9d087", examples: ["Contemplate nature.", "Contemplate the future.", "Sat to contemplate.", "Did not contemplate."] },
  { id: "541d3134-69cd-40dc-ad72-e28851923ef6", examples: ["Traffic bottleneck.", "Bottleneck in production.", "Remove the bottleneck.", "Create a bottleneck."] },
  { id: "648a13a1-47b1-4e7e-9aa0-9952206f66fa", examples: ["Job redundancy.", "Redundancy payment.", "Avoid redundancy.", "System redundancy."] },
  { id: "f7a04326-eb89-4634-9840-98b7e45ed942", examples: ["Drink coaster.", "Put it on a coaster.", "Beer coaster.", "Roller coaster."] },
  { id: "eccac478-e9c0-469e-bac7-775b2c9b9de6", examples: ["Unscrew bottle cap.", "Collect bottle caps.", "Metal bottle cap.", "Plastic bottle cap."] },
  { id: "161d7b1b-a625-4833-96cf-7675626dfbda", examples: ["Plug into power strip.", "Surge protector power strip.", "Turn off power strip.", "Full power strip."] },
  { id: "b8d6a800-37ca-43b9-9221-637bc1df7c0d", examples: ["Need an extension cord.", "Long extension cord.", "Orange extension cord.", "Run an extension cord."] },
  { id: "82f9e6ca-8ded-4695-9ee7-a001e564cece", examples: ["Door hinge.", "Rusty hinge.", "Oiled the hinge.", "Hinge broken."] },
  { id: "e9505e42-105a-4fdd-a5d6-79ea7e8a0dd9", examples: ["Cluttered room.", "Desk is cluttered.", "Cluttered mind.", "Look cluttered."] },
  { id: "7a27f517-82b8-4b85-8840-6ec8abab436a", examples: ["Tedious work.", "Tedious process.", "Find it tedious.", "Tedious journey."] },
  { id: "174b74ec-36bc-4094-a3d2-14cd8b14624c", examples: ["Soup ladle.", "Ladle it out.", "Big ladle.", "Use a ladle."] },
  { id: "6cde093e-e67e-4327-a77f-77e7cc5b5301", examples: ["Door ajar.", "Leave it ajar.", "Window ajar.", "Slightly ajar."] },
  { id: "2cc498d5-0705-4676-8483-c927cd7e6a2f", examples: ["Flip with spatula.", "Rubber spatula.", "Metal spatula.", "Lick the spatula."] },
  { id: "f3be292d-ba2c-4580-854b-65661a4bb16b", examples: ["Perspective vanishing point.", "Find the vanishing point.", "Lines meet at vanishing point.", "Art vanishing point."] },
  { id: "b83434bf-b002-4f61-8e8d-bcee4991af33", examples: ["Course prerequisite.", "Prerequisite knowledge.", "No prerequisite.", "Meet the prerequisite."] },
  { id: "0038768e-c3c0-48ac-ae86-049ff1850a27", examples: ["Deprecated feature.", "Method is deprecated.", "Deprecated code.", "Avoid deprecated."] },
  { id: "5faf2075-5a86-4d19-854d-c95e3cbc48d1", examples: ["Arbitrary decision.", "Arbitrary rule.", "Seem arbitrary.", "Arbitrary number."] },
  { id: "9efc91e4-0daf-4672-9f9e-15d33105e8cd", examples: ["Ambiguous meaning.", "Ambiguous ending.", "Remain ambiguous.", "Ambiguous phrase."] },
  { id: "e4421875-c3ef-4e0c-8976-b5d0da76de9e", examples: ["Align on strategy.", "Align the text.", "Stars align.", "Align on goals."] },
  { id: "6d8d96c0-53f5-429d-a3eb-cc4129f63b2b", examples: ["Leverage assets.", "Leverage influence.", "Gain leverage.", "Market leverage."] },
  { id: "4f44b247-eacd-4c9c-a020-0b0e26c0ad7f", examples: ["Steep learning curve.", "Quick learning curve.", "Learning curve ahead.", "Overcome learning curve."] },
  { id: "8ec6bb87-5e53-4037-8616-a08da64e90ae", examples: ["Seem counter-intuitive.", "Counter-intuitive result.", "It's counter-intuitive.", "Counter-intuitive logic."] },
  { id: "937efe5a-beb9-4cdd-81cc-1ec826219c26", examples: ["Know intuitively.", "Intuitively understand.", "Act intuitively.", "Feel intuitively."] },
  { id: "9590878b-fd29-4310-ac0d-8e4297c89888", examples: ["Should have gone.", "Should have known.", "Should have asked.", "Should have been."] },
  { id: "9668dd0d-5549-4528-a7a2-2c1a6b8b0a20", examples: ["No alternative but to leave.", "No alternative but to fight.", "There is no alternative but to try.", "No alternative but to accept."] },
  { id: "324be75b-b666-4658-bd2d-57d1987fef12", examples: ["But for him.", "But for the rain.", "But for your help.", "But for luck."] },
  { id: "0eadf7fd-e61c-44ae-96b0-942b09ad3a98", examples: ["Granted that he is old.", "Granted that it's late.", "Take for granted that.", "Granted that you try."] },
  { id: "35c3687d-de7c-449c-9e85-b3a019152609", examples: ["Little did he know.", "Little did I know.", "Little did they know.", "Little did she know."] },
  { id: "e1254b80-87cc-4e14-a352-0ad4c9bf425d", examples: ["Grapple with the problem.", "Grapple with opponent.", "Grapple with guilt.", "Grapple with issues."] },
  { id: "b7900809-353c-4864-8e0c-f6698e97e1bd", examples: ["It goes without saying that I agree.", "It goes without saying that he is rich.", "It goes without saying.", "It goes without saying that care is needed."] },
  { id: "8f5cdca2-9c81-4eb4-99c2-784e7f839d46", examples: ["To my surprise he won.", "To my surprise it rained.", "Much to my surprise.", "To my surprise she came."] },
  { id: "d12616a5-1e35-46ec-b141-5289004c553f", examples: ["Undermine authority.", "Undermine confidence.", "Undermine the foundation.", "Don't undermine me."] },
  { id: "d183a267-894c-40e3-96ae-4187c1b7b1ee", examples: ["Intricate design.", "Intricate plot.", "Intricate details.", "Intricate mechanism."] },
  { id: "b27c874e-5290-474d-ab7b-9391ce1b4130", examples: ["Reinforce the wall.", "Reinforce behavior.", "Reinforce the troops.", "Reinforce the idea."] },
  { id: "4bc76f40-16ed-42e7-87eb-c4bf7f40c510", examples: ["Tangible evidence.", "Tangible results.", "Tangible assets.", "Something tangible."] },
  { id: "617f6e4e-46b0-471a-879e-93423c35a92e", examples: ["Seemingly impossible.", "Seemingly happy.", "Seemingly random.", "Seemingly endless."] },
  { id: "c6bc749e-da90-4d4d-8b3b-ebd8e43782a8", examples: ["Inevitable result.", "Inevitable conclusion.", "It was inevitable.", "Accept the inevitable."] },
  { id: "4d01c4c6-1e28-4b02-b65e-0818ef692cc4", examples: ["As it happens, I know him.", "As it happens, I'm free.", "As it happens.", "It turns out as it happens."] },
  { id: "37eb01a1-1f7d-41bc-8668-801ba5a12701", examples: ["Dry on dish rack.", "Full dish rack.", "Buy a dish rack.", "Clean the dish rack."] },
  { id: "de8274f6-900b-41eb-b69a-5d82b39c1298", examples: ["Serious repercussion.", "Face repercussion.", "No repercussion.", "Political repercussion."] },
  { id: "7c838868-2874-4e3c-ad6d-e1db64f38dee", examples: ["Climb stepladder.", "Fold stepladder.", "Stand on stepladder.", "Buy a stepladder."] },
  { id: "bbebdd98-0009-483b-82a6-8ba8f68b30fa", examples: ["Brush and dustpan.", "Sweep into dustpan.", "Empty dustpan.", "Plastic dustpan."] },
  { id: "db6af7de-d7b7-43a9-b452-35c3dae1a581", examples: ["Wooden clothespin.", "Hang with clothespin.", "Clothespin bag.", "Use a clothespin."] },
  { id: "f0a18d89-fa62-4a1b-a428-4394a2b16876", examples: ["Pluck with tweezers.", "Pair of tweezers.", "Metal tweezers.", "Eyebrow tweezers."] },
  { id: "f5a8e56f-f62d-49ea-8345-e2b1b62c81b4", examples: ["Use nail file.", "Metal nail file.", "Smooth with nail file.", "Emery board nail file."] },
  { id: "fc8e6cef-bb90-4b44-8ce9-bf51c8d6204a", examples: ["Whisk eggs.", "Wire whisk.", "Use a whisk.", "Whisk away."] },
  { id: "c2aa70f8-c27f-47a3-9132-3e92299e2e76", examples: ["Deep fryer.", "Air fryer.", "Chicken in fryer.", "Oil fryer."] },
  { id: "d4f25a25-85e0-408b-96f7-82da0f3bd7ff", examples: ["Need a band-aid.", "Put on a band-aid.", "Rip off band-aid.", "Band-aid solution."] },
  { id: "565473b0-fc2c-46bf-95a5-baa94d0b4f00", examples: ["Don't procrastinate.", "Tend to procrastinate.", "Stop procrastinating.", "Procrastinate later."] },
  { id: "fa529dd0-e8bb-434c-b3e9-acbd50148780", examples: ["Strange contraption.", "Mechanical contraption.", "Build a contraption.", "Complex contraption."] },
  { id: "5b7920bf-723e-4a50-84d0-5e93928c4c2d", examples: ["Talking gibberish.", "Total gibberish.", "Sounded like gibberish.", "Wrote gibberish."] },
  { id: "9dd2e20b-28c7-4a00-aedf-b744e1e9080a", examples: ["Cheese grater.", "Use the grater.", "Box grater.", "Clean the grater."] }
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
