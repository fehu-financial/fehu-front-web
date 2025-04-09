"use server";

import { cookies } from "next/headers";
import type { z } from "zod";
import type { WorkspaceSchema } from "../domain/workspace";
import type { Workspace, WorkspaceMemberRole } from "../types/workspace";

// Base API URL - replace with your actual API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const AUTH_TOKEN =
	process.env.NEXT_PUBLIC_AUTH ||
	"Bearer eyJraWQiOiJRK0Foc3Q4eDBpaUtIUkNJS0lqdUZqdyt1SmtSQ1wvbktGVDhtaTVrMmxZcz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI0NDc4MzQwOC03MGYxLTcwOTUtMjIyMC01N2NhMjEwM2NjYTciLCJjb2duaXRvOmdyb3VwcyI6WyJ1cy1lYXN0LTFfQUJ3WUpiVmZaX0dvb2dsZSJdLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9BQndZSmJWZloiLCJ2ZXJzaW9uIjoyLCJjbGllbnRfaWQiOiI0NG11bHJqZWRvYjZka3VmZXJhNDc3bmIwOCIsIm9yaWdpbl9qdGkiOiJkYTNiYjQyYS00NmUzLTRkZDYtYjE1Ny0zN2IwMjhjY2IxOWQiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwiYXV0aF90aW1lIjoxNzM2OTg3NDI1LCJleHAiOjE3MzY5OTEwMjUsImlhdCI6MTczNjk4NzQyNSwianRpIjoiZjAxNTViZWMtNDczMC00ODI4LTljNGItZmM2ZWE1ODY0OWM0IiwidXNlcm5hbWUiOiJHb29nbGVfMTE4MTQwMzU2NzYyMjk3MTA5NzQ1In0.IEWzAp99Y-q7ykCaVCpX15_2HjE3VZbfm-x2txlIxlB2vuxnOkxa5K9iGFR3YtK53lgOXpKP_kJBGRlUDwticzcm20kvglkZB9S4csyuPwLuBjocHt9G5WNTa7xcobiYODnWr5wdvsoT0HtjV46JnWuaobxQjbnsyUJ5dPzQJhzRinSDc6j4vfyekQtI-JEH2Q7Fa3tBHXzF2tjZZwToWtuSULQboiATzyOKfYJCzCAvfuUCasbf-d7aR5t3ENAA7K9OGLTf-rBJOPAPwXnYcSZYnVnI59LyeZ14eqidQ6mvqHMM5cF1hIiXN7kXLI6CC6kyKDw8VgBdMUvw4MIwcg";

export async function createWorkspace(workspace: z.infer<typeof WorkspaceSchema>) {
	try {
		const requestBody = {
			title: workspace.name,
			description: workspace.description,
			users: workspace.users?.map((user) => ({
				email: user.email,
				role: user.role as WorkspaceMemberRole,
			})),
		};

		const response = await fetch(`${API_BASE_URL}/workspaces`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: AUTH_TOKEN,
			},
			body: JSON.stringify(requestBody),
			cache: "no-store", // Don't cache mutations
		});

		if (!response.ok) {
			console.error("Failed to create workspace:", await response.text());
			throw new Error("Failed to create workspace");
		}

		const data = await response.json();
		return data.id;
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function getWorkspaceById(workspaceId: string, workspaceType: string): Promise<Partial<Workspace> | null> {
	try {
		const response = await fetch(
			`${API_BASE_URL}/workspaces/${workspaceId}?type=${encodeURIComponent(workspaceType)}`,
			{
				next: { revalidate: 60 }, // Revalidate cache every 60 seconds
			},
		);

		if (!response.ok) {
			console.error("Failed to fetch workspace:", await response.text());
			throw new Error("Failed to fetch workspace");
		}

		const workspace = await response.json();

		if (!workspace) throw new Error("Workspace not found");

		return {
			id: workspace.id,
			type: workspace.type ?? undefined,
			name: workspace.title ?? undefined,
			description: workspace.description ?? undefined,
			users: workspace.users?.map((user: any) => ({
				id: user?.id || "",
				name: user?.name || "",
				email: user?.email || "",
				role: user?.role || "",
			})),
		};
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function getWorkspaces(): Promise<Workspace[]> {
	try {
		const response = await fetch(`${API_BASE_URL}/workspaces`, {
			// next: { revalidate: 5 }, // Revalidate cache every 5 minutes
			headers: {
				Authorization: AUTH_TOKEN,
			},
		});

		if (!response.ok) {
			console.error("Failed to fetch workspaces:", await response.text());
			throw new Error("Failed to fetch workspaces");
		}

		const workspaces = await response.json();
		console.log("API Response", workspaces);

		return workspaces.map((workspace: any) => ({
			id: workspace.id,
			type: workspace.type || undefined,
			name: workspace.title || undefined,
			description: workspace.description || undefined,
			color: workspace.color || undefined,
			avatar: workspace.avatar || undefined,
			members: workspace.users?.map((user: any) => ({
				id: user?.id || "",
				name: user?.name || "",
				email: user?.email || "",
				role: user?.role || "",
			})),
			createdAt: workspace.createdAt || undefined,
			updatedAt: workspace.updatedAt || undefined,
			archived: workspace.archived || false,
		}));
	} catch (error) {
		console.error(error);
		return [];
	}
}

export async function getSelectedWorkspace() {
	try {
		const cookieStore = await cookies();
		const workspaceCookie = cookieStore.get("workspace")?.value;
		if (!workspaceCookie) {
			return null;
		}
		const selectedWorkspace = JSON.parse(atob(workspaceCookie));
		return selectedWorkspace;
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function setSelectedWorkspace(workspace: Workspace) {
	try {
		const cookieStore = await cookies();
		cookieStore.set("workspace", btoa(JSON.stringify(workspace)));
	} catch (error) {
		console.error(error);
	}
}
