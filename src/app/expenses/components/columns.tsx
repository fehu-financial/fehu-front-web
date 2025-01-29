"use client";

import type { Expense } from "@/@core/domain/expense";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import Formatter from "@/lib/formatter";
import { cn } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { Calendar1Icon, RefreshCcwIcon } from "lucide-react";
import { categories, statuses } from "./properties";

const columns: ColumnDef<Expense>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
				className="translate-y-[2px]"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
				className="translate-y-[2px]"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "title",
		header: "Descrição",
		cell: ({ row }) => {
			return (
				<div className="flex flex-col">
					<span className="text-md font-semibold">{row.original.title}</span>
					<span className="text-xs font-light text-muted-foreground">
						{row.original.description}
					</span>
				</div>
			);
		},
	},
	{
		accessorKey: "category",
		header: "Categoria",
		cell: (info) => {
			const category = categories.find((c) => c.id === info.getValue());
			return (
				<div className={cn("flex items-center space-x-2 font-semibold")}>
					<div
						className={cn(
							"rounded-full p-1.5 font-bold",
							category ? category?.color : "gray-600",
						)}
					>
						{category && <category.icon size={16} />}
					</div>
					<span>{category?.label}</span>
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
		cell: (info) => {
			const dueDate = Formatter.date(info.getValue() as string | number | Date);
			return (
				<div className="flex items-center space-x-2">
					<Calendar1Icon size={16} />
					<span>{dueDate}</span>
				</div>
			);
		},
	},
	{
		accessorKey: "recurrence",
		header: "Recorrência",
		cell: (info) => {
			const recurrence = info.getValue();
			return (
				recurrence && (
					<Badge variant="outline" className="text-muted-foreground">
						<RefreshCcwIcon size={14} className={"mr-2"} />
						{recurrence as string}
					</Badge>
				)
			);
		},
	},
	{
		accessorKey: "amount",
		header: "Valor",
		cell: (info) => {
			const value = info.getValue();
			return Formatter.currency(Number(value));
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
	// {
	// 	id: "actions",
	// 	cell: ({ row }) => <DataTableRowActions row={row} />,
	// },
];

export default columns;
