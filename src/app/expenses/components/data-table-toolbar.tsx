"use client";

import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { PlusIcon } from "lucide-react";
import AddExpenseForm from "./add-expense-form";

export function DataTableToolbar() {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="ml-auto hidden h-8 lg:flex space-x-1"
				>
					<PlusIcon size={16} className="ml-2" />
					<span>Add</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-96 p-6" align="start">
				<AddExpenseForm />
			</PopoverContent>
		</Popover>
	);
}
