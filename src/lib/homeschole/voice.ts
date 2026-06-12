import { canUseSpeechSynthesis } from "@/lib/voice";

// homeschole voice guidance routes through the browser SpeechSynthesis API.
// All speech is gated by the parent "Voice guidance" setting.

export function speak(text: string, enabled: boolean): void {
  if (!enabled || !canUseSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.92;
  utterance.pitch = 1.05;
  window.speechSynthesis.speak(utterance);
}

/** Sound out a single letter (its name, gently). */
export function speakLetter(letter: string, enabled: boolean): void {
  speak(letter.toUpperCase(), enabled);
}
