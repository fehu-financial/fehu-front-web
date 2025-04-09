import { z } from "zod";

export const ExpenseSchema = z.object({
	title: z.string().min(1, { message: "Title cannot be empty." }),
	description: z.string().min(1, { message: "Description cannot be empty." }),
	amount: z.number().min(0.01, { message: "Amount must be greater than zero." }),
	category: z
		.enum([
			"CREDIT_CARD",
			"CONDO",
			"MARKET",
			"VEHICLE",
			"FEED",
			"HEALTH",
			"INSURANCE",
			"LEISURE",
			"TAXES",
			"TRANSPORT",
			"WORK",
			"SUBSCRIPTION",
			"HOME",
		])
		.optional(),
	date: z.date(),
	recurrence: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]).optional(),
});

export type ExpenseCategory = z.infer<typeof ExpenseSchema>["category"];
export type ExpenseStatus = "PENDING" | "PAID" | "OVERDUE";
export type ExpenseRecurrence = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY" | "NONE";

export type Installment = {
	current: number;
	total: number;
	remaining: number;
	amount: number;
};

export type Payment = {
	amount: number;
	installmentNumber?: number;
	paidAt?: Date;
	paymentProof?: string;
};

export enum PaymentMethod {
	CASH = "CASH",
	CREDIT_CARD = "CREDIT_CARD",
	DEBIT_CARD = "DEBIT_CARD",
	PIX = "PIX",
	BANK_SLIP = "BANK_SLIP",
}

export class Expense {
	constructor(
		public readonly id: string,
		public readonly transactionId: string,
		public title: string,
		public description: string,
		public totalAmount: number,
		public category: ExpenseCategory,
		public interval?: ExpenseRecurrence,
		public dueDate?: Date,
		public status?: ExpenseStatus,
		public tags?: string[],
		public installments?: Installment,
		public payment?: Payment,
	) {}
}
