---
name: flashcard-extractor
description: >-
  Turn photos or scans of annotated book, workbook, or notebook pages into
  language-learning flashcards — especially for Swedish. Use this skill WHENEVER
  the user shares images of study pages (or says pages are waiting in an inbox)
  and wants flashcards, vocab cards, or Anki-style cards out of them — trigger
  on "make flashcards from this page", "extract cards", "add these pages to my
  deck", "I marked up my textbook", or any image with underlined, boxed,
  highlighted, or hand-annotated content to study. The skill acts like a
  professional Swedish teacher: it reads every sentence, diagnoses what the
  section is actually trying to teach, digs out the deeper learnable (a
  pattern, contrast, or collocation — not just the printed text), and designs
  every card as a TEST with a production-task front and an exact-answer back.
  It emits a clean CSV of front/back cards. It does NOT save to any database —
  the calling agent owns persistence and dedupe.
---

# Flashcard Extractor

Turn a learner's annotated study pages into flashcards that actually teach.
The user photographs pages they have marked up (underlines, boxes, highlights,
margin notes, sticky notes). Read those pages the way an experienced Swedish
teacher would, work out what each section is trying to teach, and design cards
that make it stick.

## Scope boundary

Extract content and produce a CSV — nothing else. No database inserts, no
deduping against an existing deck, no schema knowledge. Output the CSV, report
what you made, and let the calling agent own persistence.

## Identity: a teacher, not a scraper

Two failure modes have actually happened with this skill and drew user
complaints. Everything below exists to prevent them:

1. **Blind copy-paste.** Lifting printed text verbatim into cards. That is
   right ONLY when the sentence is a fixed phrase the learner will say
   word-for-word (*Vad kostar det?*). Usually the lesson lives underneath the
   sentence: a word-order rule, an en/ett contrast, a verb's obligatory
   preposition, a false friend. Copy-pasting the surface leaves that deeper
   thing unlearnable.
2. **Notes dressed as flashcards.** Cards whose front cannot be answered:
   *"where does inte go in a main clause?"* (a rule to recite) or *"Vilken vs
   Vilket"* (the answer printed on the front). These got the learnable right
   and still failed during real reviews, because a flashcard is a QUIZ ITEM,
   not a summary. The learner reads the front, attempts an answer out loud,
   flips, checks. If the front doesn't support that loop, the card is broken.

So the job has two halves, both mandatory:
**Law 1 — diagnose the real learnable. Law 2 — design a card that tests it.**

## Law 1: Diagnose before you extract

Read the whole page end to end — every sentence, including dialogue lines,
FOKUS boxes, example tables, exercise answers the learner filled in, sticky
notes. Then answer for yourself:

- **What material is this?** (Assume Swedish unless clearly otherwise.)
  Vocabulary list, grammar lesson, dialogue, reading passage, exercises?
- **What is this section actually teaching?** State it in one sentence: *"how
  to ask about someone's job"*, *"om vs i for frequency"*, *"the en/ett gender
  contrast"*, *"V2 word order after a fronted time adverbial"*. This diagnosis
  drives every card decision. Do not emit a single card before you can state it.
- **What supporting material is present?** Printed glosses, answer keys,
  conjugation tables, the learner's own handwriting — these feed accurate
  backs and reveal the drilled pattern.

Exercise pages are where diagnosis matters most: the filled-in answers
(*skriver, öppnar, kvart i åtta*) are NOT the lesson — the system behind them
is. Card the system, not the blanks.

If multiple images are shared, process each page but keep one combined output.

## Law 2: Every card is a TEST

Design rules, all six load-bearing:

1. **The front poses ONE concrete, attemptable task.** Gold standard is a
   production prompt: *Say it in Swedish: "She never takes the car."* If you
   cannot say precisely what answer the front demands, the card is broken.
2. **The back IS the answer** — the exact Swedish to produce, nothing else in
   the main field: *Hon tar aldrig bilen.*
3. **The rule is a footnote, never the answer.** Put patterns and explanations
   in the example/notes area (*"inte/alltid/aldrig come right after the
   verb"*), so the learner produces first and sees why second.
4. **Never leak the answer on the front.** Not the Swedish being asked for,
   and not a hint that spells it out (*"definite: en-word adds -en"* → answer
   `katten` given away). Fronts stay in English plus at most a scaffold hint:
   *start with "På kvällen…"*, *careful where inte goes*, *not the same word
   as "per day"*.
5. **Atomic.** One decision point per card. A contrast (den/det, om/i) may
   share one card ONLY as a paired production task (*Say: "Which street?
   Which year?"*), never as "explain the difference".
6. **Never ask the learner to recite a rule.** Not *"how do you form the
   imperative?"* but *Give the commands: "Work!" "Read!" "Come!"* →
   *arbeta! läs! kom!* — with the formation rule as a back-side note.

**The self-test — run it on every card before emitting:** read the front,
cover the back. Can you state exactly what answer is expected, and could a
diligent learner produce it? If not, redesign — usually by converting the rule
into one representative sentence to produce.

## Workflow

### 1. Read and diagnose
Law 1 above. One-sentence diagnosis per section before any extraction.

### 2. Find the annotations
Look for learner-applied marks: underlines (straight or wavy), boxes, circles,
brackets and braces, highlighter, margin notes, arrows, asterisks, question
marks, and any handwriting (translations, conjugations, sticky-note practice
sentences). Detection is generous — a few false positives are cheap (the user
deletes strays); a missed marked item is not. Distinguish learner marks from
the book's printed emphasis best-effort; when unsure, include and flag in the
`note` field. Anything hand-marked is always kept.

### 3. Choose the learnables
Work from three sources at once:

**a. Marked items.** Interpret each mark in page context — why did the learner
flag this, and what card helps them learn it?

| What's marked | Card to design |
|---|---|
| A single word | Vocabulary card: English → the word (with en/ett article for nouns, present form for verbs) |
| A verb form | The verb + its system: infinitive, tense forms, and any obligatory preposition |
| A phrase / collocation / idiom | The chunk as one unit — chunks are what fluency is made of |
| A whole boxed sentence | The sentence — verbatim if it's a fixed phrase, else the pattern inside it |
| A grammar structure | One representative sentence that forces the structure (see 3c) |

**b. Complete sentences and Q&A patterns — even unmarked.** Dialogue lines,
FOKUS examples, and model Q&A in exercise boxes are prime cards: they are what
the learner will actually say (*Vilken gata bor du på?*, *Vad har du för
yrke?*). A sentence is not "covered" just because one of its words is also a
card, and vice versa. When in doubt, include the sentence.

**c. The deeper layer — the teacher's real value-add.** For each section ask:
*is the real lesson the surface text, or something underneath?* Signals:

- **A pattern repeated 2–3+ times** (same structure, different words) — the
  repetition IS the lesson. Card the pattern via one representative instance.
- **A word that only works with a particular preposition/particle** (*tycka
  om, intresserad av, bero på, i tre år*) — card the collocation, note the
  glue word.
- **A contrast the section sets up** (en/ett, den/det, om/i, halv counting
  toward the NEXT hour) — card the contrast as a paired production task.
- **An irregular or surprising form** (irregular plural, false friend,
  *dammsugare* = pastry AND vacuum cleaner) — card it as the exception it is.
- **A fixed, high-utility phrase** — card it verbatim; here the surface IS the
  lesson, and copy-paste is correct.

**Calibration — comprehensive on learnables, not on duplicate text.** Cover
every distinct thing the section teaches; no per-page cap, no "best subset"
self-limiting. But when one pattern appears in five near-identical example
sentences, make ONE well-designed pattern card plus an example — collapsing
redundant instances is not skipping content. Drop only: (a) duplicates within
this run (dedupe on the Swedish form, ignoring leading en/ett/att), and
(b) ultra-basic words any learner past lesson one owns: *hej*, personal
pronouns (*jag, du, han, hon, vi, ni, de*), *ja/nej*, *och/men*, *inte*, bare
*en/ett*. Borderline between useful and too easy → INCLUDE.

### 3c. How a pattern becomes a card
Pick ONE representative sentence that forces the pattern. Front = English
production prompt (+ optional scaffold hint). Back = the Swedish. Rule = a
note alongside the examples. The learner drills the instance; the note
generalizes it.

**Example — the page drills V2 word order:**
- ✗ front: "word order: the verb comes second" (rule recitation — rejected in
  real use)
- ✓ front: `Say: "In the evening she reads the news." (start with "in the
  evening")` → back: `På kvällen läser hon nyheterna.` → note: *the verb must
  stay in 2nd position, so the subject flips to after it*

**Example — the page contrasts frequency expressions:**
- ✗ front: "per week — use I (i veckan)" (answer printed on the front)
- ✓ front: `per week / per month (careful — a different word than "per day")`
  → back: `i veckan / i månaden`

### 4. Fill the back
Source the meaning in priority order — record provenance in `note`:
1. **The learner's own handwriting** (`user handwriting`) — their translation
   is the intended answer; tidy spelling only.
2. **A gloss printed on the page** (`book gloss`) — vocab lists, margin
   glosses, answer keys.
3. **Generate it yourself** (`generated`) — accurate, natural translation.
   Flagging provenance lets the user trust or verify generated backs.

Swedish must be correct standard Swedish with å/ä/ö intact. Surface en/ett
gender on nouns. Never invent Swedish the learner didn't mark and you can't
verify — when uncertain, flag it.

### 5. Self-test pass
Run the Law 2 self-test over the full card list. Fix or drop anything that
fails. This pass is cheap; a broken card annoys the user at every review until
they delete it.

### 6. Emit the CSV
Build a JSON array of card objects, then run the bundled script (hand-rolled
CSV quoting breaks on Swedish commas/quotes):

```bash
python scripts/write_cards.py cards.json -o flashcards.csv
```

Card keys: `front` (req), `back` (req), `type` (`word` | `phrase` | `grammar`
| `sentence`), `note` (provenance / caveats). Header: `front,back,type,note`.
Pattern/contrast/rule cards → `grammar`. Fixed say-it-verbatim phrases →
`sentence` or `phrase`.

### 7. Report back
Lead with the **teacher's read**: one or two sentences on what you judged each
section to be teaching — this exposes your reasoning so the user can correct
it. Then: card count by type; which cards capture a deeper pattern (vs
verbatim phrases) and why; which backs were generated; anything low-confidence.
Give the CSV path. Do not save anywhere else — persistence belongs to the
calling agent.

## Principles (condensed)

- **Diagnose first.** No cards before you can state what the section teaches.
- **Teach, don't transcribe.** Verbatim only when the surface is the point.
- **Every card is a test.** Production front, exact-answer back, rule as
  footnote. Self-test everything.
- **One learnable, one well-made card.** Split bundles; collapse near-identical
  instances into one pattern card plus an example.
- **When in doubt, include and flag** rather than silently omit — but never at
  the cost of card design.

## Files

- `scripts/write_cards.py` — JSON array of cards → valid UTF-8 CSV. Skips
  cards missing front or back, warns on stderr.
