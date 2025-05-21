"use client";

import { formatDistanceToNow } from "date-fns";
import { Archive, MoreHorizontal, Settings, Users } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Workspace, WorkspaceType } from "@/types/workspace";

interface WorkspaceCardProps {
	workspace: Workspace;
	isArchived?: boolean;
	onEdit?: () => void;
	onArchive?: () => void;
	onRestore?: () => void;
}

export function WorkspaceCard({
	workspace,
	isArchived = false,
	onEdit,
	onArchive,
	onRestore,
}: WorkspaceCardProps) {
	const {
		title = "",
		description,
		type,
		updatedAt,
		members = [],
		color,
	} = workspace;

	const displayMembers = members.slice(0, 3);
	const additionalMembersCount = members.length - displayMembers.length;

	return (
		<Card className={isArchived ? "opacity-70" : ""}>
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between">
					<div className="flex items-center space-x-3">
						<div
							className="flex h-10 w-10 items-center justify-center rounded-md"
							style={{ backgroundColor: color }}
						>
							<span className="text-lg font-semibold text-white">
								{title.charAt(0)}
							</span>
						</div>
						<div>
							<CardTitle className="text-lg">{title}</CardTitle>
							<CardDescription className="line-clamp-1 mt-1">
								{description}
							</CardDescription>
						</div>
					</div>
					{!isArchived && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon" className="h-8 w-8">
									<MoreHorizontal className="h-4 w-4" />
									<span className="sr-only">Open menu</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onClick={onEdit}>
									<Settings className="mr-2 h-4 w-4" />
									Edit workspace
								</DropdownMenuItem>
								<DropdownMenuItem onClick={onEdit}>
									<Users className="mr-2 h-4 w-4" />
									Manage members
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={onArchive}
									className="text-destructive focus:text-destructive"
								>
									<Archive className="mr-2 h-4 w-4" />
									Archive workspace
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
				<div className="mt-2">
					<Badge
						variant={type === WorkspaceType.PERSONAL ? "outline" : "secondary"}
						className="mt-1"
					>
						{type === WorkspaceType.PERSONAL ? "Personal" : "Team"}
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="pb-3">
				<div className="flex -space-x-2">
					{displayMembers.map((member) => (
						<Avatar
							key={member.id}
							className="border-2 border-background h-8 w-8"
						>
							<AvatarImage src={member.avatar} alt={member.name} />
							<AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
						</Avatar>
					))}
					{additionalMembersCount > 0 && (
						<div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
							+{additionalMembersCount}
						</div>
					)}
				</div>
			</CardContent>
			<CardFooter className="pt-1 text-xs text-muted-foreground">
				{isArchived ? (
					<div className="flex w-full items-center justify-between">
						<span>
							Archived {formatDistanceToNow(updatedAt, { addSuffix: true })}
						</span>
						<Button variant="ghost" size="sm" onClick={onRestore}>
							Restore
						</Button>
					</div>
				) : (
					<span>
						Updated {formatDistanceToNow(updatedAt, { addSuffix: true })}
					</span>
				)}
			</CardFooter>
		</Card>
	);
}
