"use client";

import { CandlestickChart, CreditCard, Landmark, LayoutDashboard, PiggyBank } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { Sidebar, SidebarMenu, SidebarMenuItem } from "../ui/sidebar";

export function SideNav() {
	const router = useRouter();

	const handleRedirect = useCallback((path: string) => router.push(path), [router]);

	return (
		<Sidebar className="row-span-2 w-20 h-full">
			<div className="flex items-center px-7 mb-10">
				<Image className="dark:invert" src="/fehu-logo.svg" alt="" width={16} height={26} />
			</div>
			<SidebarMenu>
				<SidebarMenuItem icon={LayoutDashboard} onClick={() => handleRedirect("/home")} />
				<SidebarMenuItem icon={PiggyBank} onClick={() => handleRedirect("/investments")} />
				<SidebarMenuItem icon={Landmark} onClick={() => handleRedirect("/investments/fixed-income")} />
				<SidebarMenuItem icon={CreditCard} />
			</SidebarMenu>
		</Sidebar>
	);
}
