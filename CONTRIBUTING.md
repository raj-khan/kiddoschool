# Contributing

Nuha Keyboard is intentionally small and open so contributors can add more child-friendly language packs over time.

## Local setup

```bash
pnpm install
pnpm dev
```

Then open `http://localhost:3000`.

## Before you open a PR

Run the full checks:

```bash
pnpm typecheck
pnpm test
pnpm lint
pnpm build
```

## Adding a new language pack

The keyboard layouts live in `src/lib/language-packs.ts`.

Each language pack defines:

- `id`: stable machine-readable id
- `label`: English-facing name in the dropdown
- `nativeLabel`: native-script label shown in the UI
- `description`: short contributor-facing explanation
- `direction`: `ltr` or `rtl`
- `prompt`: idle headline for the main display
- `hint`: idle helper text
- `voice`: current playback strategy
- `rows`: the clickable virtual keyboard layout

Each key can define:

- `value`: the underlying key value
- `label`: the small button label
- `displayText`: override for the large center display
- `speechText`: override for spoken text
- `speechLang`: override for speech language
- `assetKey`: future audio asset id
- `size`: `regular`, `wide`, or `full`

## Voice architecture

Today, Arabic and Bengali use browser speech synthesis through `src/lib/voice.ts`.

English and Numbers are now wired for an optional community audio pack:

- audio folder: `public/audio/english-community-v1/`
- manifest: `public/audio/english-community-v1/manifest.json`
- fallback: browser speech synthesis when a listed asset is missing

The voice layer supports `audio-files` mode, so a pack can move to real open-source child voice assets without changing the game loop.

## Adding a community voice pack

For the current English community pack:

1. Add real child voice clips under `public/audio/english-community-v1/`
2. Name each file from its `assetKey`, for example `a.mp3`, `one.mp3`, `space.mp3`, or `color-red.mp3`
3. Add those same keys to `manifest.json` under `assetKeys`
4. Keep clips short, dry, and at consistent volume
5. Confirm the app plays the file instead of the browser voice

The intended rollout is:

1. Start with English voice assets.
2. Cover letters first, then numbers, punctuation, and colors.
3. Expand the same pattern to Arabic, Bengali, and future community packs.

## Pull request scope

Keep PRs focused:

- One language pack, one UI improvement, or one bug fix at a time
- Do not mix template boilerplate edits with gameplay changes
- Do not edit `universal/` unless the change is genuinely template-wide

## Testing new language packs

For every new pack:

1. Confirm the dropdown switches to the pack.
2. Confirm the virtual keyboard renders correctly.
3. Click several keys and verify the large display, speech, and recent history.
4. Add or extend unit tests in `src/lib/__tests__/`.
