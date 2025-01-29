import type { Workspace } from "@/@core/domain/workspace";
import { createContext, useCallback, useState } from "react";

export interface WorkspaceContextProps {
	currentWorkspace: Workspace | null;
	createWorkspace: (input: Workspace) => void;
	changeWorkspace: (id: string) => void;
	listWorkspaces: () => Workspace[];
}

export const WorkspaceContext = createContext<
	WorkspaceContextProps | undefined
>({
	currentWorkspace: null,
	createWorkspace: () => {},
	changeWorkspace: () => {},
	listWorkspaces: () => [],
});

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
		null,
	);
	const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

	const createWorkspace = useCallback((input: Workspace) => {
		setWorkspaces((prev) => [...prev, input]);
	}, []);

	const changeWorkspace = useCallback(
		(id: string) => {
			const workspace = workspaces.find((workspace) => workspace.id === id);
			if (!workspace) {
				throw new Error("Workspace not found");
			}
			setCurrentWorkspace(workspace);
		},
		[workspaces],
	);

	const listWorkspaces = useCallback(() => {
		return workspaces;
	}, [workspaces]);

	return (
		<WorkspaceContext.Provider
			value={{
				currentWorkspace,
				createWorkspace,
				changeWorkspace,
				listWorkspaces,
			}}
		>
			{children}
		</WorkspaceContext.Provider>
	);
};
