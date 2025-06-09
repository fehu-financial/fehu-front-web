"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import type { Account } from "@/types/wallet";
import { Building2, Plus } from "lucide-react";
import { memo, useState } from "react";
import { AccountCard } from "./account-card";
import AccountForm from "./account-form";

interface AccountsSectionProps {
	accounts: Account[];
}

const EmptyState = memo(
	({ onCreateAccount }: { onCreateAccount: () => void }) => (
		<Card className="col-span-full">
			<div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
				<Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
				<h3 className="text-lg font-semibold mb-2">Nenhuma conta cadastrada</h3>
				<p className="text-muted-foreground mb-4">
					Adicione sua primeira conta bancária para começar
				</p>
				<Button onClick={onCreateAccount}>
					<Plus className="mr-2 h-4 w-4" /> Nova Conta
				</Button>
			</div>
		</Card>
	),
);

EmptyState.displayName = "EmptyState";

export function AccountsSection({ accounts }: AccountsSectionProps) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const handleCreateAccount = () => {
		setIsDialogOpen(true);
	};

	const handleSuccess = () => {
		setIsDialogOpen(false);
	};

	return (
		<section className="space-y-6">
			<header className="flex items-center justify-between">
				<h2 className="text-2xl font-bold tracking-tight">
					Contas Bancárias & Cartões de Crédito
				</h2>
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button>
							<Plus className="mr-2 h-4 w-4" /> Nova Conta
						</Button>
					</DialogTrigger>
					<DialogContent className="max-w-lg w-full">
						<DialogHeader>
							<DialogTitle>Cadastrar Conta Bancária</DialogTitle>
						</DialogHeader>
						<AccountForm mode="create" onSuccess={handleSuccess} />
					</DialogContent>
				</Dialog>
			</header>

			<div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
				{accounts.length > 0 ? (
					accounts.map((account) => (
						<AccountCard key={account.id} account={account} />
					))
				) : (
					<EmptyState onCreateAccount={handleCreateAccount} />
				)}
			</div>
		</section>
	);
}
