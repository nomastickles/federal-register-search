import { Topic } from "./types";

const localStoragePrefix = "v1";

export function getTopicFromLocalStorage(id: string) {
  try {
    const itemRaw = localStorage.getItem(`${localStoragePrefix}.${id}`);
    if (!itemRaw) {
      return null;
    }
    const item = JSON.parse(itemRaw) as Topic;

    return item;
  } catch (_e) {
    return null;
  }
}

export function setTopicLocalStorage(topic: Topic) {
  localStorage.setItem(
    `${localStoragePrefix}.${topic.id}`,
    JSON.stringify(topic)
  );
}

export const getNRandomFromArray = (array: string[], n: number) => {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
};
