/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";

import { DispatchContext } from "../context";

export function useDispatch() {
  const dispatch = React.useContext(DispatchContext);

  return React.useMemo(() => dispatch, []);
}
