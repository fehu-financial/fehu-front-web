import { z } from "zod";

const ExpenseSchema = z.object({
	id: z.string(),
	title: z.string().min(1, { message: "Title cannot be empty." }),
	description: z.string().min(1, { message: "Description cannot be empty." }),
	amount: z
		.number()
		.min(0.01, { message: "Amount must be greater than zero." }),
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
	status: z.enum(["PAID", "PENDING", "OVERDUE"]),
	recurrence: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]).optional(),
});

type ExpenseCategory = z.infer<typeof ExpenseSchema>["category"];
type ExpenseStatus = z.infer<typeof ExpenseSchema>["status"];
type ExpenseRecurrence = z.infer<typeof ExpenseSchema>["recurrence"];

export class Expense {
	public readonly id!: string;
	public date!: Date;
	public title!: string;
	public description!: string;
	public amount!: number;
	public category!: ExpenseCategory;
	public status!: ExpenseStatus;
	public recurrence?: ExpenseRecurrence;

	constructor(data: z.infer<typeof ExpenseSchema>) {
		const validatedData = ExpenseSchema.parse(data);
		Object.assign(this, validatedData);
	}
}
