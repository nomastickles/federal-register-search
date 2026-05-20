import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SetStep, State, Step, Topic } from "./types";
import {
  getTopicFromLocalStorage,
  getTopicIndex,
  makeNewTopic,
  removeTopicFromLocalStorage,
  setTopicIndex,
  setTopicLocalStorage,
} from "./utils";
import { appName, getTopicDefaults } from "./constants";

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
      if (index === -1) return;
      state.topics[index] = payload;
      setTopicLocalStorage(payload);
      state.stepMap[Step.TOPIC_EDIT] = undefined;
      state.stepMap[Step.TOPIC_UPDATE] = undefined;
    },
    addTopic: (state) => {
      const topic = makeNewTopic();
      state.topics.push(topic);
      setTopicLocalStorage(topic);
      setTopicIndex(state.topics.map((t) => t.id));
      // jump straight into edit mode for the new topic
      state.stepMap[Step.TOPIC_OPEN] = topic.id;
      state.stepMap[Step.TOPIC_EDIT] = topic.id;
    },
    removeTopic: (state, { payload }: PayloadAction<number>) => {
      state.topics = state.topics.filter((t) => t.id !== payload);
      removeTopicFromLocalStorage(payload);
      setTopicIndex(state.topics.map((t) => t.id));
      state.stepMap[Step.TOPIC_OPEN] = undefined;
      state.stepMap[Step.TOPIC_EDIT] = undefined;
    },
    reorderTopics: (state, { payload }: PayloadAction<number[]>) => {
      // payload = new ordered list of topic ids
      const lookup = new Map(state.topics.map((t) => [t.id, t]));
      const reordered = payload
        .map((id) => lookup.get(id))
        .filter((t): t is Topic => !!t);
      // include any topics not present in payload at the end (defensive)
      state.topics.forEach((t) => {
        if (!payload.includes(t.id)) reordered.push(t);
      });
      state.topics = reordered;
      setTopicIndex(state.topics.map((t) => t.id));
    },
    setStepValue: (state, { payload }: PayloadAction<SetStep>) => {
      let newValue = payload.clearStep ? undefined : Date.now();
      if (payload.value) {
        newValue = payload.value;
      }
      state.stepMap[payload.step] = newValue;
    },
    init: (state) => {
      const storedIndex = getTopicIndex();

      if (!storedIndex || storedIndex.length === 0) {
        // first run — seed with defaults and persist them
        const defaults = getTopicDefaults();
        state.topics = defaults;
        defaults.forEach(setTopicLocalStorage);
        setTopicIndex(defaults.map((t) => t.id));
        return;
      }

      // rebuild topics from index + per-topic blobs; skip missing blobs
      const rebuilt: Topic[] = [];
      storedIndex.forEach((id) => {
        const t = getTopicFromLocalStorage(id);
        if (t) rebuilt.push(t);
      });
      state.topics = rebuilt;
    },
  },
});

export { actions, reducer, initialState };
