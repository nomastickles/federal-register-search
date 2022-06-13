import React from "react";

import "./App.css";
import { DispatchContext, StateContext } from "./context";
import Nav from "./Nav";

import { actions } from "./slice";
import Topic from "./Topic/Topic";
import { Step } from "./types";

function App() {
  const dispatch = React.useContext(DispatchContext);
  const { topics, stepMap } = React.useContext(StateContext);
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
        {topics.map((item) => {
          const sectionClassName = `${
            currentTopicId === item.id ? "bl-expand bl-expand-top" : ""
          }`;

          return (
            <section
              key={item.id}
              style={{ background: item.backgroundColor }}
              onClick={() => onSectionClick(item.id)}
              className={sectionClassName}
            >
              <Topic topic={item} />
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default App;
