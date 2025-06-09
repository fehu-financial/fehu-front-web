export enum TransactionType {
	REVENUE = "REVENUE",
	EXPENSE = "EXPENSE",
}

export enum TransactionStatus {
	PENDING = "PENDING",
	PAID = "PAID",
	OVERDUE = "OVERDUE",
}

export enum RecurrenceFrequency {
	MONTHLY = "MONTHLY",
	ANNUAL = "ANNUAL",
}

export enum PaymentMethod {
	CASH = "CASH",
	CREDIT_CARD = "CREDIT_CARD",
	DEBIT_CARD = "DEBIT_CARD",
	PIX = "PIX",
	BANK_SLIP = "BANK_SLIP",
}

export interface Transaction {
	id: string;
	type: TransactionType;
	title: string;
	description: string;
	amount: number;
	category: string;
	recurrence?: RecurrenceFrequency;
	dueDate: Date;
	status: TransactionStatus;
	installments?: {
		current: number;
		total: number;
		remaining: number;
		totalAmount?: number;
		creditCard?: {
			lastDigits: string;
			issuer: string;
			brand: string;
			expirationDate?: Date;
		};
	};
	payment?: {
		amount: number;
		paidAt?: Date;
		paidBy?: {
			id: string;
			name: string;
			email: string;
			avatar?: string;
		};
		receipt?: string;
		lateFees?: number;
		paymentMethod?: PaymentMethod;
	};
	tags: string[];
	origin?: {
		planId: string;
		workspace: {
			id: string;
			title: string;
			color?: string;
			avatar?: string;
		};
	};
}

export interface CreateTransactionInput {
	workspaceId: string;
	type: TransactionType;
	title: string;
	description?: string;
	category: string;
	amount: number;
	dueDate: Date;
	installments?: {
		total: number;
		creditCardId?: string;
	};
	recurrence?: {
		frequency: RecurrenceFrequency;
		endDate?: Date;
		fixedDay?: number;
	};
	tags?: string[];
}

export interface RegisterPaymentInput {
	workspaceId: string;
	planId: string;
	transactionId: string;
	payment: {
		amount: number;
		method: PaymentMethod;
		lateFees?: number;
		paidAt?: Date;
		receipt?: string;
	};
}
