"use client";

import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type ChartCardProps = {
	title?: string;
	children: React.ReactNode;
	className?: HTMLAttributes<HTMLDivElement>["className"];
};

function ChartCard({ title, children, className }: ChartCardProps) {
	return (
		<Card className={cn("", className)}>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
			</CardHeader>
			<CardContent className="p-4 pt-0 w-full h-64">{children}</CardContent>
		</Card>
	);
}

export default ChartCard;
