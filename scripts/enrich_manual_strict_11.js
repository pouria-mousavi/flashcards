
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

// Batch 11 (Indices 150-199 - Final of current fetch)
const batch = [
  { id: "84dbc6be-7a5b-4240-88ca-c94318aa3320", examples: ["It takes time to absorb new information.", "Absorb this knowledge.", "Hard to absorb everything.", "Absorb what you learned."] },
  { id: "a0eaad51-78c6-4666-95bf-c1f37620e1af", examples: ["Can you do me a favour?", "I need to ask a favour.", "Return the favour.", "As a favour to me."] },
  { id: "b2de050a-a6dd-4a2d-b657-e6ff2acb0d05", examples: ["He proposed a new plan.", "I propose we meet tomorrow.", "Proposing changes.", "What do you propose?"] },
  { id: "6f6fb772-a0f2-448b-8316-b2cb150b6d21", examples: ["Under the circumstances, we had no choice.", "Given the circumstances.", "Unusual circumstances.", "In these circumstances."] },
  { id: "4f9be05a-6795-470f-bb98-25afee4efc60", examples: ["This environment is conducive to learning.", "Not conducive to sleep.", "Conducive to creativity.", "Very conducive."] },
  { id: "ea923c7f-1b92-489d-bdf2-b4eeaa6d2f1b", examples: ["The negotiation was fraught with difficulty.", "Fraught with danger.", "A fraught relationship.", "Fraught with problems."] },
  { id: "e28cf61e-eb19-4678-86a7-510b6fa31c04", examples: ["The story was devoid of logic.", "Devoid of emotion.", "Completely devoid of sense.", "Devoid of originality."] },
  { id: "f44c22f0-5f52-4b49-89f7-f5d0f7516761", examples: ["She seems immune to criticism.", "Immune to disease.", "Not immune to pressure.", "Immune to charm."] },
  { id: "1c48300f-c003-45e0-9aba-ad6a4981a5c4", examples: ["I mistook him for his brother.", "Don't mistake me for a fool.", "Easily mistaken.", "Mistook her for someone else."] },
  { id: "8818b0a5-d821-43c1-99ae-910a153996db", examples: ["She excels at mathematics.", "He excels in sports.", "A chance to excel.", "Excelling in every area."] },
  { id: "55f44f82-1716-4b7d-b184-d4c0210726e5", examples: ["We need to finalize the plans.", "Let's finalize the deal.", "Finalizing details.", "Everything is finalized."] },
  { id: "b1bf2e4d-d423-49b9-964e-243b8a58ee99", examples: ["This argument is pointless.", "A pointless exercise.", "Don't be pointless.", "Seems pointless."] },
  { id: "e86af2c5-2477-4d8d-9dc5-63837faf0b42", examples: ["The band has a huge following.", "Building a following.", "A devoted following.", "Growing following."] },
  { id: "9163816f-a9bf-45aa-b0ca-7e4e86ab7d16", examples: ["The housing market is booming.", "Affordable housing.", "Social housing.", "Housing shortage."] },
  { id: "cc8d2e85-b2d3-4b9a-b501-ad6069799733", examples: ["It was heartless to leave him.", "A heartless decision.", "How heartless!", "Heartless behavior."] },
  { id: "81ecbcdf-ffca-47e7-8c34-416ab8b1954a", examples: ["The handling of the case was poor.", "Careful handling required.", "Material handling.", "Handling instructions."] },
  { id: "b603462d-3187-447d-b952-d60a7e9f8deb", examples: ["This is an emotive topic.", "Emotive language.", "Highly emotive.", "Emotive issues."] },
  { id: "3e1572ac-30df-4e55-acad-c40decb18719", examples: ["He was very apologetic.", "Apologetic tone.", "Sounding apologetic.", "Quite apologetic."] },
  { id: "03d8fff8-ed5a-41bb-9793-519fcf15fd1f", examples: ["His betrayal was unforgivable.", "An unforgivable act.", "Simply unforgivable.", "Almost unforgivable."] },
  { id: "0f852192-6ef5-4d97-b17d-77abd90be19f", examples: ["The beauty was indescribable.", "An indescribable feeling.", "Indescribable joy.", "Almost indescribable."] },
  { id: "bf039f91-f047-44b5-97e5-b49567e3a83d", examples: ["There's a noticeable difference.", "Barely noticeable.", "Quite noticeable.", "Noticeable improvement."] },
  { id: "8a421565-46f6-43f2-bec9-8f988b123fff", examples: ["The price is fully inclusive.", "Inclusive of tax.", "An inclusive resort.", "All-inclusive package."] },
  { id: "b4d8f8b2-323b-4aeb-a974-13478798b832", examples: ["Are the prices comparable?", "Comparable quality.", "Not comparable.", "Comparable results."] },
  { id: "fe3ae072-5a09-49c4-aea4-091b3d0a3f05", examples: ["Use a reputable company.", "A reputable source.", "Highly reputable.", "Reputable brand."] },
  { id: "b210402c-0e71-4b40-8bc6-cbde2638a30f", examples: ["They plan to furnish the office.", "Furnish the apartment.", "Furnishing the house.", "Fully furnished."] },
  { id: "f90c5d5c-dc0a-40d5-8aa6-5716298d94db", examples: ["The flat is fully furnished.", "A furnished room.", "Furnished accommodation.", "Already furnished."] },
  { id: "39e17da2-8b59-4362-93d5-c84daf3fd694", examples: ["The apartment is unfurnished.", "Unfurnished rental.", "Prefer unfurnished.", "Left unfurnished."] },
  { id: "4ce35dfa-beb6-4a0b-b664-70cfa3d10e69", examples: ["It was an eventful trip.", "An eventful day.", "Rather eventful.", "Eventful week."] },
  { id: "797b26d7-b299-4370-964f-386d173eacc9", examples: ["His disappearance is inexplicable.", "Inexplicable behavior.", "Quite inexplicable.", "Truly inexplicable."] },
  { id: "0ce52ff8-672a-47f4-9d91-f6a09ff9f701", examples: ["Recognition of the problem.", "Growing recognition.", "Gaining recognition.", "International recognition."] },
  { id: "f637fa9f-de95-4269-934c-12015d4055ec", examples: ["It was a worthwhile investment.", "A worthwhile cause.", "Totally worthwhile.", "Worthwhile experience."] },
  { id: "a79fe317-c23d-45da-b43c-4f2270349fe2", examples: ["This old coin is worthless.", "Completely worthless.", "Practically worthless.", "Worthless advice."] },
  { id: "cadefc86-da6c-4186-9788-522107902608", examples: ["A worthy opponent.", "Worthy of attention.", "Worthy champion.", "Worthy cause."] },
  { id: "196db369-0fd2-47d9-adcb-f4e04fe6fc7e", examples: ["The building occupies the whole block.", "Occupy your time.", "Occupied with work.", "Currently occupied."] },
  { id: "732a74a1-ea6b-47eb-b64a-86a86f97519e", examples: ["He confessed to the crime.", "I confess I was wrong.", "Confessing guilt.", "Made a confession."] },
  { id: "b501ad9b-91bd-4174-8a86-0a5ba1226fc4", examples: ["He can't commit to anything.", "Commit to the project.", "Committed to success.", "Make a commitment."] },
  { id: "3b5c98b8-5d7c-4f6e-8068-009a669b83c4", examples: ["The origin of the word.", "Unknown origin.", "Of humble origin.", "Country of origin."] },
  { id: "9d25291d-61a2-48b7-a5f9-ef0001e74ce3", examples: ["I can assure you it's safe.", "Rest assured.", "Assured of success.", "Gave assurance."] },
  { id: "bfaf269e-c126-4508-aa23-cd2e10fb1b8c", examples: ["Simplify the process.", "Let me simplify.", "Simplified version.", "Simplification needed."] },
  { id: "a0079de8-2828-48a1-a5af-cce2735c8eaf", examples: ["Child abuse is a serious crime.", "Abuse of power.", "Verbal abuse.", "Signs of abuse."] },
  { id: "f373e546-a7cf-461e-9971-022fd0ffcd82", examples: ["He defended himself bravely.", "Defend your rights.", "Unable to defend.", "Defenseless victim."] },
  { id: "04f4c0ee-276f-4ba8-a5ae-7ba136633e28", examples: ["The weather was severe.", "Severe consequences.", "Severe pain.", "Severe shortage."] },
  { id: "bb75a76f-5eeb-4f63-8983-bb80edc84aab", examples: ["This indicates a problem.", "Early indications.", "Indicate your preference.", "The report indicates."] },
  { id: "f302d44e-6b08-4109-a47a-269e88dd6011", examples: ["What a cute baby!", "That's cute.", "So cute!", "Cute puppy."] },
  { id: "6212522d-6eab-4256-8a4e-d3e5c7bca781", examples: ["The baby has chubby cheeks.", "A chubby face.", "Chubby fingers.", "Quite chubby."] },
  { id: "5bdd0b30-14b0-41d1-9594-7011ba01afcd", examples: ["You look gorgeous!", "A gorgeous view.", "Gorgeous weather.", "Absolutely gorgeous."] },
  { id: "8b1ccb4c-abb4-4621-a4d8-0b4830166590", examples: ["She loves to show off her car.", "Stop showing off.", "Showing off skills.", "Always showing off."] },
  { id: "9eb1eded-c7db-4883-8071-60bd47db21c2", examples: ["He's developing a paunch.", "Growing a paunch.", "That paunch.", "Noticeable paunch."] },
  { id: "91b33d3b-37f1-4cbc-ad2b-198fb4d65dc3", examples: ["His belly sticks out.", "Don't stick out.", "Really sticks out.", "Sticking out noticeably."] },
  { id: "2c1ecc04-d8db-4bda-a128-7dafeeb21b18", examples: ["He's getting on for 60.", "Getting on for midnight.", "Getting on for retirement.", "Getting on in years."] }
];

async function main() {
    console.log(`Enriching strict batch 11 of ${batch.length} cards...`);
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
