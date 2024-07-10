import { DatePicker } from "@/components/ui/date-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Table } from "@tanstack/react-table";
import { CrossIcon, PlusCircleIcon } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { DataTableFacetedFilter } from "../../../components/ui/data-table/data-table-faced-filter";
import { DataTableViewOptions } from "../../../components/ui/data-table/data-table-view-options";
import { Input } from "../../../components/ui/input";

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
	const isFiltered = table.getState().columnFilters.length > 0;

	const filters = {
		type: [
			{
				label: "Ações",
				value: "STOCK",
			},
			{
				label: "FIIs",
				value: "FII",
			},
			{
				label: "ETFs",
				value: "ETF",
			},
		],
	};

	return (
		<div className="flex items-center justify-between">
			<div className="flex flex-1 items-center space-x-2">
				{table.getColumn("ticker") && (
					<Input
						placeholder="Filtrar ativo..."
						value={(table.getColumn("ticker")?.getFilterValue() as string) ?? ""}
						onChange={(event) => table.getColumn("ticker")?.setFilterValue(event.target.value)}
						className="h-8 w-[150px] lg:w-[250px]"
					/>
				)}
				<DataTableFacetedFilter column={table.getColumn("type")} title="Tipo Ativo" options={filters.type} />
				{isFiltered && (
					<Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
						Resetar filtros
						<CrossIcon className="ml-2 h-4 w-4" />
					</Button>
				)}
			</div>
			<div className="flex space-x-2">
				<Popover>
					<PopoverTrigger asChild>
						<Button size="sm" className="h-8 border-dashed">
							<PlusCircleIcon className="mr-2 h-4 w-4" />
							Novo Ativo
						</Button>
					</PopoverTrigger>
					<PopoverContent className="flex flex-col items-end space-y-2" sideOffset={5} align="end">
						<Input placeholder="Ativo" />
						<Input placeholder="Quantidade" />
						<Input placeholder="Preço Médio" />
						<DatePicker />
						<Button className="mt-2">Incluir</Button>
					</PopoverContent>
				</Popover>
				<DataTableViewOptions table={table} />
			</div>
		</div>
	);
}
