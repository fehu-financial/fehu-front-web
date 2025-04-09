"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight, Target } from "lucide-react";
import { useExpenses } from "./ExpensesContext";

export default function ExpensesSummary() {
	const { expenses } = useExpenses();

	const categoryTotals = expenses.reduce(
		(acc, expense) => {
			acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
			return acc;
		},
		{} as Record<string, number>,
	);

	const topCategory =
		Object.entries(categoryTotals).length > 0
			? Object.entries(categoryTotals).reduce((a, b) => (a[1] > b[1] ? a : b))[0]
			: "N/A";

	const lowestCategory =
		Object.entries(categoryTotals).length > 0
			? Object.entries(categoryTotals).reduce((a, b) => (a[1] < b[1] ? a : b))[0]
			: "N/A";

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-xl font-semibold">Expense Insights</CardTitle>
			</CardHeader>
			<CardContent className="grid gap-4">
				<div className="flex items-center space-x-4">
					<ArrowUpRight className="h-8 w-8 text-red-500" />
					<div>
						<p className="text-sm font-medium text-muted-foreground">Highest Spending</p>
						<h3 className="text-2xl font-bold">{topCategory}</h3>
					</div>
				</div>
				<div className="flex items-center space-x-4">
					<ArrowDownRight className="h-8 w-8 text-green-500" />
					<div>
						<p className="text-sm font-medium text-muted-foreground">Lowest Spending</p>
						<h3 className="text-2xl font-bold">{lowestCategory}</h3>
					</div>
				</div>
				<div className="flex items-center space-x-4">
					<Target className="h-8 w-8 text-blue-500" />
					<div>
						<p className="text-sm font-medium text-muted-foreground">Budget Goal</p>
						<h3 className="text-2xl font-bold">Set your goal</h3>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
