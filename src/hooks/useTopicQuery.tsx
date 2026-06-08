import axios from "axios";
import { useQuery } from "react-query";
import { Doc, Topic, TopicOpen } from "../types";

/**
 * Federal Register search with strict AND semantics across multiple
 * search terms.
 *
 * The Federal Register API takes `conditions[term]` as a single string
 * and (empirically) treats multiple words as OR — even with the `AND`
 * keyword between them. So we:
 *   1. Send a wide query so we still get a candidate set from the API.
 *   2. Filter the response client-side, keeping only docs that contain
 *      ALL of the user's terms in title / abstract / excerpts.
 *
 * The `count` and `results` returned reflect the post-filter view so
 * the UI shows the user the true AND match count.
 *
 * If the topic is "open" we mark the query as fresh (staleTime=Infinity)
 * so it doesn't re-fetch while the user is reading.
 *
 * If a topic has no searchWords AND no sections, the request is skipped
 * entirely (an empty filter would otherwise return every document).
 */
function useTopicQuery(topic: Topic, isOpen: boolean) {
  const hasQuery =
    topic.searchWords.length > 0 || topic.topicSections.length > 0;

  // The wide query we send to the API — joined with spaces, multi-word
  // entries quoted as phrases. We DON'T put "AND" between them because
  // the FR API treats the literal token as a searchable word, which
  // actually makes results worse.
  const termQuery = buildTermQuery(topic.searchWords);

  return useQuery<TopicOpen>(
    `${termQuery}|${topic.topicSections.join(",")}|${
      topic.presidential ? "P" : ""
    }`,
    async () => {
      const url = "https://www.federalregister.gov/api/v1/documents.json";
      const params = {
        per_page: 50, // wider candidate set so the AND filter has room
        order: "newest",
        "conditions[sections]": topic.topicSections,
        "conditions[term]": termQuery,
        "conditions[type]": topic.presidential ? ["PRESDOCU"] : undefined,
        // explicitly ask for the fields we render so agencies always
        // come back (default field set varies)
        "fields[]": [
          "title",
          "document_number",
          "html_url",
          "publication_date",
          "type",
          "abstract",
          "excerpts",
          "agencies",
        ],
      };

      const results = await axios.get<TopicOpen>(url, { params });
      return applyAndFilter(results.data, topic.searchWords);
    },
    {
      enabled: hasQuery,
      staleTime: isOpen ? Infinity : undefined,
    }
  );
}

/**
 * Build the term query string for the API. Quotes multi-word entries so
 * they're treated as phrases (not loose tokens), and joins with spaces.
 */
function buildTermQuery(words: string[]): string {
  return words
    .map((w) => w.trim())
    .filter((w) => w.length > 0)
    .map((w) => (/\s/.test(w) ? `"${w.replace(/"/g, "")}"` : w))
    .join(" ");
}

/**
 * Keep only documents that contain ALL search terms (case-insensitive)
 * in the title / abstract / excerpts blob. With one term or fewer,
 * passes the response through untouched.
 */
function applyAndFilter(data: TopicOpen, words: string[]): TopicOpen {
  const terms = words
    .map((w) => w.trim().toLowerCase())
    .filter((w) => w.length > 0);
  if (terms.length <= 1) return data;

  const filtered = (data.results || []).filter((doc) => {
    const haystack = docHaystack(doc);
    return terms.every((t) => haystack.includes(t));
  });

  return {
    ...data,
    results: filtered,
    count: filtered.length,
  };
}

function docHaystack(doc: Doc): string {
  return [doc.title, doc.abstract, doc.excerpts, doc.type]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export default useTopicQuery;
