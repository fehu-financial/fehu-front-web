// src/types/wallet.ts
// Tipos e interfaces para a feature Wallet

export interface CreditCard {
	id: string;
	lastFourDigits: string;
	brand: string;
	issuer: string;
	accountId: string;
	workspaceId?: string;
	expiration: Date;
	closingDay: number;
	dueDay: number;
	displayName: string;
	color: string;
}

export interface Account {
	id: string;
	type: string;
	institution: string;
	number: string;
	agency: string;
	name: string;
	isActive: boolean;
	creditCards: CreditCard[];
}

export interface WalletsResponse {
	accounts: Account[];
}

export interface CreateAccountInput {
	type: string;
	institution: string;
	number: string;
	agency: string;
	name: string;
}

export interface CreateCreditCardInput {
	lastFourDigits: string;
	brand: string;
	issuer: string;
	accountId: string;
	workspaceId: string;
	expiration: Date;
	closingDay: number;
	dueDay: number;
	color: string;
}

export interface UpdateAccountInput {
	type?: string;
	institution?: string;
	number?: string;
	agency?: string;
	name?: string;
}

export interface UpdateCreditCardInput {
	lastFourDigits?: string;
	brand?: string;
	issuer?: string;
	workspaceId?: string;
	expiration?: Date;
	closingDay?: number;
	dueDay?: number;
	color?: string;
}
