"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { Workspace } from "@/types/workspace";
import React from "react";
import { WorkspaceForm } from "./workspace-form";

interface WorkspaceDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	workspace: Workspace | null;
	onSave: (workspace: Workspace) => void;
}

export function WorkspaceDialog({
	open,
	onOpenChange,
	workspace,
	onSave,
}: WorkspaceDialogProps) {
	const submitFormRef = React.useRef<() => void>(null);

	const handleExternalSubmit = () => {
		console.log(submitFormRef);
		if (submitFormRef.current) {
			submitFormRef.current(); // Triggers form submit
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>
						{workspace ? "Edit Workspace" : "Create Workspace"}
					</DialogTitle>
					<DialogDescription>
						{workspace
							? "Update your workspace details and manage members"
							: "Create a new workspace and add team members"}
					</DialogDescription>
				</DialogHeader>
				<WorkspaceForm defaultValues={workspace ?? undefined} />
				{/* <DialogFooter></DialogFooter> */}
			</DialogContent>
		</Dialog>
	);
}
