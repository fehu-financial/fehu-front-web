import type { Transaction } from "./transaction";

export interface CategoryAnalysis {
	category: string;
	amount: number;
	percentage: number;
	count: number;
}

export interface TrendData {
	current: number;
	previous?: number;
	change?: number;
	trend: string;
}

export interface Statement {
	balance: {
		total: number;
		income: number;
		expenses: number;
	};
	analysis: {
		paid: number;
		pending: number;
		overdue: number;
		topExpenseCategories: CategoryAnalysis[];
		topIncomeCategories: CategoryAnalysis[];
		trends: {
			income: TrendData;
			expenses: TrendData;
			balance: TrendData;
		};
		metrics: {
			savingsRate: number;
			expenseToIncomeRatio: number;
			averageTransactionAmount: number;
			dailyAverageExpense: number;
			frequentTransactionDays: string[];
		};
	};
	transactions: Transaction[];
}
