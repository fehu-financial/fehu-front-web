"use client";

import { createCreditCard, updateCreditCard } from "@/actions/wallets";
import { getWorkspaces } from "@/actions/wokspaces";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import ColorPicker from "@/components/ui/color-picker";
import { Form } from "@/components/ui/form";
import { FormFieldWrapper } from "@/components/ui/form-field-wrapper";
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
import { cn } from "@/lib/utils";
import { CreditCardSchema } from "@/schemas/credit-card-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { CalendarIcon, CheckCircle2, Loader2 } from "lucide-react";
import { memo, useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { CREDIT_CARD_BRANDS, CREDIT_CARD_ISSUERS } from "../lib/constants";
import type { CreditCard } from "../lib/types";

interface CreditCardFormProps {
	mode?: "create" | "edit";
	accountId?: string;
	creditCard?: CreditCard;
	onSuccess?: () => void;
	onCancel?: () => void;
}

function CreditCardForm({
	mode = "create",
	accountId,
	creditCard,
	onSuccess,
	onCancel,
}: CreditCardFormProps) {
	const [isPending, startTransition] = useTransition();
	const [showAlert, setShowAlert] = useState(false);
	const isEditing = mode === "edit" && creditCard;

	const { data: workspaces } = useQuery({
		queryKey: ["workspaces"],
		queryFn: getWorkspaces,
	});

	const form = useForm<z.infer<typeof CreditCardSchema>>({
		resolver: zodResolver(CreditCardSchema),
		mode: "onBlur",
		defaultValues: {
			lastFourDigits: isEditing ? creditCard?.lastFourDigits : "",
			brand: isEditing ? creditCard?.brand : "",
			issuer: isEditing ? creditCard?.issuer : "",
			expiration: isEditing ? creditCard?.expiration : new Date(),
			closingDay: isEditing ? creditCard?.closingDay : 1,
			dueDay: isEditing ? creditCard?.dueDay : 1,
			color: isEditing ? creditCard?.color : "#1e293b",
			accountId: isEditing ? creditCard?.accountId : accountId || "",
			workspaceId: isEditing ? creditCard?.workspaceId : "",
		},
	});

	useEffect(() => {
		// Auto-focus on first field
		const input = document.getElementById("lastFourDigits");
		if (input) input.focus();
	}, []);

	useEffect(() => {
		if (form.formState.isSubmitSuccessful) {
			setShowAlert(true);
			const timeout = setTimeout(() => {
				setShowAlert(false);
				onSuccess?.();
			}, 1800);
			return () => clearTimeout(timeout);
		}
	}, [form.formState.isSubmitSuccessful, onSuccess]);

	async function onSubmit(data: z.infer<typeof CreditCardSchema>) {
		startTransition(async () => {
			try {
				if (isEditing && creditCard) {
					await updateCreditCard(data.accountId, creditCard.id, data);
				} else {
					await createCreditCard(data);
				}

				form.reset();
			} catch (error) {
				console.error("Failed to save credit card:", error);
			}
		});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<Card>
					<CardContent className="space-y-4">
						{showAlert && (
							<Alert
								variant="default"
								className="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200 animate-fade-in"
							>
								<CheckCircle2 className="h-4 w-4" />
								<AlertDescription>
									{isEditing
										? "Cartão atualizado com sucesso!"
										: "Cartão cadastrado com sucesso!"}
								</AlertDescription>
							</Alert>
						)}

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormFieldWrapper
								control={form.control}
								name="issuer"
								label="Emissor"
								required
								render={(field) => (
									<Select
										onValueChange={field.onChange}
										value={String(field.value || "")}
										defaultValue={String(field.value || "")}
									>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Selecione o emissor" />
										</SelectTrigger>
										<SelectContent>
											{CREDIT_CARD_ISSUERS.map((issuer) => (
												<SelectItem key={issuer.id} value={issuer.id}>
													{issuer.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>

							<FormFieldWrapper
								control={form.control}
								name="brand"
								label="Bandeira"
								required
								render={(field) => (
									<Select
										onValueChange={field.onChange}
										value={String(field.value || "")}
										defaultValue={String(field.value || "")}
									>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Selecione a bandeira" />
										</SelectTrigger>
										<SelectContent>
											{CREDIT_CARD_BRANDS.map((brand) => (
												<SelectItem key={brand.id} value={brand.id}>
													{brand.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormFieldWrapper
								control={form.control}
								name="lastFourDigits"
								label="Número"
								description="Últimos 4 dígitos"
								required
								render={(field) => (
									<Input
										id="lastFourDigits"
										maxLength={4}
										placeholder="Ex: 1234"
										autoFocus
										{...field}
										value={String(field.value || "")}
									/>
								)}
							/>

							<FormFieldWrapper
								control={form.control}
								name="expiration"
								label="Validade"
								description="mm/aaaa"
								required
								render={(field) => (
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												className={cn(
													"pl-3 text-left font-normal w-full",
													!field.value && "text-muted-foreground",
												)}
											>
												{field.value ? (
													date(new Date(field.value))
												) : (
													<span>Selecione</span>
												)}
												<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={
													field.value ? new Date(field.value) : undefined
												}
												onSelect={field.onChange}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
								)}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormFieldWrapper
								control={form.control}
								name="closingDay"
								label="Dia de fechamento"
								required
								render={(field) => (
									<Input
										type="number"
										min={1}
										max={31}
										{...field}
										value={String(field.value || "")}
										onChange={(e) => field.onChange(Number(e.target.value))}
									/>
								)}
							/>

							<FormFieldWrapper
								control={form.control}
								name="dueDay"
								label="Dia de vencimento"
								required
								render={(field) => (
									<Input
										type="number"
										min={1}
										max={31}
										{...field}
										value={String(field.value || "")}
										onChange={(e) => field.onChange(Number(e.target.value))}
									/>
								)}
							/>
						</div>

						<FormFieldWrapper
							control={form.control}
							name="color"
							label="Cor do cartão"
							description="Selecione uma cor para o cartão"
							required
							render={(field) => (
								<Popover>
									<PopoverTrigger asChild>
										<div
											className="w-8 h-8 rounded-full border cursor-pointer"
											style={{ background: String(field.value || "#1e293b") }}
										/>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-2">
										<ColorPicker
											initialColor={String(field.value || "#1e293b")}
											onColorChange={field.onChange}
											className="custom-class"
										/>
									</PopoverContent>
								</Popover>
							)}
						/>

						<FormFieldWrapper
							control={form.control}
							name="workspaceId"
							label="Workspace para despesas"
							description="Selecione o workspace onde as despesas da fatura serão criadas"
							required
							render={(field) => (
								<Select
									onValueChange={field.onChange}
									value={String(field.value || "")}
									defaultValue={String(field.value || "")}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Selecione o workspace" />
									</SelectTrigger>
									<SelectContent>
										{workspaces?.map((workspace) => (
											<SelectItem key={workspace.id} value={workspace.id}>
												{workspace.title}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>
					</CardContent>
				</Card>

				<div className="flex justify-end gap-3 mt-4">
					{onCancel && (
						<Button
							type="button"
							variant="outline"
							onClick={onCancel}
							disabled={isPending}
						>
							Cancelar
						</Button>
					)}
					<Button type="submit" className="min-w-[140px]" disabled={isPending}>
						{isPending ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								{isEditing ? "Atualizando..." : "Salvando..."}
							</>
						) : isEditing ? (
							"Atualizar Cartão"
						) : (
							"Cadastrar Cartão"
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}

export { CreditCardForm };
export default memo(CreditCardForm);
