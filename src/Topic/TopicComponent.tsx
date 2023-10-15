import React from "react";
import { Step, Topic, TopicOpen } from "../types";
import TopicForm from "./TopicComponentForm";
import TopicComponentOpen from "./TopicComponentOpen";
import { Illustration } from "./Illustrations";
import { useAppState } from "../hooks/useAppState";
import axios from "axios";
import { actions } from "../slice";
import { useDispatch } from "../hooks/useDispatch";

/**
 * main component
 */
export function TopicComponent({ item: topic }: { item: Topic }) {
  const { stepMap } = useAppState();
  const dispatch = useDispatch();
  const [data, setData] = React.useState<TopicOpen | undefined>(undefined);
  const [hasError, setHasError] = React.useState<boolean>(false);
  const currentTopicOpenId = stepMap[Step.OPEN_TOPIC];
  const currentTopicEditId = stepMap[Step.EDIT_TOPIC];
  const topicUpdatedId = stepMap[Step.TOPIC_UPDATE];

  const isLoading = !data;

  const fetchData = React.useCallback(async (topicToLookup: Topic) => {
    const url = "https://www.federalregister.gov/api/v1/documents.json";
    const params = {
      per_page: 20, // doesn't seem to go lower
      order: "newest",
      "conditions[sections]": topicToLookup.topicSections,
      "conditions[term]": topicToLookup.searchWords,
      "conditions[type]": topicToLookup.presidential ? ["PRESDOCU"] : undefined,
    };

    const results = await axios.get<TopicOpen>(url, {
      params,
    });

    return results.data;
  }, []);

  React.useEffect(() => {
    if (!topic) return;
    fetchData(topic)
      .then((results) => {
        setData(results);

        if (!topicUpdatedId) {
          return;
        }

        // topic was updated let's go read some articles
        setTimeout(() => {
          dispatch(
            actions.setStepValue({
              step: Step.OPEN_TOPIC,
              value: topicUpdatedId,
            })
          );
        }, 1000);
      })
      .catch(() => {
        setHasError(true);
      })
      .finally(() => {});
  }, [fetchData, topic, topicUpdatedId, dispatch]);

  if (!topic) return null;

  const color = topic.illustrationColor;
  const illustrationType = topic.illustrationType;

  return (
    <>
      <div className="bl-box">
        <Illustration
          type={illustrationType}
          color={color}
          hasError={hasError}
          isLoading={isLoading}
        />
        <h2>{topic.searchWords.join(" | ")}</h2>
        <h4
          style={{
            width: "100%",
          }}
        >
          {topic.topicSections.join(" | ")}
        </h4>
        <div
          style={{
            height: "40px",
            textAlign: "center",
          }}
        >
          {isLoading && <div className="loading" />}
          {!isLoading && data && formatTopicIntro(data, !!topic.presidential)}
        </div>
      </div>

      <div className="bl-content">
        {isLoading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "50px 0 0 0",
            }}
          >
            <div className="loading" />
          </div>
        )}
        {!isLoading && !currentTopicEditId && !!currentTopicOpenId && data && (
          <TopicComponentOpen info={data} />
        )}
        {!isLoading && !!currentTopicEditId && <TopicForm topic={topic} />}
      </div>
    </>
  );
}

function formatTopicIntro(item: TopicOpen, isPres: boolean) {
  const lastDate =
    item.count && item.results ? item.results[0].publication_date : undefined;
  return (
    <div>
      articles found: <strong>{item.count}</strong>
      {lastDate && (
        <div>
          last updated: <strong>{lastDate}</strong>
        </div>
      )}
      {isPres && (
        <div>
          <span className="nes">
            <i className="nes-icon star is-small"></i>
          </span>
          Presidential Documents
        </div>
      )}
    </div>
  );
}
