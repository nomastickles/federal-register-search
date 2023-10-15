import React from "react";
import { XCircle as Delete } from "react-feather";
import { useForm } from "react-hook-form";
import { actions } from "../slice";
import { Step, Topic, FormData } from "../types";
import { useDispatch } from "../hooks/useDispatch";
import { useAppState } from "../hooks/useAppState";

const sections = [
  "business-and-industry",
  "environment",
  "health-and-public-welfare",
  "science-and-technology",
  "world",
];

const deleteIconSize = 22;
/**
 * the form
 */
function TopicForm({ topic }: { topic: Topic }) {
  const dispatch = useDispatch();
  const { stepMap } = useAppState();
  const [newSections, setNewSections] = React.useState(topic.topicSections);
  const shouldUpdateTopic = stepMap[Step.TOPIC_UPDATE] === topic.id;

  const { register, watch } = useForm<FormData>({
    defaultValues: {
      searchWords: topic.searchWords.join(","),
      presidential: topic.presidential,
    },
  });

  const formData = watch();

  const addSection = React.useCallback(
    (section: string) => {
      if (newSections.includes(section)) {
        return;
      }

      setNewSections((prev) => [...prev, section]);
    },
    [newSections]
  );

  const removeSection = React.useCallback((section: string) => {
    setNewSections((prev) => prev.filter((i) => i !== section));
  }, []);

  React.useEffect(() => {
    if (!shouldUpdateTopic) {
      return;
    }
    console.log("🌈");

    const newItem = {
      ...topic,
      topicSections: newSections,
      searchWords: formData.searchWords.split(",").map((i) => i.trim()),
      presidential: formData.presidential,
    };

    dispatch(actions.updateTopic(newItem));
  }, [dispatch, formData, newSections, shouldUpdateTopic, topic]);

  const availableSelections = sections.filter(
    (section) => !newSections.includes(section)
  );

  return (
    <>
      <div className="nes is-rounded">
        <p>Topic Edit</p>
      </div>

      <form className={"nes"} onSubmit={() => {}}>
        <>
          <section className="nes">
            <label htmlFor="searchWords">Search Terms (comma separated)</label>
            <div className="nes-field">
              <textarea
                className="nes-textarea"
                style={{
                  margin: "0 0 15px 0",
                  width: "100%",
                  maxWidth: "500px",
                  minHeight: "80px",
                  display: "block",
                }}
                {...register("searchWords", { required: true })}
              />

              <label>
                <input
                  type="checkbox"
                  className="is-dark"
                  {...register("presidential")}
                />
                <span> Only search presidentially signed documents</span>
              </label>
            </div>
          </section>
          <section className="nes">
            {/* <label htmlFor="sections">Section Focus</label> */}
            {availableSelections.length > 0 && (
              <div style={{ margin: "16px 0 0 0" }}>
                <select value={""} onChange={(e) => addSection(e.target.value)}>
                  <option value="" disabled>
                    Target Search in...
                  </option>
                  {availableSelections.map((section) => {
                    return (
                      <option key={section} value={section}>
                        {section}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

            <div style={{ margin: "20px 0 0 5px" }}>
              {newSections.map((department) => {
                return (
                  <div
                    style={{ margin: "0 0 10px 0", display: "inline-block" }}
                    key={department}
                  >
                    <div style={{ margin: "0px 10px 0 0", float: "left" }}>
                      <Delete
                        width={deleteIconSize}
                        height={deleteIconSize}
                        onClick={() => removeSection(department)}
                      />
                    </div>

                    <div style={{ float: "left" }}>{department}</div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      </form>
    </>
  );
}

export default TopicForm;
