"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CreditCard } from "@/types/wallet";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { useTransition } from "react";

interface CreditCardActionsProps {
	card: CreditCard;
	onEdit: (card: CreditCard) => void;
	onDelete: (cardId: string) => void;
}

export function CreditCardActions({
	card,
	onEdit,
	onDelete,
}: CreditCardActionsProps) {
	const [isPending, startTransition] = useTransition();

	const handleEdit = () => {
		onEdit(card);
	};

	const handleDelete = () => {
		startTransition(() => {
			onDelete(card.id);
		});
	};

	return (
		<div className="absolute top-2 right-20 opacity-0 group-hover:opacity-100 transition-opacity">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="sm"
						className="h-8 w-8 p-0 bg-black/20 text-white hover:bg-black/40"
						disabled={isPending}
					>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem onClick={handleEdit}>
						<Edit className="mr-2 h-4 w-4" />
						Editar Cartão
					</DropdownMenuItem>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
								<Trash2 className="mr-2 h-4 w-4" />
								Excluir Cartão
							</DropdownMenuItem>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Excluir Cartão</AlertDialogTitle>
								<AlertDialogDescription>
									Tem certeza que deseja excluir este cartão? Esta ação não pode
									ser desfeita.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancelar</AlertDialogCancel>
								<AlertDialogAction onClick={handleDelete} disabled={isPending}>
									{isPending ? "Excluindo..." : "Excluir"}
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
