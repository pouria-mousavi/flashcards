
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

const batch = [
  { id: "da85882d-2f2c-4f0b-bbe4-edbd6ca3a9df", examples: ["Let's get it over with.", "Want to get it over with.", "Get it over with quickly.", "Dreading it, get it over with."] },
  { id: "cdc86124-a596-4c77-aeb2-35a7606ae937", examples: ["Don't badmouth him.", "She backstabbed her friend.", "Badmouthing behind back.", "Backstabber behavior."] },
  { id: "2b02c2c4-27c3-415a-92e2-aeb2ae2e867e", examples: ["Sweep it under the rug.", "Swept under the rug.", "Can't sweep this under the rug.", "Rug conspiracy."] },
  { id: "33433a15-f127-44a5-83a7-dcec1e4ad08b", examples: ["Have the guts.", "Do you have the guts?", "Takes guts to say that.", "No guts no glory."] },
  { id: "b3a1a1ce-cc29-4213-9159-ac41d9cfce5e", examples: ["Flex your muscles.", "Political muscle flexing.", "Time to flex our muscles.", "Flexing muscles."] },
  { id: "3fddc242-04b1-4981-99d2-8264300bd37f", examples: ["What makes you tick?", "Understand what makes him tick.", "Know what makes her tick.", "Find out what makes them tick."] },
  { id: "4cc7d255-260c-40c0-810c-aff6de7c16e5", examples: ["Catch him red-handed.", "Caught red-handed stealing.", "Red-handed evidence.", "Caught red-handed."] },
  { id: "47c00140-57d8-4412-9f74-bef73f8155bf", examples: ["Beat the rap.", "Managed to beat the rap.", "Lawyer beat the rap.", "Can't beat the rap."] },
  { id: "17f07831-e7e5-45a3-b21e-3f35d101c491", examples: ["Fend for myself.", "Left to fend for themselves.", "Fend for yourself.", "Learn to fend for oneself."] },
  { id: "d5dd41a4-e3a0-45c1-8770-cc3ad7219bfb", examples: ["Finger in every pie.", "She has a finger in every pie.", "Keep a finger in every pie.", "Wants a finger in every pie."] },
  { id: "9c15d916-db23-4337-ad91-a76855929037", examples: ["Handed on a silver platter.", "Want it on a silver platter.", "Life on a silver platter.", "Success on a silver platter."] },
  { id: "02056d9d-085b-4553-8ef0-0472538cb7fb", examples: ["Kill two birds with one stone.", "Killed two birds with one stone.", "Plan kills two birds with one stone.", "Like killing two birds with one stone."] },
  { id: "6fb4182d-dfac-4b99-b09e-e35989818d51", examples: ["Unavoidable delay.", "Accident was unavoidable.", "Conclusion is unavoidable.", "Seem unavoidable."] },
  { id: "291041b2-ec8a-4223-bb93-1b08056603f7", examples: ["It's a bluff.", "Call his bluff.", "Don't bluff.", "He is bluffing."] },
  { id: "f612a4a2-d6df-42c3-85b1-d4c2fac5e03a", examples: ["Public scandal.", "In disgrace.", "Caused a scandal.", "Bring disgrace."] },
  { id: "fb799a5e-94bc-49e7-8fdc-9411c944e798", examples: ["What a coincidence.", "Pure coincidence.", "By coincidence.", "Strange coincidence."] },
  { id: "3129f0ec-005c-453c-8840-ba83153df6e4", examples: ["Caused disruption.", "Service disruption.", "Market disruption.", "Digital disruption."] },
  { id: "b64036eb-e655-4322-8d9b-d5e9199735b2", examples: ["High probability.", "What are the odds?", "Beat the odds.", "Low probability."] },
  { id: "63bc75ca-10c7-46d4-a585-735d950b5bd8", examples: ["Slip of the tongue.", "Freudian slip.", "Just a slip of the tongue.", "Embarrassing slip of the tongue."] },
  { id: "ad433547-bf46-421e-8763-d342fbeb2905", examples: ["Make an exception.", "exception to the rule.", "No exceptions.", "Exceptional case."] },
  { id: "a42ecf60-afe5-459d-8d2d-b06b8ce68a6b", examples: ["Unless you help.", "Not unless.", "Unless it rains.", "Go unless."] },
  { id: "5009f70e-13b6-4440-9ea3-58986bbf644e", examples: ["No sooner had I arrived.", "No sooner had he left.", "No sooner said than done.", "No sooner had."] },
  { id: "cf2e5678-2407-4bf8-9d4e-4ccd1ae33931", examples: ["I doubt that.", "I highly doubt that.", "Do you doubt that?", "Doubt that it's true."] },
  { id: "4047c3fe-253b-4be5-ba8c-524737b7e473", examples: ["Political expediency.", "Matter of expediency.", "For expediency.", "Choose expediency."] },
  { id: "a941156c-7323-4310-b72a-bc81c4a01c87", examples: ["Bullish on Bitcoin.", "Bullish market.", "Feeling bullish.", "Be bullish."] },
  { id: "a9e37bb3-71cc-40a9-8652-d988563f1d5d", examples: ["Cursory glance.", "Cursory inspection.", "Cursory look.", "Took a cursory look."] },
  { id: "7e905d55-25c3-45c1-9b71-98728dee53d1", examples: ["No reception here.", "Lost signal.", "Bad reception.", "Phone has no signal."] },
  { id: "0f1e1b7a-94b9-4e13-9f9b-4a4237d28a0d", examples: ["Stuck in traffic.", "Late due to being stuck in traffic.", "Always stuck in traffic.", "Traffic jam."] },
  { id: "a227e1b8-9cb3-4094-8df2-bb2a2b9976bd", examples: ["Ran out of battery.", "Phone ran out of battery.", "Battery died.", "About to run out of battery."] },
  { id: "b1c1e985-6926-4194-bfdb-ba1dfde3d4bf", examples: ["What's done is done.", "Miss the boat.", "Don't miss the boat.", "Too late, what's done is done."] },
  { id: "e3307e3d-8c7e-491e-b786-07119be342ba", examples: ["Inasmuch as I can.", "True inasmuch as.", "Agreed inasmuch as.", "Inasmuch as."] },
  { id: "defbdfe8-5a61-465a-ab52-c2334fdfa709", examples: ["Company going bust.", "Went bust.", "Fear of going bust.", "Business went bust."] },
  { id: "0a97ae11-b0e0-4dbd-ad47-819fa4cb93cb", examples: ["What's the story?", "So what's the story?", "Tell me the story.", "What's the story with that?"] },
  { id: "115461f9-5158-453b-aa8c-531a3f8bd6c8", examples: ["What have you been up to?", "Hey, what have you been up to?", "Tell me what you've been up to.", "Recently, what have you been up to?"] },
  { id: "d3732cb0-d79d-4977-bdcc-422e378164ed", examples: ["Tell me something I don't know.", "Yeah, tell me something I don't know.", "Old news, tell me something I don't know.", "Come on, tell me something I don't know."] },
  { id: "c5f9e1cf-0986-4be9-95f6-988e2757b580", examples: ["Count me out.", "I'm busy, count me out.", "If he's going, count me out.", "Don't count me out yet."] },
  { id: "0f82f1ef-b0f4-450b-930e-451b099bd461", examples: ["I'm down.", "I'm game.", "Are you down?", "Sure, I'm game."] },
  { id: "0629c60a-2f0d-46ca-a16e-4c789c242c7f", examples: ["Give it to me straight.", "Don't lie, give it to me straight.", "Doc, give it to me straight.", "Just give it to me straight."] },
  { id: "7fcdbca3-d052-4e88-84eb-c54e2383aa82", examples: ["Count me in.", "I'm going, count me in.", "Sounds fun, count me in.", "Can you count me in?"] },
  { id: "143fa84c-f3d6-4ccb-bd52-3e09a6f6b1d0", examples: ["Cut to the chase.", "Let's cut to the chase.", "Stop stalling and cut to the chase.", "Cut to the chase please."] },
  { id: "73947944-a814-49a1-a8db-850c2697e234", examples: ["Take it easy.", "Just take it easy.", "Relax and take it easy.", "Tell him to take it easy."] },
  { id: "b7a14d9a-c48b-4d27-9f20-9d64d4a5971d", examples: ["Hold your horses.", "Whoa, hold your horses.", "Just hold your horses.", "Hold your horses, we aren't ready."] },
  { id: "ceab59f0-c6e6-4b07-aae0-89838b5f5d89", examples: ["You got a point.", "He's got a point.", "Maybe you got a point.", "Valid point."] },
  { id: "21a7a408-cc8b-4d5b-874b-1a15b572f507", examples: ["Never mind.", "Oh, never mind.", "Never mind that.", "Just never mind."] },
  { id: "9b3773b9-5b05-4300-b3cb-5746b0fd5ab6", examples: ["Knock on wood.", "Hopefully, knock on wood.", "Knock on wood for luck.", "Superstitious knock on wood."] },
  { id: "63433a68-25bf-4896-824b-b614fbc51acd", examples: ["You nailed it.", "She nailed it.", "Totally nailed it.", "Nailed the presentation."] },
  { id: "3731b95a-7205-4804-aa53-5bc79e018baf", examples: ["Way to go!", "That's it, way to go.", "Way to go team.", "Good job, way to go."] },
  { id: "74b9f509-09b9-4301-9a1e-fe57a7d535c2", examples: ["You got lucky.", "Got lucky this time.", "Creating my own luck.", "She got lucky."] },
  { id: "7df9e621-9997-4b43-830f-7214a4090e39", examples: ["It gets on my nerves.", "She gets on my nerves.", "Noise gets on my nerves.", "Don't get on my nerves."] },
  { id: "7b327501-38da-4da9-9c74-c52ed7110c9e", examples: ["You're driving me crazy.", "Noise driving me crazy.", "Kids are driving me crazy.", "Don't drive me crazy."] },
  { id: "306c6e75-78ea-4a6d-8067-19475b611b44", examples: ["Watch your mouth.", "Watch your language.", "Better watch your mouth.", "Hey, watch your language."] },
  { id: "c95a8ea3-6bfe-4dec-a33e-c8a808ba4945", examples: ["Beat it.", "Tell him to beat it.", "Just beat it.", "Beat it, kid."] },
  { id: "55a55835-4af5-4c45-825d-b8e4bf9b3418", examples: ["Get out of my face.", "Don't get in my face.", "Get out of my face now.", "Told him to get out of my face."] },
  { id: "e8cfda1e-fc56-4f13-9491-d7338c7dd8b6", examples: ["Watch your back.", "Always watch your back.", "Better watch your back.", "I'll watch your back."] },
  { id: "31a77faa-9d7d-4097-bce4-3a991abe2c50", examples: ["Stay out of it.", "This is between us, stay out of it.", "Warned to stay out of it.", "Just stay out of it."] },
  { id: "6cfc17b7-151a-4754-81a2-20fe69839174", examples: ["Get off my back.", "Tell him to get off my back.", "Get off my back already.", "Need you to get off my back."] },
  { id: "840565b8-b864-41fa-990f-201fa764649b", examples: ["Don't stick your nose in.", "Sticking his nose where it doesn't belong.", "Don't be nosy.", "Stick to your own business."] },
  { id: "4a7b77f7-ef4f-4912-be79-596ab1a6246b", examples: ["What's on your mind?", "Tell me what's on your mind.", "Something on your mind?", "Speak your mind."] },
  { id: "dd3fa278-20d7-4a84-b5fe-a169a26d4d89", examples: ["Don't put words in my mouth.", "Stop putting words in my mouth.", "He put words in my mouth.", "I didn't say that, don't put words in my mouth."] },
  { id: "dc4ba2b6-4b16-45b4-b467-1e4c8937d25b", examples: ["I'm all ears.", "Tell me, I'm all ears.", "I'm listening, all ears.", "Ready to hear, I'm all ears."] },
  { id: "72cce5e2-cdaf-4307-8c31-7141a58ba65a", examples: ["Forget I asked.", "Just forget I asked.", "Never mind, forget I asked.", "Awkward, forget I asked."] },
  { id: "d49ad4b7-3bfd-4f41-9ded-9b44f89c0736", examples: ["It slipped my mind.", "Sorry, it slipped my mind.", "Forgot, it slipped my mind.", "Completely slipped my mind."] },
  { id: "7d4c5c00-837b-4ef2-a87a-590188535698", examples: ["That's not what I meant.", "Misunderstood, that's not what I meant.", "No, that's not what I meant.", "Clarify, that's not what I meant."] },
  { id: "681c3a9d-0d3a-4475-bf0a-7b79f452b612", examples: ["It's on the tip of my tongue.", "Name is on the tip of my tongue.", "Almost remember, on the tip of my tongue.", "Word on the tip of my tongue."] },
  { id: "8860373b-5520-4cf7-9da2-a8ff2f63de9b", examples: ["You hit the nail on the head.", "Exactly, hit the nail on the head.", "Hit the nail on the head with that comment.", "Nail on the head."] },
  { id: "7fb3d642-3f60-4150-8cb2-d7c6ceb7cab0", examples: ["I got your back.", "Don't worry, I got your back.", "Friends got your back.", "Who's got your back?"] },
  { id: "581c7d2c-827c-4f78-ac3f-9778278dcb9e", examples: ["Have my back.", "Will you have my back?", "He didn't have my back.", "Need someone to have my back."] },
  { id: "984552c1-e07d-41fa-a390-5cb89e09e1bf", examples: ["Get it off my chest.", "Need to get it off my chest.", "Feels good to get it off my chest.", "Get a load off my chest."] },
  { id: "f4c70b0d-538e-4d55-8724-b2e35a7ea4be", examples: ["Took the words right out of my mouth.", "You took the words out of my mouth.", "Exactly what I was thinking, took the words out of my mouth.", "Stole the words out of my mouth."] },
  { id: "0a981511-d807-4594-818b-10477bdd169e", examples: ["Don't hold back.", "Tell me everything, don't hold back.", "He didn't hold back.", "No need to hold back."] },
  { id: "c84efd18-abda-4e16-974c-80e773900697", examples: ["Don't leave me hanging.", "High five, don't leave me hanging.", "Left me hanging.", "Don't keep me waiting."] },
  { id: "c58ea89f-f4db-42bf-889e-a08b7822af8b", examples: ["Don't be a baby.", "Stop crying, don't be a baby.", "Acting like a baby.", "He's such a baby."] },
  { id: "3861a1c4-3b94-4a4d-99bc-4c9d2081d1e9", examples: ["I'm in.", "Count me in.", "If you're going, I'm in.", "Who's in?"] },
  { id: "5ad59d6e-125d-44bc-955d-7045b38284de", examples: ["Don't be ridiculous.", "That's ridiculous.", "Stop being ridiculous.", "You look ridiculous."] },
  { id: "55e62b05-4044-4f58-ba00-1b5d97d5409e", examples: ["Don't raise your voice.", "Stop yelling.", "Don't raise your voice at me.", "No need to raise your voice."] },
  { id: "0bdfa617-dc92-4907-893b-5ca15d3dcdd0", examples: ["Behave yourself.", "Tell the kids to behave.", "Behave properly.", "Can't you behave?"] },
  { id: "f5b9d401-05ae-4bc1-b908-314380f7ca9d", examples: ["Grow up.", "Time to grow up.", "Stop acting childish, grow up.", "He needs to grow up."] },
  { id: "8fb61062-5840-40d0-a0a0-b45a822cce51", examples: ["Settle down.", "Class settle down.", "Calm down.", "Ready to settle down."] },
  { id: "45e0729d-5a0a-4aa9-8636-91b4a07eb9fb", examples: ["I'll make it up to you.", "Let me make it up to you.", "How can I make it up to you?", "Made it up to her."] },
  { id: "f1dbc443-a8cd-4b85-84eb-908f8e7258e8", examples: ["It's not the end of the world.", "Don't worry, it's not the end of the world.", "Seems bad but not the end of the world.", "Not the end of the world."] },
  { id: "0f90531c-e1b2-43ee-8033-e78760e558c1", examples: ["You're a lifesaver.", "Thanks, you're a lifesaver.", "True lifesaver.", "She's a lifesaver."] },
  { id: "0bb60c3b-dc7b-4cdc-95c5-2ee67697bcb3", examples: ["I owe you one.", "Thanks, I owe you one.", "Big time, I owe you.", "IOU."] },
  { id: "57958f07-46ad-462d-885b-973491341d15", examples: ["It is what it is.", "Accept it, it is what it is.", "Can't change it, it is what it is.", "Situation is what it is."] },
  { id: "2599be4d-c702-4c4a-b415-d6a08ee0c531", examples: ["Let's split the bill.", "Go Dutch.", "Split the check.", "Pay separately."] },
  { id: "6751225e-7a09-4588-a01b-32866ba0c61a", examples: ["We're even.", "Even steven.", "Now we are even.", "Settled."] },
  { id: "c70c2d38-376e-433b-960a-0eb7962d6b15", examples: ["Let me sleep on it.", "Decide tomorrow, sleep on it.", "Sleep on the decision.", "Need to sleep on it."] },
  { id: "473a3b18-63e7-49be-a037-e046958f3c67", examples: ["I'll get back to you.", "Let me check and get back to you.", "Get back to you later.", "Got back to me."] },
  { id: "bfc09b6f-25eb-401e-8947-7dd2ec68457e", examples: ["It's on me.", "Dinner is on me.", "I'll pay, it's on me.", "Don't worry, it's on me."] },
  { id: "0f99269e-796b-45d8-b8c1-a7bfe4ea136c", examples: ["Be my guest.", "Go ahead, be my guest.", "Feel free, be my guest.", "You want it? Be my guest."] },
  { id: "9e2d687f-5f2a-430a-a9c3-41d8e3d89bc8", examples: ["At your service.", "Ready and at your service.", "I am at your service.", "Always at your service."] },
  { id: "24291652-e5fc-4f08-a830-82461cd9363f", examples: ["Take care.", "Goodbye, take care.", "Take care of yourself.", "You too, take care."] },
  { id: "4f777cd3-565c-45dd-8e14-457ec6a3ccde", examples: ["Have a blast.", "Enjoy the party, have a blast.", "We had a blast.", "Hope you have a blast."] },
  { id: "d86a7036-4df8-4baa-95dc-ad8ad720a11f", examples: ["Keep in touch.", "Let's keep in touch.", "Stay in touch.", "Don't be a stranger, keep in touch."] }
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
