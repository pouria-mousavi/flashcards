
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);
const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

const cards = [
    { word: "Spicy", examples: [
        "Do you like spicy food?", 
        "A spicy curry.", 
        "The salsa is too spicy for me.",
        "He added spicy peppers to the sauce."
    ]},
    { word: "Crispy", examples: [
        "I love crispy fried chicken.", 
        "Fresh, crispy lettuce.", 
        "Bake until crispy.",
        "The bacon was nice and crispy."
    ]},
    { word: "Greasy", examples: [
        "Keep greasy food away.", 
        "Greasy hair.", 
        "This burger is too greasy.",
        "My hands are greasy from the oil."
    ]},
    { word: "Rotten", examples: [
        "A rotten apple.", 
        "The wood is rotten.", 
        "Something smells rotten.",
        "Don't let the fruit go rotten."
    ]},
    { word: "Spacious", examples: [
        "A spacious apartment.", 
        "The back seat is spacious.", 
        "We need a spacious office.",
        "The room feels very spacious."
    ]},
    { word: "Cramped", examples: [
        "The seat was cramped.", 
        "Living in a cramped room.", 
        "My handwriting is cramped.",
        "It felt cramped in the elevator."
    ]},
    { word: "Cozy", examples: [
        "A cozy little cafe.", 
        "It feels cozy by the fire.", 
        "I have a cozy blanket.",
        "The cabin was warm and cozy."
    ]},
    { word: "Tidy", examples: [
        "Keep your room tidy.", 
        "A tidy desk.", 
        "Please tidy up.",
        "She likes everything neat and tidy."
    ]},
    { word: "Messy", examples: [
        "His desk is messy.", 
        "A messy eater.", 
        "It got messy quickly.",
        "Don't make the kitchen messy."
    ]},
    { word: "Tilted", examples: [
        "The picture is tilted.", 
        "The table is tilted.", 
        "He tilted his head.",
        "The floor looks tilted."
    ]},
    { word: "Upside down", examples: [
        "You're holding it upside down.", 
        "Turned the house upside down.", 
        "Life turned upside down.",
        "The cake was upside down."
    ]},
    { word: "Inside out", examples: [
        "Your shirt is inside out.", 
        "I know the city inside out.", 
        "Blew the umbrella inside out.",
        "He knows the system inside out."
    ]},
    { word: "Hollow", examples: [
        "A hollow tree.", 
        "A hollow sound.", 
        "Promises rang hollow.",
        "The statue is hollow inside."
    ]},
    { word: "Shallow", examples: [
        "The pool is shallow.", 
        "Shallow breathing.", 
        "He is a shallow person.",
        "Buried in a shallow grave."
    ]},
    { word: "Steep", examples: [
        "A steep hill.", 
        "Steep prices.", 
        "A steep learning curve.",
        "The path was very steep."
    ]},
    { word: "Slippery", examples: [
        "The floor is slippery.", 
        "A slippery politician.", 
        "Ice made it slippery.",
        "Be careful, it's slippery when wet."
    ]},
    { word: "Sticky", examples: [
        "Hands are sticky.", 
        "A sticky situation.", 
        "This tape isn't sticky.",
        "The table felt sticky."
    ]},
    { word: "Rough", examples: [
        "Sandpaper is rough.", 
        "Rough skin.", 
        "A rough flight.",
        "He has a rough voice."
    ]},
    { word: "Smooth", examples: [
        "A smooth surface.", 
        "Everything went smooth.", 
        "Smooth jazz.",
        "Her skin is very smooth."
    ]},
    { word: "Dull", examples: [
        "This knife is dull.", 
        "A dull pain.", 
        "Life can be dull.",
        "The colors looked dull."
    ]},
    { word: "Sharp", examples: [
        "The edge is sharp.", 
        "A sharp mind.", 
        "At 8 o'clock sharp.",
        "A sharp pain in my side."
    ]},
    { word: "Loose", examples: [
        "A loose tooth.", 
        "Loose pants.", 
        "The dog got loose.",
        "The screw is loose."
    ]},
    { word: "Tight", examples: [
        "Shoes are too tight.", 
        "Hold on tight.", 
        "Money is tight.",
        "The lid is on tight."
    ]},
    { word: "Waterproof", examples: [
        "A waterproof jacket.", 
        "Is this watch waterproof?", 
        "Ensure it is waterproof.",
        "Waterproof mascara."
    ]},
    { word: "Soundproof", examples: [
        "Soundproof studio.", 
        "Thick walls made it soundproof.", 
        "Make the room soundproof.",
        "Soundproof windows."
    ]},
    { word: "Portable", examples: [
        "A portable speaker.", 
        "Portable charger.", 
        "Lightweight and portable.",
        "A portable TV."
    ]},
    { word: "Adjustable", examples: [
        "Adjustable chair.", 
        "Adjustable straps.", 
        "Height is adjustable.",
        "Totally adjustable fit."
    ]},
    { word: "Disposable", examples: [
        "Disposable plates.", 
        "Disposable income.", 
        "Friends aren't disposable.",
        "Disposable cameras."
    ]},
    { word: "Recyclable", examples: [
        "Is plastic recyclable?", 
        "Recyclable materials.", 
        "Blue bin for recyclables.",
        "Packages are 100% recyclable."
    ]},
    { word: "Flammable", examples: [
        "Gasoline is flammable.", 
        "Keep away from flammable items.", 
        "Non-flammable pajamas.",
        "Highly flammable liquid."
    ]},
    { word: "Toxic", examples: [
        "Toxic chemicals.", 
        "A toxic relationship.", 
        "Toxic fumes.",
        "It is toxic if swallowed."
    ]},
    { word: "Lethal", examples: [
        "Lethal dose.", 
        "Lethal weapon.", 
        "Can be lethal.",
        "A lethal combination."
    ]},
    { word: "Harmless", examples: [
        "A harmless spider.", 
        "A harmless joke.", 
        "He is harmless.",
        "The snake is harmless."
    ]},
    { word: "Beneficial", examples: [
        "Exercise is beneficial.", 
        "Beneficial agreement.", 
        "Beneficial to crops.",
        "Mutually beneficial."
    ]},
    { word: "Detrimental", examples: [
        "Smoking is detrimental.", 
        "Detrimental effects.", 
        "Detrimental to career.",
        "Stress is detrimental to health."
    ]},
    { word: "Mandatory", examples: [
        "Attendance is mandatory.", 
        "Mandatory meeting.", 
        "Seatbelt is mandatory.",
        "It is mandatory to sign."
    ]},
    { word: "Optional", examples: [
        "The tour is optional.", 
        "Tipping is optional.", 
        "An optional extra.",
        "Music is optional."
    ]},
    { word: "Formal", examples: [
        "Formal attire.", 
        "Formal complaint.", 
        "No formal training.",
        "A formal dinner."
    ]},
    { word: "Casual", examples: [
        "Dress is casual.", 
        "Casual meeting.", 
        "Casual glance.",
        "Casual wear."
    ]},
    { word: "Temporary", examples: [
        "Temporary solution.", 
        "Temporary job.", 
        "Pain is temporary.",
        "Temporary housing."
    ]},
    { word: "Permanent", examples: [
        "Permanent job.", 
        "Permanent marker.", 
        "Permanent damage.",
        "A permanent address."
    ]},
    { word: "Instant", examples: [
        "Instant coffee.", 
        "Instant messaging.", 
        "Instant success.",
        "Instant noodles."
    ]},
    { word: "Gradual", examples: [
        "Gradual improvement.", 
        "Gradual incline.", 
        "Gradual change.",
        "A gradual process."
    ]},
    { word: "Sudden", examples: [
        "Sudden stop.", 
        "All of a sudden.", 
        "Sudden death.",
        "A sudden noise."
    ]},
    { word: "Accidental", examples: [
        "Accidental meeting.", 
        "Accidental damage.", 
        "Purely accidental.",
        "Accidental discharge."
    ]},
    { word: "Deliberate", examples: [
        "Deliberate attack.", 
        "Deliberate choice.", 
        "A deliberate pause.",
        "It was deliberate."
    ]},
    { word: "Artificial", examples: [
        "Artificial intelligence.", 
        "Artificial flowers.", 
        "Artificial sweetener.",
        "Artificial light."
    ]},
    { word: "Natural", examples: [
        "Natural ingredients.", 
        "Comes natural to him.", 
        "Natural disaster.",
        "A natural look."
    ]},
    { word: "Authentic", examples: [
        "Authentic food.", 
        "Authentic signature.", 
        "Be authentic.",
        "An authentic copy."
    ]},
    { word: "Fake", examples: [ // "Fake / Counterfeit" in file
        "Fake smile.", 
        "It looks fake.", 
        "Fake news.",
        "Don't buy fake goods."
    ]},
    { word: "Abstract", examples: [
        "Abstract art.", 
        "Abstract concept.", 
        "Too abstract.",
        "Abstract thinking."
    ]},
    { word: "Concrete", examples: [
        "Concrete evidence.", 
        "Concrete example.", 
        "Concrete jungle.",
        "We need a concrete plan."
    ]},
    { word: "Sophisticated", examples: [
        "Sophisticated device.", 
        "Sophisticated taste.", 
        "Sophisticated technology.",
        "A sophisticated lady."
    ]},
    { word: "Primitive", examples: [
        "Primitive technology.", 
        "Primitive man.", 
        "Primitive conditions.",
        "A primitive shelter."
    ]},
    { word: "Contemporary", examples: [
        "Contemporary art.", 
        "Contemporary furniture.", 
        "Contemporary society.",
        "Contemporary dance."
    ]},
    { word: "Conventional", examples: [
        "Conventional medicine.", 
        "Conventional wisdom.", 
        "Conventional oven.",
        "Conventional weapons."
    ]},
    { word: "Unconventional", examples: [
        "Unconventional methods.", 
        "Unconventional lifestyle.", 
        "Unconventional warfare.",
        "She is quite unconventional."
    ]}
];

async function main() {
    console.log(`Manually enriching V6 Part 4 - Phase 2 (${cards.length} cards)...`);
    
    for (const item of cards) {
        const { data: existing, error } = await supabase
            .from('cards')
            .select('id, back, examples')
            .ilike('back', `${item.word}%`) // fuzzy match start
            .limit(1);

        if (error) {
            console.error(`Error searching ${item.word}:`, error.message);
            continue;
        }

        if (existing && existing.length > 0) {
            const card = existing[0];
            const { error: updErr } = await supabase
                .from('cards')
                .update({ examples: item.examples })
                .eq('id', card.id);
            if (updErr) console.error(`Failed ${item.word}:`, updErr.message);
            else console.log(`✅ Updated: ${item.word}`);
        } else {
            console.log(`⚠️ Not found: ${item.word}`);
        }
    }
}

main();
