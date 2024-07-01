import { LineProps, LineSvgProps } from "@nivo/line";
import { DataProps, DefaultRawDatum, MayHaveLabel, PieSvgProps } from "@nivo/pie";
import { config, doughnut, line } from "nivo.config";
import { useEffect, useState } from "react";

const { colors, theme } = config;

export type ChartType = "line" | "doughnut";

export type ChartData = {
	line: LineProps["data"];
	doughnut: DataProps<DefaultRawDatum & MayHaveLabel>["data"];
};

export type ChartOptions = {
	line: Omit<LineSvgProps, "width" | "height" | "data">;
	doughnut: Omit<PieSvgProps<DefaultRawDatum & MayHaveLabel>, "width" | "height" | "data">;
};

export type ChartProvider = {
	type: ChartType;
	data: ChartData[ChartType];
	options: ChartOptions[ChartType];
};

const useChart = (type: ChartType, data: ChartData[typeof type], options: ChartOptions[typeof type]) => {
	const [chartState, setChartState] = useState<ChartProvider>({ type, data, options: { theme, colors, ...options } });

	useEffect(() => {
		switch (type) {
			case "line":
				setChartState((prev) => ({
					...prev,
					options: { ...prev.options, ...line } as ChartOptions["line"],
				}));
				break;
			case "doughnut":
				setChartState((prev) => ({
					...prev,
					options: { ...prev.options, ...doughnut } as ChartOptions["doughnut"],
				}));
				break;
		}
	}, [type]);

	return { ...chartState };
};

export default useChart;
