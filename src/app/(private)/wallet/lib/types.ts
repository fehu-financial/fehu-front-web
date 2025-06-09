import type { Account, CreditCard } from "@/types/wallet";

// Re-export for module convenience
export type { CreditCard };

export interface WalletStats {
	totalBalance: number;
	totalCards: number;
	totalAccounts: number;
	monthlyGrowth: number;
	newCardsThisMonth: number;
	newAccountsThisMonth: number;
}

export interface AccountWithCards extends Omit<Account, "creditCards"> {
	creditCards: CreditCard[];
	bankInfo: {
		name: string;
		logo: string | null;
		gradient: string;
		color: string;
	};
}

export interface CreditCardDisplay extends CreditCard {
	maskedNumber: string;
	formattedExpiry: string;
	brandLogo: string | null;
}
