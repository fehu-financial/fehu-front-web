"use client";

import { Card } from "@/components/ui/card";
import {
	ArrowDownRight,
	ArrowUpRight,
	Banknote,
	Building2,
	CreditCard as CreditCardIcon,
	TrendingUp,
} from "lucide-react";
import type { WalletStats as WalletStatsType } from "../lib/types";

interface WalletStatsProps {
	stats: Pick<WalletStatsType, "totalBalance" | "totalCards" | "totalAccounts">;
}

const StatCard = ({
	title,
	value,
	trend,
	trendValue,
	icon: Icon,
	gradient,
}: {
	title: string;
	value: string | number;
	trend: "up" | "down";
	trendValue: string;
	icon: React.ComponentType<{ className?: string }>;
	gradient: string;
}) => (
	<Card className={`${gradient} p-6 text-white border-0`}>
		<div className="flex items-center justify-between">
			<div>
				<p className="text-white/80 text-sm font-medium">{title}</p>
				<p className="text-2xl font-bold mt-1">{value}</p>
			</div>
			<div className="p-3 bg-white/20 rounded-full">
				<Icon className="h-6 w-6" />
			</div>
		</div>
		<div className="flex items-center mt-4 text-white/80">
			{trend === "up" ? (
				<TrendingUp className="h-4 w-4 mr-1" />
			) : (
				<ArrowDownRight className="h-4 w-4 mr-1" />
			)}
			<span className="text-sm">{trendValue}</span>
		</div>
	</Card>
);

export function WalletStats({ stats }: WalletStatsProps) {
	const { totalBalance, totalCards, totalAccounts } = stats;

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
			<StatCard
				title="Saldo Total"
				value={new Intl.NumberFormat("pt-BR", {
					style: "currency",
					currency: "BRL",
				}).format(totalBalance)}
				trend="up"
				trendValue="+12.5% este mês"
				icon={Banknote}
				gradient="bg-gradient-to-r from-blue-600 to-blue-700"
			/>

			<StatCard
				title="Cartões Ativos"
				value={totalCards}
				trend="up"
				trendValue="2 novos este mês"
				icon={CreditCardIcon}
				gradient="bg-gradient-to-r from-emerald-600 to-emerald-700"
			/>

			<StatCard
				title="Contas Bancárias"
				value={totalAccounts}
				trend="down"
				trendValue="1 conta adicionada"
				icon={Building2}
				gradient="bg-gradient-to-r from-purple-600 to-purple-700"
			/>
		</div>
	);
}
