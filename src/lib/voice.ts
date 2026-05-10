import type { VoiceConfig } from "@/lib/language-packs";

type SpeakRequest = {
  text: string;
  assetKey: string;
  voice: VoiceConfig;
  speechLang: string;
};

let activeAudio: HTMLAudioElement | null = null;
const audioManifestCache = new Map<string, Promise<Set<string>>>();

export function canUseSpeechSynthesis(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function canUseHtmlAudio(): boolean {
  return typeof Audio !== "undefined";
}

async function loadAudioManifest(
  voice: Extract<VoiceConfig, { type: "audio-files" }>
): Promise<Set<string>> {
  if (!voice.manifestPath || typeof fetch === "undefined") {
    return new Set();
  }

  const cachedManifest = audioManifestCache.get(voice.manifestPath);

  if (cachedManifest) {
    return cachedManifest;
  }

  const manifestPromise = fetch(voice.manifestPath, { cache: "no-store" })
    .then(async (response) => {
      if (!response.ok) {
        return new Set<string>();
      }

      const manifest = (await response.json()) as { assetKeys?: unknown };

      if (!Array.isArray(manifest.assetKeys)) {
        return new Set<string>();
      }

      return new Set(
        manifest.assetKeys.filter((assetKey): assetKey is string => typeof assetKey === "string")
      );
    })
    .catch(() => new Set<string>());

  audioManifestCache.set(voice.manifestPath, manifestPromise);

  return manifestPromise;
}

export function isVoicePlaybackAvailable(voice: VoiceConfig): boolean {
  if (voice.type === "speech-synthesis") {
    return canUseSpeechSynthesis();
  }

  return canUseHtmlAudio() || Boolean(voice.fallback && canUseSpeechSynthesis());
}

export function stopVoicePlayback(): void {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
    activeAudio = null;
  }

  if (canUseSpeechSynthesis()) {
    window.speechSynthesis.cancel();
  }
}

function speakWithSpeechSynthesis(
  text: string,
  lang: string,
  voice: Extract<VoiceConfig, { type: "speech-synthesis" }>
): void {
  if (!canUseSpeechSynthesis()) {
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = voice.rate ?? 1;
  utterance.pitch = voice.pitch ?? 1;
  utterance.volume = voice.volume ?? 1;

  window.speechSynthesis.speak(utterance);
}

async function speakWithAudioFiles(
  assetKey: string,
  voice: Extract<VoiceConfig, { type: "audio-files" }>
): Promise<boolean> {
  if (!canUseHtmlAudio()) {
    throw new Error("HTML audio is not available in this browser.");
  }

  const availableAssetKeys = await loadAudioManifest(voice);

  if (voice.manifestPath && !availableAssetKeys.has(assetKey)) {
    return false;
  }

  const fileExtension = voice.extension ?? "mp3";
  const audio = new Audio(`${voice.basePath}/${assetKey}.${fileExtension}`);

  activeAudio = audio;
  await audio.play();
  return true;
}

export async function speakWithVoice(request: SpeakRequest): Promise<void> {
  stopVoicePlayback();

  if (request.voice.type === "speech-synthesis") {
    speakWithSpeechSynthesis(request.text, request.speechLang, request.voice);
    return;
  }

  try {
    const didPlayAudio = await speakWithAudioFiles(request.assetKey, request.voice);

    if (!didPlayAudio && request.voice.fallback) {
      speakWithSpeechSynthesis(request.text, request.speechLang, request.voice.fallback);
    }
  } catch (error) {
    if (request.voice.fallback) {
      speakWithSpeechSynthesis(request.text, request.speechLang, request.voice.fallback);
      return;
    }

    throw error;
  }
}
