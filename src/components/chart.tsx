import type { ChartData, ChartOptions, ChartProvider } from "@/lib/hooks/use-chart";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";
import type React from "react";

interface ChartProps {
	provider: ChartProvider;
}

const Chart: React.FC<ChartProps> = ({ provider }) => {
	const { type, options, data } = provider;

	const ChartComponent = {
		line: <ResponsiveLine data={data as ChartData["line"]} {...(options as ChartOptions["line"])} />,
		doughnut: <ResponsivePie data={data as ChartData["doughnut"]} {...(options as ChartOptions["doughnut"])} />,
	}[type];

	return <div className="w-full h-full p-4">{ChartComponent}</div>;
};

export default Chart;
