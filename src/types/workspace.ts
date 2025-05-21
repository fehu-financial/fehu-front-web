export enum WorkspaceMemberRole {
	EDITOR = "EDITOR",
	OWNER = "OWNER",
	VIEWER = "VIEWER",
}

export enum WorkspaceType {
	PERSONAL = "PERSONAL",
	SHARED = "SHARED",
}

export interface WorkspaceMember {
	id: string;
	name: string;
	email: string;
	avatar?: string;
	role: WorkspaceMemberRole;
}

export interface Workspace {
	id: string;
	title: string;
	description: string;
	type: string;
	color?: string;
	archived?: boolean;
	avatar?: string;
	members: WorkspaceMember[];
	createdAt: Date;
	updatedAt: Date;
}
