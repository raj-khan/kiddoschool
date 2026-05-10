export type TextDirection = "ltr" | "rtl";

export type SpeechSynthesisVoiceConfig = {
  type: "speech-synthesis";
  lang: string;
  rate?: number;
  pitch?: number;
  volume?: number;
};

export type AudioFilesVoiceConfig = {
  type: "audio-files";
  basePath: string;
  extension?: "mp3" | "wav" | "ogg";
  manifestPath?: string;
  fallback?: SpeechSynthesisVoiceConfig;
};

export type VoiceConfig = SpeechSynthesisVoiceConfig | AudioFilesVoiceConfig;

export type LanguageKey = {
  value: string;
  label?: string;
  displayText?: string;
  speechText?: string;
  speechLang?: string;
  assetKey?: string;
  size?: "regular" | "wide" | "full";
  textDirection?: TextDirection;
};

export type LanguagePack = {
  id: "english" | "numbers" | "arabic" | "bengali";
  label: string;
  nativeLabel: string;
  description: string;
  direction: TextDirection;
  prompt: string;
  hint: string;
  voice: VoiceConfig;
  rows: readonly (readonly LanguageKey[])[];
};

export type LanguagePackId = LanguagePack["id"];

function key(value: string, options: Omit<LanguageKey, "value"> = {}): LanguageKey {
  return {
    value,
    ...options
  };
}

const ENGLISH_VOICE: SpeechSynthesisVoiceConfig = {
  type: "speech-synthesis",
  lang: "en-US",
  rate: 0.9,
  pitch: 1.05,
  volume: 1
};

const ENGLISH_COMMUNITY_VOICE: AudioFilesVoiceConfig = {
  type: "audio-files",
  basePath: "/audio/english-community-v1",
  manifestPath: "/audio/english-community-v1/manifest.json",
  fallback: ENGLISH_VOICE
};

const ARABIC_VOICE: SpeechSynthesisVoiceConfig = {
  type: "speech-synthesis",
  lang: "ar",
  rate: 0.92,
  pitch: 1.02,
  volume: 1
};

const BENGALI_VOICE: SpeechSynthesisVoiceConfig = {
  type: "speech-synthesis",
  lang: "bn-BD",
  rate: 0.92,
  pitch: 1.02,
  volume: 1
};

export const LANGUAGE_PACKS: readonly LanguagePack[] = [
  {
    id: "english",
    label: "English",
    nativeLabel: "English",
    description: "The starter pack with letters, digits, punctuation, and a wide space key.",
    direction: "ltr",
    prompt: "Press any key or click the English keyboard.",
    hint: "Letters, numbers, Space, Enter, and punctuation all work.",
    voice: ENGLISH_COMMUNITY_VOICE,
    rows: [
      [
        key("1", { label: "1", assetKey: "one" }),
        key("2", { label: "2", assetKey: "two" }),
        key("3", { label: "3", assetKey: "three" }),
        key("4", { label: "4", assetKey: "four" }),
        key("5", { label: "5", assetKey: "five" }),
        key("6", { label: "6", assetKey: "six" }),
        key("7", { label: "7", assetKey: "seven" }),
        key("8", { label: "8", assetKey: "eight" }),
        key("9", { label: "9", assetKey: "nine" }),
        key("0", { label: "0", assetKey: "zero" })
      ],
      [
        key("q", { label: "Q" }),
        key("w", { label: "W" }),
        key("e", { label: "E" }),
        key("r", { label: "R" }),
        key("t", { label: "T" }),
        key("y", { label: "Y" }),
        key("u", { label: "U" }),
        key("i", { label: "I" }),
        key("o", { label: "O" }),
        key("p", { label: "P" })
      ],
      [
        key("a", { label: "A" }),
        key("s", { label: "S" }),
        key("d", { label: "D" }),
        key("f", { label: "F" }),
        key("g", { label: "G" }),
        key("h", { label: "H" }),
        key("j", { label: "J" }),
        key("k", { label: "K" }),
        key("l", { label: "L" })
      ],
      [
        key("z", { label: "Z" }),
        key("x", { label: "X" }),
        key("c", { label: "C" }),
        key("v", { label: "V" }),
        key("b", { label: "B" }),
        key("n", { label: "N" }),
        key("m", { label: "M" }),
        key(".", { label: ".", assetKey: "dot" }),
        key(",", { label: ",", assetKey: "comma" }),
        key("/", { label: "/", assetKey: "slash" }),
        key(";", { label: ";", assetKey: "semicolon" })
      ],
      [
        key(" ", {
          label: "Space",
          displayText: "Space",
          speechText: "space",
          assetKey: "space",
          size: "full"
        })
      ]
    ]
  },
  {
    id: "numbers",
    label: "Numbers",
    nativeLabel: "123",
    description: "A simple counting board focused on digits and a few familiar symbols.",
    direction: "ltr",
    prompt: "Count with clicks or number keys.",
    hint: "Use the number row on the keyboard or click the big number buttons.",
    voice: ENGLISH_COMMUNITY_VOICE,
    rows: [
      [
        key("1", { label: "1", assetKey: "one" }),
        key("2", { label: "2", assetKey: "two" }),
        key("3", { label: "3", assetKey: "three" }),
        key("4", { label: "4", assetKey: "four" }),
        key("5", { label: "5", assetKey: "five" })
      ],
      [
        key("6", { label: "6", assetKey: "six" }),
        key("7", { label: "7", assetKey: "seven" }),
        key("8", { label: "8", assetKey: "eight" }),
        key("9", { label: "9", assetKey: "nine" }),
        key("0", { label: "0", assetKey: "zero" })
      ],
      [
        key(".", { label: ".", assetKey: "dot" }),
        key(",", { label: ",", assetKey: "comma" }),
        key("?", { label: "?", assetKey: "question-mark" })
      ],
      [
        key(" ", {
          label: "Space",
          displayText: "Space",
          speechText: "space",
          assetKey: "space",
          size: "full"
        })
      ]
    ]
  },
  {
    id: "arabic",
    label: "Arabic",
    nativeLabel: "العربية",
    description: "A right-to-left starter pack for Arabic letters with a native space key.",
    direction: "rtl",
    prompt: "اضغط أي مفتاح أو انقر على لوحة المفاتيح العربية.",
    hint: "انقر على الحروف العربية أو استخدم تخطيط لوحة مفاتيح عربي.",
    voice: ARABIC_VOICE,
    rows: [
      [
        key("ض"),
        key("ص"),
        key("ث"),
        key("ق"),
        key("ف"),
        key("غ"),
        key("ع"),
        key("ه"),
        key("خ"),
        key("ح"),
        key("ج"),
        key("د")
      ],
      [
        key("ش"),
        key("س"),
        key("ي"),
        key("ب"),
        key("ل"),
        key("ا"),
        key("ت"),
        key("ن"),
        key("م"),
        key("ك"),
        key("ط")
      ],
      [
        key("ئ"),
        key("ء"),
        key("ؤ"),
        key("ر"),
        key("لا"),
        key("ى"),
        key("ة"),
        key("و"),
        key("ز"),
        key("ظ")
      ],
      [
        key(" ", {
          label: "مسافة",
          displayText: "مسافة",
          speechText: "مسافة",
          assetKey: "space",
          size: "full",
          textDirection: "rtl"
        })
      ]
    ]
  },
  {
    id: "bengali",
    label: "Bengali",
    nativeLabel: "বাংলা",
    description: "A Bengali starter pack with vowels, consonants, and a wide native space key.",
    direction: "ltr",
    prompt: "কীবোর্ডে চাপ দাও বা বাংলা কীগুলোতে ক্লিক করো।",
    hint: "বাংলা কীগুলোতে ক্লিক করো, বা বাংলা হার্ডওয়্যার লেআউট ব্যবহার করো।",
    voice: BENGALI_VOICE,
    rows: [
      [
        key("অ"),
        key("আ"),
        key("ই"),
        key("ঈ"),
        key("উ"),
        key("ঊ"),
        key("এ"),
        key("ঐ"),
        key("ও"),
        key("ঔ")
      ],
      [
        key("ক"),
        key("খ"),
        key("গ"),
        key("ঘ"),
        key("ঙ"),
        key("চ"),
        key("ছ"),
        key("জ"),
        key("ঝ"),
        key("ঞ")
      ],
      [
        key("ট"),
        key("ঠ"),
        key("ড"),
        key("ঢ"),
        key("ণ"),
        key("ত"),
        key("থ"),
        key("দ"),
        key("ধ"),
        key("ন")
      ],
      [
        key("প"),
        key("ফ"),
        key("ব"),
        key("ভ"),
        key("ম"),
        key("য"),
        key("র"),
        key("ল"),
        key("শ"),
        key("ষ"),
        key("স"),
        key("হ")
      ],
      [
        key(" ", {
          label: "স্পেস",
          displayText: "স্পেস",
          speechText: "স্পেস",
          assetKey: "space",
          size: "full"
        })
      ]
    ]
  }
] as const;

export const DEFAULT_LANGUAGE_ID: LanguagePackId = "english";

export function getLanguagePackById(id: LanguagePackId): LanguagePack {
  const languagePack = LANGUAGE_PACKS.find((pack) => pack.id === id);

  if (!languagePack) {
    throw new Error(`Unknown language pack: ${id}`);
  }

  return languagePack;
}

export function normalizeLanguageLookupValue(value: string): string {
  return /^[A-Z]$/.test(value) ? value.toLowerCase() : value;
}

export function findLanguageKeyByValue(
  languagePack: LanguagePack,
  value: string
): LanguageKey | undefined {
  const normalizedValue = normalizeLanguageLookupValue(value);

  for (const row of languagePack.rows) {
    const match = row.find((languageKey) => normalizeLanguageLookupValue(languageKey.value) === normalizedValue);

    if (match) {
      return match;
    }
  }

  return undefined;
}

export function filterLanguageRows(
  languagePack: LanguagePack,
  visibleKeyIds?: ReadonlySet<string>
): readonly (readonly LanguageKey[])[] {
  if (!visibleKeyIds || visibleKeyIds.size === 0) {
    return languagePack.rows;
  }

  return languagePack.rows
    .map((row) =>
      row.filter((languageKey) => visibleKeyIds.has(languageKey.assetKey ?? languageKey.value))
    )
    .filter((row) => row.length > 0);
}
