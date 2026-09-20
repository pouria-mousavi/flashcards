# Flashcards PWA

A flashcard app with FSRS spaced repetition and a shared twenty-minute study day.

## Features
- **Scheduling**: FSRS with ten-minute learning steps, durable review history, and gradual adoption as cards are rated.
- **Daily pacing**: Twenty active minutes across Swedish and English; missed days do not add catch-up time.
- **Voice/TTS**: High-quality Text-to-Speech with voice selection.
- **Responsive Design**: "Noji-style" dark UI.
- **PWA**: Installable on Android/iOS.
- **Interrupted connections**: Reviews in a loaded session queue locally and sync when connected. Initial deck loading requires a connection.

See [study engine and release notes](docs/STUDY_ENGINE.md) for migration, verification, and card-design decisions.

## status
![Build Status](https://github.com/pouria-mousavi/flashcards/actions/workflows/deploy.yml/badge.svg)

## AI configuration

Flashcard generation and enrichment use OpenAI. Local scripts load `OPENAI_API_KEY`
from `.env`, then `.env.local`, with process environment variables taking precedence.
`OPENAI_MODEL` defaults to `gpt-4.1-mini-2025-04-14`. The translation audit uses
`OPENAI_AUDIT_MODEL` (default `gpt-4.1-2025-04-14`). These are server-side settings;
never prefix an AI secret with `VITE_` or add it to the Pages build.

- Install: `npm ci`
- Build: `npm run build`
- Offline AI checks: `npm run test:ai`
- Small live generation check (uses API credit): `npm run check:ai`

The app calls `supabase/functions/generate-flashcards`. Set `OPENAI_API_KEY` as a
Supabase Edge Function secret, then deploy that function after comparing with the
existing deployed function. The local replacement verifies the signed-in owner's
role and returns card previews; it never writes cards or study progress.
Deployment of the generation function is separate from the study-engine release
and remains pending. Studying and assistant-led card repairs need no AI key.

Renamed tools: `scripts/audit_fix_openai.js`, `scripts/enrich_with_openai.cjs`, and
`scripts/test_openai.js`. The audit/enrichment tools retain their existing data
mutation behavior; the smoke test performs no database writes.

GitHub and Supabase management tokens can be placed in the ignored `.env.local`
as `GITHUB_TOKEN` and `SUPABASE_ACCESS_TOKEN`. They are for local deployment tooling,
not frontend code. See [Supabase token scopes](https://supabase.com/docs/guides/platform/personal-access-tokens)
and [GitHub token setup](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).
