"use client";

import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";

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
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import useToggle from "@/hooks/use-toggle";
import { useWorkspace } from "@/hooks/use-workspace";
import { cn } from "@/lib/utils";
import { WorkspaceManage } from "./workspace-manage";

type WorkspaceSwitcherProps = React.ComponentPropsWithoutRef<
	typeof PopoverTrigger
>;

export function WorkspaceSwitcher({ className }: WorkspaceSwitcherProps) {
	const { currentWorkspace, listWorkspaces, changeWorkspace } = useWorkspace();
	const [isWorkspaceManagerOpen, toggleWorkspaceManager] = useToggle(false);
	const workspaces = listWorkspaces();
	console.log(workspaces);

	return (
		<>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						aria-label="Select a workspace"
						className={cn("w-[200px] justify-between", className)}
					>
						{!currentWorkspace ? (
							"Nenhum workspace"
						) : (
							<>
								<Avatar className="mr-2 h-5 w-5">
									<AvatarImage
										src="https://avatar.vercel.sh/satori.png"
										alt={currentWorkspace.name}
									/>
									<AvatarFallback>SC</AvatarFallback>
								</Avatar>
								{currentWorkspace.name}
							</>
						)}
						<ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[200px] p-0">
					<Command>
						<CommandList>
							<CommandInput placeholder="Search workspace..." />
							<CommandEmpty>No workspace found.</CommandEmpty>
							<CommandGroup heading="Workspaces">
								{workspaces.map((workspace) => (
									<CommandItem
										key={workspace.id}
										onSelect={() => changeWorkspace(workspace.id)}
										className="text-sm"
									>
										<Avatar className="mr-2 h-5 w-5">
											<AvatarImage
												src="https://avatar.vercel.sh/satori"
												alt={workspace.name}
												className="grayscale"
											/>
											<AvatarFallback>SC</AvatarFallback>
										</Avatar>
										{workspace.name}
										<Check
											className={cn(
												"ml-auto h-4 w-4",
												currentWorkspace?.id === workspace.id
													? "opacity-100"
													: "opacity-0",
											)}
										/>
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
						<CommandSeparator />
						<CommandList>
							<CommandGroup>
								<CommandItem onSelect={toggleWorkspaceManager}>
									<PlusCircle className="mr-2 h-5 w-5" />
									Criar Workspace
								</CommandItem>
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
			<WorkspaceManage
				isOpen={isWorkspaceManagerOpen}
				onClose={toggleWorkspaceManager}
			/>
		</>
	);
}
