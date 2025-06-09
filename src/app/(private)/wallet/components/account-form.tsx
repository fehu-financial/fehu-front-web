"use client";

import { createAccount, updateAccount } from "@/actions/wallets";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { FormFieldWrapper } from "@/components/ui/form-field-wrapper";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { AccountSchema } from "@/schemas/account-schema";
import type { Account } from "@/types/wallet";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { ACCOUNT_TYPES, BANKS } from "../lib/constants";

interface AccountFormProps {
	account?: Account;
	onSuccess?: () => void;
	mode?: "create" | "edit";
}

export default function AccountForm({
	account,
	onSuccess,
	mode = account ? "edit" : "create",
}: AccountFormProps) {
	const isEditing = mode === "edit" && account;
	const [showAlert, setShowAlert] = useState(false);
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof AccountSchema>>({
		resolver: zodResolver(AccountSchema),
		defaultValues: {
			type: isEditing ? (account.type as any) : "CHECKING",
			institution: isEditing ? account.institution : "",
			number: isEditing ? account.number : "",
			agency: isEditing ? account.agency : "",
		},
	});

	const { isValid, isSubmitSuccessful } = form.formState;

	useEffect(() => {
		if (isSubmitSuccessful) {
			setShowAlert(true);
			const timeout = setTimeout(() => {
				setShowAlert(false);
				onSuccess?.();
			}, 1800);
			return () => clearTimeout(timeout);
		}
	}, [isSubmitSuccessful, onSuccess]);

	const onSubmit = (data: z.infer<typeof AccountSchema>) => {
		startTransition(async () => {
			try {
				const formData = new FormData();
				formData.append("type", data.type);
				formData.append("institution", data.institution);
				formData.append("number", data.number);
				formData.append("agency", data.agency);

				if (isEditing && account) {
					await updateAccount(account.id, formData);
				} else {
					await createAccount(formData);
				}

				form.reset();
			} catch (error) {
				console.error("Error submitting form:", error);
			}
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<Card>
					<CardContent className="space-y-4 pt-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormFieldWrapper
								control={form.control}
								name="institution"
								label="Instituição"
								required
								render={(field) => (
									<Select
										onValueChange={field.onChange}
										value={field.value}
										defaultValue={field.value}
									>
										<SelectTrigger>
											<SelectValue placeholder="Selecione a instituição" />
										</SelectTrigger>
										<SelectContent>
											{Object.entries(BANKS).map(([key, bank]) => (
												<SelectItem key={key} value={key}>
													{bank.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>

							<FormFieldWrapper
								control={form.control}
								name="type"
								label="Tipo de Conta"
								required
								render={(field) => (
									<Select
										onValueChange={field.onChange}
										value={field.value}
										defaultValue={field.value}
									>
										<SelectTrigger>
											<SelectValue placeholder="Selecione o tipo" />
										</SelectTrigger>
										<SelectContent>
											{ACCOUNT_TYPES.map((type) => (
												<SelectItem key={type.value} value={type.value}>
													{type.label}
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
								name="agency"
								label="Agência"
								required
								render={(field) => (
									<Input
										placeholder="Ex: 1234"
										{...field}
										disabled={isPending}
									/>
								)}
							/>

							<FormFieldWrapper
								control={form.control}
								name="number"
								label="Número da Conta"
								required
								render={(field) => (
									<Input
										placeholder="Ex: 123456-7"
										{...field}
										disabled={isPending}
									/>
								)}
							/>
						</div>
					</CardContent>
				</Card>

				{showAlert && (
					<Alert className="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
						<CheckCircle2 className="h-4 w-4" />
						<AlertDescription>
							{isEditing
								? "Conta atualizada com sucesso!"
								: "Conta cadastrada com sucesso!"}
						</AlertDescription>
					</Alert>
				)}

				<div className="flex justify-end gap-3">
					<Button
						type="button"
						variant="outline"
						onClick={() => onSuccess?.()}
						disabled={isPending}
					>
						Cancelar
					</Button>

					<Button
						type="submit"
						disabled={isPending || !isValid}
						className="min-w-[140px]"
					>
						{isPending ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								{isEditing ? "Atualizando..." : "Salvando..."}
							</>
						) : (
							<>{isEditing ? "Atualizar Conta" : "Cadastrar Conta"}</>
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}
