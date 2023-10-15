import React from "react";
import { reducer } from "./slice";
import { appName } from "./constants";
import { State } from "./types";
import { AnyAction } from "@reduxjs/toolkit";

const initialState: State = {
  stepMap: {},
  topics: [],
};

const initialDispatch: React.Dispatch<AnyAction> = () => {
  return;
};

const StateContext = React.createContext(initialState);
const DispatchContext = React.createContext(initialDispatch);

interface Props {
  children: React.ReactNode;
}

const ContextProvider = ({ children }: Props): React.ReactElement => {
  const [state, dispatch] = React.useReducer(reducer, {
    stepMap: {},
    topics: [],
  });
  const devToolsConnectionRef = React.useRef({} as any);
  const lastDispatch = React.useRef({} as any);

  const wrappedDispatch = React.useCallback((stuff: any) => {
    lastDispatch.current = stuff;
    dispatch(stuff);
  }, []);

  React.useEffect(() => {
    devToolsConnectionRef.current = (
      window as any
    ).__REDUX_DEVTOOLS_EXTENSION__?.connect({
      name: appName,
    });
  }, []);

  React.useEffect(() => {
    devToolsConnectionRef.current?.send(lastDispatch?.current || "init", state);
  }, [state]);

  return (
    <DispatchContext.Provider value={wrappedDispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export { ContextProvider, StateContext, DispatchContext };
