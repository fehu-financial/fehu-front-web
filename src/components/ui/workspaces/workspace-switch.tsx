import { ChevronsUpDown } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getSelectedWorkspace, getWorkspaces } from "@/core/actions/wokspaces";
import { cn } from "@/core/lib/utils";
import { Suspense } from "react";
import { WorkspaceList } from "./workspace-list";

type WorkspaceSwitcherProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

export async function WorkspaceSwitcher({ className }: WorkspaceSwitcherProps) {
	const selectedWorkspace = await getSelectedWorkspace();
	const workspaces = getWorkspaces();

	return (
		<>
			<Popover>
				<PopoverTrigger asChild>
					<Button variant="outline" aria-label="Select a workspace" className={cn("w-60 justify-between", className)}>
						{!selectedWorkspace ? (
							"Nenhum workspace"
						) : (
							<>
								<Avatar className="mr-2 h-5 w-5">
									<AvatarFallback>⚓️</AvatarFallback>
								</Avatar>
								{selectedWorkspace.name}
							</>
						)}
						<ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-60 p-0">
					<Suspense fallback={<div>Loading...</div>}>
						<WorkspaceList workspacesPromise={workspaces} />
					</Suspense>
				</PopoverContent>
			</Popover>
		</>
	);
}
