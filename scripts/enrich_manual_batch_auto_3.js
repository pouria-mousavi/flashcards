
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

const batch = [
  { id: "c95bc165-6e1c-4273-8e4d-f30cfb72dc34", examples: ["Stayed at a B & B.", "Bed & Breakfast.", "Book a B & B.", "Cozy B & B."] },
  { id: "d02a7022-02ab-41fd-842d-aab5f7cb8c6f", examples: ["NB: Calculate tax first.", "Nota Bene (Note Well).", "Read the NB section.", "NB: Do not touch."] },
  { id: "92a3e366-f4cd-4abe-8b10-a611c8e6e0a7", examples: ["Sent c/o the manager.", "Care of (c/o).", "Address c/o John Smith.", "Letter c/o the office."] },
  { id: "839364ea-5908-45d2-a46b-2c46f8858f2d", examples: ["Please RSVP.", "Forgot to RSVP.", "RSVP by mail.", "RSVP deadline."] },
  { id: "d5029f33-c337-42ef-8a59-e4f6528cda0c", examples: ["He hung his head in shame.", "Hang your head.", "Don't hang your head.", "She hung her head low."] },
  { id: "2f993c9a-2bb5-490c-840a-67d1e22c1e44", examples: ["High and low tide times.", "Tides go high and low.", "Fishing at high tide.", "Low tide reveals rocks."] },
  { id: "66cf7f4c-ccc1-45f1-87dd-c5058273700a", examples: ["The boat capsized.", "Don't capsize the canoe.", "Risk of capsizing.", "High waves capsized it."] },
  { id: "ff0b4d9e-6fca-4e81-a9f1-d1f73d18acfa", examples: ["Keep me apprised.", "Fully apprised of the situation.", "Apprised the boss.", "Stay apprised."] },
  { id: "4003ac0e-9b5f-4191-942a-fc2b6dded4cc", examples: ["At this latitude.", "Given some latitude.", "Latitude and longitude.", "Wide latitude in decisions."] },
  { id: "35ed0130-d594-4bec-9b51-f36258ef9366", examples: ["Everyone thinks they have a say.", "Design by committee.", "Too many opinions.", "Engineers want a say in design."] },
  { id: "38d22f92-d815-4f6d-9afa-63cb37916403", examples: ["Conducive to learning.", "Environment is conducive.", "Not conducive to sleep.", "Conducive atmosphere."] },
  { id: "546d6994-2753-4448-b100-317698037ec2", examples: ["Skin irritant.", "Major irritant.", "Remove the irritant.", "Chemical irritant."] },
  { id: "701ce627-740e-4a88-b5cf-82ebc2f49400", examples: ["Reimburse expenses.", "Please reimburse me.", "Company will reimburse.", "Reimburse the cost."] },
  { id: "bd4f7b0a-5400-4274-b817-6af707ea6eb4", examples: ["Self-sabotage.", "Sabotage the mission.", "Act of sabotage.", "Don't sabotage yourself."] },
  { id: "a78f316b-28f4-48f6-b342-74e21d2555f2", examples: ["Losing my job was a blessing in disguise.", "It seemed bad but was a blessing in disguise.", "A true blessing in disguise.", "Blessing in disguise."] },
  { id: "ecd7ca24-3d94-4af7-bf17-6b6f7b7a122a", examples: ["I like those odds.", "Those are my kind of odds.", "Better chances.", "Playing the odds."] },
  { id: "5c6e38df-706c-48cd-a9f9-3fc436dabc27", examples: ["It is a 10 million to 1 shot.", "Long shot.", "One in a million.", "Rare chance."] },
  { id: "ca69f23b-8231-4cd2-a22f-02f5ddc844a7", examples: ["Compelling argument.", "Compelling story.", "Felt compelled.", "Very compelling."] },
  { id: "9f564ce1-71de-490a-beac-097d42b01c83", examples: ["Nefarious plot.", "Nefarious activities.", "Acted nefariously.", "Nefarious villain."] },
  { id: "6f2d2403-64c7-4a42-a165-dfd3be31e43d", examples: ["Conservative estimate.", "Socially conservative.", "Conservative party.", "Conservative approach."] },
  { id: "eda71cb6-8da4-4871-b41b-c625991aa096", examples: ["Public sentiment.", "Hurtful sentiment.", "Share the sentiment.", "Sentiment analysis."] },
  { id: "5480e495-ac93-4216-9da9-b9122bbef543", examples: ["It is an abomination.", "Cruelty is an abomination.", "Abomination to nature.", "Utter abomination."] },
  { id: "a4cafc78-0f0d-461e-9a89-3885bb9c1d65", examples: ["Preceded by a storm.", "Lunch preceded the meeting.", "A precedes B.", "Silence preceded the announcement."] },
  { id: "7bdc14e7-65f8-4aea-9905-460d95bd2203", examples: ["Overcome obstacles.", "Many obstacles.", "Obstacle course.", "Major obstacle."] },
  { id: "b108a20b-5b91-4dc5-bd07-ef9628fc6d57", examples: ["Seems counterintuitive.", "Counterintuitive result.", "Actually counterintuitive.", "It feels counterintuitive."] },
  { id: "70b63905-22ff-4e28-949c-8fe2af925a8f", examples: ["Mitigate risks.", "Mitigate the impact.", "Measure to mitigate.", "Hard to mitigate."] },
  { id: "8511e8f9-290d-47c1-88c7-a9e607704aa0", examples: ["Pursue a career.", "Pursue happiness.", "Police pursued the thief.", "Pursue goals."] },
  { id: "b02693ad-e91a-4db5-910d-d02fa12a1bf0", examples: ["Institutionalised racism.", "Became institutionalised.", "Institutionalised practice.", "Institutionalised care."] },
  { id: "6649a510-8299-4a03-9b35-39fba7a905a8", examples: ["Advocate for change.", "Patient advocate.", "Devils advocate.", "Advocated the policy."] },
  { id: "4dbae7de-4f5e-450d-a229-726b2d05b0de", examples: ["Carve out a niche.", "Carve out time.", "Carver of wood.", "Carve it out."] },
  { id: "5295ae4e-8f8c-4e29-98e2-17dd0a446a2e", examples: ["Drag along the ground.", "Don't drag me along.", "Drag it along.", "Time dragged along."] },
  { id: "934de6f4-5b48-4ab4-90ac-96091b4f60e9", examples: ["Coherent argument.", "Not very coherent.", "Coherent strategy.", "Became coherent."] },
  { id: "a276aaef-8128-4449-b07a-c19049c9432b", examples: ["Arch rivals.", "Bitter rivals.", "Rivals in business.", "No rivals."] }
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
