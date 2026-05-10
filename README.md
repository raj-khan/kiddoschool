# Nuha Keyboard

A playful browser typing game for one child. Each key press should feel immediate and fun: show the actual key in large text, speak it aloud, change the colors, and show a friendly emoji reaction.

## Status

This repository has been prepared from the `pre-school-keyboard` template for the new project context in [kids_typing_game_development_plan.pdf](kids_typing_game_development_plan.pdf). The current build includes a playable browser app, starter language packs, a virtual keyboard, and a voice layer that can later move from browser synthesis to real open-source child voice files.

## Version 1 scope

- One main screen with a clear "Press any key!" prompt
- Display the actual pressed key in very large text
- Speak the key aloud with child-friendly wording
- Rotate bright or pastel background and text colors on each key press
- Show a random emoji and encouragement message
- Keep recent history of the last 10 keys
- Provide Mute/Unmute, Clear, and Fullscreen controls
- Switch between English, Numbers, Arabic, and Bengali from a dropdown
- Offer a clickable virtual keyboard for mouse and touch input
- No backend, database, auth, analytics, payments, or complex game modes

## Planned app structure

```text
src/
  app/
    globals.css
    layout.tsx
    page.tsx
  components/
    BigKeyDisplay.tsx
    ControlButtons.tsx
    LanguageSelector.tsx
    RecentKeys.tsx
    TypingGame.tsx
    VirtualKeyboard.tsx
  lib/
    constants.ts
    getDisplayText.ts
    getSpeechText.ts
    language-packs.ts
    random.ts
    resolveLanguageKey.ts
    voice.ts
```

## Project docs

- `CLAUDE.md` is the project-specific instruction layer for coding agents.
- `project-template/project-context.md` captures the product rules and scope.
- `universal/` stays unchanged across projects and provides shared engineering conventions.
- `CONTRIBUTING.md` explains how to add new community language packs.

## Open-source direction

- `LICENSE` uses MIT so contributors can extend the project.
- New languages should be added as language packs in `src/lib/language-packs.ts`.
- English and Numbers now support an optional community voice-pack path in `public/audio/english-community-v1/`, with browser speech as fallback.
- Future real child voice assets should start with English, then expand to other packs through the shared voice abstraction in `src/lib/voice.ts`.
- The language-pack rows are already filterable so future parent controls can show either a full keyboard or only selected weak letters.

## Local testing

1. Install dependencies:

```bash
pnpm install
```

2. Start the local dev server:

```bash
pnpm dev
```

3. Open `http://localhost:3000`.

4. Manual checks for version 1:

- The page shows `Press any key!` before any input
- Switch the dropdown between English, Numbers, Arabic, and Bengali
- Click several keys from the virtual keyboard and confirm they behave the same as physical keys
- Press `A` and confirm it displays `A` and speaks `A`
- Press `1` and confirm it displays `1` and speaks `one`
- Press `.` and confirm it displays `.` and speaks `dot`
- Press `Space` and confirm it displays `Space` and speaks `space`
- Confirm the background, emoji, and encouragement message change on each key press
- Confirm the recent history updates and keeps only the last 10 keys
- Confirm `Mute voice`, `Clear screen`, and `Go fullscreen` work

5. Automated checks:

```bash
pnpm typecheck
pnpm test
pnpm lint
pnpm build
```

## Notes

- Version 1 is browser-only and local/private by design.
- No environment variables are required for version 1.
