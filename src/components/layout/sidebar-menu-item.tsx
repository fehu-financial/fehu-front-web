"use client";

import type { MenuItem } from "@/actions/get-menu";
import {
	SidebarMenuButton,
	SidebarMenuItem as SidebarMenuItemComponent,
} from "@/components/ui/sidebar";
import * as LucideIcons from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export function SidebarMenuItem({ menu }: { menu: MenuItem }) {
	const pathname = usePathname();
	const router = useRouter();

	const Icon = LucideIcons[
		menu.icon as keyof typeof LucideIcons
	] as React.ComponentType<{ size?: number }>;

	const handleRedirect = () => {
		if (menu.access) router.push(menu.path);
	};

	return (
		<SidebarMenuItemComponent>
			<SidebarMenuButton
				tooltip={{
					children: menu.label,
					hidden: false,
				}}
				isActive={pathname === menu.path}
				className="px-2.5 md:px-3 [&>svg]:size-6"
				size="lg"
				disabled={!menu.access}
				onClick={handleRedirect}
			>
				{/* <a href={menu.path} className="flex items-center"> */}
				{Icon && <Icon size={12} />}
				<span className="lg:hidden ml-2">{menu.label}</span>
				{/* </a> */}
			</SidebarMenuButton>
			{!menu.access && (
				<LucideIcons.Lock
					size={14}
					className="absolute bottom-1 right-1 text-amber-600 dark:text-amber-400"
				/>
			)}
		</SidebarMenuItemComponent>
	);
}
