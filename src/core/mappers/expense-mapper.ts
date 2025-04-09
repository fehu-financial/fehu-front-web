import type { Expense as ExpenseResponse } from "@/core/data/graphql/client/types";
import { Expense, type ExpenseCategory } from "@/core/domain/expense";

const toDomain = (input: ExpenseResponse): Expense[] => {
	// If no payments exist, return a single expense
	if (!input.payments?.length) {
		return [createExpenseFromInput(input)];
	}

	// Create an expense for each payment
	return input.payments
		.filter((payment): payment is NonNullable<typeof payment> => payment !== null)
		.map((payment) => {
			return createExpenseFromInput(input, payment);
		});
};

// Helper function to create an Expense from input data
function createExpenseFromInput(
	input: ExpenseResponse,
	payment?: NonNullable<NonNullable<ExpenseResponse["payments"]>[number]>,
): Expense {
	const filteredTags = (input.tags ?? []).filter((tag): tag is string => tag !== null);

	// Use payment data if provided, otherwise use input data
	const id = payment ? `${input.id}-${payment.id}` : input.id;
	const amount = payment?.amount ?? input.totalAmount ?? 0;
	const dueDate = payment?.dueDate ?? input.nextDueDate;

	const installmentData = input.installments
		? {
				current: payment?.installmentNumber ?? input.installments.current ?? 0,
				total: input.installments.total ?? 0,
				remaining: input.installments.remaining ?? 0,
				amount: payment?.amount ?? input.installments.amount ?? 0,
			}
		: undefined;

	// Create payment data if this is a payment-specific expense
	const paymentData = payment
		? {
				id: payment.id,
				amount: payment.amount ?? 0,
				dueDate: payment.dueDate,
				installmentNumber: payment.installmentNumber ?? 0,
				paidAt: payment.paidAt,
				type: payment.type ?? undefined,
			}
		: undefined;

	const expense = new Expense(
		id,
		input.title ?? "",
		input.description ?? "",
		amount,
		dueDate,
		input.category as ExpenseCategory,
		input.recurrence?.interval ?? undefined,
		filteredTags,
		installmentData,
		paymentData,
	);
	console.log(expense);
	return expense;
}

export const ExpenseMapper = {
	toDomain,
};
