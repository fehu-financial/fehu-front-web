import type { Metadata } from "next";
import "./globals.css";
import { Body } from "@/components/layout/body";

export const metadata: Metadata = {
	title: "Fehu Finances",
	description: "Gerencie investimentos, despesas e tudo mais.",
};

type RootLayoutProps = {
	children: React.ReactNode;
};

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
	return (
		<html lang="en">
			<Body>{children}</Body>
		</html>
	);
}
