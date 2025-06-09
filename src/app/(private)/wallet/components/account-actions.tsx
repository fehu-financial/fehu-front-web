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
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { useTransition } from "react";

interface AccountActionsProps {
	onEdit: () => void;
	onDelete: () => void;
}

export function AccountActions({ onEdit, onDelete }: AccountActionsProps) {
	const [isPending, startTransition] = useTransition();

	const handleDelete = () => {
		startTransition(() => {
			onDelete();
		});
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="h-8 w-8 p-0 text-white hover:bg-white/20"
					disabled={isPending}
				>
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={onEdit}>
					<Edit className="mr-2 h-4 w-4" />
					Editar Conta
				</DropdownMenuItem>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
							<Trash2 className="mr-2 h-4 w-4" />
							Excluir Conta
						</DropdownMenuItem>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Excluir Conta</AlertDialogTitle>
							<AlertDialogDescription>
								Tem certeza que deseja excluir esta conta? Esta ação não pode
								ser desfeita. Todos os cartões vinculados também serão
								excluídos.
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
	);
}
