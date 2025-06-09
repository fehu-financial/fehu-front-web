import type { Account, CreditCard } from "@/types/wallet";
import { BANKS } from "./constants";
import type { BankKey } from "./constants";

export function getBankInfo(institution: string) {
	return (
		BANKS[institution as BankKey] || {
			name: institution,
			logo: null,
			gradient: "from-slate-600 to-slate-700",
			color: "#64748b",
		}
	);
}

export function formatCardNumber(lastFourDigits: string): string {
	return `•••• •••• •••• ${lastFourDigits}`;
}

export function formatExpiryDate(date: Date): string {
	return new Intl.DateTimeFormat("pt-BR", {
		month: "2-digit",
		year: "2-digit",
	}).format(date);
}

export function getCardGradient(color: string): string {
	const colors = [
		"from-slate-900 to-slate-700",
		"from-blue-900 to-blue-700",
		"from-purple-900 to-purple-700",
		"from-green-900 to-green-700",
		"from-red-900 to-red-700",
		"from-orange-900 to-orange-700",
		"from-pink-900 to-pink-700",
		"from-indigo-900 to-indigo-700",
	];

	const hash = color.split("").reduce((a, b) => {
		a = (a << 5) - a + b.charCodeAt(0);
		return a & a;
	}, 0);

	return colors[Math.abs(hash) % colors.length];
}

export function calculateAccountStats(accounts: Account[]) {
	const totalCards = accounts.reduce(
		(sum, account) => sum + (account.creditCards?.length || 0),
		0,
	);

	const totalAccounts = accounts.length;

	// This would be calculated based on actual balance data
	const totalBalance = 0;

	return {
		totalBalance,
		totalCards,
		totalAccounts,
	};
}
