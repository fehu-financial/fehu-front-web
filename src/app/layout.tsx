import "./globals.css";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { SideNav } from "@/components/layout/sidenav";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Fehu Finances",
	description: "Gerencie investimentos, despesas e tudo mais.",
};

type RootLayoutInput = {
	children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutInput) {
	return (
		<html lang="en" className="dark">
			<body
				className={cn("grid grid-cols-[80px,1fr] grid-rows-[80px,1fr] gap-2 h-screen antialiased", inter.className)}
			>
				<SideNav />
				<Header />
				<Main>{children}</Main>
			</body>
		</html>
	);
}
