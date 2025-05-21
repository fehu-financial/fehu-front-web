"use server";

import { fetchWithAuth } from "@/data/http-client";
import type {
	CreateWorkspaceInput,
	UpdateWorkspaceInput,
} from "@/schemas/workspace-schema";
import type { Workspace } from "@/types/workspace";

const API_URL = `${process.env.FEHU_BFF_API_URL}/workspaces`;

export const getWorkspaces = async (): Promise<Workspace[]> => {
	return fetchWithAuth(API_URL, {
		method: "GET",
	});
};

export const createWorkspace = async (data: CreateWorkspaceInput) => {
	return fetchWithAuth(API_URL, {
		method: "POST",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
		},
	});
};

export const updateWorkspace = async (
	id: string,
	data: UpdateWorkspaceInput,
) => {
	return fetchWithAuth(`${API_URL}/${id}`, {
		method: "PUT",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
		},
	});
};
