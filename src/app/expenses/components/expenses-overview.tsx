"use client";

import { DataTable } from "@/components/ui/data-table/data-table";
import DateNavigator from "@/components/ui/date-navigator";
import StatsCard from "@/components/ui/stats-card";
import { getExpenses } from "@/core/actions/expenses";
import type { Expense } from "@/core/domain/expense";
import { useWorkspaceParams } from "@/core/hooks/use-workspace";
import { currency } from "@/core/lib/formatter";
import { useQuery } from "@tanstack/react-query";
import { DollarSignIcon } from "lucide-react";
import React, { useCallback, useState } from "react";
import columns from "./columns";
import { DataTableToolbar } from "./data-table-toolbar";

type ExpensesFilter = {
	startDate: string;
	endDate: string;
};

export default function ExpensesOverview() {
	const { workspaces } = useWorkspaceParams();
	const [filters, setFilters] = useState<ExpensesFilter>({
		startDate: "",
		endDate: "",
	});

	const {
		data: expenses = [] as Expense[],
		isFetching,
		isLoading,
	} = useQuery({
		queryKey: ["expenses", workspaces, filters.startDate, filters.endDate],
		queryFn: () => getExpenses({ workspaces, ...filters }),
		enabled: (!!filters.startDate && !!filters.endDate) || workspaces.length < 1,
		staleTime: 1000 * 60 * 5,
		refetchInterval: 1000 * 60 * 10,
		refetchOnReconnect: true,
	});

	const handleDateRangeChange = useCallback((startDate: Date, endDate: Date) => {
		setFilters((prev) => ({
			...prev,
			startDate: startDate.toISOString(),
			endDate: endDate.toISOString(),
		}));
	}, []);

	return (
		<div className="flex flex-col space-y-6">
			<DateNavigator onDateSelect={handleDateRangeChange} />
			<div className="flex items-center justify-between">
				<StatsCard
					title="Total Investido"
					value={currency(128560)}
					icon={DollarSignIcon}
					change={12.5}
					description="from last month"
				/>
			</div>
			<DataTable
				columns={columns}
				data={expenses as Expense[]}
				toolbar={<DataTableToolbar isFetching={isFetching && !isLoading} />}
				isLoading={isLoading}
			/>
		</div>
	);
}
