import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { Pie, PieChart } from "recharts";

const chartData = [
	{ browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
	{ browser: "safari", visitors: 200, fill: "var(--color-safari)" },
	{ browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
	{ browser: "edge", visitors: 173, fill: "var(--color-edge)" },
	{ browser: "other", visitors: 190, fill: "var(--color-other)" },
];

const chartConfig = {
	visitors: {
		label: "Visitors",
	},
	chrome: {
		label: "Chrome",
		color: "hsl(var(--chart-1))",
	},
	safari: {
		label: "Safari",
		color: "hsl(var(--chart-2))",
	},
	firefox: {
		label: "Firefox",
		color: "hsl(var(--chart-3))",
	},
	edge: {
		label: "Edge",
		color: "hsl(var(--chart-4))",
	},
	other: {
		label: "Other",
		color: "hsl(var(--chart-5))",
	},
} satisfies ChartConfig;

export default function AllocationChart() {
	return (
		<ChartContainer config={chartConfig} className="mx-auto aspect-square h-[280px]">
			<PieChart margin={{ top: 15, left: -4, right: -4 }}>
				<ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
				<Pie
					data={chartData}
					label
					labelLine={false}
					dataKey="visitors"
					nameKey="browser"
					innerRadius={60}
					strokeWidth={5}
				/>
				<ChartLegend content={<ChartLegendContent nameKey="browser" />} className="mt-6" />
			</PieChart>
		</ChartContainer>
	);
}
