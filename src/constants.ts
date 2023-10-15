import { Topic } from "./types";
import { getNRandomFromArray } from "./utils";

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

export const sectionColors = {
  1: "#4F7CAC",
  2: "rgb(123, 154, 169)",
  3: "#576CA8",
  4: "rgb(117, 124, 130)",
};

const randomIllustrations = getNRandomFromArray(illustrationTypes, 4);

export const topicDefaults: Topic[] = [
  {
    id: 1,
    backgroundColor: sectionColors[1],
    illustrationColor: sectionColors[4],
    topicSections: [],
    searchWords: ["climate change"],
    presidential: true,
    illustrationType: randomIllustrations[0],
  },
  {
    id: 2,
    backgroundColor: sectionColors[2],
    illustrationColor: sectionColors[3],
    topicSections: [],
    searchWords: ["cyber"],
    presidential: true,
    illustrationType: randomIllustrations[1],
  },
  {
    id: 3,
    backgroundColor: sectionColors[3],
    illustrationColor: sectionColors[2],
    topicSections: [],
    searchWords: ["artificial intelligence"],
    illustrationType: randomIllustrations[2],
  },
  {
    id: 4,
    backgroundColor: sectionColors[4],
    illustrationColor: sectionColors[1],
    topicSections: [],
    searchWords: ["gun violence"],
    illustrationType: randomIllustrations[3],
  },
];
