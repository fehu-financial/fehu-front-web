"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-headers";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import Formatter from "@/lib/formatter";
import { cn } from "@/lib/utils";
import { PaymentMethod, type Transaction } from "@/types/transaction";
import type { ColumnDef } from "@tanstack/react-table";
import { differenceInCalendarDays } from "date-fns";
import {
	AlertTriangleIcon,
	Calendar1Icon,
	CheckCircle2Icon,
	CreditCardIcon,
	FileSpreadsheet,
	MoreHorizontal,
	RefreshCcwIcon,
	TagIcon,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { PaymentModal } from "./payment-modal";
import { categories, recurrencies, statuses } from "./properties";

const columns: ColumnDef<Transaction>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
				className="translate-y-[2px]"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
				className="translate-y-[2px]"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "title",
		header: ({ column }) => (
			<DataTableColumnHeader title="Descrição" column={column} />
		),
		cell: ({ row }) => {
			const tags = row.original.tags || [];
			const workspaceColor = row.original.origin?.workspace?.color || "#6b7280";

			return (
				<div className="flex">
					{/* Barra vertical sutil do workspace */}
					<div
						className="w-1 mr-3 rounded-full flex-shrink-0"
						style={{ backgroundColor: workspaceColor }}
					/>
					<div className="flex flex-col space-y-1">
						<span className="text-base font-semibold">
							{row.original.title}
						</span>
						<span className="text-xs text-muted-foreground">
							{row.original.description}
						</span>
						{tags.length > 0 && (
							<div className="flex flex-wrap gap-1 mt-1">
								{tags.map((tag) => (
									<Badge key={tag} variant="secondary" className="text-xs">
										<TagIcon size={10} className="mr-1" />
										{tag}
									</Badge>
								))}
							</div>
						)}
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "category",
		header: ({ column }) => (
			<DataTableColumnHeader title="Categoria" column={column} />
		),
		cell: (info) => {
			const category = categories.find((c) => c.id === info.getValue());
			return (
				<div className={cn("flex items-center space-x-2 font-semibold")}>
					<div
						className={cn(
							"rounded-full p-1.5 font-bold",
							category ? category?.color : "gray-600",
						)}
					>
						{category && <category.icon size={16} />}
					</div>
					<span>{category?.label}</span>
				</div>
			);
		},
	},
	{
		accessorKey: "dueDate",
		header: ({ column }) => (
			<DataTableColumnHeader
				className="justify-center"
				title="Vencimento"
				column={column}
			/>
		),
		cell: ({ row }) => {
			const date = row.original?.dueDate;

			if (!date)
				return (
					<span className="text-muted-foreground">
						No due date for payment id: {row.original.id}
					</span>
				);

			const diffDays = differenceInCalendarDays(date, new Date());
			const formattedDate = Formatter.date(date);

			const statusProps =
				row.original.status === "PAID"
					? {
							color: "text-green-500",
							icon: CheckCircle2Icon,
							text: row.original.payment?.paidAt
								? `Pago em: ${Formatter.date(row.original.payment.paidAt)}`
								: "Pago (data não registrada)",
						}
					: diffDays < 0
						? {
								color: "text-red-500",
								icon: AlertTriangleIcon,
								text: `Vencido há ${Math.abs(diffDays)} dia${Math.abs(diffDays) !== 1 ? "s" : ""}`,
							}
						: diffDays <= 7
							? {
									color: "text-orange-500",
									icon: AlertTriangleIcon,
									text:
										diffDays === 0
											? "Vence hoje"
											: `Vence em ${diffDays} dia${diffDays !== 1 ? "s" : ""}`,
								}
							: {
									color: "text-amber-500",
									icon: Calendar1Icon,
									text: "Pendente",
								};

			return (
				<div className="flex flex-col items-center gap-1">
					<div className="flex items-center">
						<Calendar1Icon
							size={16}
							className={`mr-2 ${row.original.status === "OVERDUE" ? "text-red-500" : ""}`}
						/>
						<span
							className={`font-medium ${row.original.status === "OVERDUE" ? "text-red-500" : ""}`}
						>
							{formattedDate}
						</span>
						{row.original.recurrence && (
							<RefreshCcwIcon size={14} className="ml-2" />
						)}
					</div>

					<Badge
						variant="outline"
						className={`${statusProps.color} text-xs flex items-center`}
					>
						<statusProps.icon size={12} className="mr-1" />
						<span>{statusProps.text}</span>
					</Badge>
				</div>
			);
		},
	},

	{
		accessorKey: "amount",
		header: ({ column }) => (
			<DataTableColumnHeader
				className="justify-center"
				title="Valor"
				column={column}
			/>
		),
		cell: ({ row }) => {
			const value = row.getValue("amount");
			const installments = row.original.installments;
			const paymentMethod = row.original.payment?.paymentMethod;

			return (
				<div className="flex flex-col items-end space-y-1">
					<div className="font-semibold text-right text-base">
						{Formatter.currency(Number(value))}
					</div>

					{paymentMethod && (
						<div className="flex flex-col items-end w-full">
							<div className="flex items-center text-xs text-muted-foreground">
								{paymentMethod === PaymentMethod.CREDIT_CARD ? (
									<CreditCardIcon size={10} className="mr-1 text-blue-500" />
								) : paymentMethod === PaymentMethod.DEBIT_CARD ? (
									<CreditCardIcon size={10} className="mr-1 text-green-500" />
								) : paymentMethod === PaymentMethod.PIX ? (
									<div className="h-2.5 w-2.5 relative mr-1">
										<Image
											src="/images/payment-methods/pix.svg"
											alt="PIX"
											width={10}
											height={10}
											className="text-green-500 [filter:invert(53%)_sepia(90%)_saturate(1695%)_hue-rotate(122deg)_brightness(97%)_contrast(101%)]"
										/>
									</div>
								) : paymentMethod === PaymentMethod.CASH ? (
									<span className="mr-1 text-green-600 text-xs">$</span>
								) : paymentMethod === PaymentMethod.BANK_SLIP ? (
									<div className="h-2.5 w-2.5 relative mr-1">
										<FileSpreadsheet size={10} />
									</div>
								) : null}
								<span>{paymentMethod?.replace("_", " ")}</span>
							</div>
							{/* Informações extras do pagamento */}
							{row.original.payment && (
								<div className="flex flex-col items-end text-[10px] text-muted-foreground mt-0.5 w-full">
									{typeof row.original.payment.lateFees === "number" &&
										row.original.payment.lateFees > 0 && (
											<span>
												Juros pagos:{" "}
												<span className="font-medium">
													{Formatter.currency(row.original.payment.lateFees)}
												</span>
											</span>
										)}
									{row.original.payment.paidBy && (
										<Tooltip>
											<TooltipTrigger asChild>
												<div className="flex items-center gap-1">
													<span>Pago por:</span>
													{row.original.payment.paidBy?.avatar ? (
														<img
															src={row.original.payment.paidBy.avatar}
															alt={
																row.original.payment.paidBy?.name ||
																row.original.payment.paidBy?.email ||
																"User"
															}
															width={12}
															height={12}
															className="rounded-full"
														/>
													) : (
														<span className="font-medium">
															{row.original.payment.paidBy?.name.charAt(0)}
														</span>
													)}
												</div>
											</TooltipTrigger>
											<TooltipContent>
												{row.original.payment.paidBy?.name ||
													row.original.payment.paidBy?.email}
											</TooltipContent>
										</Tooltip>
									)}
								</div>
							)}
						</div>
					)}

					{installments && (
						<div className="flex flex-col items-end space-y-1">
							<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
								{installments.creditCard && (
									<div className="flex items-center">
										<div className="h-3 w-4 relative mr-0.5">
											<Image
												src={`/images/credit-cards/brands/${installments.creditCard.brand.toLowerCase()}.svg`}
												alt={installments.creditCard.brand}
												fill
												className="object-contain"
											/>
										</div>
										<span className="font-mono text-[10px]">
											•{installments.creditCard.lastDigits}
										</span>
									</div>
								)}
								<span className="text-xs">
									{installments.current}/{installments.total}x{" "}
									{Formatter.currency(installments.totalAmount ?? 0)}
								</span>
							</div>
							<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
								<div
									className="bg-green-500 h-1 rounded-full"
									style={{
										width: `${(installments.current / installments.total) * 100}%`,
									}}
								/>
							</div>
						</div>
					)}
				</div>
			);
		},
	},

	{
		id: "actions",
		cell: ({ row }) => {
			const [showPaymentModal, setShowPaymentModal] = useState(false);

			return (
				<>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Ações</DropdownMenuLabel>
							<DropdownMenuItem
								onClick={() => navigator.clipboard.writeText(row.original.id)}
							>
								Copiar ID
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Editar</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setShowPaymentModal(true)}>
								Marcar como pago
							</DropdownMenuItem>
							<DropdownMenuItem>Ver histórico</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem className="text-red-600">
								Excluir
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<PaymentModal
						open={showPaymentModal}
						transaction={row.original}
						onOpenChangeAction={(isOpen: boolean) => {
							setShowPaymentModal(isOpen);
						}}
					/>
				</>
			);
		},
	},
];

export default columns;
