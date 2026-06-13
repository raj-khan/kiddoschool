# homeschole

A calm, premium early-learning web app for one child, ages 3–6 — "Apple meets
Montessori." A gentle daily journey, playful phonics and reading activities, a quiet
Playroom of games, and a parent dashboard. Browser-only and local/private by design.

## Status

Rebranded from the earlier `Nuha Keyboard` project to **homeschole**, implementing the
"Linden — Early Learning" design. The build covers onboarding, the age-scaled daily
journey, the progress garden, five learning activities, a three-game Playroom, calm
rewards, a parent gate + dashboard, and an in-app design-system reference — all driven by
one design system and a typed curriculum content library.

The earlier keyboard components remain in `src/components` (and their `src/lib` modules and
tests) but are no longer wired into the main flow; they are a separate cleanup pass.

## Scope

- Calm onboarding that captures name, age (3–6), and learning focus (local storage only)
- Age-scaled daily journey: fewer, simpler steps at 3 → more structure at 5–6
- Progress garden with three metaphors (garden / tree / path)
- Five activities: trace, letter match, phonics, read-and-connect, memory
- A Playroom of three games: Word Workshop (movable alphabet), Sound Hunt, Memory Garden
- Calm rewards (seeds → garden) with no dopamine loops
- Parent gate + dashboard: gentle weekly note, skill growth, healthy-engagement controls,
  printable worksheets, and the open-ecosystem positioning
- No backend, database, auth, analytics, or payments

## The content library (engine vs. content)

The games are **engines**; `src/lib/homeschole/curriculum.ts` is the **content** they pull
from. Repetition is solved by growing the typed word bank (CVC → blends → digraphs → sight
words, tagged by level and phonics), not by adding screens. Selection is adaptive: missed
words resurface more, mastered ones less. Bespoke paper-cut pictures are the real bottleneck
(six exist today); words without one fall back to a letter tile, and community content packs
plug in by appending to `WORD_BANK`.

## App structure

```text
src/
  app/                  layout.tsx (DM Sans), page.tsx → HomescholeApp, globals.css (tokens)
  components/homeschole/
    Icon.tsx, illustrations.tsx, ds.tsx          design vocabulary
    voice-context.tsx, HomescholeApp.tsx         provider + root state machine
    Onboarding.tsx
    screens/   DailyJourney, ProgressGarden, GamesHub, ParentGate, ParentDashboard, DesignSystemScreen
    activities/ ActivityShell, Trace, Match, Phonics, Connect, Memory, Reward, ActivityRouter
    games/      WordWorkshop, SoundHunt, MemoryGame, GameRouter, GameComplete
  lib/homeschole/
    curriculum.ts, profile.ts, progress.ts, settings.ts, activity-meta.ts, voice.ts
```

## Project docs

- `CLAUDE.md` is the project-specific instruction layer for coding agents.
- `universal/` stays unchanged across projects and provides shared engineering conventions.
- `CONTRIBUTING.md` explains how to add community content packs.

## Local testing

```bash
pnpm install
pnpm dev          # then open http://localhost:3000
```

Walk the flow: onboarding (try ages 3/4/5/6 — density changes) → daily journey path → open
each activity → reward → garden → Playroom → solve Word Workshop / Sound Hunt / Memory →
the grown-ups lock → parent gate → dashboard (toggle voice, progress shape, reward style).

Automated checks:

```bash
pnpm typecheck
pnpm test
pnpm lint
pnpm build
```

## Notes

- Browser-only and local/private by design; no environment variables required.
- Voice guidance routes through `src/lib/voice.ts` and is gated by the parent "Voice
  guidance" setting. Letter sounds prefer the real family recordings in
  `public/audio/letters-by-nuha/` (family clips → community pack → browser speech); whole
  words fall back to browser speech.
