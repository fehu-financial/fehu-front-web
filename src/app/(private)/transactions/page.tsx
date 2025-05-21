import { PageContainer } from "@/components/ui/page-container";
import { WorkspaceCombobox } from "@/components/ui/workspace-combobox";
import dynamic from "next/dynamic";
import ExpensesOverview from "./components/expenses-overview";
dynamic(() => import("./components/expenses-overview"));

export default function ExpensesPage() {
	return (
		<PageContainer
			title="Extrato Transações"
			description="Gerencie suas operações de gastos e ganhos."
			header={<WorkspaceCombobox />}
		>
			<ExpensesOverview />
		</PageContainer>
	);
}
