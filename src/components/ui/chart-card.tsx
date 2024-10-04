"use client";

import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";

type ChartCardProps = {
	title: string;
	icon: React.ComponentType<{ className?: string }>;
	description?: string;
	change?: number;
} & React.HTMLAttributes<HTMLDivElement>;

const ChardCard = React.forwardRef<typeof Card, ChartCardProps>(
	({ title, description, change, children, className, ...props }, ref) => {
		const changeColor =
			!!change && change > 0 ? "text-green-400" : "text-red-400";
		return (
			<Card className={className}>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-lg font-medium">{title}</CardTitle>
					{props.icon && (
						<props.icon className="h-5 w-5 text-muted-foreground" />
					)}
				</CardHeader>
				<CardContent className="pb-2">{children}</CardContent>
				<CardFooter>
					<p className="text-sm leading-none font-medium text-muted-foreground">
						{change && <span className={changeColor}>↑ {change}%</span>}{" "}
						{description}
					</p>
				</CardFooter>
			</Card>
		);
	},
);

export default ChardCard;
