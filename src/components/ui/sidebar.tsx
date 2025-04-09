import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/core/lib/utils";
import type { LucideIcon } from "lucide-react";
import React from "react";
import { ScrollArea } from "./scroll-area";

const Sidebar = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(({ className, children }, ref) => (
	<aside className="hidden lg:flex flex-col items-center w-20 bg-background border-r">
		<ScrollArea className="flex-1 w-full">
			<nav className="flex flex-col items-center gap-4 py-4">{children}</nav>
		</ScrollArea>
	</aside>
));

Sidebar.displayName = "Sidebar";

const SidebarSection = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ title, children }, ref) => (
		<div className="px-3 py-2">
			<h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">{title}</h2>
			<div className="space-y-1" ref={ref}>
				{children}
			</div>
		</div>
	),
);

SidebarSection.displayName = "SidebarSection";

const SidebarMenu = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ children }, ref) => (
	<div className="space-y-6" ref={ref}>
		{children}
	</div>
));

SidebarMenu.displayName = "SidebarMenu";

export interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLButtonElement>, ButtonProps {
	icon?: LucideIcon;
}

const SidebarMenuItem = React.forwardRef<HTMLButtonElement, SidebarMenuItemProps>(
	({ title, icon: Icon, variant, ...props }, ref) => (
		<Button variant={variant || "ghost"} className="w-full justify-start" ref={ref} {...props}>
			{Icon && <Icon className="m-2 h-6 w-6" />}
			{/* {title} */}
		</Button>
	),
);

SidebarMenuItem.displayName = "SidebarMenuItem";

export { Sidebar, SidebarSection, SidebarMenu, SidebarMenuItem };
