# English Community Voice Pack

This folder is reserved for real child voice assets for the English learning modes.

## Current status

The app is already wired to look for files here first:

- Base path: `/audio/english-community-v1/`
- Manifest: `/audio/english-community-v1/manifest.json`
- Fallback: browser speech synthesis when an asset is missing

## How contributors should add files

1. Add one `.mp3` file per spoken asset key.
2. Add the same key names to `manifest.json` under `assetKeys`.
3. Keep clips short, clean, and normalized to a similar volume.

## Example filenames

- `a.mp3`
- `b.mp3`
- `z.mp3`
- `one.mp3`
- `space.mp3`
- `dot.mp3`
- `color-red.mp3`
- `color-blue.mp3`
- `color-pink.mp3`

## Where asset keys come from

- English and Numbers keyboard keys: `src/lib/language-packs.ts`
- Generic punctuation keys: `src/lib/resolveLanguageKey.ts`
- Color learning mode: `src/lib/learning-content.ts`

This voice pack is intended for openly licensed child recordings that the project is allowed to redistribute.
