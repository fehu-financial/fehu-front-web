"use client";

import { ChevronsUpDown, Settings, User, Users } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getWorkspaces } from "@/core/actions/wokspaces";
import { useWorkspaceParams } from "@/core/hooks/use-workspace";
import { WorkspaceType } from "@/core/types/workspace";
import { useQuery } from "@tanstack/react-query";

// Add this utility class for hiding scrollbars while maintaining functionality
const scrollbarHideClass = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

export function WorkspaceCombobox() {
	const { data: workspaces } = useQuery({
		queryKey: ["workspaces"],
		queryFn: getWorkspaces,
	});

	const [open, setOpen] = React.useState(false);
	const { workspaces: selectedWorkspaces, setWorkspaces: setSelectedWorkspaces } = useWorkspaceParams();
	const [searchQuery, setSearchQuery] = React.useState("");

	const filteredWorkspaces = React.useMemo(() => {
		if (!searchQuery) return workspaces;

		return workspaces?.filter(
			(workspace) =>
				workspace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				workspace.type.toLowerCase().includes(searchQuery.toLowerCase()),
		);
	}, [searchQuery, workspaces]);

	const toggleWorkspace = (workspaceId: string) => {
		if (selectedWorkspaces.includes(workspaceId)) {
			setSelectedWorkspaces(selectedWorkspaces.filter((id) => id !== workspaceId));
		} else {
			setSelectedWorkspaces([...selectedWorkspaces, workspaceId]);
		}
	};

	const selectAll = () => {
		if (!workspaces) return;
		if (selectedWorkspaces.length === workspaces?.length) {
			setSelectedWorkspaces([]);
		} else {
			setSelectedWorkspaces(workspaces.map((workspace) => workspace.id));
		}
	};

	// Get names of selected workspaces for display
	const selectedWorkspaceNames = selectedWorkspaces
		.map((id) => workspaces?.find((w) => w.id === id)?.name)
		.filter(Boolean);

	return (
		<div className="w-full max-w-md">
			<style jsx global>
				{scrollbarHideClass}
			</style>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button variant="outline" aria-expanded={open} className="w-full justify-between h-auto min-h-10 px-3 py-2">
						<div className="flex-1 overflow-x-auto mr-2 scrollbar-hide">
							<div className="flex flex-nowrap gap-1 py-1 min-w-min">
								{selectedWorkspaces.length > 0 ? (
									selectedWorkspaces.map((id) => {
										const workspace = workspaces?.find((w) => w.id === id);
										if (!workspace) return null;

										return (
											<Badge
												key={workspace.id}
												variant="secondary"
												className="flex items-center gap-1 px-2 py-1 whitespace-nowrap"
											>
												<div
													className="h-3 w-3 rounded-full flex-shrink-0"
													style={{ backgroundColor: workspace.color }}
												/>
												{workspace.name}
											</Badge>
										);
									})
								) : (
									<span className="text-muted-foreground">Select workspaces...</span>
								)}
							</div>
						</div>
						<ChevronsUpDown className="h-4 w-4 opacity-50 flex-shrink-0" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
					<Command shouldFilter={false}>
						<CommandInput placeholder="Search workspaces..." value={searchQuery} onValueChange={setSearchQuery} />
						<CommandList>
							<CommandEmpty>No workspaces found.</CommandEmpty>
							<CommandGroup>
								<CommandItem onSelect={selectAll} className="flex items-center gap-2">
									<Checkbox
										checked={selectedWorkspaces.length === workspaces?.length && workspaces?.length > 0}
										className="mr-2"
									/>
									<span>Select All</span>
								</CommandItem>
							</CommandGroup>
							<CommandSeparator />
							<CommandGroup heading="Workspaces">
								{filteredWorkspaces?.map((workspace) => (
									<CommandItem
										key={workspace.id}
										onSelect={() => toggleWorkspace(workspace.id)}
										className="flex items-center"
									>
										<Checkbox checked={selectedWorkspaces.includes(workspace.id)} className="mr-2" />
										<div
											className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md mr-2"
											style={{ backgroundColor: workspace.color }}
										>
											{workspace.avatar ? (
												<img
													src={workspace.avatar || "/placeholder.svg"}
													alt={workspace.name}
													className="h-5 w-5 rounded-md object-cover"
												/>
											) : (
												<span className="text-xs font-semibold text-white">{workspace.name.charAt(0)}</span>
											)}
										</div>
										<span>{workspace.name}</span>
										<div className="ml-auto flex items-center text-xs text-muted-foreground">
											{workspace.type === WorkspaceType.PERSONAL ? (
												<>
													<User className="mr-1 h-3 w-3" />
													<span className="hidden sm:inline">Personal</span>
												</>
											) : (
												<>
													<Users className="mr-1 h-3 w-3" />
													<span className="hidden sm:inline">Shared</span>
												</>
											)}
										</div>
									</CommandItem>
								))}
							</CommandGroup>
							<CommandSeparator />
							<CommandGroup>
								<CommandItem onSelect={() => {}} asChild>
									<Link href="/workspace/settings" className="flex items-center">
										<Settings className="mr-2 h-4 w-4" />
										<span>Workspace Settings</span>
									</Link>
								</CommandItem>
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>

			{/* {selectedWorkspaces.length > 0 && (
				<div className="mt-4">
					<Button className="w-full">
						Continue with {selectedWorkspaces.length} workspace{selectedWorkspaces.length !== 1 ? "s" : ""}
					</Button>
				</div>
			)} */}
		</div>
	);
}
