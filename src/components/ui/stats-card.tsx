"use client";

import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";

type StatsCardProps = {
	title: string;
	value: string | number | React.ReactNode;
	icon: React.ComponentType<{ className?: string }>;
	description: string;
	change?: number;
} & React.HTMLAttributes<HTMLDivElement>;

const StatsCard = React.forwardRef<typeof Card, StatsCardProps>(
	({ title, description, change, value, className, ...props }, ref) => {
		const changeColor =
			!!change && change > 0 ? "text-green-400" : "text-red-400";
		return (
			<Card className={className}>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-md font-medium">{title}</CardTitle>
					{props.icon && (
						<props.icon className="h-5 w-5 text-muted-foreground" />
					)}
				</CardHeader>
				<CardContent className="text-2xl font-bold pb-2">{value}</CardContent>
				<CardFooter>
					<p className="text-sm leading-none font-normal text-muted-foreground">
						{change && <span className={changeColor}>↑ {change}%</span>}{" "}
						{description}
					</p>
				</CardFooter>
			</Card>
		);
	},
);

export default StatsCard;
