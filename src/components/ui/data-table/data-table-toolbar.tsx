"use client";

import type { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";

import { DataTableFacetedFilter } from "./data-table-faceted-filter";

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
	facetedFilters?: {
		[key: string]: string[];
	};
	customn?: React.ReactNode;
	children?: React.ReactNode;
}

export function DataTableToolbar<TData>({
	table,
	facetedFilters,
	customn,
	children,
}: DataTableToolbarProps<TData>) {
	const isFiltered = table.getState().columnFilters.length > 0;

	const filters = Object.entries(facetedFilters ?? {}).map(
		([key, value]) =>
			table.getColumn(key) && (
				<DataTableFacetedFilter
					key={key}
					column={table.getColumn(key)}
					title={key.replace(
						/\w+/g,
						(w: string) => w[0].toUpperCase() + w.slice(1).toLowerCase(),
					)}
					options={value.map((v) => ({ label: v, value: v }))}
				/>
			),
	);

	return (
		<div className="flex items-center justify-between space-x-2">
			<div className="flex flex-1 items-center space-x-2">
				<Input
					placeholder="Filter tasks..."
					value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
					onChange={(event) =>
						table.getColumn("title")?.setFilterValue(event.target.value)
					}
					className="h-8 w-[150px] lg:w-[250px]"
				/>
				{facetedFilters && filters}
				{isFiltered && (
					<Button
						variant="ghost"
						onClick={() => table.resetColumnFilters()}
						className="h-8 px-2 lg:px-3"
					>
						Reset
						<X />
					</Button>
				)}
				{children}
			</div>
			{customn}
			<DataTableViewOptions table={table} />
		</div>
	);
}
