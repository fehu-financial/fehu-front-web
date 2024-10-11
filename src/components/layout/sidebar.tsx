"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLayout } from "@/hooks/use-layout";
import { cn } from "@/lib/utils";
import {
	Bell,
	CreditCard,
	LayoutDashboard,
	PieChart,
	Target,
	TrendingUp,
	Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Sheet, SheetContent } from "../ui/sheet";

interface NavigationItemProps {
	icon: React.ReactNode;
	label: string;
	path: string;
	isActive?: boolean;
	onClick: () => void;
}

const NavigationItem = ({
	icon,
	label,
	path,
	isActive,
	onClick,
}: NavigationItemProps) => (
	<TooltipProvider>
		<Tooltip>
			<TooltipTrigger asChild>
				<Link key={label} href={path} passHref>
					<Button
						variant={isActive ? "secondary" : "ghost"}
						size="icon"
						className={cn("h-12 w-12", isActive && "bg-muted hover:bg-muted")}
						onClick={onClick}
						aria-label={label}
					>
						{icon}
						<span className="ml-2 lg:hidden">{label}</span>
					</Button>
				</Link>
			</TooltipTrigger>
			<TooltipContent side="right">
				<p>{label}</p>
			</TooltipContent>
		</Tooltip>
	</TooltipProvider>
);

interface SidebarProps {
	className?: string;
}

export function Sidebar({ className }: SidebarProps) {
	const { isMobileSidebarOpen, toggleMobileSidebar } = useLayout();
	const [activeItem, setActiveItem] = useState("Overview");

	const navItems = useMemo(
		() => [
			{ icon: <LayoutDashboard size={24} />, label: "Overview", path: "/" },
			{
				icon: <TrendingUp size={24} />,
				label: "Investments",
				path: "/investments",
			},
			{ icon: <CreditCard size={24} />, label: "Expenses", path: "/expenses" },
			{ icon: <Target size={24} />, label: "Goals", path: "/goals" },
			{ icon: <PieChart size={24} />, label: "Budget", path: "/budget" },
			{ icon: <Wallet size={24} />, label: "Savings", path: "/savings" },
			{ icon: <Bell size={24} />, label: "Alerts", path: "/alerts" },
		],
		[],
	);

	const handleNavItemClick = useCallback(
		(label: string) => setActiveItem(label),
		[],
	);

	return (
		<>
			{/* Sidebar for larger screens */}
			<aside
				className={cn(
					className,
					"h-full hidden lg:flex flex-col items-center w-20 border-r",
				)}
			>
				<ScrollArea className="flex-1 w-full">
					<Image
						className="dark:invert mx-auto my-4"
						src="/fehu-logo.svg"
						alt="Fehu Logo"
						width={20}
						height={20}
					/>
					<nav className="flex flex-col items-center gap-4 py-4">
						{navItems.map((item) => (
							<NavigationItem
								key={item.label}
								icon={item.icon}
								label={item.label}
								path={item.path}
								isActive={activeItem === item.label}
								onClick={() => handleNavItemClick(item.label)}
							/>
						))}
					</nav>
				</ScrollArea>
			</aside>

			{/* Mobile menu */}
			<Sheet open={isMobileSidebarOpen} onOpenChange={toggleMobileSidebar}>
				<SheetContent side="left" className="w-[300px] sm:w-[400px]">
					<nav className="flex flex-col gap-4 py-4">
						{navItems.map((item) => (
							<Link key={item.label} href={item.path} passHref>
								<Button
									variant={activeItem === item.label ? "secondary" : "ghost"}
									className="w-full justify-start"
									onClick={() => {
										setActiveItem(item.label);
										toggleMobileSidebar();
									}}
								>
									{item.icon}
									<span className="ml-2">{item.label}</span>
								</Button>
							</Link>
						))}
					</nav>
				</SheetContent>
			</Sheet>
		</>
	);
}
