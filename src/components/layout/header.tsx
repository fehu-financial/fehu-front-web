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

import type { User } from "@/actions/user";
import useCookies from "@/hooks/use-cookies";
import { useLayout } from "@/hooks/use-layout";
import { cn } from "@/lib/utils";
import {
	Bell,
	ChevronDown,
	Menu,
	MoonIcon,
	SunIcon,
	UserIcon,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useSidebar } from "../ui/sidebar";

interface HeaderProps {
	className?: string;
}

export function Header({ className }: HeaderProps) {
	const { isDarkMode, toggleDarkMode } = useLayout();
	const { toggleSidebar, isMobile } = useSidebar();
	const { value: user } = useCookies<User | null>("user", null, "json");

	return (
		<header
			className={cn(
				className,
				"sticky top-0 z-50 flex flex-row w-full bg-background justify-between shadow-xs p-4 sm:px-6 lg:px-8",
			)}
		>
			{isMobile ? (
				<div className="flex items-center">
					<Button
						variant="ghost"
						size="icon"
						className=" mr-2"
						onClick={toggleSidebar}
					>
						<Menu className="h-6 w-6" />
					</Button>
				</div>
			) : (
				<div />
			)}
			<div className="ml-auto flex items-center gap-2">
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
							<Badge className="!bg-red-800" variant="dot">
								1
							</Badge>
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
						<Button variant="ghost" className="flex items-center gap-2 px-2">
							<Avatar className="h-8 w-8">
								<AvatarImage className="object-cover" src={user?.avatar} />
								<AvatarFallback>{user?.name[0]}</AvatarFallback>
							</Avatar>

							<div className="hidden flex-col items-baseline justify-start sm:flex max-w-24">
								<span className="text-sm font-medium">{user?.name}</span>
								<span className="text-xs text-muted-foreground w-full truncate ">
									{user?.email}
								</span>
							</div>
							<ChevronDown className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-56">
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<UserIcon className="mr-2 h-4 w-4" />
							<span>Profile</span>
						</DropdownMenuItem>
						<DropdownMenuItem>Settings</DropdownMenuItem>
						<DropdownMenuItem>Billing</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="text-destructive">
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}
