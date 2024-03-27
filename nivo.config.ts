import { ChartOptions } from "@/hooks/use-chart";
import colors from "tailwindcss/colors";
import theme from "tailwindcss/defaultTheme";

type NivoRC = ChartOptions["doughnut" | "line"];

const legends = [
	{
		anchor: "bottom",
		direction: "row",
		justify: false,
		translateX: 0,
		translateY: 56,
		itemsSpacing: 10,
		itemWidth: 100,
		itemHeight: 18,
		// itemTextColor: "#999",
		itemDirection: "left-to-right",
		itemOpacity: 0.75,
		symbolSize: 14,
		symbolShape: "circle",
		toggleSerie: true,
		symbolSpacing: 5,
		effects: [
			{
				on: "hover",
				style: {
					itemBackground: "rgba(0, 0, 0, .03)",
					itemOpacity: 1,
				},
			},
		],
	},
];

export const config: NivoRC = {
	colors: { scheme: "category10" },
	theme: {
		background: colors.transparent,
		text: {
			fontSize: 12,
			fill: colors.current,
			outlineWidth: 5,
			outlineColor: "accent",
		},

		axis: {
			domain: {
				line: {
					stroke: "#fff",
					strokeWidth: 0,
				},
			},
			legend: {
				text: {
					fontSize: 25,
					fill: "#fff",
					outlineWidth: 0,
					outlineColor: "transparent",
				},
			},
			ticks: {
				line: {
					stroke: "#fff",
					strokeWidth: 0,
				},
				text: {
					fontSize: 12,
					fill: "#fff",
					outlineWidth: 0,
					outlineColor: "transparent",
				},
			},
		},
		grid: {
			line: {
				stroke: "hsl(250, 100%, 100%, 0.2)",
				strokeWidth: 1,
			},
		},
		legends: {
			hidden: { text: { fill: "#FFF", outlineColor: "#FFF" }, symbol: { opacity: 1, fill: "#333" } },
			title: {
				text: {
					fontSize: 16,
					fill: "#fff",
					outlineWidth: 0,
					outlineColor: "transparent",
				},
			},
			text: {
				fontSize: 14,
				fill: "#fff",
				outlineWidth: 0,
				outlineColor: "transparent",
			},
			ticks: {
				line: {},
				text: {
					fontSize: 20,
					fill: "#fff",
					outlineWidth: 0,
					outlineColor: "transparent",
				},
			},
		},
		annotations: {
			text: {
				fontSize: 13,
				fill: "#fff",
				outlineWidth: 2,
				outlineColor: "#ffffff",
				outlineOpacity: 1,
			},
			link: {
				stroke: "#000000",
				strokeWidth: 1,
				outlineWidth: 2,
				outlineColor: "#ffffff",
				outlineOpacity: 1,
			},
			outline: {
				stroke: "#000000",
				strokeWidth: 2,
				outlineWidth: 2,
				outlineColor: "#ffffff",
				outlineOpacity: 1,
			},
			symbol: {
				fill: "#000000",
				outlineWidth: 2,
				outlineColor: "#ffffff",
				outlineOpacity: 1,
			},
		},
		tooltip: {
			container: {
				background: "rgba(0, 0, 0, 0.7)",
				color: "#fff",
				fontSize: 14,
			},
			basic: {},
			chip: {},
			table: {},
			tableCell: {},
			tableCellValue: {},
		},
		crosshair: {
			line: {
				stroke: "#fff",
				strokeWidth: 1,
				strokeOpacity: 0.5,
			},
		},
	},
	doughnut: {
		innerRadius: 0.6,
		padAngle: 0.7,
		cornerRadius: 3,
		activeOuterRadiusOffset: 8,
		borderWidth: 1,
		borderColor: {
			from: "color",
			modifiers: [["darker", 0.2]],
		},
		enableArcLinkLabels: false,
		arcLabelsSkipAngle: 10,
		legends,
	},
	line: {
		xScale: { type: "point" },
		yScale: {
			type: "linear",
			min: "auto",
			max: "auto",
			stacked: false,
			reverse: false,
		},
		// yFormat: ">-.2f",
		axisTop: null,
		axisRight: null,
		axisBottom: {
			tickSize: 5,
			tickPadding: 5,
			tickRotation: 0,
			legendOffset: 36,
			legendPosition: "middle",
			truncateTickAt: 0,
		},
		axisLeft: {
			tickSize: 5,
			tickPadding: 5,
			tickRotation: 0,
			legendOffset: -40,
			legendPosition: "middle",
			truncateTickAt: 0,
		},
		pointSize: 5,
		pointColor: { theme: "background" },
		pointBorderWidth: 2,
		pointBorderColor: { from: "serieColor" },
		pointLabelYOffset: -12,
		enableTouchCrosshair: true,
		useMesh: true,
		enableGridX: false,
		enableGridY: false,
		enableSlices: "x",
		enableCrosshair: true,
		legends,
	},
};
