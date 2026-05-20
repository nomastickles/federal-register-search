import { Topic } from "./types";
import { illustrationTypes, accentPalette } from "./constants";

const STORAGE_PREFIX = "v2";
const INDEX_KEY = `${STORAGE_PREFIX}.index`;
const TOPIC_KEY = (id: number) => `${STORAGE_PREFIX}.topic.${id}`;

/**
 * Read the ordered list of topic ids the user is watching.
 */
export function getTopicIndex(): number[] | null {
  try {
    const raw = localStorage.getItem(INDEX_KEY);
    if (!raw) return null;
    const ids = JSON.parse(raw) as number[];
    if (!Array.isArray(ids)) return null;
    return ids.filter((i) => typeof i === "number");
  } catch (_e) {
    return null;
  }
}

export function setTopicIndex(ids: number[]) {
  localStorage.setItem(INDEX_KEY, JSON.stringify(ids));
}

export function getTopicFromLocalStorage(id: number): Topic | null {
  try {
    const raw = localStorage.getItem(TOPIC_KEY(id));
    if (!raw) return null;
    return JSON.parse(raw) as Topic;
  } catch (_e) {
    return null;
  }
}

export function setTopicLocalStorage(topic: Topic) {
  localStorage.setItem(TOPIC_KEY(topic.id), JSON.stringify(topic));
}

export function removeTopicFromLocalStorage(id: number) {
  localStorage.removeItem(TOPIC_KEY(id));
}

export const getNRandomFromArray = (array: string[], n: number) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
};

/**
 * Build a freshly-minted topic with sensible defaults.
 */
export function makeNewTopic(): Topic {
  const id = Date.now();
  const illo =
    illustrationTypes[Math.floor(Math.random() * illustrationTypes.length)];
  const accent =
    accentPalette[Math.floor(Math.random() * accentPalette.length)];
  return {
    id,
    backgroundColor: accent.background,
    illustrationColor: accent.illustration,
    topicSections: [],
    searchWords: [],
    presidential: false,
    illustrationType: illo,
  };
}
