"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ColumnDef } from "@tanstack/react-table";
import {
	AlertTriangle,
	ArrowUpDown,
	BarChart3,
	Clock,
	DollarSign,
	Package,
	Percent,
	TrendingDown,
	TrendingUp,
} from "lucide-react";
import type { Asset } from "../page";

const columns: ColumnDef<Asset>[] = [
	{
		accessorKey: "name",
		header: "Asset",
		cell: ({ row }) => (
			<div className="flex items-center space-x-2">
				<img
					src={`/placeholder.svg?height=32&width=32`}
					alt={`${row.original.name} logo`}
					className="w-8 h-8 rounded-full"
				/>
				<span className="font-medium">{row.original.name}</span>
			</div>
		),
	},
	{
		accessorKey: "position",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="whitespace-nowrap"
				>
					<DollarSign className="w-4 h-4 mr-2" />
					Position (R$)
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="text-right font-medium">
				{row.original.position.toLocaleString("pt-BR", {
					style: "currency",
					currency: "BRL",
				})}
			</div>
		),
	},
	{
		accessorKey: "allocation",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					<Percent className="w-4 h-4 mr-2" />
					Allocation
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="text-right">
				<Badge
					variant={
						row.original.allocation > 20
							? "destructive"
							: row.original.allocation > 10
								? "warning"
								: "default"
					}
				>
					{row.original.allocation.toFixed(2)}%
				</Badge>
			</div>
		),
	},
	{
		accessorKey: "profitability",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					<BarChart3 className="w-4 h-4 mr-2" />
					Profitability
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div
				className={`flex items-center justify-end ${row.original.profitability >= 0 ? "text-green-600" : "text-red-600"}`}
			>
				{row.original.profitability >= 0 ? (
					<TrendingUp className="w-4 h-4 mr-1" />
				) : (
					<TrendingDown className="w-4 h-4 mr-1" />
				)}
				{Math.abs(row.original.profitability).toFixed(2)}%
			</div>
		),
	},
	{
		accessorKey: "averagePrice",
		header: "Avg. Price (R$)",
		cell: ({ row }) => (
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<div className="text-right font-medium">
							{row.original.averagePrice.toFixed(2)}
						</div>
					</TooltipTrigger>
					<TooltipContent>
						<p>Average purchase price</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		),
	},
	{
		accessorKey: "lastPrice",
		header: "Last Price (R$)",
		cell: ({ row }) => (
			<div className="text-right space-y-1">
				<div className="font-medium">{row.original.lastPrice.toFixed(2)}</div>
				<div className="text-xs text-muted-foreground flex items-center justify-end">
					<Clock className="w-3 h-3 mr-1" />
					{row.original.lastUpdatePeriod} ago
				</div>
			</div>
		),
	},
	{
		accessorKey: "totalQuantity",
		header: "Total Qty.",
		cell: ({ row }) => (
			<div className="text-right">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="flex items-center justify-end">
								<Package className="w-4 h-4 mr-2" />
								{row.original.totalQuantity}
							</div>
						</TooltipTrigger>
						<TooltipContent>
							<p>Total quantity of assets</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		),
	},
	{
		accessorKey: "projectedGainLoss",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="whitespace-nowrap"
				>
					Projected Gain/Loss
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="flex items-center justify-end space-x-2">
				<span
					className={`font-medium ${row.original.projectedGainLoss >= 0 ? "text-green-600" : "text-red-600"}`}
				>
					{row.original.projectedGainLoss.toLocaleString("pt-BR", {
						style: "currency",
						currency: "BRL",
					})}
				</span>
				{/* <Progress
					value={Math.abs(
						(row.original.projectedGainLoss / row.original.position) * 100,
					)}
					className="w-20"
					indicatorClassName={
						row.original.projectedGainLoss >= 0 ? "bg-green-600" : "bg-red-600"
					}
				/> */}
			</div>
		),
	},
	{
		accessorKey: "stopLoss",
		header: "Stop Loss (R$)",
		cell: ({ row }) => (
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<div className="text-right font-medium flex items-center justify-end">
							<AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />
							{row.original.stopLoss.toFixed(2)}
						</div>
					</TooltipTrigger>
					<TooltipContent>
						<p>Stop loss price</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		),
	},
	{
		accessorKey: "sector",
		header: "Sector",
		cell: ({ row }) => <Badge variant="outline">{row.original.sector}</Badge>,
	},
];

export default columns;
