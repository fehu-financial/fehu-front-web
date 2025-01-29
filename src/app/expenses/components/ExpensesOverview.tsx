"use client";

import StatsCard from "@/components/ui/stats-card";
import { Calendar, DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { useExpenses } from "./ExpensesContext";

export default function ExpensesOverview() {
	const { expenses } = useExpenses();

	const totalExpenses = expenses.reduce(
		(sum, expense) => sum + expense.amount,
		0,
	);
	const averageExpense =
		expenses.length > 0 ? totalExpenses / expenses.length : 0;
	const highestExpense =
		expenses.length > 0
			? Math.max(...expenses.map((expense) => expense.amount))
			: 0;
	const latestExpenseDate =
		expenses.length > 0
			? new Date(
					Math.max(...expenses.map((e) => new Date(e.date).getTime())),
				).toLocaleDateString()
			: "N/A";

	const overviewItems = [
		{
			title: "Total Expenses",
			value: `$${totalExpenses.toFixed(2)}`,
			icon: DollarSign,
			color: "text-blue-500",
		},
		{
			title: "Average Expense",
			value: `$${averageExpense.toFixed(2)}`,
			icon: TrendingUp,
			color: "text-green-500",
		},
		{
			title: "Highest Expense",
			value: `$${highestExpense.toFixed(2)}`,
			icon: TrendingDown,
			color: "text-red-500",
		},
		{
			title: "Latest Expense",
			value: latestExpenseDate,
			icon: Calendar,
			color: "text-purple-500",
		},
	];

	return (
		<div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
			<StatsCard
				title="Total Expenses"
				value={`$${totalExpenses.toFixed(2)}`}
				icon={DollarSign}
				iconColor="text-blue-500"
			/>
			<StatsCard
				title="Average Expense"
				value={`$${averageExpense.toFixed(2)}`}
				icon={TrendingUp}
				iconColor="text-green-500"
			/>
			<StatsCard
				title="Highest Expense"
				value={`$${highestExpense.toFixed(2)}`}
				icon={TrendingDown}
				iconColor="text-red-500"
			/>
		</div>
	);
}
