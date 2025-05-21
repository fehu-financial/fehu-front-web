"use client";

import { createWorkspace, updateWorkspace } from "@/actions/wokspaces";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
	type CreateWorkspaceInput,
	CreateWorkspaceSchema,
	UpdateWorkspaceInput,
} from "@/schemas/workspace-schema";
import type { Workspace, WorkspaceMember } from "@/types/workspace";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { workspaceColors } from "./colors";
import { MemberManagement } from "./member-managements";

type WorkspaceFormProps = {
	defaultValues?: Partial<Workspace>;
};

export function WorkspaceForm({ defaultValues }: WorkspaceFormProps) {
	const form = useForm<CreateWorkspaceInput>({
		resolver: zodResolver(CreateWorkspaceSchema),
		defaultValues,
	});

	const [activeTab, setActiveTab] = React.useState("details");
	const members = form.watch("members") || [];

	const handleAddMember = useCallback(
		(member: WorkspaceMember) => {
			form.setValue("members", [...members, member]);
		},
		[members, form],
	);

	const handleRemoveMember = useCallback(
		(memberId: string) => {
			form.setValue(
				"members",
				members.filter((member: WorkspaceMember) => member.id !== memberId),
			);
		},
		[members, form],
	);

	const handleUpdateRole = useCallback(
		(memberId: string, role: string) => {
			const updatedMembers = members.map((member: WorkspaceMember) =>
				member.id === memberId
					? { ...member, role: role as WorkspaceMember["role"] }
					: member,
			);
			form.setValue("members", updatedMembers);
		},
		[members, form],
	);

	const onSubmit = useCallback(
		async (input: CreateWorkspaceInput) => {
			if (defaultValues) {
				if (!defaultValues.id) {
					throw new Error("Workspace ID is required for update");
				}
				updateWorkspace(defaultValues.id, input);
			} else {
				createWorkspace(input);
			}
		},
		[defaultValues],
	);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="details">Workspace Details</TabsTrigger>
						<TabsTrigger value="members">Members</TabsTrigger>
					</TabsList>

					<TabsContent value="details" className="space-y-4 py-4">
						<div className="space-y-4">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Workspace Name <span className="text-destructive">*</span>
										</FormLabel>
										<FormControl>
											<Input
												id="name"
												{...field}
												placeholder="Enter workspace name"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Textarea
												id="description"
												{...field}
												placeholder="Describe the purpose of this workspace"
												className="resize-none"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="color"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Workspace Color</FormLabel>
										<FormControl>
											<ToggleGroup
												type="single"
												value={field.value}
												onValueChange={field.onChange}
												className="flex gap-2"
											>
												{workspaceColors.map((colorOption) => (
													<ToggleGroupItem
														key={colorOption}
														value={colorOption}
														className={`h-8 w-8 !rounded-full border-2 cursor-pointer ${
															field.value === colorOption
																? "border-primary"
																: "border-transparent"
														}`}
														style={{ backgroundColor: colorOption }}
													/>
												))}
											</ToggleGroup>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</TabsContent>

					<TabsContent value="members" className="py-4">
						<MemberManagement
							members={members}
							availableUsers={[]}
							onAddMember={handleAddMember}
							onRemoveMember={handleRemoveMember}
							onUpdateRole={handleUpdateRole}
							error={form.formState.errors.members?.message}
						/>
					</TabsContent>
				</Tabs>
				<div className="flex gap-2 justify-end">
					<Button type="button" variant="outline">
						Cancel
					</Button>
					<Button type="submit">
						{defaultValues ? "Save Changes" : "Create Workspace"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
