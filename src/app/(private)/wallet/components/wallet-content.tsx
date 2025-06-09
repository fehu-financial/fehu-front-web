import { getUserWallet } from "@/actions/wallets";
import type { WalletsResponse } from "@/types/wallet";
import { calculateAccountStats } from "../lib/utils";
import { AccountsSection } from "./accounts-section";
import { WalletStats } from "./wallet-stats";

export async function WalletContent() {
	const wallet: WalletsResponse = await getUserWallet();
	const stats = calculateAccountStats(wallet.accounts);

	return (
		<div className="space-y-6">
			<WalletStats stats={stats} />
			<AccountsSection accounts={wallet.accounts} />
		</div>
	);
}
