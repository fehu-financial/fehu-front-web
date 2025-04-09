"use client";

import { useLayout } from "@/hooks/use-layout";
import { cn } from "@/lib/utils";

type BodyProps = {
	className?: string;
	children: React.ReactNode;
};

export function Body({ children, className }: BodyProps) {
	const { isDarkMode } = useLayout();
	return (
		<body
			className={cn(
				"grid lg:grid-cols-[80px_1fr] grid-cols-1 grid-rows-[70px_1fr] h-full antialiased",
				isDarkMode ? "dark" : "light",
				className,
			)}
		>
			{children}
		</body>
	);
}
