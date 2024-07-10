"use client";

import { SummaryStats } from "@/components/summary-stats";
import { DataTable } from "@/components/ui/data-table";
import type { Asset } from "@/domain/models/asset";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { CircleDollarSign, TrendingUp } from "lucide-react";
import React from "react";
import { columns } from "./data-table-columns";
import { DataTableToolbar } from "./data-table-toolbar";

export default function VariableIncomePage() {
	const data = React.useMemo<Asset[]>(
		() => [
			{
				ticker: "AAPL",
				type: "STOCK",
				name: "Apple Inc.",
				logo: "https://s3-symbol-logo.tradingview.com/apple.svg",
				averagePrice: 150.25,
				result: { profit: 500.0, percentage: 5.0 },
				orderDate: new Date("2021-10-01"),
				targetPrice: 170.5,
				lastQuote: 155.75,
				stopLoss: 140.0,
				sector: "Technology",
				quantity: 100,
				technicalRating: "STRONG_BUY",
				amount: 15025.0,
			},
			{
				ticker: "GOOGL",
				type: "STOCK",
				name: "Alphabet Inc.",
				logo: "https://s3-symbol-logo.tradingview.com/alphabet.svg",
				averagePrice: 2500.75,
				result: { profit: -500.0, percentage: -2.0 },
				orderDate: new Date("2021-09-15"),
				targetPrice: 2800.0,
				lastQuote: 2550.5,
				stopLoss: 2400.0,
				sector: "Technology",
				quantity: 50,
				technicalRating: "BUY",
				amount: 125037.5,
			},
		],
		[],
	);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		initialState: {
			columnVisibility: {
				type: false,
			},
		},
	});

	return (
		<div className="space-y-4">
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
			<div className="">
				<DataTable table={table} toolbar={<DataTableToolbar table={table} />} />
			</div>
		</div>
	);
}
