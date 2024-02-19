"use client";

import { useCallback, useState } from "react";

type Response = [boolean, () => void, () => void];

const useToggle = (initialState = false): Response => {
  const [state, setState] = useState(initialState);

  const toggle = useCallback(() => setState((old) => !old), []);

  const reset = useCallback(() => setState(initialState), [initialState]);

  return [state, toggle, reset];
};

export default useToggle;
