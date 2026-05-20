import React from "react";
import { Topic } from "../types";
import { Illustration } from "./Illustrations";
import useTopicQuery from "../hooks/useTopicQuery";

/**
 * One row in the topic list. Click anywhere to expand. The right side
 * is a full-card-height kawaii zone tinted with the topic's accent.
 */
export function TopicComponent({
  topic,
  onOpen,
}: {
  topic: Topic;
  onOpen: () => void;
}) {
  const { isLoading, data, error } = useTopicQuery(topic, false);
  const hasError = !!error;

  const firstDoc = data?.results?.[0];
  const count = data?.count;
  const hasQuery =
    topic.searchWords.length > 0 || topic.topicSections.length > 0;

  const lastUpdated = firstDoc?.publication_date;
  const lastUpdatedLabel = formatDate(lastUpdated);

  const cardStyle = {
    ["--topic-bg" as any]: topic.backgroundColor,
    ["--topic-accent" as any]: topic.illustrationColor,
  } as React.CSSProperties;

  // top meta row only emits chips/pills that actually exist
  const topMeta: React.ReactNode[] = [];
  if (topic.presidential) {
    topMeta.push(
      <span className="meta-pill" key="pres">
        Presidential
      </span>,
    );
  }
  if (topic.topicSections.length > 0) {
    topMeta.push(
      <span className="meta-tag" key="sec">
        {topic.topicSections[0]}
      </span>,
    );
  }
  if (isLoading) {
    topMeta.push(<span className="loading-pulse" key="load" />);
  }

  return (
    <div
      className="topic-card"
      style={cardStyle}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
    >
      <div className="topic-card-body">
        <div>
          {topMeta.length > 0 && (
            <div className="topic-card-meta">{topMeta}</div>
          )}

          <h2 className="topic-card-title">
            {topic.searchWords.length > 0 ? (
              topic.searchWords.join(" · ")
            ) : (
              <span style={{ color: "var(--fg-dim)", fontStyle: "italic" }}>
                untitled topic
              </span>
            )}
          </h2>

          {firstDoc && (
            <div className="topic-card-latest">
              <div className="topic-card-latest-eyebrow">
                Latest
                {lastUpdatedLabel && (
                  <>
                    <span className="topic-card-latest-sep">·</span>
                    <span className="topic-card-latest-date">
                      {lastUpdatedLabel}
                    </span>
                  </>
                )}
              </div>
              <div className="topic-card-preview">{firstDoc.title}</div>
            </div>
          )}
          {hasError && (
            <div className="topic-card-preview">
              Couldn't reach the register
            </div>
          )}
        </div>

        <div className="topic-card-count-row">
          <span className="topic-card-count">
            {typeof count === "number" ? count.toLocaleString() : "—"}
          </span>
          <span className="topic-card-count-label">
            {typeof count === "number"
              ? "documents"
              : isLoading
                ? "loading"
                : hasQuery
                  ? "—"
                  : "tap to set up"}
          </span>
        </div>
      </div>

      <div className="topic-kawaii">
        <Illustration
          type={topic.illustrationType}
          color={topic.illustrationColor}
          hasError={hasError}
          isLoading={isLoading}
          size={120}
        />
      </div>

      {isLoading && (
        <div className="topic-loading-bar" style={{ width: "30%" }} />
      )}
    </div>
  );
}

function formatDate(raw?: string): string {
  if (!raw) return "";
  const date = new Date(raw);
  if (isNaN(date.getTime())) return raw;
  const now = new Date();
  const sameYear = date.getFullYear() === now.getFullYear();
  const month = date.toLocaleDateString(undefined, { month: "short" });
  const day = date.getDate();
  return sameYear
    ? `${month} ${day}`
    : `${month} ${day}, ${date.getFullYear()}`;
}
