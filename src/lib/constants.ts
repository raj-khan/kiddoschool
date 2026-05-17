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
  // ── Nuha redesign tokens ────────────────────────────
  primary: string;
  primaryDeep: string;
  accent: string;
  accentDeep: string;
  sunny: string;
  mint: string;
  sky: string;
  coral: string;
  card: string;
  cardLine: string;
  cardShadow: string;
  ink: string;
  inkSoft: string;
  chips: readonly string[];
};

export const PALETTES: readonly Palette[] = [
  {
    id: "lavender-pop",
    background:
      "radial-gradient(1200px 600px at 80% -10%, #FCE7F2 0%, rgba(252,231,242,0) 60%), radial-gradient(900px 500px at -10% 90%, #E9DFFF 0%, rgba(233,223,255,0) 60%), #FBF7FF",
    orbOne: "#FFD66B",
    orbTwo: "#9FE3C9",
    orbThree: "#F5A8C8",
    shell: "rgba(255, 255, 255, 0.82)",
    shellBorder: "#EFE6F6",
    badgeSurface: "rgba(255, 255, 255, 0.86)",
    badgeText: "#2B1B3D",
    buttonSurface: "#FFFFFF",
    buttonText: "#2B1B3D",
    buttonBorder: "#EFE6F6",
    historySurface: "rgba(255, 255, 255, 0.96)",
    historyText: "#2B1B3D",
    keyText: "#A687F0",
    keyShadow: "rgba(166, 135, 240, 0.32)",
    messageText: "#2B1B3D",
    detailText: "#6E5C86",
    activeKeySurface: "#A687F0",
    activeKeyBorder: "#7A5BD8",
    activeKeyText: "#FFFFFF",
    activeKeyGlow: "rgba(166, 135, 240, 0.34)",
    primary: "#A687F0",
    primaryDeep: "#7A5BD8",
    accent: "#F5A8C8",
    accentDeep: "#E4669B",
    sunny: "#FFD66B",
    mint: "#9FE3C9",
    sky: "#9CC9F5",
    coral: "#FF9B7A",
    card: "#FFFFFF",
    cardLine: "#EFE6F6",
    cardShadow: "#D9C8EE",
    ink: "#2B1B3D",
    inkSoft: "#6E5C86",
    chips: ["#F5A8C8", "#A687F0", "#FFD66B", "#9FE3C9", "#9CC9F5", "#FF9B7A"]
  },
  {
    id: "peach-cream",
    background:
      "radial-gradient(1200px 600px at 80% -10%, #FFE4D2 0%, rgba(255,228,210,0) 60%), radial-gradient(900px 500px at -10% 90%, #FFF1C9 0%, rgba(255,241,201,0) 60%), #FFF8F0",
    orbOne: "#FFD29D",
    orbTwo: "#FFE5A6",
    orbThree: "#FFC0D2",
    shell: "rgba(255, 255, 255, 0.82)",
    shellBorder: "#F4E6D6",
    badgeSurface: "rgba(255, 255, 255, 0.86)",
    badgeText: "#3A2114",
    buttonSurface: "#FFFFFF",
    buttonText: "#3A2114",
    buttonBorder: "#F4E6D6",
    historySurface: "rgba(255, 255, 255, 0.96)",
    historyText: "#3A2114",
    keyText: "#FF8A5C",
    keyShadow: "rgba(255, 138, 92, 0.28)",
    messageText: "#3A2114",
    detailText: "#8A6B5A",
    activeKeySurface: "#FF8A5C",
    activeKeyBorder: "#E66A3A",
    activeKeyText: "#FFFFFF",
    activeKeyGlow: "rgba(255, 138, 92, 0.34)",
    primary: "#FF8A5C",
    primaryDeep: "#E66A3A",
    accent: "#FFC25C",
    accentDeep: "#E69A1F",
    sunny: "#FFD66B",
    mint: "#9FE3C9",
    sky: "#9CC9F5",
    coral: "#FF9B7A",
    card: "#FFFFFF",
    cardLine: "#F4E6D6",
    cardShadow: "#E8C9A8",
    ink: "#3A2114",
    inkSoft: "#8A6B5A",
    chips: ["#FF8A5C", "#FFC25C", "#9FE3C9", "#9CC9F5", "#C7B8F5", "#F5A8C8"]
  },
  {
    id: "mint-breeze",
    background:
      "radial-gradient(1200px 600px at 80% -10%, #D8F5E4 0%, rgba(216,245,228,0) 60%), radial-gradient(900px 500px at -10% 90%, #CDEAF7 0%, rgba(205,234,247,0) 60%), #F2FBF6",
    orbOne: "#B7ECD6",
    orbTwo: "#9CC9F5",
    orbThree: "#FFD0A2",
    shell: "rgba(255, 255, 255, 0.82)",
    shellBorder: "#DCEEE5",
    badgeSurface: "rgba(255, 255, 255, 0.86)",
    badgeText: "#15302A",
    buttonSurface: "#FFFFFF",
    buttonText: "#15302A",
    buttonBorder: "#DCEEE5",
    historySurface: "rgba(255, 255, 255, 0.96)",
    historyText: "#15302A",
    keyText: "#3CB58C",
    keyShadow: "rgba(60, 181, 140, 0.28)",
    messageText: "#15302A",
    detailText: "#577A6B",
    activeKeySurface: "#3CB58C",
    activeKeyBorder: "#1E8C68",
    activeKeyText: "#FFFFFF",
    activeKeyGlow: "rgba(60, 181, 140, 0.32)",
    primary: "#3CB58C",
    primaryDeep: "#1E8C68",
    accent: "#5BB1E8",
    accentDeep: "#2E83C0",
    sunny: "#FFD66B",
    mint: "#9FE3C9",
    sky: "#9CC9F5",
    coral: "#FF9B7A",
    card: "#FFFFFF",
    cardLine: "#DCEEE5",
    cardShadow: "#B7DECB",
    ink: "#15302A",
    inkSoft: "#577A6B",
    chips: ["#3CB58C", "#5BB1E8", "#FFD66B", "#FF9B7A", "#C7B8F5", "#F5A8C8"]
  },
  {
    id: "sunset-candy",
    background:
      "radial-gradient(1100px 600px at 85% -5%, #FFD7DD 0%, rgba(255,215,221,0) 60%), radial-gradient(900px 500px at -10% 90%, #FFE9AF 0%, rgba(255,233,175,0) 60%), #FFF8F4",
    orbOne: "#FFB6C9",
    orbTwo: "#FFE09C",
    orbThree: "#B7E6FF",
    shell: "rgba(255, 255, 255, 0.82)",
    shellBorder: "#F8DBE3",
    badgeSurface: "rgba(255, 255, 255, 0.86)",
    badgeText: "#6B2D5C",
    buttonSurface: "#FFFFFF",
    buttonText: "#6B2D5C",
    buttonBorder: "#F8DBE3",
    historySurface: "rgba(255, 255, 255, 0.96)",
    historyText: "#6B2D5C",
    keyText: "#E4669B",
    keyShadow: "rgba(228, 102, 155, 0.28)",
    messageText: "#6B2D5C",
    detailText: "#8C3F67",
    activeKeySurface: "#E4669B",
    activeKeyBorder: "#B9437A",
    activeKeyText: "#FFFFFF",
    activeKeyGlow: "rgba(228, 102, 155, 0.34)",
    primary: "#E4669B",
    primaryDeep: "#B9437A",
    accent: "#FFB347",
    accentDeep: "#E0892C",
    sunny: "#FFE09C",
    mint: "#9FE3C9",
    sky: "#9CC9F5",
    coral: "#FF9B7A",
    card: "#FFFFFF",
    cardLine: "#F8DBE3",
    cardShadow: "#F1B7C9",
    ink: "#6B2D5C",
    inkSoft: "#8C3F67",
    chips: ["#E4669B", "#FFB347", "#9CC9F5", "#FFD66B", "#9FE3C9", "#C7B8F5"]
  },
  {
    id: "lagoon-peach",
    background:
      "radial-gradient(1200px 600px at 80% -10%, #CAEEFF 0%, rgba(202,238,255,0) 60%), radial-gradient(900px 500px at -10% 90%, #FFE4CF 0%, rgba(255,228,207,0) 60%), #F3FCFF",
    orbOne: "#ABDFF0",
    orbTwo: "#FFDCB4",
    orbThree: "#FFC5DE",
    shell: "rgba(255, 255, 255, 0.82)",
    shellBorder: "#D6ECF5",
    badgeSurface: "rgba(255, 255, 255, 0.86)",
    badgeText: "#0C4A6E",
    buttonSurface: "#FFFFFF",
    buttonText: "#0C4A6E",
    buttonBorder: "#D6ECF5",
    historySurface: "rgba(255, 255, 255, 0.96)",
    historyText: "#0C4A6E",
    keyText: "#3B8BC2",
    keyShadow: "rgba(59, 139, 194, 0.28)",
    messageText: "#0F3559",
    detailText: "#325D78",
    activeKeySurface: "#3B8BC2",
    activeKeyBorder: "#1F6692",
    activeKeyText: "#FFFFFF",
    activeKeyGlow: "rgba(59, 139, 194, 0.32)",
    primary: "#3B8BC2",
    primaryDeep: "#1F6692",
    accent: "#FFB97A",
    accentDeep: "#E08C46",
    sunny: "#FFD66B",
    mint: "#9FE3C9",
    sky: "#9CC9F5",
    coral: "#FF9B7A",
    card: "#FFFFFF",
    cardLine: "#D6ECF5",
    cardShadow: "#BDDDEE",
    ink: "#0C4A6E",
    inkSoft: "#325D78",
    chips: ["#3B8BC2", "#FFB97A", "#9FE3C9", "#F5A8C8", "#FFD66B", "#C7B8F5"]
  },
  {
    id: "strawberry-cream",
    background:
      "radial-gradient(1200px 600px at 80% -10%, #FFD9E5 0%, rgba(255,217,229,0) 60%), radial-gradient(900px 500px at -10% 90%, #FFF0C6 0%, rgba(255,240,198,0) 60%), #FFF9FB",
    orbOne: "#FFBDD2",
    orbTwo: "#FFE7A9",
    orbThree: "#C0E7FF",
    shell: "rgba(255, 255, 255, 0.82)",
    shellBorder: "#F8DAE4",
    badgeSurface: "rgba(255, 255, 255, 0.86)",
    badgeText: "#7A284F",
    buttonSurface: "#FFFFFF",
    buttonText: "#7A284F",
    buttonBorder: "#F8DAE4",
    historySurface: "rgba(255, 255, 255, 0.96)",
    historyText: "#7A284F",
    keyText: "#E4669B",
    keyShadow: "rgba(228, 102, 155, 0.26)",
    messageText: "#7A284F",
    detailText: "#944363",
    activeKeySurface: "#E4669B",
    activeKeyBorder: "#B9437A",
    activeKeyText: "#FFFFFF",
    activeKeyGlow: "rgba(228, 102, 155, 0.32)",
    primary: "#E4669B",
    primaryDeep: "#B9437A",
    accent: "#FFC25C",
    accentDeep: "#E69A1F",
    sunny: "#FFE7A9",
    mint: "#9FE3C9",
    sky: "#9CC9F5",
    coral: "#FF9B7A",
    card: "#FFFFFF",
    cardLine: "#F8DAE4",
    cardShadow: "#F1ADC4",
    ink: "#7A284F",
    inkSoft: "#944363",
    chips: ["#E4669B", "#FFC25C", "#9CC9F5", "#9FE3C9", "#C7B8F5", "#FFD66B"]
  },
  {
    id: "lime-bubble",
    background:
      "radial-gradient(1100px 600px at 85% -5%, #E2F6B9 0%, rgba(226,246,185,0) 60%), radial-gradient(900px 500px at -10% 90%, #D8F1FF 0%, rgba(216,241,255,0) 60%), #FBFFEF",
    orbOne: "#D2ED99",
    orbTwo: "#BEE8FF",
    orbThree: "#FFD0A2",
    shell: "rgba(255, 255, 255, 0.82)",
    shellBorder: "#E1EFC9",
    badgeSurface: "rgba(255, 255, 255, 0.86)",
    badgeText: "#335C2B",
    buttonSurface: "#FFFFFF",
    buttonText: "#335C2B",
    buttonBorder: "#E1EFC9",
    historySurface: "rgba(255, 255, 255, 0.96)",
    historyText: "#335C2B",
    keyText: "#7BB549",
    keyShadow: "rgba(123, 181, 73, 0.28)",
    messageText: "#2F5233",
    detailText: "#487147",
    activeKeySurface: "#7BB549",
    activeKeyBorder: "#578F2B",
    activeKeyText: "#FFFFFF",
    activeKeyGlow: "rgba(123, 181, 73, 0.32)",
    primary: "#7BB549",
    primaryDeep: "#578F2B",
    accent: "#5BB1E8",
    accentDeep: "#2E83C0",
    sunny: "#FFD66B",
    mint: "#9FE3C9",
    sky: "#9CC9F5",
    coral: "#FF9B7A",
    card: "#FFFFFF",
    cardLine: "#E1EFC9",
    cardShadow: "#C4DF9E",
    ink: "#2F5233",
    inkSoft: "#487147",
    chips: ["#7BB549", "#5BB1E8", "#FFD66B", "#FF9B7A", "#F5A8C8", "#C7B8F5"]
  }
] as const;

export const EMOJIS = ["🌟", "🎈", "🦄", "🚀", "🎉", "🌸", "🐣", "🍭", "✨", "🫧"] as const;

export const MESSAGES = [
  "Great job!",
  "You did it!",
  "Wow!",
  "Yay!",
  "Nice one!",
  "Keep going!",
  "Super!",
  "Way to go!",
  "Awesome!",
  "Sparkle!",
  "High five!",
  "Brilliant!"
] as const;

export const IDLE_EMOJI = "✨";
export const IDLE_MESSAGE = "Press any key to make the screen dance.";
export const IDLE_HINT = "Letters, numbers, Space, Enter, and punctuation all work.";
