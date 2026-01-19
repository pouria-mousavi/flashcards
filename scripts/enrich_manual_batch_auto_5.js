
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

const batch = [
  { id: "e1bf3921-931a-4c28-941c-300451e045cb", examples: ["Drain the water.", "Brain drain.", "Money down the drain.", "Feeling drained."] },
  { id: "9dbf3932-6188-4d49-81db-04a6c0c429aa", examples: ["Hit a pothole.", "Avoid the pothole.", "Deep pothole.", "Pothole damage."] },
  { id: "6055352c-e788-47c4-aede-37e4e524fa59", examples: ["Curb your enthusiasm.", "Hit the curb.", "Curb spending.", "Sit on the curb."] },
  { id: "25f202ef-52c7-4f92-a50f-f84beb49eca8", examples: ["Use binoculars.", "Bird watching binoculars.", "Pair of binoculars.", "Look through binoculars."] },
  { id: "83037427-5472-4e8c-aecd-91a6b62c8745", examples: ["Magnetic compass.", "Compass direction.", "Moral compass.", "Lost without a compass."] },
  { id: "173c4075-a6cf-4f76-a298-9538f1befdc2", examples: ["Sit by the campfire.", "Build a campfire.", "Campfire stories.", "Extinguish the campfire."] },
  { id: "b4cf766d-db38-47fc-b355-bbfe85b7cf6e", examples: ["Swiss Army penknife.", "Pocket penknife.", "Sharp penknife.", "Cut with a penknife."] },
  { id: "0d565eff-47f2-4a6d-8caa-0926282a7b46", examples: ["Flashlight beam.", "Turn on the flashlight.", "Batteries for flashlight.", "Shine the flashlight."] },
  { id: "db136730-3a7a-4fd7-8c04-ce5dc83e6a7d", examples: ["Paper lantern.", "Lantern festival.", "Light the lantern.", "Holding a lantern."] },
  { id: "cef2a85a-97b7-4bf7-8676-f1b6fdfe7873", examples: ["Warm sleeping bag.", "Roll up the sleeping bag.", "Sleep in a sleeping bag.", "Winter sleeping bag."] },
  { id: "4fa6edff-a195-49d1-be07-278f3af7785b", examples: ["Pitch a tent.", "Sleep in a tent.", "Tent pegs.", "Camping tent."] },
  { id: "a663ec70-618a-41e2-9695-99960473c89e", examples: ["How are you getting on?", "Getting on well.", "She is getting on in years.", "Getting on my nerves."] },
  { id: "3f6af8ad-6c23-456e-be54-5c4be1667b26", examples: ["Put down the dog.", "Had to put him down.", "Put down a rebellion.", "Put down the book."] },
  { id: "9e889ab1-d5b3-41c2-b27b-ac130ed51fa6", examples: ["Help herself to cake.", "Help yourself to food.", "She helped herself to my money.", "Don't help yourself."] },
  { id: "5c8404f9-611a-424e-ba04-188308bc922b", examples: ["Visually impaired.", "Impaired driving.", "Hearing impaired.", "Impaired judgment."] },
  { id: "14d68a2b-2699-4e5c-9fe7-3027c64ad4b5", examples: ["Put the cat to sleep.", "Decision to put it to sleep.", "Put it to sleep gently.", "Had to put it to sleep."] },
  { id: "419c3f19-dba5-4135-934b-34170c0c7574", examples: ["He passed away peacefully.", "My grandfather passed away.", "Sad she passed away.", "Just passed away."] },
  { id: "56192ecd-4deb-4338-a1dd-a12703a6cab9", examples: ["Let him go free.", "Had to let him go (fire).", "Let him go now.", "Refused to let him go."] },
  { id: "98bc1830-6fff-4193-8b7f-7c1ff0a764d3", examples: ["Primarily responsible.", "Chiefly concerned with.", "Predominantly white.", "Primarily for kids."] },
  { id: "cac0b486-5c58-4735-922c-c2a5bd0bf1c9", examples: ["Simply the best.", "Purely coincidental.", "It is simply wrong.", "Did it purely for fun."] },
  { id: "ded1d839-73d1-4aeb-bf60-7a8155e8b053", examples: ["Relatively easy.", "Somewhat difficult.", "It was somewhat boring.", "Relatively speaking."] },
  { id: "70357986-fbea-4a7d-9d58-30b8e81f11f8", examples: ["As far as I'm concerned.", "Not concerned about it.", "Concerned parents.", "Deeply concerned."] },
  { id: "ec101838-21b6-4092-82f2-c6309f412e3b", examples: ["Financially viable.", "Commercially successful.", "Speaking financially.", "Commercially available."] },
  { id: "d51c7d30-25fd-4f92-861b-c50a61492c67", examples: ["Frankly speaking.", "Personally, I disagree.", "Quite frankly.", "Personally responsible."] },
  { id: "4f760ba8-b61a-41ed-9bd8-725e69259bb0", examples: ["Curiously silent.", "Strangely familiar.", "Oddly enough.", "Behaved strangely."] },
  { id: "a96e85d5-eb5c-43dd-b75f-8724280e6eb5", examples: ["Evidently true.", "Evidently, he forgot.", "Self-evidently.", "He was evidently upset."] },
  { id: "00d8905b-fd69-468d-9e43-f25bc715450d", examples: ["Negligent driving.", "Negligible amount.", "Grossly negligent.", "Difference is negligible."] },
  { id: "ddb24a01-ac46-4748-a19b-4c6a3c4b9842", examples: ["Invaluable help.", "Worthless junk.", "Valueless antique.", "Experience is invaluable."] },
  { id: "e7ef6211-4c72-45a0-8579-483b6db0aa29", examples: ["Childlike wonder.", "Childish behavior.", "Stop being childish.", "Childlike innocence."] },
  { id: "9cd1974f-fb60-41b6-b817-b4f5cfedd98a", examples: ["Stark naked.", "Bare feet.", "Nude painting.", "With bare hands."] },
  { id: "27161c20-e985-41fc-8eef-01e9fa991f39", examples: ["Despondent mood.", "Feeling despondent.", "Grew despondent.", "Despondent over the loss."] },
  { id: "42f98bd1-a2df-478b-a579-d5ca2c22c6e2", examples: ["Notorious criminal.", "Infamous day.", "Notorious liar.", "Become infamous."] },
  { id: "8c4eaa62-7bdd-402c-a8e2-04c9ee8dc15a", examples: ["Get out of sight.", "Out of sight, out of mind.", "Stay out of sight.", "Hidden out of sight."] },
  { id: "848acc74-d066-4f9f-82e3-624fb0c14f36", examples: ["Caught a glimpse of him.", "Just a glimpse.", "Brief glimpse.", "Catch a glimpse."] },
  { id: "b93521fb-c48b-4be9-80c4-f3a4ee93d6e2", examples: ["By means of force.", "Transport by means of rail.", "Escape by means of a tunnel.", "Succeed by means of hard work."] },
  { id: "d4475a46-9ece-427f-ad0f-4597a3f0b2fa", examples: ["Out of touch with reality.", "Out of touch with friends.", "Feel out of touch.", "Politicians out of touch."] },
  { id: "ae56a9e2-2bdb-4256-95e1-4ccddc2af246", examples: ["Out of respect for him.", "Did it out of respect.", "Silence out of respect.", "Act out of respect."] },
  { id: "eb8c55fe-74d7-46f8-ae80-e4b1377539aa", examples: ["Put plans on hold.", "On hold for now.", "Project is on hold.", "Put life on hold."] },
  { id: "17bb13c0-8565-4ee8-8332-a70113974cdd", examples: ["Keep in touch.", "Stay in touch.", "Get in touch.", "Lose touch."] },
  { id: "0aa1e54c-05ef-4d26-9662-7916f4a6b6a1", examples: ["In possession of drugs.", "Found in possession.", "In possession of facts.", "Valuable possession."] },
  { id: "67531f22-a1ae-4431-beb2-fa756c22a145", examples: ["Under investigation.", "Under suspicion.", "Came under suspicion.", "Subject of investigation."] },
  { id: "c63da47c-7347-452c-8314-c13f57a3dec8", examples: ["In exchange for money.", "Work in exchange for food.", "Given in exchange.", "Fair exchange."] },
  { id: "31d7134c-5940-45c4-ac6c-6fc94004acd8", examples: ["Reminiscent of the past.", "Smell reminiscent of home.", "Style reminiscent of the 80s.", "Highly reminiscent."] },
  { id: "17ddc0af-2c79-41f1-b6fc-80b1e63a8567", examples: ["Stems from fear.", "Problem stems from...", "Stems from a mistake.", "Violence stems from poverty."] },
  { id: "d40b8499-2dbf-4123-97ce-85f8c3c16d0f", examples: ["Resistant to change.", "Water resistant.", "Heat resistant.", "Resistant bacteria."] },
  { id: "86732613-f1be-42c3-8f9a-fd1324920944", examples: ["Intent on winning.", "Evil intent.", "With good intent.", "Malicious intent."] },
  { id: "1edd76d1-2f41-4212-88c1-e67aea42606b", examples: ["Reconciled with his fate.", "Resigned to the fact.", "Became reconciled.", "Resigned to lose."] },
  { id: "9595e0a3-9318-410f-928f-633519a7f094", examples: ["Dependent on parents.", "Drug dependent.", "Dependent variable.", "Overly dependent."] },
  { id: "18fa65bc-0397-4f2b-a415-bea8331e6143", examples: ["Sales representative.", "Representative sample.", "Legal representative.", "House of Representatives."] },
  { id: "298bfe41-1465-4d35-b902-bce585fc5dc4", examples: ["Set a restriction.", "Without restriction.", "Trade restriction.", "Restriction on movement."] },
  { id: "d4d8de66-6b0c-4aff-9381-22e5912ba818", examples: ["Natural aptitude.", "Aptitude test.", "Aptitude for math.", "Show aptitude."] },
  { id: "32d21ce6-bcdd-4f84-9973-4a0d5130c70a", examples: ["Hold a grudge.", "Bear a grudge.", "Old grudge.", "Grudge match."] },
  { id: "cfe5063c-20df-4d61-b636-25e403748c5a", examples: ["Read an extract.", "Extract from a book.", "Brief excerpt.", "Quote an excerpt."] },
  { id: "ded5bdd5-07b8-4138-8990-896970022e94", examples: ["Regard as a friend.", "Highly regarded.", "In this regard.", "Regard with suspicion."] },
  { id: "7a53d373-9915-46eb-96ec-a802e88351d8", examples: ["Inflation-proof savings.", "Make it inflation-proof.", "Not totally inflation-proof.", "Inflation-proof bond."] },
  { id: "89094eed-afb4-49c9-b262-66718e27d28f", examples: ["Bulletproof vest.", "Bulletproof plan.", "Bulletproof glass.", "Is it bulletproof?"] },
  { id: "150e6b17-4de9-435e-9f2d-8bd9a574ca8b", examples: ["Interest-free loan.", "Interest-free credit.", "Totally interest-free.", "Interest-free period."] },
  { id: "1de7a8db-7462-4329-b6f9-be128f5fe2d0", examples: ["Buy duty-free.", "Duty-free shop.", "Duty-free allowance.", "Duty-free goods."] },
  { id: "7bbc7502-3a58-434b-96d3-7a7a70e1038b", examples: ["Foolproof plan.", "Foolproof system.", "Nothing is foolproof.", "Foolproof recipe."] },
  { id: "090d3569-d893-4fe5-accf-3b87cde9bfa5", examples: ["Tax-free income.", "Tax-free savings.", "Tax-free threshold.", "Earn tax-free."] },
  { id: "3b376035-1074-413b-ab3c-55c082bcf670", examples: ["Childproof cap.", "Make it childproof.", "Childproof lock.", "Childproof container."] },
  { id: "9a4083a3-badd-4b85-88b5-1687cc99e347", examples: ["Privatize the industry.", "Plan to privatize.", "Privatize health care.", "Privatized company."] },
  { id: "9fc91ede-483f-461a-9537-309b8084da79", examples: ["Fighting intensified.", "Pain intensified.", "Intensified efforts.", "Storm intensified."] },
  { id: "09d4f08c-b11a-4626-b4e4-862e80a1964f", examples: ["Exemplify the trait.", "He exemplifies courage.", "To exemplify this.", "Works that exemplify the style."] },
  { id: "467d56b7-d5a2-4c59-aa17-66f0e72517ed", examples: ["Electrify the audience.", "Electrify the fence.", "News electrified the nation.", "Electrify rural areas."] },
  { id: "4e193ad3-2ac8-405b-993b-61f63a2d1ea7", examples: ["Industrialize the country.", "Rapidly industrialize.", "Industrialized nation.", "Effort to industrialize."] },
  { id: "759e8f14-968d-4aff-8385-dceb8d62aa2b", examples: ["Clarify the situation.", "Clarify butter.", "Please clarify.", "Clarify your meaning."] },
  { id: "239f624e-b27e-495e-a7e6-0699c35bb4a1", examples: ["Mishandled the crisis.", "Mismanaged funds.", "Badly mishandled.", "Mismanaged economy."] },
  { id: "1ac3a0c8-01b7-4dd4-ace8-445948e8009f", examples: ["Misjudge the distance.", "Don't misjudge him.", "I misjudged you.", "Misjudge the mood."] },
  { id: "64984a9e-e76d-4ebb-8b9d-7b312ecf4771", examples: ["Mislay my keys.", "Mislaid the document.", "Often mislay things.", "Where did I mislay it?"] },
  { id: "3bec889e-fd4a-45b8-a3ba-107bcbe68bb8", examples: ["Engine misfired.", "Plan misfired.", "Gun misfired.", "Joke misfired."] },
  { id: "d0c43f7e-89d0-45bf-9e51-165b5c58a7aa", examples: ["Mistreat prisoners.", "Don't mistreat animals.", "Mistreated child.", "He mistreats her."] },
  { id: "2ee25c69-833f-422f-af16-4f8bcf1b078d", examples: ["Misdiagnose the illness.", "Doctors misdiagnose.", "Misdiagnosed case.", "Likely to misdiagnose."] },
  { id: "c8f09381-cda6-4365-8d7f-189c079c1140", examples: ["High IQ.", "IQ test.", "What is your IQ?", "Average IQ."] },
  { id: "29ca07fd-77af-465f-adb6-4973a2df6974", examples: ["CCTV camera.", "Caught on CCTV.", "CCTV monitor.", "Install CCTV."] },
  { id: "f2df3cde-8f47-4f06-b285-7e0bdb1068be", examples: ["Attn: John Doe.", "FAO the Manger.", "Marked FAO.", "Send it Attn: Sales."] },
  { id: "2eb0c789-cb1f-49ac-a938-3caa5290b25d", examples: ["Added a PS.", "Read the PS.", "PS: I love you.", "Forgot the PS."] },
  { id: "9a0be74b-e8ca-4c40-ad9e-917e44a390e1", examples: ["Care of (c/o) my parents.", "Sent c/o the office.", "Address c/o hotel.", "Mail c/o neighbor."] },
  { id: "d88d7463-cf17-4db8-8b66-84d440d3c094", examples: ["See you 2moro.", "Call 2moro.", "Free 2moro?", "Until 2moro."] },
  { id: "f3ab9bc8-5cad-41bd-b890-31912f941e89", examples: ["Go w/o me.", "Coffee w/o sugar.", "Can't live w/o it.", "w/o a doubt."] },
  { id: "5128230d-3c9b-422d-b7d6-37a6fcc3dde2", examples: ["That's xlnt.", "Had an xlnt time.", "Xlnt work.", "Feeling xlnt."] },
  { id: "50edfecf-b648-493d-b04f-03021a642615", examples: ["IMHO, it's great.", "Wrong IMHO.", "Better IMHO.", "IMHO, wait."] },
  { id: "e3365e2f-0e78-4ee6-8d2a-ec7986abac5f", examples: ["Bye, cul8r.", "Got to go, cul8r.", "Cul8r mate.", "Text me cul8r."] },
  { id: "02af8703-c9ac-4ca7-b9e5-44cd68294d17", examples: ["Thx a lot.", "Thx for help.", "No thx.", "Thx!"] },
  { id: "c7114536-79a2-4a9e-a421-dd30c28e84cc", examples: ["Feeling gr8.", "Gr8 job.", "Sounds gr8.", "Have a gr8 day."] },
  { id: "0acd1930-bc32-42d3-a3fd-bc43fb58863a", examples: ["I won't tell, my lips are sealed.", "Promise, my lips are sealed.", "Lips are sealed.", "Don't worry, my lips are sealed."] },
  { id: "41464af0-3f78-4e6f-b07e-d6d43b70100e", examples: ["I can't recall.", "Do you remember?", "Recall the name.", "Remember the time."] },
  { id: "795f739a-5be3-4824-8279-975769816ef0", examples: ["He looked displeased.", "She was displeased with the service.", "Displeased expression.", "Highly displeased."] },
  { id: "5dbcd39b-dbfa-48c2-8a1a-f83205e7b1dc", examples: ["Humorous story.", "Humble abode.", "Be humble.", "Humorous remark."] },
  { id: "c889d72f-9148-4898-8aab-c9c1ded99594", examples: ["Reinforced concrete.", "Reinforced glass.", "Reinforced structures.", "Reinforced by steel."] },
  { id: "37ef312e-c5ed-4707-976e-9c177ffce708", examples: ["Counteract the poison.", "Counteract the effects.", "Measures to counteract.", "Counteract gravity."] },
  { id: "99eb7bef-2362-49ed-bd01-e563d5947ee2", examples: ["Steel girders.", "Structural supports.", "Supports the roof.", "Heavy girders."] }
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
