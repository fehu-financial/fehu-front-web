"use client";

import { deleteAccount, deleteCreditCard } from "@/actions/wallets";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Account } from "@/types/wallet";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Building2, ChevronDown, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { getBankInfo } from "../lib/utils";
import { AccountActions } from "./account-actions";
import AccountForm from "./account-form";
import { CreditCardsSection } from "./credit-cards-section";

interface AccountCardProps {
	account: Account;
}

export function AccountCard({ account }: AccountCardProps) {
	const [isExpanded, setIsExpanded] = useState(true);
	const [editAccountOpen, setEditAccountOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const queryClient = useQueryClient();

	const bankInfo = getBankInfo(account.institution);

	const deleteAccountMutation = useMutation({
		mutationFn: () => deleteAccount(account.id),
		onSuccess: () => {
			toast.success("Conta excluída com sucesso!");
			queryClient.invalidateQueries({ queryKey: ["wallets"] });
		},
		onError: (error) => {
			console.error("Error deleting account:", error);
			toast.error("Erro ao excluir conta. Tente novamente.");
		},
	});

	const deleteCreditCardMutation = useMutation({
		mutationFn: (cardId: string) => deleteCreditCard(account.id, cardId),
		onSuccess: () => {
			toast.success("Cartão excluído com sucesso!");
			queryClient.invalidateQueries({ queryKey: ["wallets"] });
		},
		onError: (error) => {
			console.error("Error deleting card:", error);
			toast.error("Erro ao excluir cartão. Tente novamente.");
		},
	});

	const handleDeleteAccount = () => {
		startTransition(() => {
			deleteAccountMutation.mutate();
		});
	};

	const handleDeleteCard = (cardId: string) => {
		deleteCreditCardMutation.mutate(cardId);
	};

	const handleEditAccount = () => {
		setEditAccountOpen(true);
	};

	const handleEditSuccess = () => {
		setEditAccountOpen(false);
	};

	const toggleExpanded = () => {
		setIsExpanded(!isExpanded);
	};

	return (
		<Card className="py-0 overflow-hidden transition-all duration-200 hover:shadow-lg">
			<CardContent className="p-0">
				{/* Bank Account Header */}
				<div
					className={cn(
						"p-6 cursor-pointer transition-colors",
						`bg-gradient-to-r ${bankInfo.gradient}`,
						"text-white hover:opacity-90",
					)}
				>
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<Button
								variant="ghost"
								size="sm"
								onClick={toggleExpanded}
								className="p-1 h-auto text-white hover:bg-white/20"
								disabled={isPending}
							>
								{isExpanded ? (
									<ChevronDown className="h-4 w-4" />
								) : (
									<ChevronRight className="h-4 w-4" />
								)}
							</Button>

							<div className="flex items-center space-x-3">
								<div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
									{bankInfo.logo ? (
										<Image
											src={bankInfo.logo}
											alt={bankInfo.name}
											width={32}
											height={32}
											className="object-contain"
										/>
									) : (
										<Building2 className="h-6 w-6" />
									)}
								</div>
								<div>
									<h3 className="text-xl font-bold">{bankInfo.name}</h3>
									<div className="flex items-center space-x-2">
										{account.agency && (
											<p className="text-white/70">Agência: {account.agency}</p>
										)}
										{account.number && (
											<p className="text-white/70">Conta: {account.number}</p>
										)}
									</div>
								</div>
							</div>
						</div>

						<AccountActions
							onEdit={handleEditAccount}
							onDelete={handleDeleteAccount}
						/>
					</div>
				</div>

				{/* Credit Cards Section */}
				{isExpanded && (
					<CreditCardsSection
						account={account}
						onDeleteCardAction={handleDeleteCard}
					/>
				)}
			</CardContent>

			{/* Edit Account Dialog */}
			<Dialog open={editAccountOpen} onOpenChange={setEditAccountOpen}>
				<DialogContent className="max-w-lg w-full">
					<DialogHeader>
						<DialogTitle>Editar Conta Bancária</DialogTitle>
					</DialogHeader>
					<AccountForm
						mode="edit"
						account={account}
						onSuccess={handleEditSuccess}
					/>
				</DialogContent>
			</Dialog>
		</Card>
	);
}
