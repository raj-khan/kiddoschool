export type Palette = {
  id: string;
  background: string;
  orbOne: string;
  orbTwo: string;
  orbThree: string;
  shell: string;
  shellBorder: string;
  badgeSurface: string;
  badgeText: string;
  buttonSurface: string;
  buttonText: string;
  buttonBorder: string;
  historySurface: string;
  historyText: string;
  keyText: string;
  keyShadow: string;
  messageText: string;
  detailText: string;
  activeKeySurface: string;
  activeKeyBorder: string;
  activeKeyText: string;
  activeKeyGlow: string;
};

export const PALETTES: readonly Palette[] = [
  {
    id: "apricot-sky",
    background: "linear-gradient(135deg, #fff9ef 0%, #ffe6cb 42%, #def3ff 100%)",
    orbOne: "#ffd29d",
    orbTwo: "#bbe7ff",
    orbThree: "#ffc0d2",
    shell: "rgba(255, 250, 244, 0.8)",
    shellBorder: "rgba(255, 255, 255, 0.86)",
    badgeSurface: "rgba(255, 255, 255, 0.8)",
    badgeText: "#21405e",
    buttonSurface: "rgba(255, 255, 255, 0.84)",
    buttonText: "#17324d",
    buttonBorder: "rgba(255, 255, 255, 0.92)",
    historySurface: "rgba(23, 50, 77, 0.08)",
    historyText: "#17324d",
    keyText: "#17324d",
    keyShadow: "rgba(23, 50, 77, 0.22)",
    messageText: "#17324d",
    detailText: "#355070",
    activeKeySurface: "#ffe7c9",
    activeKeyBorder: "#f4b678",
    activeKeyText: "#17324d",
    activeKeyGlow: "rgba(244, 182, 120, 0.34)"
  },
  {
    id: "mint-sorbet",
    background: "linear-gradient(135deg, #f4fff9 0%, #d8f6e7 44%, #fff4c8 100%)",
    orbOne: "#b7ecd6",
    orbTwo: "#ffe5a6",
    orbThree: "#ffbf9f",
    shell: "rgba(249, 255, 252, 0.8)",
    shellBorder: "rgba(255, 255, 255, 0.86)",
    badgeSurface: "rgba(255, 255, 255, 0.8)",
    badgeText: "#134b42",
    buttonSurface: "rgba(255, 255, 255, 0.85)",
    buttonText: "#134b42",
    buttonBorder: "rgba(255, 255, 255, 0.92)",
    historySurface: "rgba(19, 75, 66, 0.08)",
    historyText: "#134b42",
    keyText: "#0f4c5c",
    keyShadow: "rgba(15, 76, 92, 0.18)",
    messageText: "#0f4c5c",
    detailText: "#276b63",
    activeKeySurface: "#dcf7ea",
    activeKeyBorder: "#8fdab9",
    activeKeyText: "#134b42",
    activeKeyGlow: "rgba(143, 218, 185, 0.32)"
  },
  {
    id: "sunset-candy",
    background: "linear-gradient(135deg, #fff8f4 0%, #ffd7dd 42%, #ffe9af 100%)",
    orbOne: "#ffb6c9",
    orbTwo: "#ffe09c",
    orbThree: "#b7e6ff",
    shell: "rgba(255, 249, 246, 0.8)",
    shellBorder: "rgba(255, 255, 255, 0.86)",
    badgeSurface: "rgba(255, 255, 255, 0.8)",
    badgeText: "#6b2d5c",
    buttonSurface: "rgba(255, 255, 255, 0.85)",
    buttonText: "#6b2d5c",
    buttonBorder: "rgba(255, 255, 255, 0.92)",
    historySurface: "rgba(107, 45, 92, 0.08)",
    historyText: "#6b2d5c",
    keyText: "#7f2f59",
    keyShadow: "rgba(127, 47, 89, 0.18)",
    messageText: "#6b2d5c",
    detailText: "#8c3f67",
    activeKeySurface: "#ffe1e7",
    activeKeyBorder: "#f1a4b8",
    activeKeyText: "#6b2d5c",
    activeKeyGlow: "rgba(241, 164, 184, 0.34)"
  },
  {
    id: "lagoon-peach",
    background: "linear-gradient(135deg, #f3fcff 0%, #caeeff 38%, #ffe4cf 100%)",
    orbOne: "#abdff0",
    orbTwo: "#ffdcb4",
    orbThree: "#ffc5de",
    shell: "rgba(246, 253, 255, 0.8)",
    shellBorder: "rgba(255, 255, 255, 0.86)",
    badgeSurface: "rgba(255, 255, 255, 0.8)",
    badgeText: "#0c4a6e",
    buttonSurface: "rgba(255, 255, 255, 0.85)",
    buttonText: "#0c4a6e",
    buttonBorder: "rgba(255, 255, 255, 0.92)",
    historySurface: "rgba(12, 74, 110, 0.08)",
    historyText: "#0c4a6e",
    keyText: "#0f3559",
    keyShadow: "rgba(15, 53, 89, 0.2)",
    messageText: "#0f3559",
    detailText: "#325d78",
    activeKeySurface: "#dff2ff",
    activeKeyBorder: "#9fd3f0",
    activeKeyText: "#0c4a6e",
    activeKeyGlow: "rgba(159, 211, 240, 0.32)"
  },
  {
    id: "strawberry-cream",
    background: "linear-gradient(135deg, #fff9fb 0%, #ffd9e5 40%, #fff0c6 100%)",
    orbOne: "#ffbdd2",
    orbTwo: "#ffe7a9",
    orbThree: "#c0e7ff",
    shell: "rgba(255, 249, 252, 0.82)",
    shellBorder: "rgba(255, 255, 255, 0.88)",
    badgeSurface: "rgba(255, 255, 255, 0.82)",
    badgeText: "#7a284f",
    buttonSurface: "rgba(255, 255, 255, 0.86)",
    buttonText: "#7a284f",
    buttonBorder: "rgba(255, 255, 255, 0.94)",
    historySurface: "rgba(122, 40, 79, 0.08)",
    historyText: "#7a284f",
    keyText: "#7a284f",
    keyShadow: "rgba(122, 40, 79, 0.18)",
    messageText: "#7a284f",
    detailText: "#944363",
    activeKeySurface: "#ffe2eb",
    activeKeyBorder: "#f1adc4",
    activeKeyText: "#7a284f",
    activeKeyGlow: "rgba(241, 173, 196, 0.34)"
  },
  {
    id: "lime-bubble",
    background: "linear-gradient(135deg, #fbffef 0%, #e2f6b9 36%, #d8f1ff 100%)",
    orbOne: "#d2ed99",
    orbTwo: "#bee8ff",
    orbThree: "#ffd0a2",
    shell: "rgba(252, 255, 246, 0.8)",
    shellBorder: "rgba(255, 255, 255, 0.86)",
    badgeSurface: "rgba(255, 255, 255, 0.82)",
    badgeText: "#335c2b",
    buttonSurface: "rgba(255, 255, 255, 0.86)",
    buttonText: "#335c2b",
    buttonBorder: "rgba(255, 255, 255, 0.94)",
    historySurface: "rgba(51, 92, 43, 0.08)",
    historyText: "#335c2b",
    keyText: "#2f5233",
    keyShadow: "rgba(47, 82, 51, 0.18)",
    messageText: "#2f5233",
    detailText: "#487147",
    activeKeySurface: "#ecf8cf",
    activeKeyBorder: "#badf83",
    activeKeyText: "#335c2b",
    activeKeyGlow: "rgba(186, 223, 131, 0.32)"
  }
] as const;

export const EMOJIS = ["🌟", "🎈", "🦄", "🚀", "🎉", "🌸", "🐣", "🍭", "✨", "🫧"] as const;

export const MESSAGES = [
  "Great job!",
  "Nice key!",
  "Super press!",
  "You found it!",
  "Keep going!",
  "That was quick!",
  "Amazing!",
  "Wow!",
  "Pop pop pop!",
  "You are flying!"
] as const;

export const IDLE_EMOJI = "✨";
export const IDLE_MESSAGE = "Press any key to make the screen dance.";
export const IDLE_HINT = "Letters, numbers, Space, Enter, and punctuation all work.";
