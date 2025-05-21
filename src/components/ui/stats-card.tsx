"use client";

import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import type React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";

type StatsCardProps = {
	title: string;
	value: string | number | React.ReactNode;
	icon: React.ComponentType<{ className?: string }>;
	description: string;
	change?: number;
} & React.HTMLAttributes<HTMLDivElement>;

const StatsCard: React.FC<StatsCardProps> = ({
	title,
	description,
	change,
	value,
	className,
	icon: Icon,
	...props
}) => {
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
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 10 },
		visible: (i: number) => ({
			opacity: 1,
			y: 0,
			transition: {
				delay: 0.1 + i * 0.1,
				duration: 0.3,
			},
		}),
	};
	const changeColor =
		change && change > 0 ? "text-emerald-500" : "text-red-500";

	return (
		<motion.div
			variants={cardVariants}
			initial="hidden"
			animate="visible"
			className="flex w-full h-full"
		>
			<Card
				className={cn("flex-1 overflow-hidden border shadow-sm", className)}
				{...props}
			>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-md font-medium">{title}</CardTitle>
					{Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
				</CardHeader>
				<CardContent className="text-2xl font-bold pb-2">
					<motion.div custom={0} variants={itemVariants} className="space-y-2">
						{value}
					</motion.div>
				</CardContent>
				<CardFooter>
					<p className="text-sm leading-none font-normal text-muted-foreground flex items-center">
						{typeof change === "number" ? (
							<>
								{change >= 0 ? (
									<ArrowUpRight className={`w-3 h-3 mr-1 ${changeColor}`} />
								) : (
									<ArrowDownRight className={`w-3 h-3 mr-1 ${changeColor}`} />
								)}
								<span className={changeColor}>{Math.abs(change)}%</span>
								<span className="ml-1">{description}</span>
							</>
						) : (
							description
						)}
					</p>
				</CardFooter>
			</Card>
		</motion.div>
	);
};

export default StatsCard;
