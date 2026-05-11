export type TextDirection = "ltr" | "rtl";

export type SpeechSynthesisVoiceConfig = {
  type: "speech-synthesis";
  lang: string;
  rate?: number;
  pitch?: number;
  volume?: number;
};

export type AudioFileExtension = "mp3" | "wav" | "ogg" | "mp4";

export type AudioFilesVoiceConfig = {
  type: "audio-files";
  basePath: string;
  extension?: AudioFileExtension;
  manifestPath?: string;
  additionalSources?: {
    basePath: string;
    extension?: AudioFileExtension;
    manifestPath?: string;
  }[];
  fallback?: SpeechSynthesisVoiceConfig;
};

export type VoiceConfig = SpeechSynthesisVoiceConfig | AudioFilesVoiceConfig;

export type LanguageKey = {
  value: string;
  label?: string;
  name?: string;
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
  allowGenericInput?: boolean;
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
  basePath: "/audio/letters-by-nuha",
  extension: "mp4",
  fallback: ENGLISH_VOICE
};

const ENGLISH_COMMUNITY_AUDIO_SOURCE = {
  basePath: "/audio/english-community-v1",
  manifestPath: "/audio/english-community-v1/manifest.json"
};

const NUMBERS_CHILD_VOICE: AudioFilesVoiceConfig = {
  type: "audio-files",
  basePath: "/audio/numbers-child-v1",
  extension: "wav",
  manifestPath: "/audio/numbers-child-v1/manifest.json",
  fallback: ENGLISH_VOICE
};

const NUMBERS_CHILD_AUDIO_SOURCE = {
  basePath: "/audio/numbers-child-v1",
  extension: "wav" as const,
  manifestPath: "/audio/numbers-child-v1/manifest.json"
};

ENGLISH_COMMUNITY_VOICE.additionalSources = [
  ENGLISH_COMMUNITY_AUDIO_SOURCE,
  NUMBERS_CHILD_AUDIO_SOURCE
];

const ENGLISH_LETTER_ROWS = [
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
    key("m", { label: "M" })
  ]
] as const;

const ENGLISH_COMPUTER_ROWS = [
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
    key("0", { label: "0", assetKey: "zero" }),
    key("-", { label: "-", assetKey: "dash" }),
    key("=", { label: "=", assetKey: "equals" })
  ],
  [
    key("Tab", { label: "Tab", size: "wide" }),
    ...ENGLISH_LETTER_ROWS[0]
  ],
  [
    ...ENGLISH_LETTER_ROWS[1],
    key("Enter", { label: "Enter", size: "wide" })
  ],
  [
    key("Shift", { label: "Shift", size: "wide" }),
    ...ENGLISH_LETTER_ROWS[2],
    key(".", { label: ".", assetKey: "dot" }),
    key(",", { label: ",", assetKey: "comma" }),
    key("/", { label: "/", assetKey: "slash" }),
    key("Backspace", { label: "Backspace", size: "wide" })
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
] as const;

const ARABIC_SPEECH_FALLBACK: SpeechSynthesisVoiceConfig = {
  type: "speech-synthesis",
  lang: "ar",
  rate: 0.92,
  pitch: 1.02,
  volume: 1
};

export const ARABIC_FEMALE_VOICE: AudioFilesVoiceConfig = {
  type: "audio-files",
  basePath: "/audio/arabic-letters/female-voice",
  extension: "mp3",
  fallback: ARABIC_SPEECH_FALLBACK
};

export const ARABIC_MALE_VOICE: AudioFilesVoiceConfig = {
  type: "audio-files",
  basePath: "/audio/arabic-letters/male-voice",
  extension: "mp3",
  fallback: ARABIC_SPEECH_FALLBACK
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
    description: "An alphabet-only starter pack focused on English letters.",
    direction: "ltr",
    prompt: "Press a letter key or click the alphabet board.",
    hint: "English letter mode now stays focused on A to Z.",
    voice: ENGLISH_COMMUNITY_VOICE,
    rows: ENGLISH_LETTER_ROWS
  },
  {
    id: "numbers",
    label: "Numbers",
    nativeLabel: "123",
    description: "A simple counting board focused only on numbers.",
    direction: "ltr",
    prompt: "Count with taps or number keys.",
    hint: "Number mode now stays focused on numbers while keyboard symbols live in Computer mode.",
    voice: NUMBERS_CHILD_VOICE,
    allowGenericInput: false,
    rows: [
      [
        key("1", { label: "1", assetKey: "one" }),
        key("2", { label: "2", assetKey: "two" }),
        key("3", { label: "3", assetKey: "three" }),
        key("4", { label: "4", assetKey: "four" }),
        key("5", { label: "5", assetKey: "five" }),
        key("0", { label: "0", assetKey: "zero" })
      ],
      [
        key("6", { label: "6", assetKey: "six" }),
        key("7", { label: "7", assetKey: "seven" }),
        key("8", { label: "8", assetKey: "eight" }),
        key("9", { label: "9", assetKey: "nine" })
      ]
    ]
  },
  {
    id: "arabic",
    label: "Arabic",
    nativeLabel: "العربية",
    description: "A right-to-left letter learning pack covering all 28 Arabic letters from Alif to Ya.",
    direction: "rtl",
    prompt: "اضغط أي مفتاح أو انقر على لوحة المفاتيح العربية.",
    hint: "انقر على الحروف العربية أو استخدم تخطيط لوحة مفاتيح عربي.",
    voice: ARABIC_FEMALE_VOICE,
    allowGenericInput: false,
    rows: [
      [
        key("أ", { name: "Alif",  speechText: "Alif",  assetKey: "1"  }),
        key("ب", { name: "Ba",    speechText: "Ba",    assetKey: "2"  }),
        key("ت", { name: "Ta",    speechText: "Ta",    assetKey: "3"  }),
        key("ث", { name: "Tha",   speechText: "Tha",   assetKey: "4"  }),
        key("ج", { name: "Jeem",  speechText: "Jeem",  assetKey: "5"  }),
        key("ح", { name: "Ha",    speechText: "Ha",    assetKey: "6"  }),
        key("خ", { name: "Kha",   speechText: "Kha",   assetKey: "7"  })
      ],
      [
        key("د", { name: "Dal",   speechText: "Dal",   assetKey: "8"  }),
        key("ذ", { name: "Dhal",  speechText: "Dhal",  assetKey: "9"  }),
        key("ر", { name: "Ra",    speechText: "Ra",    assetKey: "10" }),
        key("ز", { name: "Za",    speechText: "Za",    assetKey: "11" }),
        key("س", { name: "Seen",  speechText: "Seen",  assetKey: "12" }),
        key("ش", { name: "Sheen", speechText: "Sheen", assetKey: "13" }),
        key("ص", { name: "Saad",  speechText: "Saad",  assetKey: "14" })
      ],
      [
        key("ض", { name: "Daad",  speechText: "Daad",  assetKey: "15" }),
        key("ط", { name: "Ta",    speechText: "Ta",    assetKey: "16" }),
        key("ظ", { name: "Za",    speechText: "Za",    assetKey: "17" }),
        key("ع", { name: "Ain",   speechText: "Ain",   assetKey: "18" }),
        key("غ", { name: "Ghain", speechText: "Ghain", assetKey: "19" }),
        key("ف", { name: "Fa",    speechText: "Fa",    assetKey: "20" }),
        key("ق", { name: "Qaf",   speechText: "Qaf",   assetKey: "21" })
      ],
      [
        key("ك", { name: "Kaf",   speechText: "Kaf",   assetKey: "22" }),
        key("ل", { name: "Lam",   speechText: "Lam",   assetKey: "23" }),
        key("م", { name: "Meem",  speechText: "Meem",  assetKey: "24" }),
        key("ن", { name: "Noon",  speechText: "Noon",  assetKey: "25" }),
        key("ه", { name: "Ha",    speechText: "Ha",    assetKey: "26" }),
        key("و", { name: "Wa",    speechText: "Wa",    assetKey: "27" }),
        key("ي", { name: "Ya",    speechText: "Ya",    assetKey: "28" }),
        key("ء", { name: "Hamza", speechText: "Hamza", assetKey: "29" })
      ]
    ]
  },
  {
    id: "bengali",
    label: "Bengali",
    nativeLabel: "বাংলা",
    description: "A Bengali letter learning pack with vowels and consonants.",
    direction: "ltr",
    prompt: "ক্লিক করো।",
    hint: "বাংলা কীগুলোতে ক্লিক করো",
    voice: BENGALI_VOICE,
    allowGenericInput: false,
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
      ]
    ]
  }
] as const;

export const ENGLISH_COMPUTER_PRACTICE_PACK: LanguagePack = {
  id: "english",
  label: "Computer",
  nativeLabel: "Keyboard",
  description: "A keyboard practice board with letters, digits, symbols, and simple computer keys.",
  direction: "ltr",
  prompt: "Press any computer key or tap the practice board.",
  hint: "Letters, numbers, Space, Enter, Tab, Shift, and simple symbols all work here.",
  voice: ENGLISH_COMMUNITY_VOICE,
  allowGenericInput: true,
  rows: ENGLISH_COMPUTER_ROWS
};

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
