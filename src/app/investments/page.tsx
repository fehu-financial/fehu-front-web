"use client";

import Chart from "@/components/chart";
import { NavLink } from "@/components/nav-link";
import ChartCard from "@/components/stats-chart";
import { SummaryStats } from "@/components/summary-stats";
import useChart from "@/hooks/use-chart";
import { CircleDollarSign, TrendingUp } from "lucide-react";

export default function InvestmentsPage() {
	const data1 = [
		{
			id: "fixed",
			label: "Renda Fixa",
			value: 150094,
			color: "#FFF",
		},
		{
			id: "variable",
			label: "Renda Variável",
			value: 35098,
		},
	];

	const data = [
		{
			id: "Carteira de Investimentos",
			data: [
				{ x: "Jan 2023", y: 1.5 },
				{ x: "Fev 2023", y: -0.8 },
				{ x: "Mar 2023", y: 2.2 },
				{ x: "Abr 2023", y: 0.3 },
				{ x: "Mai 2023", y: 1.0 },
				{ x: "Jun 2023", y: -0.5 },
				{ x: "Jul 2023", y: 1.2 },
				{ x: "Ago 2023", y: 0.7 },
				{ x: "Set 2023", y: 0.9 },
				{ x: "Out 2023", y: -0.3 },
				{ x: "Nov 2023", y: 1.8 },
				{ x: "Dez 2023", y: 0.6 },
				{ x: "Jan 2024", y: -0.2 },
				{ x: "Fev 2024", y: 1.3 },
				{ x: "Mar 2024", y: 0.4 },
			],
		},
		{
			id: "Ibovespa",
			data: [
				{ x: "Jan 2023", y: 2.1 },
				{ x: "Fev 2023", y: -1.2 },
				{ x: "Mar 2023", y: 1.8 },
				{ x: "Abr 2023", y: 0.5 },
				{ x: "Mai 2023", y: 0.9 },
				{ x: "Jun 2023", y: -0.7 },
				{ x: "Jul 2023", y: 1.5 },
				{ x: "Ago 2023", y: 0.3 },
				{ x: "Set 2023", y: 1.2 },
				{ x: "Out 2023", y: -0.4 },
				{ x: "Nov 2023", y: 2.5 },
				{ x: "Dez 2023", y: 0.8 },
				{ x: "Jan 2024", y: -0.3 },
				{ x: "Fev 2024", y: 1.0 },
				{ x: "Mar 2024", y: 0.6 },
			],
		},
		{
			id: "IPCA",
			data: [
				{ x: "Jan 2023", y: 0.7 },
				{ x: "Fev 2023", y: 0.8 },
				{ x: "Mar 2023", y: 0.6 },
				{ x: "Abr 2023", y: 0.5 },
				{ x: "Mai 2023", y: 0.4 },
				{ x: "Jun 2023", y: 0.3 },
				{ x: "Jul 2023", y: 0.2 },
				{ x: "Ago 2023", y: 0.4 },
				{ x: "Set 2023", y: 0.5 },
				{ x: "Out 2023", y: 0.6 },
				{ x: "Nov 2023", y: 0.7 },
				{ x: "Dez 2023", y: 0.8 },
				{ x: "Jan 2024", y: 0.9 },
				{ x: "Fev 2024", y: 0.7 },
				{ x: "Mar 2024", y: 0.6 },
			],
		},
	];

	const portfolioChart = useChart("doughnut", data1, {
		margin: { top: 10, right: 10, bottom: 60, left: 10 },
	});
	const propertyChart = useChart("line", data, {
		margin: { top: 10, right: 20, bottom: 60, left: 40 },
	});

	return (
		<div className="space-y-8">
			<div className="flex flex-row flex-wrap items-stretch justify-center space-x-4 w-full max-lg:space-y-4 max-lg:space-x-0">
				<ChartCard className="flex-2 min-w-80 max-lg:w-full" title="Carteira">
					<Chart provider={portfolioChart} />
				</ChartCard>
				<ChartCard className="flex-1 min-w-96 w-full" title="Evolução Patrimônio">
					<Chart provider={propertyChart} />
				</ChartCard>
			</div>
			<div className="flex flex-row max-sm:flex-wrap items-stretch justify-center space-x-4 w-full max-sm:space-y-4 max-sm:space-x-0">
				<SummaryStats
					title="Patrimônio Investido"
					icon={CircleDollarSign}
					value={10000}
					stats={{ percent: 28, text: "from last month" }}
				/>
				<SummaryStats
					title="Rentabilidade"
					icon={TrendingUp}
					value={10000000}
					stats={{ percent: -5, text: "from last month" }}
				/>
			</div>
			<div className="space-y-4">
				<NavLink title="Renda Variável" subtitle="Ações, BDRs, ETFs, Fundos, etc." href="variable-income" />
				<NavLink title="Renda Fixa" subtitle="CDBs, LCIs, LCAs e Tesouro Direto, etc." href="fixed-income" />
			</div>
		</div>
	);
}
