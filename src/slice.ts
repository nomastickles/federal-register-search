import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SetStep, State, Step, TopicInfo } from "./types";
import { getTopicFromLocalStorage } from "./utils";
// const colorSchemas = [
//   {
//     1: "#412a45",
//     2: "#623a5a",
//     3: "#945276",
//     4: "#d9769a",
//   },
//   {
//     1: "#122d42",
//     2: "#125a78",
//     3: "#1a89b5",
//     4: "#20c4d8",
//   },
//   {
//     1: "#294e77",
//     2: "#0c5d7d",
//     3: "#0c7887",
//     4: "#0aa390",
//   },
// ];

const colorSchema = ["#412a45", "#623a5a", "#945276", "#d9769a"].sort(
  () => 0.5 - Math.random()
);

const sectionColors = colorSchema;

const topicDefaults: TopicInfo[] = [
  {
    id: 1,
    backgroundColor: sectionColors[0],
    headerColor: sectionColors[3],
    topicSections: ["science-and-technology", "environment"],
    searchWords: ["greenhouse gas", "climate change"],
    presidential: true,
  },
  {
    id: 2,
    backgroundColor: sectionColors[1],
    headerColor: sectionColors[2],
    topicSections: [],
    searchWords: ["cyber"],
    presidential: true,
  },
  {
    id: 3,
    backgroundColor: sectionColors[2],
    headerColor: sectionColors[1],
    topicSections: ["world"],
    searchWords: ["artificial intelligence"],
  },
  {
    id: 4,
    backgroundColor: sectionColors[3],
    headerColor: sectionColors[0],
    topicSections: [],
    searchWords: ["gun violence"],
  },
];

const initialState: State = {
  stepMap: {},
  topics: [],
};

const { actions, reducer } = createSlice({
  name: "app",
  initialState,
  reducers: {
    reset: (state) => {
      Object.assign(state, initialState);
    },
    updateTopic: (state, { payload }: PayloadAction<TopicInfo>) => {
      const index = state.topics.findIndex((i) => i.id === payload.id);
      state.topics[index] = payload;
      localStorage.setItem(`${payload.id}`, JSON.stringify(payload));
      state.stepMap[Step.EDIT_TOPIC] = undefined;
    },
    setStepValue: (state, { payload }: PayloadAction<SetStep>) => {
      let newValue = payload.clearStep ? undefined : Date.now();
      if (payload.value) {
        newValue = payload.value;
      }
      state.stepMap[payload.step] = newValue;
    },
    init: (state) => {
      state.topics = topicDefaults.map((i, index) => {
        const localStorageVersion = getTopicFromLocalStorage(`${i.id}`);
        if (!localStorageVersion) {
          return topicDefaults[index];
        }

        return {
          ...localStorageVersion,
          headerColor: topicDefaults[index].headerColor,
          backgroundColor: topicDefaults[index].backgroundColor,
        };
      });
    },
  },
});

export { actions, reducer, initialState };
