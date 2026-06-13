# homeschole

A calm, premium early-learning browser app for one child, ages 3–6 — "Apple meets
Montessori." Local-only parent settings and child profile, gentle daily learning, playful
practice across reading, writing/tracing, phonics, word association, and memory, plus a
quiet Playroom of games. Rebranded from the earlier "Nuha Keyboard" project.

Repo:    https://github.com/raj-khan/pre-school-keyboard
Domain:  browser-first / family project / no backend
License: MIT

## Product shape

- `Onboarding`: name, age band (3–6), and learning focus, stored only in local storage
- `Daily journey`: an age-scaled path of activities (fewer/simpler at 3, more structured at 5–6)
- `Activities`: trace, letter match, phonics, read-and-connect, memory
- `Playroom`: Word Workshop (movable alphabet), Sound Hunt, Memory Garden — open free play
- `Progress garden`: calm cumulative reward (seeds → garden), with garden/tree/path metaphors
- `Parent area`: a child-proof number gate, then a dashboard (gentle note, skill growth,
  healthy-engagement controls, printable worksheets, open-ecosystem positioning)
- `Content library`: a typed curriculum (`src/lib/homeschole/curriculum.ts`) the games pull
  from — the architecture that keeps games varied as the word bank grows
- `Voice`: browser SpeechSynthesis, gated by the parent voice setting, via `src/lib/voice.ts`

## Stack

- TypeScript 5, strict mode
- Next.js 16 App Router
- React 19
- Tailwind CSS 4 (design tokens live as CSS variables in `globals.css`)
- DM Sans via `next/font/google`
- pnpm
- Vitest
- Browser APIs: SpeechSynthesis, LocalStorage

## Architecture

```text
src/
  app/                  layout.tsx, page.tsx → HomescholeApp, globals.css (design tokens)
  components/homeschole/
    Icon.tsx, illustrations.tsx, ds.tsx          line icons, paper-cut SVGs, ds primitives
    voice-context.tsx, HomescholeApp.tsx         voice provider + root state machine
    Onboarding.tsx
    screens/            DailyJourney, ProgressGarden, GamesHub, ParentGate,
                        ParentDashboard, DesignSystemScreen
    activities/         ActivityShell, Trace, Match, Phonics, Connect, Memory,
                        Reward, ActivityRouter, shared
    games/              WordWorkshop, SoundHunt, MemoryGame, GameRouter, GameComplete
  lib/homeschole/
    curriculum.ts       content library: word bank, levels, phonics, adaptive selection
    profile.ts          child profile (local storage)
    progress.ts         seeds / streak / completion / per-word mastery (local storage)
    settings.ts         voice / progress metaphor / reward style (local storage)
    activity-meta.ts    ACTIVITY_META, GAME_META, dayPlan(age)
    voice.ts            speak() over SpeechSynthesis, gated by the voice setting
```

The earlier keyboard components (`TypingGame*`, `NumberBoard`, `VirtualKeyboard`, …) and
their `src/lib/*` modules and tests remain in the repo but are unreferenced by the main flow.

## Design system

- Warm neutrals (warm white → cream → sand → gentle gray, warm near-black ink — never pure black)
- Exactly three accents: coral (warmth/action), sage (growth/success), honey (sound/delight)
- DM Sans, a 4px spacing scale, soft layered warm shadows, generous radii
- Gentle motion only (`prefers-reduced-motion` respected); no rainbows, neon, or gradients
- Tokens are CSS variables; visual components use inline styles keyed off them

## Rules

- Keep the app client-side only.
- Store child profile and parent settings in local storage only; explain local-only storage in the UI.
- Grow learning content by expanding `src/lib/homeschole/curriculum.ts`, not by adding screens.
- Route all voice behavior through `src/lib/voice.ts`; gate it on the parent voice setting.
- Try direct family recordings in `public/audio/letters-by-nuha/` before community packs and speech fallback (letter sounds reuse the english pack's voice chain).
- Keep rewards calm and cumulative — no dopamine loops, flashing, or "just one more" nudges.
- Keep parent controls responsive and scroll-safe on mobile.
- Use restrained animation that still feels playful on desktop and mobile.
- Stage files by name, never `git add .` or `git add -A`.

## Do not build yet

- Accounts, login, cloud sync, or analytics
- Payments, subscriptions, or ads
- Backend APIs or database work
- AI tutoring, multiplayer, or heavy gamification
- Complex admin panels or dashboards

## Do not touch

- `universal/`
- `kids_typing_game_development_plan.pdf`
