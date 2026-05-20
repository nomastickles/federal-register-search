import React from "react";
import { HelpCircle, X } from "react-feather";
import { actions } from "./slice";
import { Step } from "./types";
import { useAppState } from "./hooks/useAppState";
import { useDispatch } from "./hooks/useDispatch";

/**
 * Masthead — shown at the top of the topic list view. Just a title +
 * info toggle. Topic-open / edit views have their own headers inside
 * TopicOpenLayer so the buttons can be context-aware.
 */
function Masthead() {
  const { stepMap } = useAppState();
  const dispatch = useDispatch();
  const showInfo = stepMap[Step.SHOW_INFO];

  const dateLabel = React.useMemo(() => {
    return new Date().toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }, []);

  const toggleInfo = React.useCallback(() => {
    dispatch(
      actions.setStepValue({
        step: Step.SHOW_INFO,
        clearStep: !!showInfo,
      }),
    );
  }, [dispatch, showInfo]);

  return (
    <>
      <div className="masthead">
        <div>
          <div className="masthead-eyebrow">{dateLabel}</div>
          <h1 className="masthead-title">Federal Register Search</h1>
        </div>
        <div className="masthead-actions">
          <button
            className="icon-btn"
            onClick={toggleInfo}
            aria-label="about this app"
          >
            <HelpCircle size={20} />
          </button>
        </div>
      </div>

      {!!showInfo && (
        <div className="info-banner">
          Searching{" "}
          <a
            href="https://www.federalregister.gov/developers/documentation/api/v1#/Federal%20Register%20Documents/get_documents__format_"
            target="_blank"
            rel="noopener noreferrer"
          >
            federalregister.gov
          </a>{" "}
          via{" "}
          <a
            href="https://github.com/nomastickles/federal-register-search"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/nomastickles/federal-register-search
          </a>
          .
          <button
            className="icon-btn info-banner-close"
            onClick={toggleInfo}
            aria-label="close info"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </>
  );
}

export default Masthead;
