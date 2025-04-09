"use client";

import { User, Users } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { Member, Workspace, WorkspaceType } from "@/types/workspace";
import { MemberManagement } from "./member-managements";

interface WorkspaceDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	workspace: Workspace | null;
	onSave: (workspace: Workspace) => void;
}

// Sample colors for workspaces
const workspaceColors = [
	"#4f46e5", // indigo
	"#10b981", // emerald
	"#f59e0b", // amber
	"#ec4899", // pink
	"#6366f1", // indigo
	"#8b5cf6", // violet
	"#ef4444", // red
	"#0ea5e9", // sky
];

// Sample users for member selection
const availableUsers: Member[] = [
	{
		id: "u1",
		name: "Alex Johnson",
		email: "alex@example.com",
		role: "admin",
		avatarUrl: "/placeholder.svg?height=40&width=40",
	},
	{
		id: "u2",
		name: "Jamie Smith",
		email: "jamie@example.com",
		role: "editor",
		avatarUrl: "/placeholder.svg?height=40&width=40",
	},
	{
		id: "u3",
		name: "Taylor Brown",
		email: "taylor@example.com",
		role: "viewer",
		avatarUrl: "/placeholder.svg?height=40&width=40",
	},
	{
		id: "u4",
		name: "Morgan Lee",
		email: "morgan@example.com",
		role: "editor",
		avatarUrl: "/placeholder.svg?height=40&width=40",
	},
	{
		id: "u5",
		name: "Casey Wilson",
		email: "casey@example.com",
		role: "viewer",
		avatarUrl: "/placeholder.svg?height=40&width=40",
	},
	{
		id: "u6",
		name: "Riley Green",
		email: "riley@example.com",
		role: "editor",
		avatarUrl: "/placeholder.svg?height=40&width=40",
	},
	{
		id: "u7",
		name: "Jordan Black",
		email: "jordan@example.com",
		role: "viewer",
		avatarUrl: "/placeholder.svg?height=40&width=40",
	},
	{
		id: "u8",
		name: "Quinn Davis",
		email: "quinn@example.com",
		role: "editor",
		avatarUrl: "/placeholder.svg?height=40&width=40",
	},
];

export function WorkspaceDialog({ open, onOpenChange, workspace, onSave }: WorkspaceDialogProps) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [type, setType] = useState<WorkspaceType>("team");
	const [members, setMembers] = useState<Member[]>([]);
	const [color, setColor] = useState(workspaceColors[0]);
	const [activeTab, setActiveTab] = useState("details");
	const [errors, setErrors] = useState<{ [key: string]: string }>({});

	// Reset form when dialog opens/closes or workspace changes
	useEffect(() => {
		if (workspace) {
			setName(workspace.name);
			setDescription(workspace.description);
			setType(workspace.type);
			setMembers(workspace.members);
			setColor(workspace.color || workspaceColors[0]);
		} else {
			// Default values for new workspace
			setName("");
			setDescription("");
			setType("team");
			// Add current user as admin by default
			setMembers([availableUsers[0]]);
			setColor(workspaceColors[Math.floor(Math.random() * workspaceColors.length)]);
		}
		setErrors({});
		setActiveTab("details");
	}, [workspace, open]);

	const validateForm = () => {
		const newErrors: { [key: string]: string } = {};

		if (!name.trim()) {
			newErrors.name = "Workspace name is required";
		}

		if (type === "team" && members.length === 0) {
			newErrors.members = "Team workspaces must have at least one member";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSave = () => {
		if (!validateForm()) {
			// If there are errors in the details tab, switch to it
			if (errors.name) {
				setActiveTab("details");
			} else if (errors.members) {
				setActiveTab("members");
			}
			return;
		}

		const updatedWorkspace: Workspace = {
			id: workspace?.id || "temp-id",
			name,
			description,
			type,
			members,
			color,
			createdAt: workspace?.createdAt || new Date(),
			updatedAt: new Date(),
		};

		onSave(updatedWorkspace);
	};

	const handleAddMember = (member: Member) => {
		if (!members.some((m) => m.id === member.id)) {
			setMembers([...members, member]);
		}
	};

	const handleRemoveMember = (memberId: string) => {
		setMembers(members.filter((m) => m.id !== memberId));
	};

	const handleUpdateMemberRole = (memberId: string, role: string) => {
		setMembers(members.map((m) => (m.id === memberId ? { ...m, role } : m)));
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>{workspace ? "Edit Workspace" : "Create Workspace"}</DialogTitle>
					<DialogDescription>
						{workspace
							? "Update your workspace details and manage members"
							: "Create a new workspace and add team members"}
					</DialogDescription>
				</DialogHeader>

				<Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="details">Workspace Details</TabsTrigger>
						<TabsTrigger value="members">Members</TabsTrigger>
					</TabsList>

					<TabsContent value="details" className="space-y-4 py-4">
						<div className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="name">
									Workspace Name <span className="text-destructive">*</span>
								</Label>
								<Input
									id="name"
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="Enter workspace name"
									className={errors.name ? "border-destructive" : ""}
								/>
								{errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
							</div>

							<div className="space-y-2">
								<Label htmlFor="description">Description</Label>
								<Textarea
									id="description"
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									placeholder="Describe the purpose of this workspace"
									className="resize-none"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="type">Workspace Type</Label>
								<Select value={type} onValueChange={(value) => setType(value as WorkspaceType)}>
									<SelectTrigger id="type">
										<SelectValue placeholder="Select workspace type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="personal" className="flex items-center">
											<div className="flex items-center">
												<User className="mr-2 h-4 w-4" />
												Personal
											</div>
										</SelectItem>
										<SelectItem value="team">
											<div className="flex items-center">
												<Users className="mr-2 h-4 w-4" />
												Team
											</div>
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label>Workspace Color</Label>
								<div className="flex flex-wrap gap-2">
									{workspaceColors.map((colorOption) => (
										<button
											key={colorOption}
											type="button"
											className={`h-8 w-8 rounded-full border-2 ${color === colorOption ? "border-primary" : "border-transparent"}`}
											style={{ backgroundColor: colorOption }}
											onClick={() => setColor(colorOption)}
											aria-label={`Select color ${colorOption}`}
										/>
									))}
								</div>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="members" className="py-4">
						<MemberManagement
							members={members}
							availableUsers={availableUsers}
							onAddMember={handleAddMember}
							onRemoveMember={handleRemoveMember}
							onUpdateRole={handleUpdateMemberRole}
							error={errors.members}
						/>
					</TabsContent>
				</Tabs>

				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button onClick={handleSave}>{workspace ? "Save Changes" : "Create Workspace"}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
