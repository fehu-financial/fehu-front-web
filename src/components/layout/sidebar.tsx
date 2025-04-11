import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";
import { SidebarMenu } from "./sidebar-menu";

export async function AppSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar
			collapsible="offcanvas"
			className="!w-[calc(var(--sidebar-width-icon)_+_20px)] !bg-background border-r"
		>
			<SidebarHeader>
				<div className="flex aspect-square size-14 items-center justify-center rounded-lg text-sidebar-primary-foreground mt-2">
					<Image
						className="dark:invert mx-auto my-4"
						src="/fehu-logo.svg"
						alt="Fehu Logo"
						width={20}
						height={20}
					/>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent className="px-1.5 md:px-0">
						<Suspense
							fallback={
								<div className="space-y-4">
									<Skeleton className="h-12 w-full" />
									<Skeleton className="h-12 w-full" />
									<Skeleton className="h-12 w-full" />
									<Skeleton className="h-12 w-full" />
									<Skeleton className="h-12 w-full" />
									<Skeleton className="h-12 w-full" />
								</div>
							}
						>
							<SidebarMenu />
						</Suspense>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
