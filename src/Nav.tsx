import React from "react";
import {
  ArrowLeftCircle as BackIcon,
  Edit,
  X,
  HelpCircle,
  Save,
} from "react-feather";
import { actions } from "./slice";
import { Step } from "./types";
import { useAppState } from "./hooks/useAppState";
import { useDispatch } from "./hooks/useDispatch";

const iconSize = 62;
const questionSize = 28;

function Nav() {
  const { stepMap } = useAppState();
  const dispatch = useDispatch();
  const currentTopicEditId = stepMap[Step.TOPIC_EDIT];
  const currentTopicId = stepMap[Step.TOPIC_OPEN];
  const showInfo = stepMap[Step.SHOW_INFO];

  const backToGrid = React.useCallback(() => {
    dispatch(
      actions.setStepValue({
        step: Step.TOPIC_OPEN,
        clearStep: true,
      })
    );
    dispatch(
      actions.setStepValue({
        step: Step.TOPIC_EDIT,
        clearStep: true,
      })
    );
  }, [dispatch]);

  const clearEdit = React.useCallback(() => {
    dispatch(
      actions.setStepValue({
        step: Step.TOPIC_EDIT,
        clearStep: true,
      })
    );
  }, [dispatch]);

  const updateTopic = React.useCallback(() => {
    dispatch(
      actions.setStepValue({
        step: Step.TOPIC_UPDATE,
        value: currentTopicEditId,
      })
    );
  }, [dispatch, currentTopicEditId]);

  const editToggle = React.useCallback(() => {
    if (currentTopicEditId) {
      dispatch(
        actions.setStepValue({
          step: Step.TOPIC_EDIT,
          clearStep: true,
        })
      );
      return;
    }

    dispatch(
      actions.setStepValue({
        step: Step.TOPIC_EDIT,
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
        <h3 className="" style={{ margin: "0 0 0 0", lineHeight: "1.3em" }}>
          Searching
          <span> </span>
          <a
            href="https://www.federalregister.gov/developers/documentation/api/v1#/Federal%20Register%20Documents/get_documents__format_"
            target="_blank"
            rel="noopener noreferrer"
          >
            federalregister.gov
          </a>
          <span> via </span>
          <a
            href="https://github.com/nomastickles/federal-register-search"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/nomastickles/federal-register-search
          </a>
          <div className="nav-x-info nav-icon" onClick={infoToggle}>
            <X width={questionSize} height={questionSize} />
          </div>
        </h3>
      )}

      {!showInfo && !currentTopicId && (
        <div className="nav-question nav-icon" onClick={infoToggle}>
          <HelpCircle width={questionSize} height={questionSize} />
        </div>
      )}
      {!!currentTopicId && !currentTopicEditId && (
        <>
          <div className="nav-edit nav-icon button-color" onClick={editToggle}>
            <Edit width={iconSize} height={iconSize} />
          </div>
          <div className="nav-close nav-icon button-color" onClick={backToGrid}>
            <BackIcon width={iconSize} height={iconSize} />
          </div>
        </>
      )}

      {!!currentTopicId && !!currentTopicEditId && (
        <>
          <div className="nav-edit nav-icon button-color" onClick={updateTopic}>
            <Save width={iconSize} height={iconSize} />
          </div>
          <div className="nav-close nav-icon button-color" onClick={clearEdit}>
            <BackIcon width={iconSize} height={iconSize} />
          </div>
        </>
      )}
    </div>
  );
}

export default Nav;
