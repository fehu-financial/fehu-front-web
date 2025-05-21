import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { useEffect } from "react";
import useLocalStorage from "./use-local-storage";

export const useWorkspaceParams = () => {
  const [storagedWorkspaces, setStoragedWorkspaces] = useLocalStorage<string[]>(
    "workspaces",
    []
  );
  const [workspacesParams, setWorkspacesParams] = useQueryState(
    "workspaces",
    parseAsArrayOf(parseAsString).withDefault([])
  );

  useEffect(() => {
    if (storagedWorkspaces.length > 0) {
      setWorkspacesParams(storagedWorkspaces);
    }
  }, [storagedWorkspaces, storagedWorkspaces.length, setWorkspacesParams]);

  const setWorkspaces = (workspaces: string[]) => {
    setWorkspacesParams(workspaces);
    setStoragedWorkspaces(workspaces);
  };

  return { workspaces: workspacesParams, setWorkspaces };
};
