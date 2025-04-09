import { WorkspaceCombobox } from "@/components/ui/workspaces/workspace-combobox";
import { WorkspaceSwitcher } from "@/components/ui/workspaces/workspace-switch";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import ExpensesOverview from "./components/expenses-overview";
dynamic(() => import("./components/expenses-overview"));

export default function ExpensesPage() {
	return (
		<div className="min-h-full overflow-auto scrollbar-hide p-6">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold mb-8">Gastos e Despesas</h1>
				<WorkspaceCombobox />
			</div>
			<ExpensesOverview />
		</div>
	);
}
