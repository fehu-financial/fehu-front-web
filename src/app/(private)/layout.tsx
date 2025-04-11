import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import "../globals.css";
import { AppSidebar as Sidebar } from "@/components/layout/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

type RootLayoutProps = {
	children: React.ReactNode;
};

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
	return (
		<SidebarProvider>
			<Sidebar />
			<SidebarInset>
				<Header />
				<Main>{children}</Main>
			</SidebarInset>
		</SidebarProvider>
	);
}
