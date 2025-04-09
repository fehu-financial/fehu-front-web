"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartData = [
	{ month: "January", desktop: 186 },
	{ month: "February", desktop: 305 },
	{ month: "March", desktop: 237 },
	{ month: "April", desktop: 73 },
	{ month: "May", desktop: 209 },
	{ month: "June", desktop: 214 },
	{ month: "July", desktop: 173 },
	{ month: "August", desktop: 509 },
	{ month: "September", desktop: 214 },
	{ month: "October", desktop: 173 },
	{ month: "November", desktop: 409 },
	{ month: "December", desktop: 214 },
];
const chartConfig = {
	desktop: {
		label: "Desktop",
		color: "hsl(var(--chart-1))",
	},
} satisfies ChartConfig;

const PortfolioChart = () => {
	return (
		<ChartContainer className="h-[280px] w-full" config={chartConfig}>
			<LineChart
				accessibilityLayer
				data={chartData}
				margin={{
					top: 15,
					left: 10,
					right: 10,
				}}
			>
				<CartesianGrid vertical={false} />
				<XAxis
					dataKey="month"
					tickLine={false}
					axisLine={false}
					tickMargin={8}
					tickFormatter={(value) => value.slice(0, 3)}
				/>
				<ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
				<Line
					dataKey="desktop"
					type="natural"
					stroke="var(--color-desktop)"
					strokeWidth={2}
					dot={{
						fill: "var(--color-desktop)",
					}}
					activeDot={{
						r: 6,
					}}
				/>
			</LineChart>
		</ChartContainer>
	);
};

export default PortfolioChart;
