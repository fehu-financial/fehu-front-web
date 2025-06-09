import { PageContainer } from "@/components/ui/page-container";
import { Suspense } from "react";
import { WalletContent } from "./components/wallet-content";
import { WalletSkeleton } from "./components/wallet-skeleton";

export const metadata = {
	title: "Carteira Digital",
	description:
		"Gerencie seus cartões de crédito e contas bancárias em um só lugar.",
};

export default function WalletPage() {
	return (
		<PageContainer
			title="Carteira Digital"
			description="Gerencie seus cartões de crédito e contas bancárias em um só lugar."
		>
			<Suspense fallback={<WalletSkeleton />}>
				<WalletContent />
			</Suspense>
		</PageContainer>
	);
}
