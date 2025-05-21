"use client";

import { Suspense } from "react";

import { PageContainer } from "@/components/ui/page-container";
import { WorkspaceCombobox } from "@/components/ui/workspace-combobox";
import ExpensesOverview from "./components/expenses-overview";

export default function ExpensesPage() {
	return (
		<Suspense
			fallback={
				<div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto my-8" />
			}
		>
			<PageContainer
				title="Extrato Transações"
				description="Gerencie suas operações de gastos e ganhos."
				header={<WorkspaceCombobox />}
			>
				<ExpensesOverview />
			</PageContainer>
		</Suspense>
	);
}
