"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import { setSelectedWorkspace } from "@/core/actions/wokspaces";
import type { Workspace } from "@/core/domain/workspace";
import { Pen, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

type WorkspaceListProps = {
	workspacesPromise: Promise<Partial<Workspace>[]>;
};
export function WorkspaceList({ workspacesPromise }: WorkspaceListProps) {
	const workspaces = React.use(workspacesPromise) as Workspace[];
	const router = useRouter();

	return (
		<Command>
			<CommandList>
				<CommandInput placeholder="Search workspace..." />
				<CommandEmpty>No workspace found.</CommandEmpty>
				<CommandGroup heading="Workspaces">
					{workspaces?.map((workspace) => (
						<CommandItem
							key={workspace.id}
							className="text-sm"
							onSelect={() => setSelectedWorkspace(workspace as Workspace)}
						>
							<Avatar className="mr-2 h-5 w-5">
								<AvatarImage src="https://avatar.vercel.sh/satori" alt={workspace.name} className="grayscale" />
								<AvatarFallback>SC</AvatarFallback>
							</Avatar>
							{workspace.name}
							{/* <Check
								className={cn("ml-auto h-4 w-4", selectedWorkspace?.id === workspace.id ? "opacity-100" : "opacity-0")}
							/> */}
							<Button
								onClick={() => router.push(`/workspaces/${workspace.id}?type=${workspace.type}`)}
								variant="ghost"
								size="sm"
							>
								<Pen />
							</Button>
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
			<CommandSeparator />
			<CommandList>
				<CommandGroup>
					<CommandItem onSelect={() => router.push("/workspaces")}>
						<PlusCircle className="mr-2 h-5 w-5" />
						Criar Workspace
					</CommandItem>
				</CommandGroup>
			</CommandList>
		</Command>
	);
}
