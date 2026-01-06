
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

const batch = [
  { id: "ba9d42ab-8846-4cb2-834c-69f8c445610e", examples: ["Please RSVP by Friday.", "Did you RSVP to the wedding?", "RSVP is required.", "We received your RSVP."] },
  { id: "df4f911e-e539-4c9c-ab96-390c669ea87e", examples: ["I have limited PTO left.", "Requesting PTO for next week.", "Paid Time Off (PTO) is a benefit.", "She acts like she's on permanent PTO."] },
  { id: "cb0111b0-0db0-41d4-b981-bf0360c8cd67", examples: ["Address it 'Attn: HR'.", "FAO (For Attention Of) the Manager.", "Mark the envelope 'Attn'.", "Sent FAO John Smith."] },
  { id: "c3000815-b650-436e-a5d3-e26c8290822a", examples: ["Price is $10 incl. tax.", "Battery not incl.", "All meals are incl.", "Incl. shipping and handling."] },
  { id: "6b45e0a1-a655-4c3f-ac22-56d5c7ed712f", examples: ["Apple Inc. is a tech giant.", "Monsters, Inc.", "Company name, Inc.", "Incorporated (Inc.) business."] },
  { id: "0050835d-1d91-4f64-9a66-d3d573bfd6d3", examples: ["Please find the encl. document.", "See encl. for details.", "Encl: CV and cover letter.", "Check the encl. invoice."] },
  { id: "efa98bc9-62da-4a73-9958-f8a3cb180d01", examples: ["PS: I love you.", "She added a PS to the letter.", "PS stands for Postscript.", "Don't forget the PS."] },
  { id: "1790518b-e45e-4723-bd71-257cfeb12f33", examples: ["Please enclose an SAE.", "Self-addressed envelope (SAE).", "Send an SAE for a reply.", "Don't forget the stamp on the SAE."] },
  { id: "685c673a-15db-48a1-95ed-c99e2b1f18f6", examples: ["The car slid sideways.", "Looked at me sideways.", "Move it sideways.", "A sideways glance."] },
  { id: "611ddb34-b17a-432e-9124-a976f9bd7047", examples: ["I can't recall his name.", "Recall the events of that night.", "Product recall due to safety.", "As far as I can recall."] },
  { id: "f1c50b46-5f9a-482a-8a5f-3bd482be86b9", examples: ["You should mind your own business.", "I told him to mind his own business.", "Why can't you mind your own business?", "Just mind your own business."] },
  { id: "f4972b3a-c680-41e6-81da-152c3e366f2a", examples: ["I'll prolly go later.", "It's prbly going to rain.", "Prolly not.", "He's prolly sleeping."] },
  { id: "d33839a9-f0d9-40c7-9361-5290d4c951b4", examples: ["I gotta go, gtg.", "Sorry, gtg now.", "Gtg, bye!", "Chat later, gtg."] },
  { id: "8f7ff470-f9e5-4fbe-938e-8e5f126ab164", examples: ["It was Tuesday, iirc.", "Iirc, he said no.", "If I recall correctly (iirc).", "That was last year, iirc."] },
  { id: "3a9b2ad9-38fb-4e06-a33f-1ef150d6c823", examples: ["Please MYOB (Mind Your Own Business).", "Just MYOB.", "He needs to MYOB.", "It's polite to MYOB."] },
  { id: "7b93c944-4869-4827-8f54-e03fdede971a", examples: ["Love you x.", "Sent a text with a x.", "Kiss (x).", "Signed off with an x."] },
  { id: "1f69bd1d-d75e-4a64-8895-18c73c041c59", examples: ["IMHO, it's better.", "In my humble opinion (imho).", "That's wrong, imho.", "Imho, we should wait."] },
  { id: "bb3d936b-f004-48c7-918c-f1f2de6d7d5e", examples: ["That was funny, lol.", "LOL!", "I actually lol'd.", "He sent a lol."] },
  { id: "c9a7b524-fa9f-438b-825a-5e3785027efc", examples: ["Btw, how are you?", "By the way (btw).", "Oh, btw, I saw him.", "Nice shirt, btw."] },
  { id: "517c5556-aa2f-43fe-b0c7-5cd7dc3f565f", examples: ["All the best (atb).", "Hope you're well, atb.", "Signed off with atb.", "Atb for the exam."] },
  { id: "e72f55d1-31da-4647-8b63-1bc742680e88", examples: ["FYI, the meeting is cancelled.", "Just for your information (fyi).", "Sent this FYI.", "FYI, I'm leaving early."] },
  { id: "73c20835-9541-42f4-9fc0-d85be010b292", examples: ["See you later (cul8r).", "Gotta run, cul8r.", "Cul8r alligator.", "Texted cul8r."] },
  { id: "a78226c8-b3d6-4f8d-b4cf-41b36534a5d5", examples: ["Give me a hand.", "Hold my hand.", "On the other hand.", "Have a nice day (HAND) - slang."] },
  { id: "b179def4-2569-4f9c-9556-fadbe8ea4982", examples: ["Bye for now (bfn).", "Gotta go, bfn.", "Talk later, bfn.", "Bfn!"] },
  { id: "8ddd4290-53ee-42b8-ab7d-2494d2b4fb88", examples: ["Call me asap.", "Need it ASAP.", "As soon as possible.", "Reply asap."] },
  { id: "17eda6bf-9887-46f3-a471-64d1d92fe5dd", examples: ["Talk to you later (ttyl).", "Ttyl, bye.", "I'm busy, ttyl.", "Okay, ttyl."] },
  { id: "73b4ba2f-9257-49e1-a76a-086b58ccd822", examples: ["Concrete floor.", "Concrete evidence.", "Pouring concrete.", "A concrete plan."] },
  { id: "42bc7801-007e-41aa-a677-4360c96dcd39", examples: ["The current occupant.", "Occupant of the house.", "Addressed to 'Occupant'.", "Vehicle occupant safety."] },
  { id: "69c58ee8-8f87-4dd3-903e-8fc5b6ad3423", examples: ["Adverse effect on health.", "Detrimental effect on the environment.", "No adverse effects reporting.", "Drug has a detrimental effect."] },
  { id: "afe24ce5-efa4-4bf3-a2fa-11d2c30cc070", examples: ["Government bailed out the bank.", "Can you bail me out?", "Bail someone out of jail.", "My parents bailed me out."] },
  { id: "bde997b1-6d55-40b0-9712-21a698df5fd4", examples: ["Cost per person.", "Per annum.", "As per instructions.", "Miles per hour."] },
  { id: "649b725c-9760-4bf4-b919-183300c282ec", examples: ["Open a savings account.", "Interest on deposit account.", "Transfer to savings.", "Stash in deposit account."] },
  { id: "f5f85842-f5ad-4306-ae91-c3779fb840a9", examples: ["Checking/Current account.", "Pay from current account.", "Current account balance.", "Overdrawn current account."] },
  { id: "4baa7294-297a-4326-8027-9663a4fa88fd", examples: ["The sum of two numbers.", "A large sum of money.", "Sum total.", "Lump sum payment."] },
  { id: "81f786c9-037b-4880-bff0-a9f3d66545e6", examples: ["She is very thrifty.", "Thrifty shopper.", "Be thrifty with water.", "A thrifty lifestyle."] },
  { id: "c99d0453-4e30-4cc0-a54b-cdfc6907489f", examples: ["Check your bank statement.", "Monthly bank statement.", "Error on the statement.", "Online bank statement."] },
  { id: "96f25fb0-7740-4e1a-9f07-1cc14451fa15", examples: ["Pay by debit card.", "Insert your debit card.", "Lost my debit card.", "Debit card transaction."] },
  { id: "9f5a37fa-af47-42b9-b8d1-91b6dec756c7", examples: ["Positive outlook on life.", "Economic outlook.", "Weather outlook.", "Outlook for the future."] },
  { id: "985985f0-844d-411a-9682-0d7df4a9f2c0", examples: ["Corporate events.", "Corporate culture.", "Corporate ladder.", "Corporate responsibility."] },
  { id: "1f653875-d3fe-4543-b822-45a3cfe87528", examples: ["Invest in equities.", "Equities market.", "Return on equities.", "Global equities."] },
  { id: "c2dc705d-e040-4e52-bc59-171d1a761b68", examples: ["An angel investor.", "Property investor.", "Foreign investor.", "Investor confidence."] },
  { id: "be077e38-17ef-4ed2-a0ba-46a9e5651dd2", examples: ["Attempted hostile takeover.", "Defend against hostile takeover.", "Hostile takeover bid.", "Feared a hostile takeover."] },
  { id: "85dc80e9-4293-4e6d-8773-bdbccf1cf492", examples: ["Agreed to a friendly takeover.", "Friendly takeover talks.", "Merger became a friendly takeover.", "Usually prefers friendly takeover."] },
  { id: "d905d2cb-4f2b-47a4-8bc3-347086ecc7d1", examples: ["Recent acquisition.", "Mergers and acquisitions.", "Valuable acquisition.", "Target for acquisition."] },
  { id: "19114449-72d2-4906-a115-d08ae039f7ac", examples: ["Company takeover.", "Takeover bid.", "Complete the takeover.", "Resist the takeover."] },
  { id: "82552136-392e-4a67-8f32-fe9a51fcf0ba", examples: ["Merger of equals.", "The merger failed.", "Proposed merger.", "Post-merger integration."] },
  { id: "4f1ee817-5e3e-4d3d-877d-3803e29afb24", examples: ["Set off the alarm.", "Set off a chain reaction.", "Don't set him off.", "Set off on a journey."] },
  { id: "72aecf57-1ce5-46f2-839c-48cbf7908f84", examples: ["Pay a dividend.", "Dividend yield.", "Peace dividend.", "Quarterly dividend."] },
  { id: "ef19a3ed-d0e7-4129-b575-16e22c9e940a", examples: ["Shareholder meeting.", "Majority shareholder.", "Shareholder value.", "Rights of a shareholder."] },
  { id: "fd02e7fa-8460-42b5-a85a-f0106e36dff6", examples: ["Reject the offer.", "Body might reject the organ.", "Reject the idea.", "He was rejected."] },
  { id: "8bd9ddd8-0288-4e92-9c89-cf9921003058", examples: ["Financial backing.", "Needs backing from the board.", "Backing vocals.", "The fabric has a backing."] },
  { id: "f32b303c-c143-4d59-88dd-fffb9c0c50a3", examples: ["Make a bid.", "Bid for the contract.", "Highest bid wins.", "Takeover bid."] },
  { id: "01363981-18b8-4f16-b904-6cd3b0c6a979", examples: ["Joint venture.", "Joint account.", "Aching joint.", "Joint effort."] },
  { id: "16ec378b-484d-4bf7-b8ca-90628461e21d", examples: ["Mount a campaign.", "Mount a challenge.", "Mount the horse.", "Mount a defense."] },
  { id: "06c6ab33-b086-4cad-b262-623b4af91905", examples: ["Former president.", "In former times.", "Shadow of his former self.", "Former employer."] },
  { id: "8d7a0d01-d075-4ba4-93d2-27805f089391", examples: ["Take the initiative.", "New initiative launched.", "Lack of initiative.", "Government initiative."] },
  { id: "6789d058-d762-4fe8-b58d-879baab950e5", examples: ["Stifle creativity.", "Stifle a yawn.", "Stifle debate.", "Don't stifle him."] },
  { id: "6a249a23-60c6-40e5-8b35-4ad2573fbe85", examples: ["Undermine confidence.", "Undermine authority.", "Don't undermine me.", "Erosion undermined the cliff."] },
  { id: "b50a2bc0-a338-4019-ae9d-e49c69891098", examples: ["Disruptive behavior.", "Disruptive technology.", "He was disruptive in class.", "Disruptive influence."] },
  { id: "c025c44a-32c2-4f71-987a-7e83574f86ae", examples: ["Fit in with the team.", "Try to fit in.", "Check if it fits in.", "Hard to fit in."] },
  { id: "7f8b6fa7-c72d-4848-9835-502bff6635c5", examples: ["Pool resources.", "Car pool.", "Pool our money.", "Swimming pool."] },
  { id: "475951d8-4d8e-4ac8-b5ed-6462e6d16835", examples: ["I value your opinion.", "Value for money.", "Great value.", "He values honesty."] },
  { id: "7eda0fc0-8cf3-4c46-aeb3-3a8dbbacde5c", examples: ["Fulfilling career.", "Fulfilling life.", "Find it fulfilling.", "Self-fulfilling prophecy."] },
  { id: "4d8db3a7-00a2-4b5f-9a74-e587506e7438", examples: ["Mutual respect.", "Mutual friend.", "Mutual funds.", "The feeling is mutual."] },
  { id: "9cab1e39-f8cc-425a-9412-b46f6a378e88", examples: ["In collaboration with.", "Collaboration tool.", "Close collaboration.", "Artistic collaboration."] },
  { id: "5d9bc836-3645-4d17-961e-0d0102173c1f", examples: ["Build team spirit.", "Great team spirit.", "Lack of team spirit.", "Show team spirit."] },
  { id: "888cf8d2-83a0-4a32-847c-0ebc3e479e85", examples: ["Foster innovation.", "Foster parent.", "Foster good relations.", "Foster growth."] },
  { id: "313bf59a-ce8a-4872-a784-3256296280de", examples: ["Low morale.", "Boost morale.", "Employee morale.", "Morale is high."] },
  { id: "2061922b-1e70-4702-9758-9afe02ef4f4f", examples: ["Work towards a common goal.", "Share a common goal.", "United by a common goal.", "Our common goal."] },
  { id: "b4e9e59a-b54d-4c6c-b373-c89dc6259105", examples: ["Encroach upon privacy.", "Encroach on territory.", "Don't encroach.", "Encroach upon rights."] },
  { id: "d3c73df2-3059-496d-8612-b954b4bddb7b", examples: ["Encounter resistance.", "Encounter a problem.", "Brief encounter.", "Chance encounter."] },
  { id: "266804d7-28e9-4857-a5ee-53198d352656", examples: ["Additional information.", "Additional charge.", "Need additional help.", "Additional distinct features."] },
  { id: "4aaf2f1c-165e-44ee-8994-9005b069f4a2", examples: ["Guarantee a profit.", "I guarantee it.", "Money back guarantee.", "Can't guarantee safety."] },
  { id: "f7e17e3e-9a33-4910-9864-7de537eed525", examples: ["Juggle work and life.", "Juggle balls.", "Hard to juggle tasks.", "Juggle the budget."] },
  { id: "3b1582cf-e303-4321-9d5b-1ab4f0c72035", examples: ["Solely responsible.", "Rely solely on luck.", "Done solely for money.", "Solely my decision."] },
  { id: "8d4787fb-2a9a-4774-9393-f9d41367ae0f", examples: ["Lucrative deal.", "Lucrative business.", "Highly lucrative.", "Not very lucrative."] },
  { id: "21efdb74-c9c5-49bb-8171-c1a95ebeba59", examples: ["Insight into the market.", "Deep insight.", "Gain insight.", "Offer insight."] },
  { id: "968c8526-929a-450c-a8b5-61f960f193ef", examples: ["Accountable to the public.", "Hold him accountable.", "Accountable for actions.", "Who are you accountable to?", "Solely accountable."] },
  { id: "394921cf-30dd-4505-b579-4e796dcda868", examples: ["Weigh the pros and cons.", "Pros and cons of the plan.", "Discuss pros and cons.", "Consider pros and cons."] },
  { id: "1e9fbd35-685a-4f37-90be-3308d605eac5", examples: ["Eat at the subsidized canteen.", "Company has a subsidized canteen.", "Food is cheap in the subsidized canteen.", "Enjoy the subsidized canteen."] },
  { id: "a7cf21f1-13f3-4a37-9ffe-cf75a981a240", examples: ["Offers comprehensive healthcare provision.", "Need comprehensive healthcare provision.", "Lack of comprehensive healthcare provision.", "Benefit of comprehensive healthcare provision."] },
  { id: "616bc87f-b759-4dbb-9e60-2d1e4421f084", examples: ["I have a 30 days' holiday entitlement.", "Generous holiday entitlement.", "Check your holiday entitlement.", "Use your holiday entitlement."] },
  { id: "82aa9143-9020-42be-b8de-f2f60f9bdd25", examples: ["Travel expenses.", "Claim expenses.", "Business expenses.", "At my own expense."] },
  { id: "0ae8ef33-db16-4169-8abf-9f875b4f05b3", examples: ["Take paternity leave.", "Paid paternity leave.", "On paternity leave.", "Apply for paternity leave."] },
  { id: "ffc5252b-38f1-4181-b207-a87ccdf9d669", examples: ["She is on maternity leave.", "Maternity leave pay.", "Return from maternity leave.", "Extended maternity leave."] },
  { id: "2fef14ca-17fa-42a8-bfca-148f3457214f", examples: ["Join the company pension scheme.", "Pay into the pension scheme.", "Good pension scheme.", "Opt out of pension scheme."] },
  { id: "22531756-f0f3-4df2-a5dd-a43345f0605d", examples: ["Annual bonus scheme.", "Performance bonus scheme.", "Explain the bonus scheme.", "Benefit from the bonus scheme."] },
  { id: "c621d9e9-8e18-458d-bba3-6aa077343ad9", examples: ["Performance-related pay.", "Performance-related bonus.", "It is performance-related.", "Performance-related issues."] },
  { id: "d357f472-10b6-4cc3-89cd-e3e673af5de9", examples: ["Received a relocation allowance.", "Ask for relocation allowance.", "Relocation allowance covers moving costs.", "Generous relocation allowance."] },
  { id: "2d12f4b0-2bff-412b-bdd4-0aeb6666e748", examples: ["Attractive benefits package.", "Negotiate the benefits package.", "Includes a good benefits package.", "Compare benefits packages."] },
  { id: "3d8cd02a-b4af-4a41-8603-0f8a43fb925b", examples: ["Job benefits.", "Health benefits.", "Weigh the benefits.", "Mutual benefits."] },
  { id: "eabbe0b3-ecb2-405c-9d9d-b97ab66dab54", examples: ["Short-sighted decision.", "Don't be short-sighted.", "Short-sighted policy.", "He is short-sighted (needs glasses)."] },
  { id: "ad97cca6-97fe-4b72-a19a-6b8dd95e31ea", examples: ["Stamp your foot in anger.", "Don't stamp your foot.", "He stamped his foot.", "Stamp foot to remove snow."] },
  { id: "c055baca-b530-47d1-8a11-88bf23fa518e", examples: ["Shrug your shoulders.", "He just shrugged his shoulders.", "Don't shrug your shoulders at me.", "Shrug shoulders in indifference."] },
  { id: "51c1f8ce-0c78-4c05-b642-9725cd4e14d5", examples: ["Raise your eyebrows.", "It made him raise his eyebrows.", "Raise eyebrows in surprise.", "Don't raise your eyebrows."] },
  { id: "6b94cbaf-3a7d-4cc5-b483-43ffa6e6b56f", examples: ["Nod your head yes.", "He nodded his head.", "Nod your head to the music.", "Just nod your head."] },
  { id: "8f32f4f8-f216-4e5e-852c-3f3c500fd2f2", examples: ["Lick your lips.", "Lick lips in anticipation.", "Dry, lick lips.", "Don't lick your lips like that."] }
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
