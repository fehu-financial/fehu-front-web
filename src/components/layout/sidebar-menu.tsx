import { getMenuData } from "@/actions/get-menu";
import { SidebarMenu as SidebarMenuComponent } from "@/components/ui/sidebar";
import React from "react";
import { SidebarMenuItem } from "./sidebar-menu-item";

export function SidebarMenu() {
	const menu = React.use(getMenuData());

	return (
		<SidebarMenuComponent>
			{menu?.map((item) => (
				<SidebarMenuItem key={item.path} menu={item} />
			))}
		</SidebarMenuComponent>
	);
}
