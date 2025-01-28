"use client";

import type { Expense } from "@/@core/domain/expense";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { categories, statuses } from "./properties";

const columns: ColumnDef<Expense>[] = [
	{
		accessorKey: "title",
		header: "Titulo",
		cell: ({ row }) => {
			const category = categories.find((c) => c.id === row.original.category);
			return (
				<div className={cn("flex items-center space-x-2 font-semibold")}>
					<div
						className={cn(
							"rounded-full p-2 font-bold",
							category ? category?.color : "gray-600",
						)}
					>
						{category && <category.icon size={20} />}
					</div>
					<div className="flex flex-col">
						<span className="text-md">{row.original.title}</span>
						<span className="font-medium text-muted-foreground">
							{category?.label}
						</span>
					</div>
				</div>
			);
		},
	},
	// {
	// 	accessorKey: "description",
	// 	header: "Descricao",
	// },
	// {
	// 	accessorKey: "category",
	// 	header: "Categoria",
	// 	cell: (row) => {
	// 		const category = categories.find((c) => c.id === row.getValue());

	// 		return (
	// 			<div className={cn("flex items-center space-x-2 font-semibold")}>
	// 				<div
	// 					className={cn(
	// 						"rounded-full p-1.5 font-bold",
	// 						category ? category?.color : "gray-500",
	// 					)}
	// 				>
	// 					{category && <category.icon size={18} />}
	// 				</div>
	// 				<span>{category?.label}</span>
	// 			</div>
	// 		);
	// 	},
	// },
	{
		accessorKey: "date",
		header: "Data de Vencimento",
		cell: (info) =>
			new Date(info.getValue() as string | number).toLocaleDateString(),
	},
	{
		accessorKey: "amount",
		header: "Valor",
		cell: (info) => {
			const value = info.getValue();
			return typeof value === "number" ? `$${value.toFixed(2)}` : "$0.00";
		},
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: (row) => {
			const status = statuses.find((s) => s.id === row.getValue());

			return (
				<Badge variant="outline" className="space-x-2 text-muted-foreground">
					{status?.icon && (
						<status.icon size={14} className={`text-${status.color} mr-1`} />
					)}
					{status?.label}
				</Badge>
			);
		},
	},
];

export default columns;
