import { WorkspaceMemberRole } from "@/types/workspace";
import { z } from "zod";

export const CreateWorkspaceSchema = z.object({
	title: z.string(),
	description: z.string(),
	color: z.string().optional(),
	avatar: z.string().optional(),
	members: z
		.array(
			z.object({
				id: z.string(),
				name: z.string(),
				email: z.string(),
				avatar: z.string().optional(),
				role: z.nativeEnum(WorkspaceMemberRole),
			}),
		)
		.optional(),
});

export type CreateWorkspaceInput = z.infer<typeof CreateWorkspaceSchema>;

export const UpdateWorkspaceSchema = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	color: z.string().optional(),
	avatar: z.string().optional(),
	isArchived: z.boolean().optional(),
	members: z
		.array(
			z.object({
				id: z.string(),
				name: z.string(),
				email: z.string(),
				avatar: z.string().optional(),
				role: z.nativeEnum(WorkspaceMemberRole),
			}),
		)
		.optional(),
});

export type UpdateWorkspaceInput = z.infer<typeof UpdateWorkspaceSchema>;
