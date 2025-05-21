"use client";

import { Plus, Search, X } from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { type WorkspaceMember, WorkspaceMemberRole } from "@/types/workspace";

interface MemberManagementProps {
	members: WorkspaceMember[];
	availableUsers: WorkspaceMember[];
	onAddMember: (member: WorkspaceMember) => void;
	onRemoveMember: (memberId: string) => void;
	onUpdateRole: (memberId: string, role: string) => void;
	error?: string;
}

export function MemberManagement({
	members,
	availableUsers,
	onAddMember,
	onRemoveMember,
	onUpdateRole,
	error,
}: MemberManagementProps) {
	const [open, setOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const availableToAdd = availableUsers.filter(
		(user) => !members?.some((member) => member.id === user.id),
	);

	const filteredUsers = availableToAdd.filter(
		(user) =>
			user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			user.email.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<div className="space-y-4">
			<div className="flex flex-col space-y-2">
				<div className="flex justify-between items-center">
					<h3 className="text-sm font-medium">Workspace Members</h3>
					<Popover open={open} onOpenChange={setOpen}>
						<PopoverTrigger asChild>
							<Button variant="outline" size="sm" className="h-8 gap-1">
								<Plus className="h-3.5 w-3.5" />
								Add Member
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-[300px] p-0" align="end">
							<Command shouldFilter={false}>
								<div className="flex items-center border-b px-3">
									<Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
									<CommandInput
										placeholder="Search users..."
										className="border-0 focus:ring-0 h-9"
										value={searchQuery}
										onValueChange={setSearchQuery}
									/>
								</div>
								<CommandList>
									<CommandEmpty>No users found.</CommandEmpty>
									<CommandGroup className="max-h-[200px] overflow-auto">
										{filteredUsers.map((user) => (
											<CommandItem
												key={user.id}
												onSelect={() => {
													onAddMember({
														...user,
														role: WorkspaceMemberRole.VIEWER,
													});
													setOpen(false);
													setSearchQuery("");
												}}
												className="flex items-center gap-2"
											>
												<Avatar className="h-7 w-7">
													<AvatarImage src={user.avatar} alt={user.name} />
													<AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
												</Avatar>
												<div className="flex flex-col">
													<span className="text-sm">{user.name}</span>
													<span className="text-xs text-muted-foreground">
														{user.email}
													</span>
												</div>
											</CommandItem>
										))}
									</CommandGroup>
								</CommandList>
							</Command>
						</PopoverContent>
					</Popover>
				</div>

				{error && <p className="text-sm text-destructive">{error}</p>}

				{members?.length === 0 ? (
					<div className="flex h-[100px] flex-col items-center justify-center rounded-md border border-dashed p-4 text-center animate-in fade-in-50">
						<p className="text-sm text-muted-foreground">
							No members added yet
						</p>
						<Button
							variant="link"
							size="sm"
							className="mt-2"
							onClick={() => setOpen(true)}
						>
							Add members
						</Button>
					</div>
				) : (
					<div className="space-y-3 rounded-md border p-2">
						{members?.map((member) => (
							<div
								key={member.id}
								className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
							>
								<div className="flex items-center gap-3">
									<Avatar className="h-8 w-8">
										<AvatarImage src={member.avatar} alt={member.name} />
										<AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
									</Avatar>
									<div className="flex flex-col">
										<span className="text-sm font-medium">{member.name}</span>
										<span className="text-xs text-muted-foreground">
											{member.email}
										</span>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<Select
										value={member.role}
										onValueChange={(value) => onUpdateRole(member.id, value)}
										disabled={member.role === WorkspaceMemberRole.OWNER}
									>
										<SelectTrigger className="h-8 w-[110px]">
											<SelectValue placeholder="Select role" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="OWNER">Admin</SelectItem>
											<SelectItem value="EDITOR">Editor</SelectItem>
											<SelectItem value="VIWER">Viewer</SelectItem>
										</SelectContent>
									</Select>
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8"
										onClick={() => onRemoveMember(member.id)}
									>
										<X className="h-4 w-4" />
										<span className="sr-only">Remove member</span>
									</Button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
