import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SetStep, State, Step, Topic } from "./types";
import { getTopicFromLocalStorage, setTopicLocalStorage } from "./utils";
import { appName, topicDefaults } from "./constants";

const initialState: State = {
  stepMap: {},
  topics: [],
};

const { actions, reducer } = createSlice({
  name: appName,
  initialState,
  reducers: {
    reset: (state) => {
      Object.assign(state, initialState);
    },
    updateTopic: (state, { payload }: PayloadAction<Topic>) => {
      const index = state.topics.findIndex((i) => i.id === payload.id);
      state.topics[index] = payload;
      setTopicLocalStorage(payload);
      state.stepMap[Step.EDIT_TOPIC] = undefined;
      state.stepMap[Step.OPEN_TOPIC] = undefined;
      state.stepMap[Step.TOPIC_UPDATE] = undefined;
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
          illustrationColor: topicDefaults[index].illustrationColor,
          backgroundColor: topicDefaults[index].backgroundColor,
        };
      });
    },
  },
});

export { actions, reducer, initialState };
