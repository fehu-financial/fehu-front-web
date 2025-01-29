import { WorkspaceSchema } from "@/@core/domain/workspace";
import { useWorkspace } from "@/hooks/use-workspace";
import { zodResolver } from "@hookform/resolvers/zod";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { UserPlus, X } from "lucide-react";
import { useState } from "react";
import React from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Avatar } from "./avatar";
import { Button } from "./button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "./drawer";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./form";
import { Input } from "./input";

export interface WorkspaceManageProps {
	className?: string;
	isOpen: boolean;
	onClose: () => void;
}

export function WorkspaceManage({ isOpen, onClose }: WorkspaceManageProps) {
	const { currentWorkspace, listWorkspaces, changeWorkspace, createWorkspace } =
		useWorkspace();
	const [user, setUser] = useState<string>("");

	const form = useForm<z.infer<typeof WorkspaceSchema>>({
		resolver: zodResolver(WorkspaceSchema),
		defaultValues: {
			name: "",
			description: "",
			users: [] as string[],
		},
	});

	const users = form.watch("users");

	function handleAddUser() {
		if (!user) return;
		form.setValue("users", [...users, user]);
	}

	function handleRemoveUser(user: string) {
		form.setValue(
			"users",
			users.filter((u) => u !== user),
		);
	}

	function onSubmit(data: z.infer<typeof WorkspaceSchema>) {
		console.log(data);
		createWorkspace(data);
	}
	console.log(form.formState.errors);

	return (
		<Drawer open={isOpen} onClose={onClose}>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Workspace</DrawerTitle>
					<DrawerDescription>
						Gerencie seus espaços pessoais ou compartilhados
					</DrawerDescription>
				</DrawerHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="px-4 space-y-2"
					>
						<div className="flex w-full gap-2">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormLabel>Nome do Workspace</FormLabel>
										<FormControl>
											<Input {...field} className="flex-1" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormLabel>Descrição do Workspace</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="users"
							render={({ field }) => (
								<FormItem className="flex-1">
									<FormLabel>Compartilhe com alguém</FormLabel>
									<FormControl>
										<React.Fragment key={field.name}>
											<div className="relative flex-grow">
												<Input
													value={user}
													onChange={(e) => setUser(e.target.value)}
												/>
												<Button
													type="button"
													onClick={handleAddUser}
													className="absolute right-0 top-0 bottom-0 rounded-l-none"
												>
													<UserPlus className="h-4 w-4 mr-2" />
													Add
												</Button>
											</div>
											{users.length > 0 && (
												<div className="flex flex-wrap gap-2 mt-2">
													{users.map((user, index) => (
														<div
															key={user}
															className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
														>
															{user}
															<Button
																type="button"
																variant="ghost"
																size="sm"
																className="ml-2 h-auto p-0"
																onClick={() => handleRemoveUser(user)}
															>
																<X className="h-4 w-4" />
															</Button>
														</div>
													))}
												</div>
											)}
										</React.Fragment>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DrawerFooter className="p-0">
							<Button type="submit">Confirmar</Button>
						</DrawerFooter>
					</form>
				</Form>
			</DrawerContent>
		</Drawer>
	);
}
