"use client";

import { Workspace } from "@/core/domain/workspace";
import useCookie from "@/core/hooks/use-cookies";
import { createContext, useCallback } from "react";
import React from "react";
import { Provider } from "urql";
import { GetWorkspacesDocument, type GetWorkspacesQuery } from "../data/graphql/client/types";
import { gqlClient } from "../data/graphql/client/urql";

export interface WorkspaceContextProps {
	workspaces: Workspace[];
	selectedWorkspace: Workspace | null;
	onSelectWorkspace: (workspaceId: string) => void;
	addWorkspace: (input: Workspace) => Promise<boolean>;
	updateWorkspace: (id: string, name: string, description?: string) => void;
	deleteWorkspace: (id: string) => void;
	loading: boolean;
}

export const WorkspaceContext = createContext<WorkspaceContextProps | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { data, error } = React.use(gqlClient.query<GetWorkspacesQuery>(GetWorkspacesDocument, {}).toPromise());
	const [updateWorkspace] = [{}];
	const [deleteWorkspace] = [{}];
	const { value: selectedWorkspace, setCookie } = useCookie<Workspace | null>("workspace", null);

	// Adiciona um workspace e refaz a query
	const addWorkspace = async (input: Workspace): Promise<boolean> => {
		// const response = await createWorkspace({
		return new Promise(() => true);
		// 	variables: {
		// 		data: {
		// 			description: input.description,
		// 			title: input.name,
		// 			users: input.users,
		// 		},
		// 	},
		// });
		// setTimeout(() => refetch(), 1000);

		// return !!(response.data || response.errors);
	};

	// Atualiza um workspace e refaz a query
	const updateWorkspaceById = async (id: string, name: string, description?: string) => {
		// await updateWorkspace({ variables: { id, name, description } });
		// refetch();
	};

	// Deleta um workspace e refaz a query
	const deleteWorkspaceById = async (id: string) => {
		// await deleteWorkspace({ variables: { id } });
		// refetch();
	};

	const onSelectWorkspace = useCallback(
		(workspaceId: string) => {
			const workspace = data?.findWorkspacesByUser.find((w) => w.id === workspaceId);
			if (!workspace) return;
			setCookie(
				new Workspace(
					workspace.id,
					workspace.type,
					workspace.title,
					workspace.description,
					workspace.users.map((user) => ({ ...user, email: user.userId || "" })),
				),
			);
		},
		[data, setCookie],
	);

	return (
		<WorkspaceContext.Provider
			value={{
				workspaces: data
					? data.findWorkspacesByUser.map((w: any) => new Workspace(w.id, w.type, w.title, w.description, w.users))
					: ([] as Workspace[]),
				selectedWorkspace,
				onSelectWorkspace,
				addWorkspace,
				updateWorkspace: updateWorkspaceById,
				deleteWorkspace: deleteWorkspaceById,
				loading: false,
			}}
		>
			{children}
		</WorkspaceContext.Provider>
	);
};
