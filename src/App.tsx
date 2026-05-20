import "./App.css";
import React from "react";
import { Plus } from "react-feather";

import Masthead from "./Nav";
import { TopicComponent } from "./Topic/TopicComponent";
import { TopicOpenLayer } from "./Topic/TopicOpenLayer";
import { actions } from "./slice";
import { Step } from "./types";
import { useAppState } from "./hooks/useAppState";
import { useDispatch } from "./hooks/useDispatch";

function App() {
  const dispatch = useDispatch();
  const { topics, stepMap } = useAppState();
  const currentTopicId = stepMap[Step.TOPIC_OPEN];
  const openTopic = topics.find((t) => t.id === currentTopicId);

  React.useEffect(() => {
    dispatch(actions.init());
  }, [dispatch]);

  const onOpen = React.useCallback(
    (id: number) => {
      dispatch(actions.setStepValue({ step: Step.TOPIC_OPEN, value: id }));
    },
    [dispatch]
  );

  const onAddTopic = React.useCallback(() => {
    dispatch(actions.addTopic());
  }, [dispatch]);

  return (
    <div className="container">
      <Masthead />

      <div className="topic-list">
        {topics.map((topic) => (
          <TopicComponent
            key={topic.id}
            topic={topic}
            onOpen={() => onOpen(topic.id)}
          />
        ))}

        <button className="topic-add" onClick={onAddTopic} type="button">
          <Plus size={16} /> add topic
        </button>
      </div>

      {openTopic && <TopicOpenLayer topic={openTopic} />}
    </div>
  );
}

export default App;
