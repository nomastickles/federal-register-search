import "./App.css";
import Nav from "./Nav";

import { actions } from "./slice";
import { TopicComponent } from "./Topic/TopicComponent";
import { Step } from "./types";
import { useDispatch } from "./hooks/useDispatch";
import { useAppState } from "./hooks/useAppState";
import React from "react";

function App() {
  const dispatch = useDispatch();
  const { topics, stepMap } = useAppState();
  const currentTopicId = stepMap[Step.OPEN_TOPIC];
  const isTopicOpened = !!currentTopicId;
  const backgroundClassName = `bl-main ${
    isTopicOpened ? "bl-expand-item" : ""
  } ${stepMap[Step.SHOW_INFO] ? "bl-main-dropdown" : ""}`;

  React.useEffect(() => {
    dispatch(actions.init());
  }, [dispatch]);

  const onSectionClick = React.useCallback(
    (id: number) => {
      dispatch(
        actions.setStepValue({
          step: Step.OPEN_TOPIC,
          value: id,
        })
      );
    },
    [dispatch]
  );

  return (
    <div className="container">
      <Nav />
      <div id="bl-main" className={backgroundClassName}>
        {topics.map((topic) => {
          const sectionClassName = `${
            currentTopicId === topic.id ? "bl-expand bl-expand-top" : ""
          }`;

          return (
            <section
              key={topic.id}
              style={{ background: topic.backgroundColor }}
              onClick={() => onSectionClick(topic.id)}
              className={sectionClassName}
            >
              <TopicComponent item={topic} key={topic.id} />
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default App;
