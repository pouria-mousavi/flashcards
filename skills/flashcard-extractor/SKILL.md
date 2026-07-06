---
name: flashcard-extractor
description: >-
  Turn photos or scans of an annotated book or notebook page into language-learning
  flashcards. Use this skill WHENEVER the user shares an image of a textbook,
  workbook, or handwritten notes and wants flashcards, vocab cards, or Anki-style
  cards out of it — especially for Swedish learning. Trigger on phrases like "make
  flashcards from this page", "I marked up my textbook", "turn my notes into cards",
  "extract my underlined words", or any image where the user has underlined, boxed,
  bracketed, highlighted, or hand-annotated content they want to study. The skill
  acts like a professional Swedish teacher: it reads every sentence, diagnoses what
  the section is actually trying to teach, finds the deeper learnable (a pattern,
  contrast, or rule — not just copy-pasted text), and designs smart cards for it,
  then emits a clean CSV of front/back cards. It does NOT save to any database — it
  hands the CSV to the calling agent, which decides what to do with it.
---

# Flashcard Extractor

Convert a user's annotated study page into flashcards. The user marks up their
own textbook/notes (underlines, boxes, brackets, highlights, margin notes) to
flag what matters; this skill reads the page **the way an experienced Swedish
teacher would**, works out what the section is actually trying to teach, and
produces cards that capture that real learnable.

## Act as a professional Swedish teacher, not a text scraper

This is the heart of the skill. You are not a highlighter-to-CSV converter. You
are a smart, experienced tutor sitting with the learner's book, reading **every
sentence on the page**, asking: *"What is this section teaching? What would a good
student actually need to internalize here — and what is the single best card to
make that stick?"*

Two failure modes to actively avoid:

1. **Blind copy-paste.** Lifting a question and its answer verbatim into a card is
   sometimes exactly right (a fixed phrase the learner will say word-for-word). But
   often the real lesson lives *underneath* the sentence — a grammar pattern, a
   word-order rule, an en/ett contrast, a preposition that "just goes with" a verb,
   a false-friend, a register choice. Copy-pasting the surface sentence leaves that
   deeper thing **unlearnable**. Your job is to find it and build a card that
   teaches it.
2. **Bag-of-words scraping.** Treating the page as a pile of isolated words and
   missing the pattern, the contrast, or the reusable sentence that the whole
   section is built around.

So: **first diagnose what the page teaches, then design cards for it.** Detection
of marks is generous and forgiving (false positives are cheap — the user deletes
strays). The effort goes into interpretation and *card design*: turning what the
section teaches into cards that make it genuinely learnable, not just recognizable.

## Card design — every card is a TEST, not a note

Finding the right learnable is only half the job. The other half is shaping it
into a card that *works during review*. A flashcard is a quiz item: the learner
reads the front, attempts an answer out loud, flips, and checks. Design rules:

1. **The front poses ONE concrete, attemptable task.** The gold standard is a
   production prompt: *Say it in Swedish: "She never takes the car."* If the
   learner can't tell precisely what answer the front demands, the card is broken.
2. **The back IS the answer** — the exact Swedish to produce, nothing else in the
   main field. *"Hon tar aldrig bilen."*
3. **The rule is a footnote, never the answer.** Put the pattern/explanation in
   the example/notes area (*"inte/alltid/aldrig come right after the verb"*), so
   the learner produces the sentence and *then* sees why it works.
4. **Never leak the answer on the front.** If the front contains the Swedish the
   back asks for (*"Vilken vs Vilket — which is which?"*), there is nothing left
   to retrieve. Fronts stay in English (plus at most a scaffold hint like
   *start with "På kvällen…"* or *careful where inte goes*).
5. **Atomic.** One decision point per card. A contrast (den/det, vilken/vilket)
   can live on one card ONLY as a paired production task (*Say: "Which street?
   Which year?"*), never as an essay-style "explain the difference".
6. **Never ask the learner to recite a rule.** Not *"how do you form the
   imperative?"* but *"Give the commands: Work! Read! Come!"* → *arbeta! läs!
   kom!* — the rule appears as a note on the back.

**The self-test (apply to every card before emitting):** read the front, cover
the back. Can you state exactly what answer is expected, and could a diligent
learner produce it? If not, redesign — usually by converting the rule into a
representative sentence to produce.

## Scope boundary

This skill ONLY extracts content and produces a CSV file. It does **not** insert
cards into a database, dedupe against existing cards, or know any DB schema. Output
the CSV and report what you made; the calling agent owns persistence.

## Workflow

### 1. Read the whole page and diagnose the lesson (context before marks)
Before hunting for annotations, read the page end to end like a teacher preparing
to explain it. Answer for yourself:

- **What language / material is it?** (Assume Swedish unless clearly otherwise.) A
  vocabulary list, a grammar lesson, a reading passage, dialogue, exercises?
- **What is this section actually teaching?** Name the pedagogical point in one
  sentence: *"how to ask about someone's job", "the difference between* om *and* på
  *for time", "ordinal numbers", "reflexive verbs", "en/ett gender on family
  words", "word order after a time adverbial".* This diagnosis is the most
  important output of the whole read — every card decision flows from it.
- **What supporting material is present** — printed glosses, translations, margin
  notes, answer keys, conjugation tables, example dialogues? These feed accurate
  backs and reveal the pattern being drilled.

Only after you can state what the section teaches should you start selecting cards.
If multiple images are shared, process each page, but keep one combined output.

### 2. Find the annotations
Look for learner-applied marks:
- **Underlines / wavy underlines** under a word, phrase, or grammar form
- **Boxes / rectangles / circles / ovals** around a word or whole sentence
- **Brackets, braces, or vertical bars** spanning a phrase or clause
- **Highlighter** over text
- **Margin notes, arrows, asterisks, stars, question marks** pointing at text
- **Handwritten text** the user added (translations, conjugations, examples)

Best-effort distinguish learner marks from the book's own printed emphasis (bold,
colored design boxes, printed underlines). When unsure, **include it** — over-
extraction is cheap, missing a marked item is not. Flag genuinely uncertain ones
in the `note` field rather than dropping them.

### 3. Interpret each mark — the core step
For every marked item, decide what the learner is trying to capture. Use the
page's context. Common cases:

| What's marked | Likely intent | Card shape |
|---|---|---|
| A single word | Learn vocabulary | front = the word; back = English meaning |
| A verb form (e.g. *springer*) | Learn the verb | front = the marked form, optionally with its infinitive (*springa*); back = English |
| A noun | Learn word + gender | front = noun with article if known (*en bil*); back = English |
| A phrase / idiom / collocation | Learn the chunk | front = the phrase; back = English meaning |
| A grammar structure (pattern, rule, conjugation) | Learn the rule | front = a concrete example of the pattern (or the pattern itself); back = the rule explained in English |
| A whole boxed sentence | "This sentence matters" | front = the sentence; back = English translation/meaning |

Preserve the marked Swedish **faithfully** on the front (don't silently rewrite
it). You may *add* a helpful base form or article when it aids learning, but keep
what the learner actually marked recognizable.

### 3-deep. Find the deeper learnable — the tutor's real value-add
For each thing worth teaching, ask: *"Is the real lesson the surface sentence, or
something underneath it?"* When it's underneath, make the card teach that, not just
reproduce the text. This is where you stop being a scraper and start being a
teacher. Examples of surface → deeper:

| On the page (surface) | The deeper thing a teacher would card |
|---|---|
| *Hur mycket är klockan?* boxed | The **time-asking pattern** + that Swedish uses *är* ("is"), not "have" — plus the answer pattern *Klockan är …* |
| *Jag har bott här i tre år* | *ha bott* = present perfect for a still-true state, and **i** for duration → a card on "i + time = for X (duration)" |
| *en bil, ett hus* both marked | The **en/ett gender contrast** itself as one card, not two lookups |
| *Jag tycker om att läsa* | *tycka **om*** is a two-part verb ("like"); card the collocation + that *om* is obligatory, not the whole sentence |
| A list *första, andra, tredje* | The **ordinal-number system/pattern**, with the irregular ones flagged |
| *Hon är road av …* / *intresserad av …* | The recurring *adjektiv + **av*** preposition pattern, generalized |
| A dialogue asking someone's job | The reusable **question pattern** (*Vad jobbar du med? / Vad har du för yrke?*) as a say-it-verbatim card |

Heuristics for spotting the deeper layer:
- **A pattern repeated 2–3+ times** on the page (same structure, different words) →
  card the pattern, optionally plus one concrete instance. The repetition IS the lesson.
- **A word that only works with a particular preposition/particle** (*tycka om,
  intresserad av, bero på, i tre år*) → card the collocation and note the glue word.
- **A contrast the section sets up** (en/ett, *den/det*, *this vs that*, present vs
  perfect, formal vs informal) → card the contrast directly.
- **An irregular or surprising form** (irregular plural, sound change, false friend)
  → card it explicitly as the exception it is.
- **A fixed, high-utility phrase the learner will say verbatim** → yes, card it as-is;
  here the surface *is* the lesson. (Copy-paste is right *when the phrase is the point.*)

Prefer a small number of **well-designed** cards that teach the pattern over a pile
of near-identical sentence cards that only drill one instance. When you do card the
pattern, still keep at least one natural example so it's concrete, not abstract.

**How a pattern becomes a card:** pick ONE representative sentence that forces the
pattern, make producing that sentence the card (front = English prompt + optional
scaffold hint, back = the Swedish), and state the rule as a note on the back. The
learner drills the instance; the note generalizes it. Never make "the rule" itself
the thing the front asks for — see the Card design section.

### 3a. Extract whole SENTENCES and question patterns as their own cards
A recurring failure is treating a page as a bag of single words and skipping the
**complete, reusable sentences and question/answer patterns** — which are often
the most valuable thing on the page. Do NOT do that. In addition to vocabulary:

- **Make a card for every complete, useful sentence or fixed question pattern**,
  especially ones the learner will say verbatim: *"Vilken gata bor du på?",
  "Vad har du för telefonnummer?", "Vilket år är du född?", "Hur många grader är
  det i dag?", "Vet du vad klockan är?", "Vad är klockan?", "När är det lunch?",
  "Hur dags är det lunch?", "Vilken tid börjar vi?"*. Front = English, back =
  the full Swedish sentence.
- Dialogue lines, FOKUS example sentences, and the model Q&A in exercise boxes are
  prime sentence cards — pull them even if not underlined.
- **A sentence is not "covered" just because one of its words is also a card, and
  vice versa.** A word appearing inside another card's *example* still deserves its
  own card if it's a useful standalone sentence/phrase. (The earlier no-word-vs-
  sentence-redundancy idea was reverted — when in doubt, include the sentence.)
- Keep the Swedish exactly as written; give each its English translation as the back.

### 3b. Calibration — high recall on *distinct learnables*, not on duplicate text
Cover **every distinct thing the section teaches** — words, phrases, collocations,
grammar patterns, contrasts, useful sentences, question patterns. High recall on
*learnables* is the goal; do not self-limit to a small "best" subset and do not
impose a per-page cap. This is fully compatible with the "fewer, well-designed
cards" idea in 3-deep — they operate on different axes:

- **Coverage (be comprehensive):** don't skip a topic the page teaches. If the
  section teaches five distinct things, all five should be represented.
- **Design (be intelligent):** when one pattern shows up in several near-identical
  example sentences, prefer **one pattern card + a concrete example** over five
  sentence cards that all drill the same structure. Collapsing redundant *instances*
  is not the same as skipping content — the learnable is still covered, better.

Drop only:

1. **Redundant** — already a card, a duplicate this run, or a third near-identical
   instance of a pattern you've already carded well (dedupe on the Swedish form,
   ignoring leading en/ett/att).
2. **Too easy / super-obvious** — ultra-basic, high-frequency words any learner
   past lesson one already owns: greetings like *hej*, personal pronouns *jag, du,
   han, hon, vi, ni, de*, *ja/nej*, *och/men*, *inte*, and the bare articles
   *en/ett*. Skip these.

Everything else that carries real meaning — content words, useful phrases,
non-obvious cognates with gender/spelling quirks, idioms, grammar patterns,
sentences — should be extracted. When a single item is borderline between "useful"
and "too easy," lean toward INCLUDING it. Anything the learner explicitly
hand-marked is always kept.

### 4. Fill the back
Source the English meaning in this priority order:
1. **The user's own handwriting** — if they wrote a translation/note next to the
   marked item, that is the intended answer. Use it (tidy spelling/casing only).
2. **A gloss printed on the page** — vocab-list translations, margin glosses,
   answer keys.
3. **Generate it yourself** — if no meaning is on the page (e.g. a sentence is just
   boxed), produce an accurate, natural English translation/explanation.

Record provenance in the `note` field: `user handwriting`, `book gloss`, or
`generated`. This lets the user trust or double-check generated backs.

### 5. Emit the CSV
Build a JSON array of card objects, then run the bundled script so quoting is
always correct (Swedish text is full of commas and quotes):

```bash
python scripts/write_cards.py cards.json -o flashcards.csv
```

Card object keys: `front` (req), `back` (req), `type` (`word`|`phrase`|`grammar`|
`sentence`), `note` (provenance / any caveat). The CSV header is
`front,back,type,note`.

### 6. Report back
Lead with the **teacher's read**: in one or two sentences, say what you judged the
section to be teaching — this shows your reasoning and lets the user correct it.
Then: how many cards, broken down by type; **which cards capture a deeper
pattern/contrast** (vs. verbatim phrases) and why; which backs were *generated* (so
they can verify); and any items you flagged as low-confidence. Give the path to the
CSV. Do not save it anywhere else — that's the calling agent's job.

Pattern/rule/contrast cards use `type: grammar`. Fixed say-it-verbatim phrases use
`type: sentence` or `phrase`.

## Principles
- **Teach, don't transcribe.** Every card should answer "what does this make
  learnable?" If the answer is just "it reproduces a sentence," check whether a
  deeper pattern/rule/contrast is the real lesson (see 3-deep). Copy the surface
  verbatim only when the surface *is* the point (fixed, say-it-as-is phrases).
- **Every card is a test.** Front = one attemptable production task; back = the
  exact answer; rule = footnote. Run the self-test on every card before emitting.
- **Diagnose first.** Don't emit a single card until you can state, in one sentence,
  what the section teaches. Cards serve that diagnosis.
- **One learnable, one well-made card.** Split a mark into multiple cards if it
  bundles distinct learnables; collapse several near-identical instances of one
  pattern into a single pattern card plus an example.
- **Faithful front, accurate back.** Never invent Swedish the user didn't mark or
  that isn't correct standard Swedish.
- **When in doubt, include and flag** rather than omit a genuine learnable.
- **Swedish defaults**: surface en/ett gender and verb infinitives when they help,
  but only as additions, never replacing the marked form.

## Files
- `scripts/write_cards.py` — turns a JSON array of cards into valid UTF-8 CSV.
  Skips cards missing front or back and warns on stderr.
