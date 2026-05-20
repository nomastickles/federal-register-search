import React from "react";
import { StateContext } from "../context";

export function useAppState() {
  const state = React.useContext(StateContext);
  // topics list can be any non-negative length; isLoading is true while
  // init() hasn't run yet (effectively only the first render).
  const isLoading = state.topics === undefined;
  return { ...state, isLoading };
}
