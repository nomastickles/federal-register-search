import React from "react";
import { ArrowLeft, Edit2, Trash2, Check, X } from "react-feather";
import { Topic, Step } from "../types";
import { actions } from "../slice";
import { useDispatch } from "../hooks/useDispatch";
import { useAppState } from "../hooks/useAppState";
import useTopicQuery from "../hooks/useTopicQuery";
import { Illustration } from "./Illustrations";
import TopicComponentOpen from "./TopicComponentOpen";
import TopicForm from "./TopicComponentForm";

/**
 * Full-screen layer shown when a topic is open. Owns the header
 * (back / edit / save / delete) and renders either the reader or the
 * edit form depending on state.
 */
export function TopicOpenLayer({ topic }: { topic: Topic }) {
  const dispatch = useDispatch();
  const { stepMap } = useAppState();
  const isEditing = stepMap[Step.TOPIC_EDIT] === topic.id;

  const { isLoading, data, error } = useTopicQuery(topic, true);
  const hasError = !!error;

  const isEmptyTopic =
    topic.searchWords.length === 0 && topic.topicSections.length === 0;

  const closeTopic = React.useCallback(() => {
    // backing out of a still-empty topic = abandon it (it was created by
    // tapping "+ add topic" but never given any terms)
    if (isEmptyTopic) {
      dispatch(actions.removeTopic(topic.id));
      return;
    }
    dispatch(actions.setStepValue({ step: Step.TOPIC_OPEN, clearStep: true }));
    dispatch(actions.setStepValue({ step: Step.TOPIC_EDIT, clearStep: true }));
  }, [dispatch, isEmptyTopic, topic.id]);

  const enterEdit = React.useCallback(() => {
    dispatch(
      actions.setStepValue({ step: Step.TOPIC_EDIT, value: topic.id })
    );
  }, [dispatch, topic.id]);

  const cancelEdit = React.useCallback(() => {
    // cancelling while the topic is still empty = abandon it
    if (isEmptyTopic) {
      dispatch(actions.removeTopic(topic.id));
      return;
    }
    dispatch(actions.setStepValue({ step: Step.TOPIC_EDIT, clearStep: true }));
  }, [dispatch, isEmptyTopic, topic.id]);

  const triggerSave = React.useCallback(() => {
    dispatch(
      actions.setStepValue({ step: Step.TOPIC_UPDATE, value: topic.id })
    );
  }, [dispatch, topic.id]);

  const onDelete = React.useCallback(() => {
    if (
      window.confirm(
        `Delete topic "${topic.searchWords.join(" · ")}"? This can't be undone.`
      )
    ) {
      dispatch(actions.removeTopic(topic.id));
    }
  }, [dispatch, topic.id, topic.searchWords]);

  const cardStyle = {
    ["--topic-bg" as any]: topic.backgroundColor,
    ["--topic-accent" as any]: topic.illustrationColor,
  } as React.CSSProperties;

  return (
    <div className="topic-open" style={cardStyle}>
      <div className="topic-open-inner">
        <div className="topic-open-header">
          {isEditing ? (
            <button
              className="icon-btn"
              onClick={cancelEdit}
              aria-label="cancel edit"
            >
              <X size={20} />
            </button>
          ) : (
            <button
              className="icon-btn"
              onClick={closeTopic}
              aria-label="back"
            >
              <ArrowLeft size={20} />
            </button>
          )}

          <div className="topic-open-title">
            <div className="topic-open-mini-kawaii">
              <Illustration
                type={topic.illustrationType}
                color={topic.illustrationColor}
                hasError={hasError}
                isLoading={isLoading}
                size={100}
              />
            </div>
            <h2 className="topic-open-title-text">
              {isEditing
                ? "Edit topic"
                : topic.searchWords.length > 0
                ? topic.searchWords.join(" · ")
                : "untitled topic"}
            </h2>
          </div>

          {isEditing ? (
            <button
              className="icon-btn icon-btn--danger"
              onClick={onDelete}
              aria-label="delete topic"
            >
              <Trash2 size={20} />
            </button>
          ) : (
            <button
              className="icon-btn"
              onClick={enterEdit}
              aria-label="edit topic"
            >
              <Edit2 size={20} />
            </button>
          )}
        </div>

        {isEditing ? (
          <>
            <TopicForm topic={topic} />
            <div className="sticky-save">
              <button className="btn btn--ghost" onClick={cancelEdit}>
                Cancel
              </button>
              <button className="btn btn--primary" onClick={triggerSave}>
                <Check size={16} /> Save
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="topic-meta-row">
              {typeof data?.count === "number"
                ? `${data.count.toLocaleString()} documents`
                : isLoading
                ? "loading…"
                : hasError
                ? "couldn't reach the register"
                : "no results"}
              {topic.presidential && (
                <>
                  <span style={{ opacity: 0.5 }}>·</span>
                  <span>presidential only</span>
                </>
              )}
              {topic.topicSections.length > 0 && (
                <>
                  <span style={{ opacity: 0.5 }}>·</span>
                  <span>{topic.topicSections.join(", ")}</span>
                </>
              )}
            </div>
            {data && <TopicComponentOpen info={data} />}
          </>
        )}
      </div>
    </div>
  );
}
