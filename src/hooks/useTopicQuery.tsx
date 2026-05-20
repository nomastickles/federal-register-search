import axios from "axios";
import { useQuery } from "react-query";
import { Topic, TopicOpen } from "../types";

/**
 * If the topic is "open" then we want to mark the query as
 * fresh by setting staleTime to the highest level. That way
 * it won't refresh while users read topics.
 *
 * If a topic has no searchWords AND no sections, we skip the request
 * entirely — there's nothing to ask the API for (an empty filter would
 * otherwise return everything in the Federal Register).
 */
function useTopicQuery(topic: Topic, isOpen: boolean) {
  const hasQuery =
    topic.searchWords.length > 0 || topic.topicSections.length > 0;

  return useQuery<TopicOpen>(
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
      enabled: hasQuery,
      staleTime: isOpen ? Infinity : undefined,
    }
  );
}

export default useTopicQuery;
