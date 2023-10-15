import React from "react";
import { StateContext } from "../context";

export function useAppState() {
  const state = React.useContext(StateContext);
  const isLoading = state.topics.length !== 4;
  return { ...state, isLoading };
}
