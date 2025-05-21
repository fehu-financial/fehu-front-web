import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import Spinner from "@/components/ui/spinner";
import { PlusIcon } from "lucide-react";
import TransactionForm from "./transaction-form";

interface DataTableToolbarProps {
	isFetching?: boolean;
}

export function DataTableToolbar({ isFetching }: DataTableToolbarProps) {
	return (
		<div className="flex items-center">
			{isFetching && <Spinner className="mr-2" />}
			<Dialog>
				<DialogTrigger asChild>
					<Button
						variant="outline"
						size="sm"
						className="ml-auto hidden h-8 lg:flex space-x-1"
					>
						<PlusIcon size={16} className="ml-2" />
						<span>Add</span>
					</Button>
				</DialogTrigger>
				<DialogContent className="p-6 max-w-md w-full">
					<DialogTitle>Adicionar/Alterar Transações</DialogTitle>
					<TransactionForm />
				</DialogContent>
			</Dialog>
		</div>
	);
}
