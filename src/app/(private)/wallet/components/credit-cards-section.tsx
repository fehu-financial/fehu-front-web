"use client";

import { Button } from "@/components/ui/button";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import type { Account, CreditCard } from "@/types/wallet";
import { CreditCardIcon, Plus } from "lucide-react";
import { useState } from "react";
import { CreditCard as CreditCardComponent } from "./credit-card";
import { CreditCardActions } from "./credit-card-actions";
import { CreditCardForm } from "./credit-card-form";

interface CreditCardsSectionProps {
	account: Account;
	onDeleteCardAction: (cardId: string) => void;
}

export function CreditCardsSection({
	account,
	onDeleteCardAction,
}: CreditCardsSectionProps) {
	const [editCardOpen, setEditCardOpen] = useState(false);
	const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null);

	const handleEditCard = (card: CreditCard) => {
		setSelectedCard(card);
		setEditCardOpen(true);
	};

	const handleEditSuccess = () => {
		setEditCardOpen(false);
		setSelectedCard(null);
	};

	return (
		<div className="p-6 bg-accent/5">
			<div className="flex items-center justify-between mb-4">
				<h4 className="font-semibold text-lg flex items-center">
					<CreditCardIcon className="mr-2 h-5 w-5" />
					Cartões de Crédito ({account.creditCards.length})
				</h4>
				<Dialog>
					<DialogTrigger asChild>
						<Button size="sm" variant="outline" className="gap-2">
							<Plus className="h-4 w-4" /> Novo Cartão
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Cadastrar Cartão de Crédito</DialogTitle>
						</DialogHeader>
						<CreditCardForm accountId={account.id} mode="create" />
					</DialogContent>
				</Dialog>
			</div>

			{account.creditCards.length > 0 ? (
				<Carousel
					className="mx-8"
					opts={{
						align: "start",
						loop: false,
					}}
				>
					<CarouselContent>
						{account.creditCards.map((card) => (
							<CarouselItem key={card.id}>
								<div className="flex aspect-auto items-center justify-center group">
									<CreditCardComponent creditCard={card} />
									<CreditCardActions
										card={card}
										onEdit={handleEditCard}
										onDelete={onDeleteCardAction}
									/>
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>
			) : (
				<div className="text-center py-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg">
					<CreditCardIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
					<p className="text-muted-foreground mb-4">
						Nenhum cartão de crédito vinculado a esta conta
					</p>
				</div>
			)}

			{/* Edit Credit Card Dialog */}
			<Dialog open={editCardOpen} onOpenChange={setEditCardOpen}>
				<DialogContent className="max-w-lg w-full">
					<DialogHeader>
						<DialogTitle>Editar Cartão de Crédito</DialogTitle>
					</DialogHeader>
					{selectedCard && (
						<CreditCardForm
							mode="edit"
							creditCard={selectedCard}
							onSuccess={handleEditSuccess}
						/>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
