import { z } from "zod";

export const Asset = z.object({
	ticker: z.string(),
	type: z.enum(["STOCK", "ETF", "CRYPTO", "FUND"]),
	name: z.string(),
	logo: z.string(),
	averagePrice: z.number(),
	result: z.object({ profit: z.number(), percentage: z.number() }),
	orderDate: z.date(),
	targetPrice: z.number(),
	lastQuote: z.number(),
	stopLoss: z.number(),
	sector: z.string(),
	quantity: z.number(),
	technicalRating: z.enum(["STRONG_BUY", "BUY", "HOLD", "SELL", "STRONG_SELL"]),
	amount: z.number(),
});

export type Asset = z.infer<typeof Asset>;
