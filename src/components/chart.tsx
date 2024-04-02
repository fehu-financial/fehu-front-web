import { ChartProvider } from "@/hooks/use-chart";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";
import React from "react";

interface ChartProps {
	provider: ChartProvider;
}

const Chart: React.FC<ChartProps> = ({ provider }) => {
	const { type, options, data } = provider;

	const ChartComponent = {
		line: ResponsiveLine,
		doughnut: ResponsivePie,
	}[type];

	return (
		<div className="w-full h-full p-4">
			<ChartComponent data={data} {...options} />
		</div>
	);
};

export default Chart;
