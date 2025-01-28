import type { Expense } from "@/@core/domain/expense";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table/data-table";
import { WorkspaceSwitcher } from "@/components/ui/workspace-switch";
import { PlusIcon } from "lucide-react";
import AddExpenseForm from "./components/AddExpenseForm";
import { ExpensesProvider } from "./components/ExpensesContext";
import columns from "./components/columns";
import { DataTableToolbar } from "./components/data-table-toolbar";

export default function ExpensesPage() {
	const mockData: Expense[] = [
		{
			id: "1",
			title: "Taxa de Condomínio de Janeiro",
			date: new Date("2023-01-01"),
			category: "CONDO",
			amount: 50.0,
			description: "Taxa mensal do condomínio referente a Janeiro",
			status: "OVERDUE",
		},
		{
			id: "2",
			title: "Pagamento do Cartão de Crédito",
			date: new Date("2023-01-02"),
			category: "CREDIT_CARD",
			amount: 15.0,
			description: "Pagamento mínimo do cartão de crédito",
			status: "PENDING",
		},
		{
			id: "3",
			title: "Compras no Mercado",
			date: new Date("2023-01-03"),
			category: "MARKET",
			amount: 100.0,
			description: "Compras semanais no mercado local",
			status: "OVERDUE",
		},
		{
			id: "4",
			title: "Manutenção do Carro",
			date: new Date("2023-01-04"),
			category: "VEHICLE",
			amount: 75.0,
			description: "Manutenção mensal do carro e combustível",
			status: "PAID",
			recurrence: "MONTHLY",
		},
		{
			id: "5",
			title: "Ração para Animais",
			date: new Date("2023-01-05"),
			category: "FEED",
			amount: 200.0,
			description: "Suprimento mensal de ração para animais",
			status: "PENDING",
		},
		{
			id: "6",
			title: "Taxa de Condomínio de Fevereiro",
			date: new Date("2023-02-01"),
			category: "CONDO",
			amount: 60.0,
			description: "Taxa mensal do condomínio referente a Fevereiro",
			status: "PAID",
		},
		{
			id: "7",
			title: "Mensalidade do Plano de Saúde",
			date: new Date("2023-02-02"),
			category: "HEALTH",
			amount: 25.0,
			description: "Pagamento mínimo do cartão de crédito",
			status: "OVERDUE",
			recurrence: "MONTHLY",
		},
		{
			id: "8",
			title: "Seguro do Carro",
			date: new Date("2023-02-03"),
			category: "INSURANCE",
			amount: 150.0,
			description: "Compras semanais no mercado local",
			status: "PENDING",
			recurrence: "MONTHLY",
		},
		{
			id: "9",
			title: "Assinatura do Spotify",
			date: new Date("2023-02-04"),
			category: "SUBSCRIPTION",
			amount: 85.0,
			description: "Manutenção mensal do carro e combustível",
			status: "OVERDUE",
			recurrence: "YEARLY",
		},
		{
			id: "10",
			title: "Financiaimento do Apartamento",
			date: new Date("2023-02-05"),
			category: "HOME",
			amount: 220.0,
			description: "Suprimento mensal de ração para animais",
			status: "PAID",
		},
	];
	return (
		<ExpensesProvider>
			<div className="min-h-full overflow-auto scrollbar-hide p-6">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold mb-8">Expense Management</h1>
					<WorkspaceSwitcher className="mb-8" />
				</div>
				<div className="flex">
					<DataTable
						columns={columns}
						data={mockData}
						toolbar={<DataTableToolbar />}
					/>
				</div>
			</div>
		</ExpensesProvider>
	);
}
