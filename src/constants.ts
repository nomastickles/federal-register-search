import { Topic } from "./types";

export const appName = "federal-register-search";

export const illustrationTypes = [
  "Backpack",
  "Browser",
  "Cat",
  "CreditCard",
  "File",
  "Ghost",
  "IceCream",
  "Mug",
  "Planet",
  "SpeechBubble",
];

/**
 * Editorial-friendly muted accent palette. Each entry pairs a background
 * tint (used for the kawaii zone) with a stronger illustration color.
 */
export const accentPalette: { background: string; illustration: string }[] = [
  { background: "#2a2622", illustration: "#c97a5a" }, // terracotta
  { background: "#22272a", illustration: "#7a9ec4" }, // dusty blue
  { background: "#262a22", illustration: "#8aa874" }, // sage
  { background: "#2a2522", illustration: "#caa15a" }, // ochre
  { background: "#262226", illustration: "#a98cc1" }, // mauve
  { background: "#222a2a", illustration: "#6cb4a8" }, // teal
  { background: "#2a2226", illustration: "#c47a8e" }, // rose
  { background: "#2a2a22", illustration: "#bfb35a" }, // mustard
];

export const availableSections = [
  "business-and-industry",
  "environment",
  "health-and-public-welfare",
  "science-and-technology",
  "world",
];

/**
 * Seed topics used the first time someone visits — afterwards, the user's
 * own list (any length) lives in localStorage.
 */
export function getTopicDefaults(): Topic[] {
  const seeds: Array<
    Omit<
      Topic,
      "id" | "illustrationType" | "backgroundColor" | "illustrationColor"
    >
  > = [
    {
      searchWords: ["artificial intelligence"],
      presidential: true,
      topicSections: [],
    },
    {
      searchWords: ["ai", "governance"],
      presidential: false,
      topicSections: [],
    },
    {
      searchWords: ["cyber security"],
      presidential: true,
      topicSections: [],
    },
  ];

  return seeds.map((s, i) => {
    const accent = accentPalette[i % accentPalette.length];
    const illo = illustrationTypes[i % illustrationTypes.length];
    return {
      // stable ids 1..4 so links/state stay clean across reloads
      id: i + 1,
      backgroundColor: accent.background,
      illustrationColor: accent.illustration,
      illustrationType: illo,
      ...s,
    };
  });
}
