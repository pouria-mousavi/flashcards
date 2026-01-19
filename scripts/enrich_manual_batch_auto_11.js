
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

const batch = [
  { id: "edbe3551-16b6-4aaa-8b76-dfa9cb597e1c", examples: ["Inept at sports.", "Socially inept.", "Inept handling of the crisis.", "Feel inept."] },
  { id: "4c224fe1-86d7-41a7-ad6a-e75a000f5a23", examples: ["Bag of cotton balls.", "Use cotton balls for makeup.", "Soft cotton balls.", "Sterile cotton balls."] },
  { id: "9e8c2dc3-b2b0-418a-8e71-a6d0da9384dd", examples: ["He is hard of hearing.", "A bit hard of hearing.", "Speak up, she's hard of hearing.", "Hard of hearing since birth."] },
  { id: "084271fe-d643-4405-ae95-9c51b4234485", examples: ["Access for the visually impaired.", "Visually impaired students.", "Support visually impaired people.", "He is visually impaired."] },
  { id: "846698b5-420b-4c1c-af0f-1d3351d7c7a3", examples: ["She is getting on a bit.", "He's getting on in years.", "Getting on for 50.", "Grandma is getting on."] },
  { id: "7da07365-3275-48dd-81c7-c97e12b480ec", examples: ["Deny involvement with crime.", "Long involvement with charity.", "Suspect involvement with gangs.", "Direct involvement with the project."] },
  { id: "57ab3dd1-ee63-4023-a1d0-f5ae418dbf91", examples: ["Hold a grudge against him.", "Bear a grudge against society.", "Grudge against the world.", "No grudge against you."] },
  { id: "644236a6-021b-48fa-a04c-f50331b2c8ad", examples: ["No substitute for hard work.", "Substitute for sugar.", "Cheap substitute for leather.", "Poor substitute for the real thing."] },
  { id: "cebe18ee-5eae-4cca-bd0c-c84202e2016f", examples: ["Complex about his height.", "Inferiority complex about money.", "Don't have a complex about it.", "She has a complex about her weight."] },
  { id: "9c331609-3c57-4a99-8ea3-de059f805822", examples: ["Total disregard for rules.", "Disregard for safety.", "Reckless disregard for life.", "Show disregard for feelings."] },
  { id: "8c8afb0c-9972-4043-918e-bb4b7262b56b", examples: ["Compilation of greatest hits.", "Compilation of essays.", "Data compilation of errors.", "Make a compilation of videos."] },
  { id: "a389b4b8-e4bb-4c5f-8cac-474872a047ca", examples: ["Restriction on travel.", "Restriction on alcohol.", "Lift the restriction on trade.", "New restriction on parking."] },
  { id: "82c9b205-719c-4de7-9166-4109b060d07a", examples: ["Aptitude for math.", "Show aptitude for languages.", "Natural aptitude for music.", "No aptitude for sports."] },
  { id: "81417292-d9f5-4710-8b9b-99b3eb9f6af2", examples: ["Remedy for a cold.", "Legal remedy for breach.", "No remedy for this.", "Find a remedy for the problem."] },
  { id: "618c90e2-67f5-4b0d-bf51-7fd1a8a32775", examples: ["Excerpt from a book.", "Read an excerpt from.", "Excerpt from the film.", "Brief excerpt from speech."] },
  { id: "7e1134e4-26e2-454c-bedf-4129c7b144cb", examples: ["Live a trouble-free life.", "Trouble-free life in the country.", "Want a trouble-free life.", "Ensure a trouble-free life."] },
  { id: "dad4fb67-8547-4cab-9c5c-dd2edc70f900", examples: ["Duty-free shop.", "Buy duty-free goods.", "Duty-free allowance.", "Duty-free alcohol."] },
  { id: "4582fa4c-8ec6-495a-ad18-4524a6499720", examples: ["Bullet-proof vest.", "Bullet-proof glass.", "Bullet-proof car.", "Bullet-proof argument."] },
  { id: "18be6d39-2755-42a4-a3b8-865207838d0e", examples: ["Soundproof room.", "Soundproof windows.", "Make it soundproof.", "Soundproof studio."] },
  { id: "63b545df-6d14-4c29-b61c-9106974dc51a", examples: ["Waterproof jacket.", "Waterproof mascara.", "Is it waterproof?", "Waterproof watch."] },
  { id: "429500c4-7827-4eca-8688-efc6060789cf", examples: ["Childproof lock.", "Childproof cap.", "Make the house childproof.", "Childproof medicine."] },
  { id: "86d14b72-8f43-418e-845b-392772e118fe",
    examples: ["Magnetic field.", "Magnetic personality.", "Magnetic strip.", "Magnetic north."] },
  { id: "80e2f0c2-b1aa-43ed-b698-ee84f3f0e631", examples: ["Interest-free credit card.", "Offer interest-free credit.", "Get interest-free credit.", "12 months interest-free credit."] },
  { id: "40f0be19-9b38-453c-a928-7fb367fb430a", examples: ["Ovenproof dish.", "Is it ovenproof?", "Use ovenproof glass.", "Not ovenproof."] },
  { id: "6c4efca6-202e-4fd9-8fc6-e9f17c84f376", examples: ["Inflation-proof savings account.", "Inflation-proof savings bond.", "Need inflation-proof savings.", "Best inflation-proof savings."] },
  { id: "588ee4a5-6c31-4df6-91bc-91ae03bcf818", examples: ["Tax-free income.", "Tax-free shopping.", "Tax-free limit.", "Earn tax-free."] },
  { id: "0a469d1f-38ae-4fd8-9455-201d10b88949", examples: ["Foolproof plan.", "Foolproof method.", "Foolproof system.", "Nothing is foolproof."] },
  { id: "ec44e594-52c2-471a-a8a0-63feaa48e0e2", examples: ["Pacify the baby.", "Pacify the crowd.", "Tried to pacify him.", "Pacify angry customers."] },
  { id: "8dfbaddc-99bb-4163-a197-08f39d9358a9", examples: ["Quantify the damage.", "Hard to quantify.", "Quantify results.", "Can you quantify it?"] },
  { id: "f8d97aa8-8cfe-454e-bec1-dea7ed60c387", examples: ["Purify water.", "Purify the air.", "Purify the soul.", "Purify gold."] },
  { id: "1fcc809d-75a1-4c51-8787-687ce17c4da3", examples: ["Solidify the deal.", "Lava will solidify.", "Solidify position.", "Plans solidified."] },
  { id: "db4ab990-f3ad-4af3-93bb-5fd1e8d43c01", examples: ["Intensify the pressure.", "Fighting intensified.", "Intensify efforts.", "Pain intensified."] },
  { id: "8c055530-3d35-4639-9f90-969be6459591", examples: ["Visualize success.", "Visualize the scene.", "Hard to visualize.", "Try to visualize it."] },
  { id: "3ae0f4a7-9c76-4a9c-a4e0-267d1b3f9970", examples: ["Characteristic feature.", "Characteristic smell.", "It is characteristic of him.", "Defining characteristic."] },
  { id: "59928bc8-5c7c-4cdc-8a5d-f5f0689091a0", examples: ["Characterize the problem.", "Characterize as a hero.", "How would you characterize him?", "Events characterized by violence."] },
  { id: "dd3c518e-b5e6-4946-8df0-019765cbcd53", examples: ["Act of vandalism.", "Commit vandalism.", "Vandalism of property.", "Repair vandalism."] },
  { id: "d5453cd5-8b65-4b73-b3c3-65d0692b1d8d", examples: ["Vandalize the park.", "Vandalize a car.", "Don't vandalize.", "Vandalized bus stop."] },
  { id: "b52c77e5-c570-4eea-ab9f-d4d8fc31f05e", examples: ["Nationalize the banks.", "Nationalize industry.", "Plan to nationalize.", "Nationalize railways."] },
  { id: "9111f6f8-5f04-4e10-9acb-983687561c3f", examples: ["Legalize drugs.", "Legalize gambling.", "Campaign to legalize.", "Legalize same-sex marriage."] },
  { id: "83a01d13-2cc6-4e82-8833-0edcca64391f", examples: ["Feel underemployed.", "Underemployed graduates.", "Chronically underemployed.", "Underemployed workforce."] },
  { id: "79696602-2478-48ee-befd-2cfa9c652973", examples: ["Unemployed workers.", "Become unemployed.", "Registered unemployed.", "Unemployed youth."] },
  { id: "42604b40-1332-4a93-8f91-fae363846b70", examples: ["Undernourished children.", "Look undernourished.", "Undernourished plants.", "Severely undernourished."] },
  { id: "7867ae0d-8741-4000-a149-3ba7b9ed7552", examples: ["Overbook the flight.", "Don't overbook.", "Hotel is overbooked.", "Tendency to overbook."] },
  { id: "86fd199f-b7d5-414c-93c6-cd08f9ca18b8", examples: ["Take anti-inflammatory drugs.", "Prescribed anti-inflammatory drugs.", "Strong anti-inflammatory drugs.", "Need anti-inflammatory drugs."] },
  { id: "e46352a7-6aed-463c-bdda-38872a985dfa", examples: ["Anti-war protest.", "Anti-war movement.", "Anti-war sentiment.", "Anti-war activist."] },
  { id: "ecfb0b05-7ab7-487e-aaec-60d5501d3aab", examples: ["Currency devalued.", "Feel devalued.", "Devalued status.", "Work is devalued."] },
  { id: "adb21891-3a26-413e-a014-43405d2f62a0", examples: ["Defrost the chicken.", "Defrost the fridge.", "Let it defrost.", "Defrost setting."] },
  { id: "a1e1327a-ccbb-4dcd-9734-85281090f86c", examples: ["Declassified documents.", "Recently declassified.", "Declassified information.", "Read declassified files."] },
  { id: "aac77de0-4180-4a32-9c51-209f5b1ea257", examples: ["Reappraise the situation.", "Need to reappraise.", "Reappraise value.", "Time to reappraise."] },
  { id: "72ac8852-8142-4353-85d0-c636f8adebf7", examples: ["Ill-prepared for the exam.", "Ill-prepared army.", "Totally ill-prepared.", "Ill-prepared for life."] },
  { id: "43e0e8bc-6944-4f98-a579-7dd3b613e22d", examples: ["Ill-informed decision.", "Ill-informed public.", "Become ill-informed.", "Ill-informed rumors."] },
  { id: "5fdf7a00-e483-4dfd-8351-6843d76f80e1", examples: ["Interact with others.", "Interact with the crowd.", "Chemicals interact.", "Interact daily."] },
  { id: "639474b4-b90e-4846-86ea-df20e1bd2cc3", examples: ["Social interaction.", "Human interaction.", "Drug interaction.", "Interaction with customers."] },
  { id: "d98c96a0-f66f-4791-b009-bcab69d5f2a1", examples: ["Joke misfired.", "Plan misfired.", "Engine misfired.", "The whole thing misfired."] },
  { id: "790ecef3-b9e5-4f6f-9a3c-f924d334a18b", examples: ["Misjudge the distance.", "Misjudge a person.", "Don't misjudge him.", "Totally misjudged."] },
  { id: "24fa4279-4591-4154-aafe-0bcaa5d83672", examples: ["Correct the misprint.", "Common misprint.", "Spot a misprint.", "Book full of misprints."] },
  { id: "3b0423fa-efe8-4715-8407-af5cdd9bdc0a", examples: ["Misconceived plan.", "Misconceived idea.", "Totally misconceived.", "Policy was misconceived."] },
  { id: "869acd95-3edc-452d-9865-9c214854a247", examples: ["Common misconception.", "Clear up a misconception.", "Popular misconception.", "Based on a misconception."] },
  { id: "4365f9d3-458f-48ad-9b29-14fab28e3f5f", examples: ["Miscalculate the cost.", "Miscalculate the time.", "Badly miscalculated.", "Don't miscalculate."] },
  { id: "2e8deea6-1c53-46ef-afd4-f8826e5d93f2", examples: ["Seal the envelope.", "Seal the deal.", "Seal the border.", "Seal the container."] },
  { id: "c5bc1697-22c1-477b-aa6a-71445feaafd4", examples: ["Vivid recollection.", "No recollection of it.", "Vague recollection.", "To the best of my recollection."] },
  { id: "e8b62a6e-e3d9-4da7-a998-ea8e49a2ae30", examples: ["Income bracket.", "Age bracket.", "Put in brackets.", "Top bracket."] },
  { id: "33745ef9-bf79-4274-9454-a442b5882f0a", examples: ["Bolt the door.", "Bolt it down.", "Bolt furniture to wall.", "Bolt the gate."] },
  { id: "8d5be9a2-2eb3-47cc-8fa9-4ae8e912589d", examples: ["Right angle.", "From different angle.", "Camera angle.", "Get the angle right."] },
  { id: "88c51ef0-4620-4ab8-8d0d-a6125c229340", examples: ["Steel girder.", "Iron girder.", "Support girder.", "Walk on a girder."] },
  { id: "9eb7bdeb-b5db-4cd3-8ee8-ef1ffce5381b", examples: ["Laser beam.", "Beam of light.", "Support beam.", "Smile beamed."] },
  { id: "0161a978-6051-490f-abaa-bd179717a09f", examples: ["Heavy load.", "Lighten the load.", "Load of laundry.", "Carry the load."] },
  { id: "713e5917-4fcf-4d18-b2e5-853276445d52", examples: ["Vertical line.", "Vertical takeoff.", "Hold it vertical.", "Vertical stripe."] },
  { id: "bca3e6f2-167a-4334-b127-08f91540400a", examples: ["Reinforced concrete.", "Reinforced door.", "Reinforced the idea.", "Heavily reinforced."] },
  { id: "350c62a7-d795-49db-abe8-d05313b9dd9a", examples: ["Anchor the boat.", "Anchor a show.", "Anchor the tent.", "Needs an anchor."] },
  { id: "d9746a17-cfb4-4ca8-9f7c-bac5fa5eb7e2", examples: ["Slow motion.", "In motion.", "Set in motion.", "Circular motion."] },
  { id: "89a58d51-ecc8-4c57-9897-29f75f158ef5", examples: ["Counteract the poison.", "Counteract the effect.", "Exercise counteracts stress.", "Try to counteract it."] },
  { id: "367429cb-1030-4cd3-a84f-867854e2a363", examples: ["Trees sway in wind.", "Sway opinion.", "Hold sway over.", "Don't let it sway you."] },
  { id: "d85d7394-341c-416b-95a0-2862124f48f2", examples: ["Withstand pressure.", "Withstand the storm.", "Withstand heat.", "Can it withstand impact?"] },
  { id: "f9fdfc86-9d6f-4f43-8d12-1f140dcee110", examples: ["Determine the cause.", "Hard to determine.", "Determine the outcome.", "Factors determine."] },
  { id: "b4d16590-3afd-4b89-b912-a1ab749335a3", examples: ["Meet the needs of customers.", "Meet the needs of children.", "Fail to meet needs.", "Designed to meet needs."] },
  { id: "2f43a173-49d8-4fb1-9756-dd3c3f87b86e", examples: ["Stringent rules.", "Stringent measures.", "Stringent testing.", "Stringent budget."] },
  { id: "e39f6ddc-5c99-454a-aeaf-d93954552279", examples: ["In compliance with.", "Compliance officer.", "Strict compliance.", "Ensure compliance."] },
  { id: "f3f8c7ee-97c6-48b5-aaf2-d480ea7309e5", examples: ["Comply with regulations.", "Failure to comply.", "Refuse to comply.", "Must comply."] },
  { id: "ed191bad-37eb-48e2-97e5-242e18a879f8", examples: ["Constrain your anger.", "Constrain spending.", "Feel constrained.", "Constrained by rules."] },
  { id: "7876bb33-be64-424a-945b-c2873b418448", examples: ["Budget constraint.", "Time constraint.", "Without constraint.", "Severe constraint."] },
  { id: "df68a322-3207-495a-be10-22b948de694d", examples: ["Storage unit.", "Metric unit.", "Family unit.", "Unit of measurement."] },
  { id: "393fce58-8449-43c8-b01c-516e760b6409", examples: ["Virus mutated.", "Mutate into a monster.", "Genes mutate.", "Mutate fast."] },
  { id: "a6f27802-67a0-4b24-8ab8-8eafa98d2161", examples: ["Genetic mutation.", "Random mutation.", "Cause mutation.", "Rare mutation."] },
  { id: "240154d5-fe97-45a7-a532-8bf1965c2d8c", examples: ["Weak immune system.", "Boost immune system.", "Strong immune system.", "Suppress immune system."] },
  { id: "fe90060b-805c-465f-a023-115f9e0fec3f", examples: ["Repel the attack.", "Repel insects.", "Magnets repel.", "Repel water."] },
  { id: "4bf69284-b7b5-477b-bcfb-8be7656a071f", examples: ["Short-lived joy.", "Short-lived fame.", "Short-lived career.", "Short-lived phenomena."] },
  { id: "6728654a-b3c6-4298-8040-09b9ebe8e6ce", examples: ["Molecular biology.", "Molecular structure.", "Molecular level.", "Molecular weight."] },
  { id: "cab3af05-5536-4437-9dd8-b88a59fac658", examples: ["Water molecule.", "Single molecule.", "Protein molecule.", "Bonding molecule."] },
  { id: "5e752209-c3d4-46f5-abe7-490c16aa1421", examples: ["Abnormal behavior.", "Abnormal results.", "Abnormal amount.", "Highly abnormal."] },
  { id: "3d746e3f-95d1-4d16-8ca5-324d67db926b", examples: ["Insertion point.", "Data insertion.", "Needle insertion.", "Insertion of genes."] },
  { id: "0487c6e1-9532-4eb0-b68a-656d65cf3d9b", examples: ["Insert the key.", "Insert a coin.", "Insert a comment.", "Insert image."] },
  { id: "a00af261-392b-4964-92e7-7ec0cb331abe", examples: ["Birth defect.", "Speech defect.", "Design defect.", "Mechanical defect."] },
  { id: "f3fe1b19-23b0-4fb9-927d-7520cf345b79", examples: ["Defective product.", "Defective gene.", "Defective part.", "Mentally defective (dated)."] },
  { id: "3c3b43ae-9d74-4339-9412-b197a8932abb", examples: ["Hereditary disease.", "Hereditary title.", "Hereditary monarch.", "Is it hereditary?"] },
  { id: "1a80cb13-8893-4363-8a89-73399d19b7ee", examples: ["Role of heredity.", "Laws of heredity.", "Study heredity.", "Heredity versus environment."] },
  { id: "ab73e977-d2a4-44bb-8cd1-1e5c9bbc8df9", examples: ["Genetic engineering.", "Genetic disorder.", "Genetic code.", "Genetic testing."] },
  { id: "58ae6928-b687-41f6-978e-5f54fff43eb2", examples: ["Study genetics.", "Modern genetics.", "Genetics lab.", "Role of genetics."] },
  { id: "7a26b1cd-be88-46fb-9829-3e3db761625a", examples: ["Replicate results.", "Replicate DNA.", "Can't replicate it.", "Exact replicate."] },
  { id: "987040db-e59e-469e-9808-d5cd59bb0ec0", examples: ["Identity verification.", "Verification failed.", "Email verification.", "Need verification."] }
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
