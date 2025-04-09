import { z } from "zod";

export const WorkspaceUserSchema = z.object({
	email: z.string().email({ message: "Invalid email." }),
	role: z.enum(["EDITOR", "VIEWER"], { message: "Invalid role." }),
});

export const WorkspaceSchema = z.object({
	// id: z.string().nullable(),
	name: z.string().min(1, { message: "Name cannot be empty." }),
	description: z.string().min(1, { message: "Description cannot be empty." }),
	users: z.array(WorkspaceUserSchema).nullable(),
});

export class WorkspaceUser {
	public id!: string;
	public name!: string;
	public email!: string;
	public role!: string;
}

export class Workspace {
	constructor(
		public readonly id: string,
		public type: string,
		public name: string,
		public description: string,
		public users: WorkspaceUser[] = [],
	) {}

	public isValid(): boolean {
		try {
			WorkspaceSchema.parse(this);
			return true;
		} catch (error) {
			return false;
		}
	}
}
