import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { Navigation } from "@/components/layout/navigation";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
	title: "Fehu Finances",
	description: "Gerencie investimentos, despesas e tudo mais.",
};

type RootLayoutProps = {
	children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="en" className="dark">
			<body
				className={cn(
					"grid grid-cols-[80px,1fr] grid-rows-[80px,1fr] gap-2 h-screen antialiased",
					inter.className,
				)}
			>
				<Navigation />
				<Header />
				<Main>{children}</Main>
			</body>
		</html>
	);
}
