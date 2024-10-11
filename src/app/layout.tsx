import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Body } from "@/components/layout/body";
import { Sidebar } from "@/components/layout/sidebar";
import { LayoutProvider } from "@/context/layout";

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
		<html lang="en">
			<LayoutProvider>
				<Body className={inter.className}>
					<Sidebar className="row-span-2" />
					<Header className="col-span-1" />
					<Main>{children}</Main>
				</Body>
			</LayoutProvider>
		</html>
	);
}
