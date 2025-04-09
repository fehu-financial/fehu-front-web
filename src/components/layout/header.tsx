"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useLayout } from "@/hooks/use-layout";
import { cn } from "@/lib/utils";
import { Bell, ChevronDown, Menu, MoonIcon, SunIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface HeaderProps {
	className?: string;
}

export function Header({ className }: HeaderProps) {
	const { isDarkMode, toggleDarkMode, toggleMobileSidebar } = useLayout();

	return (
		<header
			className={cn(
				className,
				"flex flex-row w-full justify-between shadow-xs p-4 sm:px-6 lg:px-8",
			)}
		>
			<div className="flex items-center">
				<Button
					variant="ghost"
					size="icon"
					className="lg:hidden mr-2"
					onClick={toggleMobileSidebar}
				>
					<Menu className="h-6 w-6" />
				</Button>
			</div>
			<div className="flex items-center space-x-4">
				<Button variant="ghost" size="icon" onClick={toggleDarkMode}>
					{isDarkMode ? (
						<SunIcon className="h-6 w-6 text-yellow-500" />
					) : (
						<MoonIcon className="h-6 w-6 text-gray-500" />
					)}
				</Button>
				<Popover>
					<PopoverTrigger asChild>
						<Button variant="ghost" size="icon" className="relative">
							<Bell className="h-6 w-6" />
							<Badge variant="dot">1</Badge>
						</Button>
					</PopoverTrigger>
					<PopoverContent>
						<h3 className="text-lg font-medium">Notifications</h3>
						<div className="mt-4 space-y-4">
							<div className="flex items-start">
								<div className="ml-3 flex-1">
									<p className="text-sm font-medium">New transaction alert</p>
									<p className="mt-1 text-sm">
										You have a new transaction of $50.00 from Amazon.
									</p>
								</div>
							</div>
							<div className="flex items-start">
								<div className="ml-3 flex-1">
									<p className="text-sm font-medium">Budget limit reached</p>
									<p className="mt-1 text-sm">
										Your "Dining Out" budget has reached its limit.
									</p>
								</div>
							</div>
						</div>
					</PopoverContent>
				</Popover>

				{/* User Menu */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="ml-4 p-2 flex items-center">
							<Avatar className="h-8 w-8">
								<AvatarImage
									className="object-cover"
									src="https://sm.ign.com/ign_br/screenshot/default/blob_hbbk.jpg"
								/>
								<AvatarFallback>ML</AvatarFallback>
							</Avatar>

							<span className="ml-2 text-md font-medium hidden sm:inline-block">
								Monkey D. Luffy
							</span>
							<ChevronDown className="ml-2 h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>Profile</DropdownMenuItem>
						<DropdownMenuItem>Settings</DropdownMenuItem>
						<DropdownMenuItem>Billing</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>Log out</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}
