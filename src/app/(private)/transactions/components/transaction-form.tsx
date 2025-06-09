"use client";

import { createTransaction } from "@/actions/transaction";
import { getWorkspaces } from "@/actions/wokspaces";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { CategorySelect } from "@/components/ui/category-select";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import Spinner from "@/components/ui/spinner";
import { TagInput } from "@/components/ui/tag-input";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useWorkspaceParams } from "@/hooks/use-workspace";
import Formatter from "@/lib/formatter";
import { cn } from "@/lib/utils";
import { TransactionSchema } from "@/schemas/transaction-schema";
import { TransactionType } from "@/types/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { CalendarIcon, CreditCard } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { creditCards } from "./credit-cards";
import { recurrencies } from "./properties";

export default function TransactionForm() {
	const [loading, setLoading] = useState(false);
	const { workspaces: selectedWorkspaceIds } = useWorkspaceParams();
	const { data: workspaces } = useQuery({
		queryKey: ["workspaces"],
		queryFn: getWorkspaces,
	});
	const selectedWorkspace =
		workspaces && selectedWorkspaceIds.length > 0
			? workspaces.find((w) => w.id === selectedWorkspaceIds[0])
			: null;

	const [transactionType, setTransactionType] = useState<TransactionType>(
		TransactionType.EXPENSE,
	);

	const form = useForm<z.infer<typeof TransactionSchema>>({
		resolver: zodResolver(TransactionSchema),
		defaultValues: {
			title: "",
			description: "",
			amount: 0,
			category: "",
			date: new Date(),
			recurrence: undefined,
			installments: undefined,
			type: TransactionType.EXPENSE,
			workspaceId: selectedWorkspace?.id || "",
			tags: [],
		},
	});

	const watchInstallments = form.watch("installments");
	const watchAmount = form.watch("amount");
	const watchTags = form.watch("tags");

	const [paymentType, setPaymentType] = useState<
		"UNIQUE" | "INSTALLMENTS" | "RECURRING"
	>("UNIQUE");

	// Calcula valor da parcela
	const installmentValue = useMemo(() => {
		if (
			paymentType === "INSTALLMENTS" &&
			watchInstallments?.total &&
			watchAmount > 0
		) {
			return watchAmount / watchInstallments.total;
		}
		return 0;
	}, [paymentType, watchInstallments, watchAmount]);

	async function onSubmit(
		data: z.infer<typeof TransactionSchema> & { tags?: string[] },
	) {
		setLoading(true);
		try {
			if (!selectedWorkspace) throw new Error("Workspace não selecionado");

			const payload = {
				...data,
				dueDate: data.date,
				installments: data.installments
					? {
							total: data.installments.total,
							creditCardId: data.installments.creditCard?.id || undefined,
						}
					: undefined,
				recurrence: data.recurrence
					? { frequency: data.recurrence }
					: undefined,
				tags: data.tags || [],
			};

			createTransaction(payload);

			toast(
				`Transação criada com sucesso! ${data.title} foi registrada no valor de ${Formatter.currency(data.amount)}`,
			);
			form.reset();
		} catch (error) {
			toast(
				"Erro ao criar transação. Ocorreu um problema ao processar sua solicitação.",
			);
			setLoading(false);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<Card>
					<CardContent>
						<div className="flex flex-col gap-4">
							{/* Tipo de transação */}
							<FormField
								control={form.control}
								name="type"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Tipo de transação</FormLabel>
										<FormControl>
											<ToggleGroup
												type="single"
												value={field.value}
												onValueChange={field.onChange}
												className="w-full"
											>
												<ToggleGroupItem
													value={TransactionType.EXPENSE}
													className="p-4"
												>
													Despesa
												</ToggleGroupItem>
												<ToggleGroupItem
													value={TransactionType.REVENUE}
													className="p-4"
												>
													Receita
												</ToggleGroupItem>
											</ToggleGroup>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{/* Título */}
							<div>
								<FormField
									control={form.control}
									name="title"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Título da transação</FormLabel>
											<FormControl>
												<Input placeholder="Ex: Conta de luz" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							{/* Descrição */}
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Descrição (opcional)</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Adicione mais detalhes sobre esta transação..."
												className="resize-none"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{/* Data de vencimento */}
							<FormField
								control={form.control}
								name="date"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>Data de vencimento</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														className={cn(
															"pl-3 text-left font-normal w-full",
															!field.value && "text-muted-foreground",
														)}
													>
														{field.value ? (
															Formatter.date(field.value as Date)
														) : (
															<span>Selecione a data</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													mode="single"
													selected={field.value as Date}
													onSelect={field.onChange}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>
							{/* Categoria */}
							<div className="flex flex-col md:flex-row gap-4">
								<FormField
									control={form.control}
									name="category"
									render={({ field }) => (
										<FormItem className="w-full">
											<FormLabel>Categoria</FormLabel>
											<CategorySelect
												placeholder="Selecione uma categoria"
												onValueChange={field.onChange}
												defaultValue={field.value}
												className="w-full"
											/>
											<FormMessage />
										</FormItem>
									)}
								/>
								{/* Workspace */}
								<FormField
									control={form.control}
									name="workspaceId"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Workspace</FormLabel>
											<FormControl>
												<Select
													onValueChange={field.onChange}
													value={field.value}
													defaultValue={field.value}
												>
													<SelectTrigger>
														<SelectValue placeholder="Selecione o workspace" />
													</SelectTrigger>
													<SelectContent>
														{workspaces?.map((ws) => (
															<SelectItem key={ws.id} value={ws.id}>
																{ws.title}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="space-y-6">
						{/* Valor e tipo de pagamento */}
						<div className="flex flex-col md:flex-row gap-4 items-end">
							<div className="flex-1">
								<FormField
									control={form.control}
									name="amount"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Valor total</FormLabel>
											<FormControl>
												<Input
													type="number"
													step="0.01"
													placeholder="0,00"
													{...field}
													onChange={(e) =>
														field.onChange(Number.parseFloat(e.target.value))
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="flex-1 min-w-[250px]">
								<label
									htmlFor="paymentType"
									className="block text-sm font-medium mb-2"
								>
									Tipo de pagamento
								</label>
								<ToggleGroup
									variant="outline"
									type="single"
									className="w-full"
									value={paymentType}
									onValueChange={(v) =>
										setPaymentType(
											(v as "UNIQUE" | "INSTALLMENTS" | "RECURRING") ||
												"UNIQUE",
										)
									}
									id="paymentType"
								>
									<ToggleGroupItem value="UNIQUE" className="p-4">
										Única
									</ToggleGroupItem>
									<ToggleGroupItem value="INSTALLMENTS" className="p-4">
										Parcelado
									</ToggleGroupItem>
									<ToggleGroupItem value="RECURRING" className="p-4">
										Recorrente
									</ToggleGroupItem>
								</ToggleGroup>
							</div>
						</div>

						{/* Parcelamento */}
						{paymentType === "INSTALLMENTS" && (
							<div className="rounded-md space-y-4">
								<FormField
									control={form.control}
									name="installments"
									render={({ field }) => (
										<FormItem>
											<div className="flex flex-col md:flex-row gap-4">
												<div className="flex-1">
													<FormLabel>Parcelas</FormLabel>
													<Input
														type="number"
														min={1}
														max={36}
														value={field.value?.total || 0}
														onChange={(e) => {
															const total = Number(e.target.value);
															if (!Number.isNaN(total))
																field.onChange({ ...field.value, total });
														}}
													/>
												</div>
												<div className="flex-1">
													<FormLabel>Cartão de crédito</FormLabel>
													<Select
														onValueChange={(creditCardId) => {
															field.onChange({
																...field.value,
																creditCard: creditCards.find(
																	(c) => c.id === creditCardId,
																),
															});
														}}
														value={field.value?.creditCard?.id || ""}
														disabled={
															!(field.value?.total && field.value.total > 0)
														}
													>
														<SelectTrigger>
															<SelectValue placeholder="Selecione um cartão" />
														</SelectTrigger>
														<SelectContent>
															{creditCards.map((card) => (
																<SelectItem key={card.id} value={card.id}>
																	<div className="flex items-center gap-2">
																		<CreditCard className="h-4 w-4" />
																		<span>
																			{card.issuer} •••• {card.lastDigits} (
																			{card.brand})
																		</span>
																	</div>
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>
											</div>
											{/* Preview das parcelas */}

											<FormDescription>
												{field.value?.total &&
													field.value?.total > 0 &&
													watchAmount > 0 && (
														<span>
															{field.value?.total}x{" "}
															{Formatter.currency(installmentValue)}
														</span>
													)}
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						)}

						{/* Recorrência */}
						{paymentType === "RECURRING" && (
							<div className="rounded-md mt-2">
								<FormField
									control={form.control}
									name="recurrence"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Frequência de recorrência</FormLabel>
											<ToggleGroup
												variant="outline"
												type="single"
												value={field.value}
												onValueChange={field.onChange}
											>
												{recurrencies.map((recurrence) => (
													<ToggleGroupItem
														key={recurrence.id}
														value={recurrence.id}
														className="p-4"
													>
														{recurrence.label}
													</ToggleGroupItem>
												))}
											</ToggleGroup>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardContent>
						{/* Tags */}
						<FormField
							control={form.control}
							name="tags"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tags</FormLabel>
									<FormControl>
										<TagInput
											value={Array.isArray(field.value) ? field.value : []}
											onChange={field.onChange}
											placeholder="Digite e pressione Enter para adicionar"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>
				</Card>

				<div className="flex justify-end">
					<Button type="submit" className="w-full md:w-auto" disabled={loading}>
						{loading ? (
							<>
								<Spinner className="mr-2" /> Processando...
							</>
						) : (
							"Criar transação"
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}
