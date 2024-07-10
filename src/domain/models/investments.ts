import { z } from "zod";

// api/investments/summary
export const InvestmentSummary = z.object({
	total_equity: z.number(),
	total_return: z.number(),
	equity_allocation: z.object({
		fixed_income: z.number(),
		variable_income: z.number(),
	}),
	performance: z.array(
		z.object({
			date: z.string(),
			value: z.number(),
			percentage: z.number(),
		}),
	),
});

export type InvestmentSummary = z.infer<typeof InvestmentSummary>;
