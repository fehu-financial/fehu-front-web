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
	role: WorkspaceMemberRole;
}

export interface Workspace {
	id: string;
	name: string;
	description: string;
	type: WorkspaceType;
	members: WorkspaceMember[];
	avatar?: string;
	color?: string;
	archived?: boolean;
	createdAt: Date;
	updatedAt: Date;
}
