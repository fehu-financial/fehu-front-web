"use client";

import {
	Archive,
	ArrowUpDown,
	Check,
	ChevronDown,
	Filter,
	Plus,
	Search,
	Settings,
} from "lucide-react";
import { useState } from "react";

import { getWorkspaces } from "@/actions/wokspaces";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { PageContainer } from "@/components/ui/page-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type Workspace, WorkspaceType } from "@/types/workspace";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { WorkspaceCard } from "./components/workspace-card";
import { WorkspaceDialog } from "./components/workspace-dialog";

export default function Workspaces() {
	const { data: workspaces = [] } = useQuery({
		queryKey: ["workspaces"],
		queryFn: getWorkspaces,
	});
	const queryClient = new QueryClient();

	const [searchQuery, setSearchQuery] = useState("");
	const [typeFilter, setTypeFilter] = useState<WorkspaceType[]>([
		WorkspaceType.PERSONAL,
		WorkspaceType.SHARED,
	]);
	const [sortBy, setSortBy] = useState<"name" | "updated">("updated");
	const [currentTab, setCurrentTab] = useState<"active" | "archived">("active");
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(
		null,
	);

	const filteredWorkspaces = workspaces.filter((workspace) => {
		const matchesSearch =
			workspace.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			workspace.description.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesType = typeFilter.includes(workspace.type as WorkspaceType);
		const matchesTab =
			currentTab === "archived" ? workspace.archived : !workspace.archived;

		return matchesSearch && matchesTab && matchesType;
	});

	const handleCreateWorkspace = (workspace: Workspace) => {
		const newWorkspace = {
			...workspace,
			id: `${workspaces.length + 1}`,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		queryClient.setQueryData(["workspaces"], (oldWorkspaces: Workspace[]) => {
			return [...(oldWorkspaces || []), newWorkspace];
		});
		setDialogOpen(false);
	};

	const handleUpdateWorkspace = (updatedWorkspace: Workspace) => {
		queryClient.setQueryData(["workspaces"], (oldWorkspaces: Workspace[]) => {
			return oldWorkspaces.map((workspace) =>
				workspace.id === updatedWorkspace.id
					? { ...workspace, ...updatedWorkspace, updatedAt: new Date() }
					: workspace,
			);
		});
		setEditingWorkspace(null);
		setDialogOpen(false);
	};

	const handleArchiveWorkspace = (id: string) => {
		queryClient.setQueryData(["workspaces"], (oldWorkspaces: Workspace[]) => {
			return oldWorkspaces.map((workspace) =>
				workspace.id === id
					? { ...workspace, archived: true, updatedAt: new Date() }
					: workspace,
			);
		});
	};

	const handleRestoreWorkspace = (id: string) => {
		queryClient.setQueryData(["workspaces"], (oldWorkspaces: Workspace[]) => {
			return oldWorkspaces.map((workspace) =>
				workspace.id === id
					? { ...workspace, archived: false, updatedAt: new Date() }
					: workspace,
			);
		});
	};

	const openEditDialog = (workspace: Workspace) => {
		setEditingWorkspace(workspace);
		setDialogOpen(true);
	};

	return (
		<PageContainer
			title="Workspaces"
			description="Gerencie seus espaços de trabalho e membros."
			header={
				<Button
					onClick={() => {
						setEditingWorkspace(null);
						setDialogOpen(true);
					}}
				>
					<Plus className="mr-2 h-4 w-4" />
					Novo Workspace
				</Button>
			}
		>
			<Tabs
				defaultValue="active"
				value={currentTab}
				onValueChange={(value) => setCurrentTab(value as "active" | "archived")}
			>
				<div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
					<TabsList>
						<TabsTrigger value="active" className="relative">
							Active
							{workspaces.filter((w) => !w.archived).length > 0 && (
								<span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
									{workspaces.filter((w) => !w.archived).length}
								</span>
							)}
						</TabsTrigger>
						<TabsTrigger value="archived">
							Archived
							{workspaces.filter((w) => w.archived).length > 0 && (
								<span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
									{workspaces.filter((w) => w.archived).length}
								</span>
							)}
						</TabsTrigger>
					</TabsList>
					<div className="flex space-x-2">
						<div className="relative">
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								type="search"
								placeholder="Search workspaces..."
								className="w-full rounded-md pl-8 md:w-[200px] lg:w-[300px]"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" size="icon">
									<Filter className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-[200px]">
								<DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuCheckboxItem
									checked={typeFilter.includes(WorkspaceType.PERSONAL)}
									onCheckedChange={(checked) => {
										if (checked) {
											setTypeFilter([...typeFilter, WorkspaceType.PERSONAL]);
										} else {
											setTypeFilter(
												typeFilter.filter((t) => t !== WorkspaceType.PERSONAL),
											);
										}
									}}
								>
									Pessoal
								</DropdownMenuCheckboxItem>
								<DropdownMenuCheckboxItem
									checked={typeFilter.includes(WorkspaceType.SHARED)}
									onCheckedChange={(checked) => {
										if (checked) {
											setTypeFilter([...typeFilter, WorkspaceType.SHARED]);
										} else {
											setTypeFilter(
												typeFilter.filter((t) => t !== WorkspaceType.SHARED),
											);
										}
									}}
								>
									Compartilhado
								</DropdownMenuCheckboxItem>
							</DropdownMenuContent>
						</DropdownMenu>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" className="flex items-center">
									<ArrowUpDown className="mr-2 h-4 w-4" />
									Sort
									<ChevronDown className="ml-2 h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-[180px]">
								<DropdownMenuLabel>Sort by</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuCheckboxItem
									checked={sortBy === "name"}
									onCheckedChange={() => setSortBy("name")}
								>
									Name
									{sortBy === "name" && <Check className="ml-auto h-4 w-4" />}
								</DropdownMenuCheckboxItem>
								<DropdownMenuCheckboxItem
									checked={sortBy === "updated"}
									onCheckedChange={() => setSortBy("updated")}
								>
									Last Updated
									{sortBy === "updated" && (
										<Check className="ml-auto h-4 w-4" />
									)}
								</DropdownMenuCheckboxItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				<TabsContent value="active" className="mt-6">
					{filteredWorkspaces.length === 0 ? (
						<div className="flex h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
							<div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
								<Settings className="h-10 w-10 text-muted-foreground" />
							</div>
							<h2 className="mt-6 text-xl font-semibold">
								No workspaces found
							</h2>
							<p className="mt-2 text-center text-muted-foreground">
								{searchQuery || typeFilter.length < 2
									? "Try adjusting your search or filters"
									: "Create a new workspace to get started"}
							</p>
							{!searchQuery && typeFilter.length === 2 && (
								<Button
									onClick={() => {
										setEditingWorkspace(null);
										setDialogOpen(true);
									}}
									className="mt-6"
								>
									<Plus className="mr-2 h-4 w-4" />
									New Workspace
								</Button>
							)}
						</div>
					) : (
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{filteredWorkspaces.map((workspace) => (
								<WorkspaceCard
									key={workspace.id}
									workspace={workspace}
									onEdit={() => openEditDialog(workspace)}
									onArchive={() => handleArchiveWorkspace(workspace.id)}
								/>
							))}
						</div>
					)}
				</TabsContent>

				<TabsContent value="archived" className="mt-6">
					{filteredWorkspaces.length === 0 ? (
						<div className="flex h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
							<div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
								<Archive className="h-10 w-10 text-muted-foreground" />
							</div>
							<h2 className="mt-6 text-xl font-semibold">
								No archived workspaces
							</h2>
							<p className="mt-2 text-center text-muted-foreground">
								Archived workspaces will appear here
							</p>
						</div>
					) : (
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{filteredWorkspaces.map((workspace) => (
								<WorkspaceCard
									key={workspace.id}
									workspace={workspace}
									isArchived
									onRestore={() => handleRestoreWorkspace(workspace.id)}
								/>
							))}
						</div>
					)}
				</TabsContent>
			</Tabs>

			<WorkspaceDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				workspace={editingWorkspace}
				onSave={
					editingWorkspace ? handleUpdateWorkspace : handleCreateWorkspace
				}
			/>
		</PageContainer>
	);
}
