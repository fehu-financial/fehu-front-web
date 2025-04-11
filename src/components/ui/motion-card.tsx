"use client";
import * as LucideIcons from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type CardTheme = "primary" | "secondary" | "tertiary";

interface MotionCardProps {
	id: string;
	title: string;
	icon: string;
	items: string[];
	buttonText: string;
	href: string;
	theme: CardTheme;
	index?: number;
}

// Design system color tokens
const themeTokens: Record<
	CardTheme,
	{
		light: string;
		main: string;
		dark: string;
		contrastText: string;
		gradientFrom: string;
		gradientTo: string;
	}
> = {
	primary: {
		light: "bg-teal-50 dark:bg-teal-900/20",
		main: "text-teal-600 dark:text-teal-400",
		dark: "text-teal-700 dark:text-teal-300",
		contrastText: "text-white dark:text-teal-950",
		gradientFrom: "from-teal-400/80",
		gradientTo: "to-emerald-500/80",
	},
	secondary: {
		light: "bg-violet-50 dark:bg-violet-900/20",
		main: "text-violet-600 dark:text-violet-400",
		dark: "text-violet-700 dark:text-violet-300",
		contrastText: "text-white dark:text-violet-950",
		gradientFrom: "from-violet-400/80",
		gradientTo: "to-purple-500/80",
	},
	tertiary: {
		light: "bg-amber-50 dark:bg-amber-900/20",
		main: "text-amber-600 dark:text-amber-400",
		dark: "text-amber-700 dark:text-amber-300",
		contrastText: "text-white dark:text-amber-950",
		gradientFrom: "from-amber-400/80",
		gradientTo: "to-orange-500/80",
	},
};

export function MotionCard({
	id,
	title,
	icon,
	items,
	buttonText,
	href,
	theme,
	index = 0,
}: MotionCardProps) {
	const tokens = themeTokens[theme];

	// Animation variants
	const cardVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: "spring",
				stiffness: 260,
				damping: 20,
				delay: index * 0.1,
			},
		},
		hover: {
			y: -5,
			transition: {
				type: "spring",
				stiffness: 400,
				damping: 10,
			},
		},
	};

	const iconVariants = {
		initial: { scale: 1 },
		hover: { scale: 1.1, rotate: 5 },
		tap: { scale: 0.95 },
	};

	const listItemVariants = {
		hidden: { opacity: 0, x: -5 },
		visible: (i: number) => ({
			opacity: 1,
			x: 0,
			transition: {
				delay: 0.3 + index * 0.1 + i * 0.05,
				duration: 0.2,
			},
		}),
	};

	const buttonVariants = {
		initial: { scale: 1 },
		hover: { scale: 1.02 },
		tap: { scale: 0.98 },
	};

	const Icon = LucideIcons[
		icon as keyof typeof LucideIcons
	] as React.ComponentType<{ className?: string }>;

	return (
		<motion.div
			className="h-full"
			variants={cardVariants}
			initial="hidden"
			animate="visible"
			whileHover="hover"
			layout
		>
			<Card className="h-full flex flex-col shadow-md border-t-2 transition-all duration-300 relative overflow-hidden">
				{/* Gradient top border */}
				<div
					className={cn(
						"absolute inset-x-0 top-0 h-1 bg-gradient-to-r",
						tokens.gradientFrom,
						tokens.gradientTo,
					)}
				/>

				{/* Subtle background gradient */}
				<div
					className={cn(
						"absolute inset-0 opacity-5 bg-gradient-to-br",
						tokens.gradientFrom,
						tokens.gradientTo,
					)}
				/>

				<CardHeader className="pb-3 relative z-10">
					<div className="flex items-center justify-between">
						<CardTitle className="text-xl font-semibold tracking-tight">
							{title}
						</CardTitle>
						<motion.div
							className={cn("p-2 rounded-full", tokens.light)}
							variants={iconVariants}
							whileHover="hover"
							whileTap="tap"
						>
							<Icon className={cn("h-5 w-5", tokens.main)} />
						</motion.div>
					</div>
					<div className={cn("h-1 w-12 mt-2 rounded-full", tokens.light)} />
				</CardHeader>

				<CardContent className="flex-grow relative z-10">
					<ul className="space-y-3">
						{items.map((item, i) => (
							<motion.li
								key={`${id}-${item}`}
								className="flex items-start gap-2"
								custom={i}
								variants={listItemVariants}
								initial="hidden"
								animate="visible"
							>
								<div
									className={cn(
										"mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0",
										tokens.main,
									)}
								/>
								<span className="text-sm text-muted-foreground">{item}</span>
							</motion.li>
						))}
					</ul>
				</CardContent>

				<CardFooter className="pt-2 relative z-10">
					<Link href={href} className="w-full">
						<motion.div
							variants={buttonVariants}
							whileHover="hover"
							whileTap="tap"
						>
							<Button
								variant="outline"
								size="sm"
								className={cn(
									"w-full border transition-all duration-300 group",
									`hover:${tokens.light} hover:${tokens.dark} hover:border-current`,
								)}
							>
								<span>{buttonText}</span>
								<div
									className={cn(
										"absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 rounded-md transition-opacity duration-300",
										tokens.gradientFrom,
										tokens.gradientTo,
									)}
								/>
							</Button>
						</motion.div>
					</Link>
				</CardFooter>
			</Card>
		</motion.div>
	);
}
