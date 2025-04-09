"use client";

import ChartCard from "@/components/ui/chart-card";
import { LinkCard } from "@/components/ui/link-card";
import PeriodFilter from "@/components/ui/period-filter";
import StatsCard from "@/components/ui/stats-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Formatter from "@/core/lib/formatter";
import { AlertTriangleIcon, DollarSignIcon, LineChartIcon, PieChart, TrendingUpIcon } from "lucide-react";
import AllocationChart from "./components/allocation-chart";
import PortfolioChart from "./components/portfolio-chart";
import ProfitChart from "./components/profit-chart";

export default function InvestmentDashboard() {
	return (
		<div className="min-h-full p-6 overflow-auto scrollbar-hide">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold dark:text-white">Investimentos</h1>
				<PeriodFilter defaultValue="1W" width="180px" />
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 w-full">
				<StatsCard
					title="Total Investido"
					value={Formatter.currency(128560)}
					icon={DollarSignIcon}
					change={12.5}
					description="from last month"
				/>
				<StatsCard
					title="Total Lucro"
					value={Formatter.currency(28560)}
					icon={TrendingUpIcon}
					change={3.2}
					description="from last month"
				/>
				<StatsCard
					title="Risco de Investimento"
					value={<span className="text-yellow-500">Moderado</span>}
					icon={AlertTriangleIcon}
					description="Baseado na alocação atual"
				/>
				<ChartCard title="Diversificação da Carteira" icon={PieChart}>
					<AllocationChart />
				</ChartCard>
				<ChartCard className="col-span-2" title="Desempenho da Carteira" icon={LineChartIcon}>
					<Tabs defaultValue="profit" className="w-full">
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="profit">Rentabilidade</TabsTrigger>
							<TabsTrigger value="performance">Desempenho</TabsTrigger>
						</TabsList>
						<TabsContent value="performance">
							<PortfolioChart />
						</TabsContent>
						<TabsContent value="profit">
							<ProfitChart />
						</TabsContent>
					</Tabs>
				</ChartCard>
				<div className="col-span-3 flex space-x-4">
					<LinkCard title="Renda Variável" subtitle="Ações, BDRs, ETFs, Fundos, etc." href="variable-income" />
					<LinkCard title="Renda Fixa" subtitle="CDBs, LCIs, LCAs e Tesouro Direto, etc." href="fixed-income" />
				</div>
			</div>
		</div>
	);
}
