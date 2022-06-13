import axios from "axios";
import { useQuery } from "react-query";
import { TopicInfo, TopicOpenInfo } from "../types";

/**
 *
 * If the topic is "open" then we want to mark the query as
 * fresh by setting stateTime to the highest level. That way
 * it won't refresh while users read topics.
 */
function useTopicQuery(topic: TopicInfo, isOpen: boolean) {
  return useQuery<TopicOpenInfo>(
    `${topic.searchWords.join("")}${topic.topicSections.join("")}${
      topic.presidential ? "presidential" : ""
    }`,
    async () => {
      const url = "https://www.federalregister.gov/api/v1/documents.json";
      const params = {
        per_page: 20, // doesn't seem to go lower
        order: "newest",
        "conditions[sections]": topic.topicSections,
        "conditions[term]": topic.searchWords,
        "conditions[type]": topic.presidential ? ["PRESDOCU"] : undefined,
      };

      const results = await axios.get(url, {
        params,
      });

      return {
        ...results.data,
      };
    },
    {
      staleTime: isOpen ? Infinity : undefined,
    }
  );
}

export default useTopicQuery;
