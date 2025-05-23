import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Body } from "@/components/layout/body";

export const metadata: Metadata = {
	title: "Fehu Financial",
	description:
		"Gerencie investimentos, despesas e tudo mais com Fehu Financial",
	keywords: [
		"finanças",
		"investimentos",
		"despesas",
		"controle financeiro",
		"PWA",
	],
	authors: [{ name: "Igor Souza", url: "https://github.com/igorssk" }],
	creator: "Igor Souza",
	metadataBase: new URL(
		process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
	),
	openGraph: {
		title: "Fehu Financial",
		description: "Gerencie investimentos, despesas e tudo mais",
		type: "website",
		locale: "pt_BR",
		siteName: "Fehu Financial",
	},
	twitter: {
		card: "summary_large_image",
		title: "Fehu Financial",
		description: "Gerencie investimentos, despesas e tudo mais",
	},
	appleWebApp: {
		capable: true,
		statusBarStyle: "default",
		title: "Fehu Financial",
	},
	formatDetection: {
		telephone: false,
	},
	other: {
		"mobile-web-app-capable": "yes",
		"apple-mobile-web-app-capable": "yes",
		"apple-mobile-web-app-status-bar-style": "default",
		"apple-mobile-web-app-title": "Fehu Financial",
		"application-name": "Fehu Financial",
		"msapplication-TileColor": "#000000",
		"theme-color": "#000000",
	},
};

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#ffffff" },
		{ media: "(prefers-color-scheme: dark)", color: "#000000" },
	],
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
};

type RootLayoutProps = {
	children: React.ReactNode;
};

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
	return (
		<html lang="pt-BR">
			<head>
				<link rel="icon" href="/favicon.ico" sizes="any" />
				<link
					rel="icon"
					href="/icon-192x192.png"
					type="image/png"
					sizes="192x192"
				/>
				<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
				<meta name="theme-color" content="#000000" />
			</head>
			<Body>{children}</Body>
		</html>
	);
}
