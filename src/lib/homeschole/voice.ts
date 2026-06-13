import { getLanguagePackById } from "@/lib/language-packs";
import { canUseSpeechSynthesis, speakWithVoice } from "@/lib/voice";

// homeschole voice guidance. All speech is gated by the parent "Voice guidance"
// setting. Letter sounds prefer the real family recordings in
// /audio/letters-by-nuha (the english pack's configured chain: family clips →
// community pack → browser speech fallback). Whole words have no recordings, so
// they are spoken with browser synthesis.
const FAMILY_VOICE = getLanguagePackById("english").voice;

function speakSynthesis(text: string): void {
  if (!canUseSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.92;
  utterance.pitch = 1.05;
  window.speechSynthesis.speak(utterance);
}

export function speak(text: string, enabled: boolean): void {
  if (!enabled) return;
  speakSynthesis(text);
}

/** Sound out a single letter, trying the real family recording first. */
export function speakLetter(letter: string, enabled: boolean): void {
  if (!enabled) return;
  // speakWithVoice tries the recorded clip and falls back to browser speech
  // on its own (per the english voice config), so we don't double-speak.
  void speakWithVoice({
    text: letter.toUpperCase(),
    assetKey: letter.toLowerCase(),
    voice: FAMILY_VOICE,
    speechLang: "en-US"
  });
}
