import React from "react";
import { X, Shuffle } from "react-feather";
import { actions } from "../slice";
import { Step, Topic } from "../types";
import { useDispatch } from "../hooks/useDispatch";
import { useAppState } from "../hooks/useAppState";
import {
  availableSections,
  illustrationTypes,
  accentPalette,
} from "../constants";
import { Illustration } from "./Illustrations";

/**
 * Phone-friendly chip-based topic editor.
 */
function TopicForm({ topic }: { topic: Topic }) {
  const dispatch = useDispatch();
  const { stepMap } = useAppState();
  const shouldUpdateTopic = stepMap[Step.TOPIC_UPDATE] === topic.id;

  const [terms, setTerms] = React.useState<string[]>(topic.searchWords);
  const [pendingTerm, setPendingTerm] = React.useState("");
  const [sections, setSections] = React.useState<string[]>(topic.topicSections);
  const [presidential, setPresidential] = React.useState<boolean>(
    !!topic.presidential
  );
  const [illustrationType, setIllustrationType] = React.useState<string>(
    topic.illustrationType
  );
  const [accentIndex, setAccentIndex] = React.useState<number>(() => {
    const i = accentPalette.findIndex(
      (a) => a.illustration === topic.illustrationColor
    );
    return i >= 0 ? i : 0;
  });

  const activeAccent = accentPalette[accentIndex];

  const addTerm = React.useCallback(() => {
    const t = pendingTerm.trim();
    if (!t) return;
    if (terms.includes(t)) {
      setPendingTerm("");
      return;
    }
    setTerms((prev) => [...prev, t]);
    setPendingTerm("");
  }, [pendingTerm, terms]);

  const removeTerm = React.useCallback((t: string) => {
    setTerms((prev) => prev.filter((x) => x !== t));
  }, []);

  const toggleSection = React.useCallback((s: string) => {
    setSections((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }, []);

  const cycleIllustration = React.useCallback(() => {
    const i = illustrationTypes.indexOf(illustrationType);
    const next = illustrationTypes[(i + 1) % illustrationTypes.length];
    setIllustrationType(next);
  }, [illustrationType]);

  const shuffleLook = React.useCallback(() => {
    // pick a different accent and a different illustration at random
    setAccentIndex((current) => {
      if (accentPalette.length <= 1) return current;
      let next = current;
      while (next === current) {
        next = Math.floor(Math.random() * accentPalette.length);
      }
      return next;
    });
    setIllustrationType((current) => {
      if (illustrationTypes.length <= 1) return current;
      let next = current;
      while (next === current) {
        next = illustrationTypes[
          Math.floor(Math.random() * illustrationTypes.length)
        ];
      }
      return next;
    });
  }, []);

  // when parent dispatches TOPIC_UPDATE we commit to redux + localStorage
  React.useEffect(() => {
    if (!shouldUpdateTopic) return;
    // if there's an unsubmitted draft in the input, treat it as a term
    const draft = pendingTerm.trim();
    const finalTerms =
      draft && !terms.includes(draft) ? [...terms, draft] : terms;
    const newItem: Topic = {
      ...topic,
      topicSections: sections,
      searchWords: finalTerms,
      presidential,
      illustrationType,
      backgroundColor: activeAccent.background,
      illustrationColor: activeAccent.illustration,
    };
    dispatch(actions.updateTopic(newItem));
  }, [
    shouldUpdateTopic,
    terms,
    pendingTerm,
    sections,
    presidential,
    illustrationType,
    activeAccent,
    topic,
    dispatch,
  ]);

  return (
    <div className="topic-form">
      {/* Illustration picker */}
      <div className="illustration-picker">
        <div
          className="illustration-picker-preview"
          style={{ background: activeAccent.background }}
          onClick={cycleIllustration}
        >
          <Illustration
            type={illustrationType}
            color={activeAccent.illustration}
            size={100}
          />
        </div>
        <div className="illustration-picker-actions">
          <div className="illustration-picker-name">{illustrationType}</div>
          <div className="illustration-picker-hint">
            tap to cycle illustration
          </div>
          <button
            type="button"
            className="illustration-picker-cycle"
            onClick={shuffleLook}
          >
            <Shuffle size={12} /> shuffle
          </button>
        </div>
      </div>

      {/* Search terms */}
      <label className="form-label">Search terms</label>
      <div className="chip-input">
        {terms.map((t) => (
          <span className="chip" key={t}>
            {t}
            <span
              className="chip-x"
              onClick={() => removeTerm(t)}
              role="button"
              aria-label={`remove ${t}`}
            >
              <X size={12} />
            </span>
          </span>
        ))}
        <input
          className="chip-add-input"
          value={pendingTerm}
          placeholder={terms.length ? "add another…" : "type a term, then enter"}
          onChange={(e) => setPendingTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addTerm();
            } else if (e.key === "Backspace" && !pendingTerm && terms.length) {
              setTerms((prev) => prev.slice(0, -1));
            }
          }}
          onBlur={addTerm}
        />
      </div>

      {/* Sections */}
      <label className="form-label">Sections</label>
      <div className="section-chips">
        {availableSections.map((s) => {
          const active = sections.includes(s);
          return (
            <button
              type="button"
              key={s}
              className={`section-chip${active ? " is-active" : ""}`}
              onClick={() => toggleSection(s)}
            >
              {s}
            </button>
          );
        })}
      </div>

      {/* Presidential toggle */}
      <label className="toggle-row">
        <span>Presidential documents only</span>
        <span className="toggle">
          <input
            type="checkbox"
            checked={presidential}
            onChange={(e) => setPresidential(e.target.checked)}
          />
          <span className="toggle-track">
            <span className="toggle-thumb" />
          </span>
        </span>
      </label>
    </div>
  );
}

export default TopicForm;
