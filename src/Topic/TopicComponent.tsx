import React from "react";
import { Step, Topic, TopicOpen } from "../types";
import TopicForm from "./TopicComponentForm";
import TopicComponentOpen from "./TopicComponentOpen";
import { Illustration } from "./Illustrations";
import { useAppState } from "../hooks/useAppState";
import useTopicQuery from "../hooks/useTopicQuery";

/**
 * main component
 */
export function TopicComponent({ item: topic }: { item: Topic }) {
  const { stepMap } = useAppState();
  const currentTopicOpenId = stepMap[Step.TOPIC_OPEN];
  const currentTopicEditId = stepMap[Step.TOPIC_EDIT];

  const { isLoading, data, error } = useTopicQuery(
    topic,
    currentTopicOpenId === topic.id
  );

  const hasError = !!error;

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
