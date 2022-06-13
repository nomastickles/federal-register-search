import React from "react";
import { Minimize, Edit, X, HelpCircle } from "react-feather";
import { DispatchContext, StateContext } from "./context";
import { actions } from "./slice";
import { Step } from "./types";

function Nav() {
  const { stepMap } = React.useContext(StateContext);
  const currentTopicEditId = stepMap[Step.EDIT_TOPIC];
  const currentTopicId = stepMap[Step.OPEN_TOPIC];
  const showInfo = stepMap[Step.SHOW_INFO];
  const dispatch = React.useContext(DispatchContext);

  const iconSize = 62;

  const backToGrid = React.useCallback(() => {
    dispatch(
      actions.setStepValue({
        step: Step.OPEN_TOPIC,
        clearStep: true,
      })
    );
    dispatch(
      actions.setStepValue({
        step: Step.EDIT_TOPIC,
        clearStep: true,
      })
    );
  }, [dispatch]);

  const editToggle = React.useCallback(() => {
    if (currentTopicEditId) {
      dispatch(
        actions.setStepValue({
          step: Step.EDIT_TOPIC,
          clearStep: true,
        })
      );
      return;
    }

    dispatch(
      actions.setStepValue({
        step: Step.EDIT_TOPIC,
        value: currentTopicId,
      })
    );
  }, [currentTopicEditId, dispatch, currentTopicId]);

  const infoToggle = React.useCallback(() => {
    if (showInfo) {
      dispatch(
        actions.setStepValue({
          step: Step.SHOW_INFO,
          clearStep: true,
        })
      );
      return;
    }

    dispatch(
      actions.setStepValue({
        step: Step.SHOW_INFO,
      })
    );
  }, [showInfo, dispatch]);

  return (
    <div className="nav">
      {showInfo && (
        <h3 className="" style={{ margin: "0 0 0 0", lineHeight: "1em" }}>
          This is a simple tool for searching:
          <br />
          <a
            href="https://www.federalregister.gov/developers/documentation/api/v1#/Federal%20Register%20Documents/get_documents__format_"
            target="_blank"
            rel="noopener noreferrer"
          >
            federalregister.gov
          </a>
          <div className="nav-x-info nav-icon" onClick={infoToggle}>
            <X width={52} height={52} />
          </div>
        </h3>
      )}

      {!showInfo && !currentTopicId && (
        <div className="nav-question nav-icon" onClick={infoToggle}>
          <HelpCircle width={36} height={36} />
        </div>
      )}
      {!!currentTopicId && !currentTopicEditId && (
        <>
          <div className="nav-edit nav-icon" onClick={editToggle}>
            <Edit width={iconSize} height={iconSize} />
          </div>
          <div className="nav-close nav-icon" onClick={backToGrid}>
            <Minimize width={iconSize} height={iconSize} />
          </div>
        </>
      )}
    </div>
  );
}

export default Nav;
