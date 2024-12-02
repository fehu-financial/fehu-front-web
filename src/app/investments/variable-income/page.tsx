"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import StatsCard from "@/components/ui/stats-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Formatter from "@/lib/formatter";
import {
	DollarSignIcon,
	Table,
	TrendingDown,
	TrendingUp,
	TrendingUpDownIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { DataTable } from "../../../components/ui/data-table/data-table";
import columns from "./components/columns";

import {
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { z } from "zod";
import GoalBar from "./components/goal";

export const AssetSchema = z.object({
	id: z.string(),
	name: z.string(),
	position: z.number(),
	allocation: z.number(),
	profitability: z.number(),
	averagePrice: z.number(),
	lastPrice: z.number(),
	lastUpdatePeriod: z.string(),
	totalQuantity: z.number(),
	projectedGainLoss: z.number(),
	stopLoss: z.number(),
	sector: z.string(),
});

export type Asset = z.infer<typeof AssetSchema>;

const d_assets: Asset[] = [
	{
		id: "1",
		name: "PETR4",
		position: 10000,
		allocation: 15,
		profitability: 5.2,
		averagePrice: 28.5,
		lastPrice: 30.2,
		lastUpdatePeriod: "5min",
		totalQuantity: 350,
		projectedGainLoss: 595,
		stopLoss: 27.0,
		sector: "Oil & Gas",
	},
	{
		id: "2",
		name: "VALE3",
		position: 15000,
		allocation: 22,
		profitability: -2.1,
		averagePrice: 68.3,
		lastPrice: 66.9,
		lastUpdatePeriod: "2min",
		totalQuantity: 220,
		projectedGainLoss: -308,
		stopLoss: 65.0,
		sector: "Mining",
	},
	{
		id: "3",
		name: "ITUB4",
		position: 8000,
		allocation: 12,
		profitability: 3.7,
		averagePrice: 24.8,
		lastPrice: 25.7,
		lastUpdatePeriod: "1min",
		totalQuantity: 320,
		projectedGainLoss: 288,
		stopLoss: 23.5,
		sector: "Finance",
	},
];

export default function VariableIncome() {
	const [assets, setAssets] = useState<Asset[]>(d_assets);
	const totalInvested = useMemo(
		() =>
			assets.reduce((sum, asset) => sum + asset.quantity * asset.entryPrice, 0),
		[assets],
	);
	const totalCurrentValue = useMemo(
		() =>
			assets.reduce(
				(sum, asset) => sum + asset.quantity * asset.currentPrice,
				0,
			),
		[assets],
	);
	const totalProfitLoss = totalCurrentValue - totalInvested;
	const profitLossPercentage =
		totalInvested !== 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

	const assetTypes = useMemo(() => {
		return assets.reduce(
			(acc, asset) => {
				const assetType = asset.asset?.slice(0, 4);
				acc[assetType] =
					(acc[assetType] || 0) + asset.quantity * asset.currentPrice;
				return acc;
			},
			{} as Record<string, number>,
		);
	}, [assets]);

	const pieChartData = useMemo(
		() => Object.entries(assetTypes).map(([name, value]) => ({ name, value })),
		[assetTypes],
	);

	const barChartData = useMemo(
		() =>
			assets.map((asset) => ({
				name: asset.asset,
				invested: asset.quantity * asset.entryPrice,
				current: asset.quantity * asset.currentPrice,
			})),
		[assets],
	);

	const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setNewAsset((prev) => ({
			...prev,
			[name]: name === "asset" ? value : Number(value) || 0,
		}));
	};

	const handleAddAsset = () => {
		// if (newAsset.asset && newAsset.quantity > 0 && newAsset.entryPrice > 0) {
		// 	setAssets((prev) => [...prev, newAsset]);
		// 	setNewAsset({
		// 		asset: "",
		// 		quantity: 0,
		// 		entryPrice: 0,
		// 		stopLoss: 0,
		// 		partialExit: 0,
		// 		finalExit: 0,
		// 		executionDate: "",
		// 		exitDate: "",
		// 		currentPrice: 0,
		// 	});
		// } else {
		// 	alert(
		// 		"Please fill in at least the Asset, Quantity, and Entry Price fields.",
		// 	);
		// }
	};

	return (
		<div className="min-h-full p-6 space-y-4 overflow-auto scrollbar-hide">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold">Renda Variável</h1>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 w-full">
				<StatsCard
					title="Total Investido"
					value={Formatter.currency(totalInvested)}
					icon={DollarSignIcon}
					change={12.5}
					description="from last month"
				/>
				<StatsCard
					title="Total Lucro/Prejuízo"
					value={
						<span
							className={
								totalProfitLoss > 0 ? "text-green-500" : "text-red-500"
							}
						>
							{Formatter.currency(totalProfitLoss)}
						</span>
					}
					icon={TrendingUpDownIcon}
					change={-32.5}
					description="from last month"
				/>
				<StatsCard
					title="Rentabilidade"
					value={`${profitLossPercentage.toFixed(2)}%`}
					icon={profitLossPercentage >= 0 ? TrendingUp : TrendingDown}
					change={12.5}
					description="from last month"
				/>
				<GoalBar current={20} objectives={[-30, 10, 20, 30]} />
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Asset Details</CardTitle>
					<CardDescription>
						Detailed information about each asset in your portfolio
						<Dialog>
							<DialogTrigger asChild>
								<Button variant="outline">Edit Profile</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[425px]">
								<DialogHeader>
									<DialogTitle>Edit profile</DialogTitle>
									<DialogDescription>
										Make changes to your profile here. Click save when you're
										done.
									</DialogDescription>
								</DialogHeader>

								<DialogFooter>
									<Button type="submit">Adicionar Ativo</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="pie" className="w-full">
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="pie" className="flex items-center">
								Asset Type Distribution
							</TabsTrigger>
							<TabsTrigger value="bar" className="flex items-center">
								Asset Performance
							</TabsTrigger>
						</TabsList>
						<TabsContent value="pie">None</TabsContent>
						<TabsContent value="bar">
							<DataTable
								columns={columns}
								data={assets}
								filters={{
									id: ["A", "B", "C"],
									select: ["A", "B", "C"],
								}}
							/>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
}
