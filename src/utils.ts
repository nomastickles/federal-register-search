import { TopicInfo } from "./types";

export function getTopicFromLocalStorage(id: string) {
  try {
    const itemRaw = localStorage.getItem(id);
    if (!itemRaw) {
      return null;
    }
    const item = JSON.parse(itemRaw) as TopicInfo;

    return item;
  } catch (_e) {
    return null;
  }
}
