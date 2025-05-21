"use client";

import { getStatement } from "@/actions/statement";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table/data-table";
import DateNavigator from "@/components/ui/date-navigator";
import { Skeleton } from "@/components/ui/skeleton";
import StatsCard from "@/components/ui/stats-card";
import { useWorkspaceParams } from "@/hooks/use-workspace";
import { currency } from "@/lib/formatter";
import { cn } from "@/lib/utils";
import type { Statement } from "@/types/statement";
import { useQuery } from "@tanstack/react-query";
import {
	AlertTriangleIcon,
	ArrowDownRight,
	ArrowUpRight,
	BarChart3Icon,
	Calendar,
	CheckCircle,
	Clock,
	DollarSignIcon,
	TrendingDownIcon,
	TrendingUpIcon,
	XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import React, { useCallback, useState } from "react";
import columns from "./columns";
import { DataTableToolbar } from "./data-table-toolbar";
import { categories, categories as categoriesMetadata } from "./properties";

type DateFilter = {
	startDate: string;
	endDate: string;
};

export default function ExpensesOverview() {
	const { workspaces } = useWorkspaceParams();
	const [filters, setFilters] = useState<DateFilter>({
		startDate: "",
		endDate: "",
	});

	const {
		data: statement,
		isFetching,
		isLoading,
	} = useQuery<Statement | null>({
		queryKey: ["statement", workspaces, filters.startDate, filters.endDate],
		queryFn: () => getStatement({ workspaces, ...filters }),
		enabled:
			(!!filters.startDate && !!filters.endDate) || workspaces.length > 0,
		staleTime: 1000 * 60 * 5,
		refetchInterval: 1000 * 60 * 10,
		refetchOnReconnect: true,
	});

	const handleDateRangeChange = useCallback(
		(startDate: Date, endDate: Date) => {
			setFilters((prev) => ({
				...prev,
				startDate: startDate.toISOString(),
				endDate: endDate.toISOString(),
			}));
		},
		[],
	);

	// Map expense categories with metadata
	const expenseCategories = React.useMemo(() => {
		if (!statement?.analysis.topExpenseCategories) return [];

		return statement.analysis.topExpenseCategories.map((category) => {
			const metadata = categoriesMetadata.find(
				(c) => c.id === category.category,
			) || {
				icon: DollarSignIcon,
				color: "bg-gray-600",
				name: category.category,
			};

			return {
				...category,
				icon: metadata.icon || DollarSignIcon,
				color: metadata.color || "bg-gray-600",
				name: category.category,
			};
		});
	}, [statement?.analysis.topExpenseCategories]);

	// Animation variants
	const itemVariants = {
		hidden: { opacity: 0, y: 10 },
		visible: (i: number) => ({
			opacity: 1,
			y: 0,
			transition: {
				delay: 0.1 + i * 0.05,
				duration: 0.3,
			},
		}),
	};

	const getTrendIcon = (trend: string, isPositive: boolean) => {
		if (trend === "up") {
			return isPositive ? (
				<TrendingUpIcon className="h-4 w-4 text-green-500" />
			) : (
				<TrendingUpIcon className="h-4 w-4 text-red-500" />
			);
		}
		if (trend === "down") {
			return isPositive ? (
				<TrendingDownIcon className="h-4 w-4 text-red-500" />
			) : (
				<TrendingDownIcon className="h-4 w-4 text-green-500" />
			);
		}
		return null;
	};

	return (
		<div className="flex flex-col space-y-4">
			<DateNavigator onDateSelect={handleDateRangeChange} />

			{isLoading ? (
				// Skeletons for cards while loading
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
					{["balance", "status", "analysis", "categories"].map((key) => (
						<div
							key={key}
							className="flex flex-col space-y-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/30"
						>
							<Skeleton className="h-5 w-24 mb-4" /> {/* Title */}
							<Skeleton className="h-8 w-32 mb-2" /> {/* Value */}
							<Skeleton className="h-4 w-20 mb-2" />{" "}
							{/* Subtitle/Description */}
							<Skeleton className="h-3 w-full" /> {/* Bar/Extra */}
						</div>
					))}
				</div>
			) : (
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
					<StatsCard
						title="Balanço"
						value={
							<div className="space-y-6 flex flex-col items-center justify-center h-full">
								{/* Total Balance */}
								<div className="flex flex-col items-center">
									<span
										className={cn(
											"text-3xl font-bold text-center",
											(statement?.balance?.total ?? 0) >= 0
												? "text-emerald-600 dark:text-emerald-500"
												: "text-rose-600 dark:text-rose-500",
										)}
									>
										{currency(statement?.balance?.total ?? 0)}
									</span>
								</div>

								{/* Income and Expenses */}
								<div className="grid grid-cols-2 gap-4 w-full max-w-xs">
									{/* Income */}
									<div className="space-y-1 flex flex-col items-center">
										<div className="flex items-center gap-1.5">
											<div className="p-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20">
												<ArrowUpRight className="h-3 w-3 text-emerald-500" />
											</div>
											<span className="text-sm text-muted-foreground">
												Receitas
											</span>
										</div>
										<span className="text-lg font-medium ">
											{currency(statement?.balance?.income ?? 0)}
										</span>
									</div>

									{/* Expenses */}
									<div className="space-y-1 flex flex-col items-center">
										<div className="flex items-center gap-1.5">
											<div className="p-1 rounded-full bg-rose-50 dark:bg-rose-900/20">
												<ArrowDownRight className="h-3 w-3 text-rose-500" />
											</div>
											<span className="text-sm text-muted-foreground">
												Despesas
											</span>
										</div>
										<span className="text-lg font-medium ">
											{currency(statement?.balance?.expenses ?? 0)}
										</span>
									</div>
								</div>
							</div>
						}
						icon={DollarSignIcon}
						change={
							statement?.analysis.trends.balance.change !== undefined
								? Math.round(statement.analysis.trends.balance.change)
								: 0
						}
						description="Variação do saldo em relação ao período anterior"
					/>
					<StatsCard
						title="Status"
						value={
							<div className="grid grid-cols-3 gap-4">
								{/* Paid Transactions */}
								<div className="flex flex-col items-center justify-center p-4 rounded-lg bg-slate-50 dark:bg-slate-800/30">
									<div className="mb-2">
										<CheckCircle className="h-5 w-5 text-emerald-500" />
									</div>
									<span className="text-2xl font-bold">
										{statement?.analysis.paid}
									</span>
									<span className="text-xs text-muted-foreground mt-1">
										Pagas
									</span>
								</div>

								{/* Pending Transactions */}
								<div className="flex flex-col items-center justify-center p-4 rounded-lg bg-slate-50 dark:bg-slate-800/30">
									<div className="mb-2">
										<Clock className="h-5 w-5 text-amber-500" />
									</div>
									<span className="text-2xl font-bold">
										{statement?.analysis.pending}
									</span>
									<span className="text-xs text-muted-foreground mt-1">
										Pendentes
									</span>
								</div>

								{/* Overdue Transactions */}
								<div className="flex flex-col items-center justify-center p-4 rounded-lg bg-slate-50 dark:bg-slate-800/30">
									<div className="mb-2">
										<XCircle className="h-5 w-5 text-rose-500" />
									</div>
									<span className="text-2xl font-bold">
										{statement?.analysis.overdue}
									</span>
									<span className="text-xs text-muted-foreground mt-1">
										Vencidas
									</span>
								</div>
							</div>
						}
						icon={AlertTriangleIcon}
						description=""
					/>
					<StatsCard
						title="Analise"
						value={
							<div className="space-y-6">
								{/* Daily Average Expense */}
								<div className="flex flex-col space-y-2">
									<div className="flex items-center gap-2">
										<div className="p-1.5 rounded-full bg-rose-50 dark:bg-rose-900/20">
											<Clock className="h-3.5 w-3.5 text-rose-500" />
										</div>
										<span className="text-sm text-muted-foreground">
											Média Diária de Despesas
										</span>
									</div>
									<span className="text-xl font-medium">
										{currency(
											statement?.analysis.metrics.dailyAverageExpense ?? 0,
										)}
									</span>
								</div>

								{/* Frequent Transaction Days */}
								<div className="space-y-3">
									<div className="flex items-center gap-2">
										<div className="p-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20">
											<Calendar className="h-3.5 w-3.5 text-blue-500" />
										</div>
										<span className="text-sm text-muted-foreground">
											Dias Frequentes de Transação
										</span>
									</div>
									<div className="flex flex-wrap gap-2 mt-2">
										{statement?.analysis.metrics.frequentTransactionDays.map(
											(day) => (
												<Badge
													key={day}
													variant="outline"
													className="bg-blue-50 dark:bg-blue-900/10 text-xs"
												>
													{day}
												</Badge>
											),
										)}
									</div>
								</div>
							</div>
						}
						icon={BarChart3Icon}
						description=""
					/>
					<StatsCard
						title="Top Categorias"
						value={
							statement?.analysis.topExpenseCategories &&
							statement.analysis.topExpenseCategories.length > 0 ? (
								<div className="space-y-6">
									{statement?.analysis.topExpenseCategories
										.slice(0, 3)
										.map((category, index) => {
											const systemCategory = categories.find(
												(c) => c.id === category.category,
											);
											return (
												<motion.div
													key={category.category}
													custom={index}
													variants={itemVariants}
													className="space-y-2"
												>
													<div className="flex items-center justify-between">
														<div className="flex items-center gap-2">
															<div
																className={cn(
																	"rounded-full p-1 font-bold",
																	systemCategory
																		? systemCategory?.color
																		: "gray-600",
																)}
															>
																{systemCategory && (
																	<systemCategory.icon className="h-3 w-3" />
																)}
															</div>
															<span className="text-sm text-muted-foreground">
																{systemCategory?.label}
															</span>
														</div>
														<div className="flex items-center gap-2">
															<span className="text-sm font-medium">
																{currency(category.amount)}
															</span>
															<span className="text-xs text-muted-foreground">
																{category.percentage.toFixed(0)}%
															</span>
														</div>
													</div>
													<div
														className={`h-1.5 w-full rounded-full ${systemCategory?.color}/20`}
													>
														<motion.div
															className={`h-full rounded-full ${systemCategory?.color}`}
															style={{
																width: `${category.percentage.toFixed(0)}%`,
															}}
															initial={{ width: 0 }}
															animate={{
																width: `${category.percentage.toFixed(0)}%`,
															}}
															transition={{
																duration: 0.5,
																delay: 0.3 + index * 0.1,
															}}
														/>
													</div>
												</motion.div>
											);
										})}
								</div>
							) : (
								<div className="flex items-center justify-center h-32 text-muted-foreground">
									Nenhuma categoria de despesa encontrada
								</div>
							)
						}
						icon={DollarSignIcon}
						description=""
					/>
				</div>
			)}

			<DataTable
				columns={columns}
				data={statement?.transactions || []}
				toolbar={<DataTableToolbar isFetching={isFetching && !isLoading} />}
				isLoading={isLoading}
			/>
		</div>
	);
}
