import type { Asset } from "@/domain/models/asset";
import Formatter from "@/lib/formatter";
import type { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Asset>[] = [
	{
		accessorKey: "name",
		header: "Ativo",
		cell: ({ row }) => (
			<div className="flex items-center w-72 space-x-1">
				<img src={row.original.logo} alt="" className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full" />
				<span className="text-lg text-bold">{row.getValue("name")}</span>
				<span className="text-sm text-muted-foreground">({row.original.ticker})</span>
			</div>
		),
	},
	{ accessorKey: "quantity", header: "Quantidade" },
	{
		accessorKey: "averagePrice",
		header: "Preço Médio",
		cell: ({ row }) => <div>{new Formatter().currency(row.getValue("averagePrice"))}</div>,
	},
	{
		accessorKey: "perdaLucro",
		header: "Perda/Lucro",
		cell: ({ row }) => {
			const color = row.original.result.percentage > 0 ? "text-green-300" : "text-red-300";

			return (
				<div className={color}>
					<div>{`${new Formatter().currency(row.original.result.profit)} (${row.original.result.percentage}%)`}</div>
				</div>
			);
		},
	},
	{
		accessorKey: "lastQuote",
		header: "Últ. Preço",
		cell: ({ row }) => <div>{new Formatter().currency(row.getValue("lastQuote"))}</div>,
	},
	{
		accessorKey: "orderDate",
		header: "Dada da Ordem",
		cell: ({ row }) => <div>{new Formatter().date(row.getValue("orderDate"))}</div>,
	},
	{
		accessorKey: "targetPrice",
		header: "Preço Alvo",
		cell: ({ row }) => <div>{new Formatter().currency(row.getValue("targetPrice"))}</div>,
	},
	{
		accessorKey: "stopLoss",
		header: "Stop Loss",
		cell: ({ row }) => <div>{new Formatter().currency(row.getValue("stopLoss"))}</div>,
	},
	{
		accessorKey: "amount",
		header: "Total Investido",
		cell: ({ row }) => <div>{new Formatter().currency(row.getValue("amount"))}</div>,
	},
	{
		accessorKey: "type",
	},
];
