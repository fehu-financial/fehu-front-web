"use client";

import {
	Bar,
	BarChart,
	Label,
	Rectangle,
	ReferenceLine,
	XAxis,
} from "recharts";

import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import React from "react";

const chartData = [
	{
		date: "2024-01-01",
		steps: 2000,
	},
	{
		date: "2024-01-02",
		steps: 2100,
	},
	{
		date: "2024-01-03",
		steps: 2200,
	},
	{
		date: "2024-01-04",
		steps: -1300,
	},
	{
		date: "2024-01-05",
		steps: 1400,
	},
	{
		date: "2024-01-06",
		steps: 2500,
	},
	{
		date: "2024-01-07",
		steps: 1600,
	},
	{
		date: "2024-01-03",
		steps: 2200,
	},
	{
		date: "2024-01-04",
		steps: -1300,
	},
	{
		date: "2024-01-05",
		steps: 1400,
	},
	{
		date: "2024-01-06",
		steps: 2500,
	},
	{
		date: "2024-01-07",
		steps: 1600,
	},
];

const chartConfig = {
	steps: {
		label: "Steps",
		color: "hsl(var(--chart-1))",
	},
} satisfies ChartConfig;

const ProfitChart = () => {
	return (
		<ChartContainer config={chartConfig} className="w-full h-[280px]">
			<BarChart
				accessibilityLayer
				margin={{
					top: 15,
					left: -4,
					right: -4,
				}}
				data={chartData}
			>
				<Bar
					dataKey="steps"
					fill="var(--color-steps)"
					radius={5}
					fillOpacity={0.6}
					activeBar={<Rectangle fillOpacity={0.8} />}
				/>
				<XAxis
					dataKey="date"
					tickLine={false}
					axisLine={false}
					tickMargin={4}
					tickFormatter={(value) => {
						return new Date(value).toLocaleDateString("pt-BR", {
							month: "short",
						});
					}}
				/>
				<ChartTooltip
					defaultIndex={2}
					content={
						<ChartTooltipContent
							hideIndicator
							labelFormatter={(value) => {
								return new Date(value).toLocaleDateString("pt-BR", {
									month: "short",
									year: "numeric",
								});
							}}
						/>
					}
					cursor={false}
				/>
				<ReferenceLine
					y={1200}
					stroke="hsl(var(--muted-foreground))"
					strokeDasharray="3 3"
					strokeWidth={1}
				>
					<Label
						position="insideBottomLeft"
						value="Average Steps"
						offset={10}
						fill="hsl(var(--foreground))"
					/>
					<Label
						position="insideTopLeft"
						value="12,343"
						className="text-lg"
						fill="hsl(var(--foreground))"
						offset={10}
						startOffset={100}
					/>
				</ReferenceLine>
			</BarChart>
		</ChartContainer>
	);
};

export default ProfitChart;
