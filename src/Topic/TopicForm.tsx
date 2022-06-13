import React from "react";
import { Delete } from "react-feather";
import { useForm } from "react-hook-form";
import { DispatchContext } from "../context";
import { actions } from "../slice";
import { Step, TopicInfo, FormData } from "../types";

const sections = [
  "business-and-industry",
  "environment",
  "health-and-public-welfare",
  "science-and-technology",
  "world",
];

/**
 * the form
 */
function TopicForm({ topic }: { topic: TopicInfo }) {
  const dispatch = React.useContext(DispatchContext);
  const [newSections, setNewSections] = React.useState(topic.topicSections);

  const { handleSubmit, register } = useForm<FormData>({
    defaultValues: {
      searchWords: topic.searchWords.join(","),
      presidential: topic.presidential,
    },
  });

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

  const onSubmit = React.useCallback(
    (data: FormData) => {
      const newItem = {
        ...topic,
        topicSections: newSections,
        searchWords: data.searchWords.split(",").map((i) => i.trim()),
        presidential: data.presidential,
      };

      dispatch(actions.updateTopic(newItem));
    },
    [dispatch, newSections, topic]
  );

  const availableSelections = sections.filter(
    (section) => !newSections.includes(section)
  );

  return (
    <>
      <div className="nes is-rounded">
        <p>Topic Edit</p>
      </div>

      <form className={"nes"} onSubmit={handleSubmit(onSubmit)}>
        <>
          <section className="nes">
            <label htmlFor="searchWords">Search Terms (comma separated)</label>
            <div className="nes-field">
              <textarea
                className="nes-textarea"
                style={{ margin: "0 0 15px 0" }}
                {...register("searchWords", { required: true })}
              />

              <label>
                <input
                  type="checkbox"
                  className="nes-checkbox is-dark"
                  {...register("presidential")}
                />
                <span>Only search presidentially signed documents</span>
              </label>
            </div>
          </section>
          <section className="nes">
            {/* <label htmlFor="sections">Section Focus</label> */}
            <div style={{ margin: "0 0 30px 5px" }}>
              {newSections.map((department) => {
                return (
                  <div style={{ margin: "0 0 10px 0" }} key={department}>
                    <span>
                      {department}{" "}
                      <Delete
                        width={32}
                        height={32}
                        onClick={() => removeSection(department)}
                      />
                    </span>
                    <span style={{ float: "right" }}></span>
                  </div>
                );
              })}
            </div>

            {availableSelections.length > 0 && (
              <div className="nes-select">
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
          </section>

          <div style={{ position: "fixed", right: "20px", bottom: "20px" }}>
            <button className="nes-btn is-normal" type="submit">
              update
            </button>{" "}
            <button
              className="nes-btn is-normal"
              type="button"
              onClick={() => {
                dispatch(
                  actions.setStepValue({
                    step: Step.EDIT_TOPIC,
                    clearStep: true,
                  })
                );
              }}
            >
              cancel
            </button>
          </div>
        </>
      </form>
    </>
  );
}

export default TopicForm;
