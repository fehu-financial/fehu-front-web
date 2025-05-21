"use client";

import { useLayout } from "@/hooks/use-layout";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

type BodyProps = {
	className?: string;
	children: React.ReactNode;
};

export function Body({ children, className }: BodyProps) {
	const { isDarkMode } = useLayout();

	return (
		<Providers>
			<body
				className={cn(
					inter.variable,
					"h-full antialiased",
					isDarkMode ? "dark" : "light",
					className,
				)}
			>
				{children}
			</body>
		</Providers>
	);
}
