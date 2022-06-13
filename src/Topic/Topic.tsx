import React from "react";
import { StateContext } from "../context";
import { Step, TopicInfo, TopicOpenInfo } from "../types";
import TopicForm from "./TopicForm";
import TopicOpen from "./TopicOpen";
import useTopicQuery from "./useTopicQuery";

/**
 * main component
 */
function Topic(props: { topic: TopicInfo }) {
  const { topicSections, searchWords } = props.topic;
  const { stepMap } = React.useContext(StateContext);
  const currentTopicOpenId = stepMap[Step.OPEN_TOPIC];
  const currentTopicEditId = stepMap[Step.EDIT_TOPIC];

  const { isLoading, data } = useTopicQuery(
    props.topic,
    currentTopicOpenId === props.topic.id
  );

  return (
    <>
      <div className="bl-box">
        <h2 className="">{searchWords.join(" | ")}</h2>
        <h4
          style={{
            width: "100%",
          }}
        >
          {topicSections.join(" | ")}
        </h4>
        <div
          style={{
            height: "40px",
            textAlign: "center",
          }}
        >
          {isLoading && <div className="loading" />}
          {!isLoading &&
            data &&
            formatTopicIntro(data, !!props.topic.presidential)}
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
        {!isLoading && !!currentTopicEditId && (
          <TopicForm topic={props.topic} />
        )}
        {!isLoading && !currentTopicEditId && !!currentTopicOpenId && data && (
          <TopicOpen info={data} />
        )}
      </div>
    </>
  );
}

function formatTopicIntro(item: TopicOpenInfo, isPres: boolean) {
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

export default Topic;
