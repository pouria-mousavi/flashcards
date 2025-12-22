import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function main() {
    console.log("Deep Enrichment Batch 7 (Final)...");

    const updates = [
        { id: "20fff2c6-1687-4343-89e1-5632f8c07f02", word: "illumination", forms: { noun: "illumination", verb: "illuminate", past: "illuminated", pp: "illuminated", adj: "illuminated" } },
        { id: "fd3001d0-fa59-47bd-9ee8-c03029fea0e5", word: "toppling", forms: { noun: "topple", verb: "topple", past: "toppled", pp: "toppled" } },
        { id: "2f2478d0-6038-4d2f-934e-3d35a0d2e4ae", word: "synonymous", forms: { adj: "synonymous", noun: "synonym" } },
        { id: "a618ab2e-0226-4c0d-bd0c-b790bb1c8d7c", word: "sense", forms: { noun: "sense", verb: "sense", past: "sensed", pp: "sensed" } },
        { id: "1590e105-84af-4413-b915-3ff68377bb59", word: "ambiguous", forms: { adj: "ambiguous", noun: "ambiguity", adv: "ambiguously" } },
        { id: "c7849676-8399-495c-8370-c75647db1673", word: "scorched", forms: { adj: "scorched", verb: "scorch", past: "scorched", pp: "scorched" } },
        { id: "e55bdec0-99c9-4c60-99c4-49beb9291a95", word: "huddled", forms: { verb: "huddle", past: "huddled", pp: "huddled" } },
        { id: "c226df1e-196b-46eb-974e-eb31bb0cbd23", word: "Wandering", forms: { adj: "wandering", noun: "wanderer", verb: "wander", past: "wandered", pp: "wandered" } },
        { id: "59fbc936-7779-448f-9ce5-91e98b05823d", word: "Implication", forms: { noun: "implication", verb: "imply", past: "implied", pp: "implied", adj: "implicit" } },
        { id: "f8b75852-9e2d-4e00-9f93-ef8f259edb8c", word: "distort", forms: { noun: "distortion", verb: "distort", past: "distorted", pp: "distorted", adj: "distorted" } },
        { id: "b80e68fe-b5ee-4ee7-9cf0-ee6abe86c2ee", word: "resilient", forms: { adj: "resilient", noun: "resilience", adv: "resiliently" } },
        { id: "9dc45fd3-987d-4b2f-a8f9-b1817b69fe89", word: "gamble", forms: { noun: "gamble", verb: "gamble", past: "gambled", pp: "gambled" } },
        { id: "a821d90f-53fb-4d0f-b693-db476f2ac472", word: "Chill out", forms: { verb: "chill", past: "chilled", pp: "chilled" } },
        { id: "874feea2-f035-4bca-8fe8-e66502e845cf", word: "interpret", forms: { noun: "interpretation", verb: "interpret", past: "interpreted", pp: "interpreted" } },
        { id: "798dd82a-5f58-462f-881e-fdb03f606154", word: "precise", forms: { adj: "precise", noun: "precision", adv: "precisely" } },
        { id: "656c33eb-8fa0-478b-a793-e0d886d6cc03", word: "Brace", forms: { noun: "brace", verb: "brace", past: "braced", pp: "braced" } },
        { id: "54260106-ce27-40b3-8698-6b86d8a9ade7", word: "spontaneous", forms: { adj: "spontaneous", noun: "spontaneity", adv: "spontaneously" } },
        { id: "18a1e871-bd6b-4964-a5c4-3bd657b85b15", word: "transparent", forms: { adj: "transparent", noun: "transparency", adv: "transparently" } },
        { id: "b110732a-afcf-4fb5-b4b9-b51a3a096b44", word: "ironic", forms: { adj: "ironic", noun: "irony", adv: "ironically" } },
        { id: "f6ffd594-03c6-4be9-9326-1223f6f3b2a9", word: "sarcasm", forms: { noun: "sarcasm", adj: "sarcastic", adv: "sarcastically" } },
        { id: "6ea73df1-2264-4292-8764-6e58769ce148", word: "sarcastic", forms: { adj: "sarcastic", noun: "sarcasm", adv: "sarcastically" } },
        { id: "4dd58d8f-5ece-4372-83c0-a16b5763c548", word: "figurative", forms: { adj: "figurative", adv: "figuratively" } },
        { id: "5faf2075-5a86-4d19-854d-c95e3cbc48d1", word: "Arbitrary", forms: { adj: "arbitrary", noun: "arbitrariness", adv: "arbitrarily" } },
        { id: "e4421875-c3ef-4e0c-8976-b5d0da76de9e", word: "Align", forms: { noun: "alignment", verb: "align", past: "aligned", pp: "aligned" } },
        { id: "82f9e6ca-8ded-4695-9ee7-a001e564cece", word: "Hinge", forms: { noun: "hinge", verb: "hinge", past: "hinged", pp: "hinged" } },
        { id: "937efe5a-beb9-4cdd-81cc-1ec826219c26", word: "Intuitively", forms: { adj: "intuitive", noun: "intuition", adv: "intuitively" } },
        { id: "0038768e-c3c0-48ac-ae86-049ff1850a27", word: "Deprecated", forms: { adj: "deprecated", noun: "deprecation", verb: "deprecate", past: "deprecated", pp: "deprecated" } },
        { id: "934de6f4-5b48-4ab4-90ac-96091b4f60e9", word: "Coherent", forms: { adj: "coherent", noun: "coherence", adv: "coherently" } },
        { id: "2d17be45-5540-40f0-8f84-05a99651f947", word: "Ushered", forms: { verb: "usher", past: "ushered", pp: "ushered" } },
        { id: "6e02147d-5479-46cc-83e1-8972980331f2", word: "Spike", forms: { noun: "spike", verb: "spike", past: "spiked", pp: "spiked" } },
        { id: "fb970b8c-530e-47e2-aa2f-3e85e1b9d4a9", word: "Lingered", forms: { verb: "linger", past: "lingered", pp: "lingered" } },
        { id: "f0066d95-4b96-4425-9fb4-81ebdb17956e", word: "Toiled", forms: { noun: "toil", verb: "toil", past: "toiled", pp: "toiled" } },
        { id: "8242df24-6fc1-482c-85cd-b2ca74f87ae2", word: "Forestall", forms: { noun: "forestallment", verb: "forestall", past: "forestalled", pp: "forestalled" } },
        { id: "1ebb14b8-0f9e-4e01-801c-0e22e0d80e50", word: "merciful", forms: { adj: "merciful", noun: "mercy", adv: "mercifully" } },
        { id: "80fb85b6-e4d7-4a31-9b4d-d8349cf96d84", word: "literary", forms: { adj: "literary", noun: "literature" } },
        { id: "78852559-96aa-4fb9-946b-4dc6c1f2a32b", word: "disapproving", forms: { adj: "disapproving", adv: "disapprovingly", noun: "disapproval", verb: "disapprove", past: "disapproved", pp: "disapproved" } },
        { id: "54595e52-ef06-49b9-ae51-eb9da6b9bcc3", word: "Unadorned", forms: { adj: "unadorned", verb: "adorn" } },
        { id: "af281fe1-7609-4168-897f-429aad1ec9fd", word: "Scrawny", forms: { adj: "scrawny", noun: "scrawniness" } },
        { id: "fda79643-10ad-4c3e-81fe-daafa40d0645", word: "portly", forms: { adj: "portly", noun: "portliness" } },
        { id: "a767331a-1409-4f91-9ca7-2c02645f14dc", word: "senior", forms: { adj: "senior", noun: "seniority" } },
        { id: "cd21331f-1290-48e6-abe8-15343c5fb26f", word: "discharged", forms: { noun: "discharge", verb: "discharge", past: "discharged", pp: "discharged" } },
        { id: "39e2c9b1-b66b-42cc-bd33-8928c9bb63a0", word: "Loathe", forms: { noun: "loathing", verb: "loathe", past: "loathed", pp: "loathed", adj: "loathsome" } },
        { id: "d31a5c88-91cd-424d-873c-06dd480ff46f", word: "convalesce", forms: { noun: "convalescence", verb: "convalesce", past: "convalesced", pp: "convalesced", adj: "convalescent" } },
        { id: "7ceb1976-81fd-4b21-8938-8245a18e94ad", word: "recuperate", forms: { noun: "recuperation", verb: "recuperate", past: "recuperated", pp: "recuperated", adj: "recuperative" } },
        { id: "ba86c95d-f666-4e38-a703-2ec61a246885", word: "tainted", forms: { noun: "taint", verb: "taint", past: "tainted", pp: "tainted" } },
        { id: "e94e8aea-206e-4080-9294-de63e2086ddb", word: "Con", forms: { noun: "con", verb: "con", past: "conned", pp: "conned" } },
        { id: "93ffed31-547d-4294-831d-7b8f52c6b6c5", word: "Intrigued", forms: { adj: "intriguing", noun: "intrigue", verb: "intrigue", past: "intrigued", pp: "intrigued" } },
        { id: "48716fef-9486-4fc6-b1d8-25bd16d85b22", word: "Evocative", forms: { adj: "evocative", noun: "evocation", verb: "evoke", past: "evoked", pp: "evoked" } },
        { id: "76ff569d-e5f5-40e9-be4a-9378b0d9d087", word: "Contemplate", forms: { adj: "contemplative", noun: "contemplation", verb: "contemplate", past: "contemplated", pp: "contemplated" } },
        { id: "3fd64c4a-e627-4652-876e-9922d8605d83", word: "insulting", forms: { noun: "insult", verb: "insult", past: "insulted", pp: "insulted" } },
        { id: "0597a9d4-79b5-4e8f-bb60-f3a01429f444", word: "depicted", forms: { noun: "depiction", verb: "depict", past: "depicted", pp: "depicted" } },
        { id: "1bfd685e-b8f4-4501-be8b-a87a1cb23aab", word: "endows", forms: { noun: "endowment", verb: "endow", past: "endowed", pp: "endowed" } },
        { id: "7a27f517-82b8-4b85-8840-6ec8abab436a", word: "Tedious", forms: { adj: "tedious", noun: "tedium", adv: "tediously" } },
        { id: "ac7f9d49-5cf8-4338-a01e-c9ae81b710bf", word: "straightforward", forms: { adj: "straightforward", noun: "straightforwardness" } },
        { id: "50aa84ce-700d-45c7-bf9b-0a5430b04581", word: "crawl", forms: { noun: "crawl", verb: "crawl", past: "crawled", pp: "crawled" } },
        { id: "4d8e46ad-cae7-4f5f-977c-355a72cb2a20", word: "objective", forms: { adj: "objective", noun: "objectivity" } },
        { id: "5d12ed8f-798b-4499-99a2-9ecda75c97a1", word: "biased", forms: { adj: "biased", noun: "bias" } },
        { id: "c822935d-25f6-4ac4-899e-f97e351b8e7a", word: "craving", forms: { noun: "craving", verb: "crave", past: "craved", pp: "craved" } },
        { id: "47dfd690-6ff6-4dde-a2c6-4a686512c64a", word: "starving", forms: { verb: "starve", past: "starved", pp: "starved" } },
        { id: "640ddf63-c5fa-48f7-8b48-f660e5b7078b", word: "stuffed", forms: { verb: "stuff", past: "stuffed", pp: "stuffed" } },
        { id: "0a317b8c-342b-404e-b738-8ca998bbd473", word: "doomed", forms: { adj: "doomed", verb: "doom", past: "doomed", pp: "doomed" } },
        { id: "18a4e7ab-c88a-4e94-899d-7f27700e031a", word: "deserve", forms: { verb: "deserve", past: "deserved", pp: "deserved" } },
        { id: "ef558917-7540-4785-9655-c461f0f960ff", word: "suits", forms: { verb: "suit", past: "suited", pp: "suited" } },
        { id: "40055b04-aea0-468e-b124-6000a5c0d753", word: "floored", forms: { adj: "floored", verb: "floor", past: "floored", pp: "floored" } },
        { id: "76e477c3-8a2c-4235-a3bb-aeaf56ad9408", word: "thick", forms: { adj: "thick", noun: "thickness", adv: "thickly" } },
        { id: "b02693ad-e91a-4db5-910d-d02fa12a1bf0", word: "Institutionalised", forms: { adj: "institutionalised", noun: "institutionalisation", verb: "institutionalise", past: "institutionalised", pp: "institutionalised" } },
        { id: "841cf609-1526-49b2-b876-5c36033c7ab9", word: "recuperation", forms: { noun: "recuperation", verb: "recuperate", past: "recuperated", pp: "recuperated" } },
        { id: "31d6c13b-8433-49b5-af7e-06701af47a37", word: "defy", forms: { noun: "defiance", verb: "defy", past: "defied", pp: "defied" } }
    ];

    for (const item of updates) {
        const { error } = await supabase
            .from('cards')
            .update({ word_forms: item.forms })
            .eq('id', item.id);
            
        if (error) console.error(`Failed ${item.word}:`, error.message);
    }
    console.log("Batch 7 Complete. All Candidates Processed.");
}

main();
