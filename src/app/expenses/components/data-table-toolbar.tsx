import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Spinner from "@/components/ui/spinner";
import { PlusIcon } from "lucide-react";
import AddExpenseForm from "./add-expense-form";

interface DataTableToolbarProps {
	isFetching?: boolean;
}

export function DataTableToolbar({ isFetching }: DataTableToolbarProps) {
	return (
		<div className="flex items-center">
			{isFetching && <Spinner className="mr-2" />}
			<Popover>
				<PopoverTrigger asChild>
					<Button variant="outline" size="sm" className="ml-auto hidden h-8 lg:flex space-x-1">
						<PlusIcon size={16} className="ml-2" />
						<span>Add</span>
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-96 p-6" align="start">
					<AddExpenseForm />
				</PopoverContent>
			</Popover>
		</div>
	);
}
