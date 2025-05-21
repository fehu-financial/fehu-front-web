"use client";

import { registerPayment } from "@/actions/transaction";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
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
import { date } from "@/lib/formatter";
import { PaymentSchema } from "@/schemas/payment-schema";
import { PaymentMethod, type Transaction } from "@/types/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

interface PaymentModalProps {
	open: boolean;
	onOpenChangeAction: (open: boolean) => void;
	transaction: Transaction;
}

export function PaymentModal({
	open,
	onOpenChangeAction,
	transaction,
}: PaymentModalProps) {
	const [loading, setLoading] = useState(false);
	const form = useForm<z.infer<typeof PaymentSchema>>({
		resolver: zodResolver(PaymentSchema),
		defaultValues: {
			amount: transaction.amount,
			lateFees: 0,
			paidAt: new Date(),
			receipt: undefined,
			method: transaction.payment?.paymentMethod || PaymentMethod.BANK_SLIP,
		},
	});

	async function onSubmit(data: z.infer<typeof PaymentSchema>) {
		setLoading(true);
		try {
			await registerPayment({
				workspaceId: transaction.origin?.workspacePublicId || "",
				planId: transaction.origin?.planId || "",
				transactionId: transaction.id,
				payment: {
					amount: data.amount,
					method: data.method as PaymentMethod,
					lateFees: data.lateFees,
					paidAt: data.paidAt,
					// receipt: tratar upload se necessário
				},
			});
			toast("Pagamento registrado com sucesso!");
			onOpenChangeAction(false);
			form.reset();
		} catch (e) {
			toast("Erro ao registrar pagamento");
		} finally {
			setLoading(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChangeAction}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Confirmar pagamento</DialogTitle>
					<DialogDescription>
						Preencha as informações para registrar o pagamento da transação.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						className="space-y-4"
						onSubmit={form.handleSubmit(onSubmit)}
						encType="multipart/form-data"
					>
						<FormField
							control={form.control}
							name="amount"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Valor pago</FormLabel>
									<FormControl>
										<Input
											type="number"
											step="0.01"
											min={0}
											{...field}
											onChange={(e) =>
												field.onChange(
													e.target.value === "" ? 0 : Number(e.target.value),
												)
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="lateFees"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Multa/Juros</FormLabel>
									<FormControl>
										<Input
											type="number"
											step="0.01"
											min={0}
											{...field}
											onChange={(e) =>
												field.onChange(
													e.target.value === "" ? 0 : Number(e.target.value),
												)
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="paidAt"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Data</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant="outline"
													className="pl-3 text-left font-normal w-full"
												>
													{field.value ? (
														date(field.value)
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
												selected={field.value}
												onSelect={field.onChange}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="receipt"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Comprovante (opcional)</FormLabel>
									<FormControl>
										<Input
											type="file"
											accept="image/*,application/pdf"
											onChange={(e) => field.onChange(e.target.files?.[0])}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="method"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Método de pagamento</FormLabel>
									<FormControl>
										<Select
											value={field.value}
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<SelectTrigger>
												<SelectValue placeholder="Selecione o método" />
											</SelectTrigger>
											<SelectContent>
												{Object.values(PaymentMethod).map((m) => (
													<SelectItem key={m} value={m}>
														{m.replace("_", " ")}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline" type="button" disabled={loading}>
									Cancelar
								</Button>
							</DialogClose>
							<Button type="submit" disabled={loading}>
								{loading ? "Processando..." : "Confirmar pagamento"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
