"use server";

import { fetchWithAuth } from "@/data/http-client";
import { AccountSchema, UpdateAccountSchema } from "@/schemas/account-schema";
import type {
	CreateCreditCardInput,
	UpdateCreditCardInput,
	WalletsResponse,
} from "@/types/wallet";
import { revalidatePath } from "next/cache";

const API_URL = `${process.env.FEHU_BFF_API_URL}/wallets`;

/**
 * Busca todas as contas e cartões do usuário.
 */
export async function getUserWallet(): Promise<WalletsResponse> {
	return await fetchWithAuth(API_URL, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
		next: { revalidate: 30 },
	});
}

/**
 * Cria uma nova conta bancária com validação.
 */
export async function createAccount(formData: FormData) {
	try {
		const input = {
			type: formData.get("type") as string,
			institution: formData.get("institution") as string,
			number: formData.get("number") as string,
			agency: formData.get("agency") as string,
			name: formData.get("name") as string,
		};
		const parsed = AccountSchema.safeParse(input);
		if (!parsed.success) {
			return {
				success: false,
				message: "Erro de validação.",
				error: parsed.error.errors.map((e) => e.message).join(" "),
			};
		}
		await fetchWithAuth(`${API_URL}/accounts`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(parsed.data),
		});

		revalidatePath("/wallet");

		return {
			success: true,
			message: "Conta cadastrada com sucesso!",
		};
	} catch (error) {
		return {
			success: false,
			message: "Erro ao salvar conta.",
			error: error instanceof Error ? error.message : "Erro desconhecido.",
		};
	}
}

/**
 * Cria um novo cartão de crédito vinculado a uma conta.
 */
export async function createCreditCard(input: CreateCreditCardInput) {
	const res = await fetchWithAuth(
		`${API_URL}/accounts/${input.accountId}/credit-cards`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(input),
		},
	);
	revalidatePath("/wallet");
	return res;
}

/**
 * Atualiza os dados de uma conta bancária com validação.
 */
export async function updateAccount(accountId: string, formData: FormData) {
	try {
		const input = {
			type: formData.get("type") as string,
			institution: formData.get("institution") as string,
			number: formData.get("number") as string,
			agency: formData.get("agency") as string,
			name: formData.get("name") as string,
		};
		const parsed = UpdateAccountSchema.safeParse(input);
		if (!parsed.success) {
			return {
				success: false,
				message: "Erro de validação.",
				error: parsed.error.errors.map((e) => e.message).join(" "),
			};
		}
		await fetchWithAuth(`${API_URL}/accounts/${accountId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(parsed.data),
		});
		revalidatePath("/wallet");
		return {
			success: true,
			message: "Conta atualizada com sucesso!",
		};
	} catch (error) {
		return {
			success: false,
			message: "Erro ao salvar conta.",
			error: error instanceof Error ? error.message : "Erro desconhecido.",
		};
	}
}

/**
 * Remove uma conta bancária.
 */
export async function deleteAccount(accountId: string) {
	await fetchWithAuth(`${API_URL}/accounts/${accountId}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
	});

	revalidatePath("/wallet");
}

/**
 * Atualiza os dados de um cartão de crédito.
 */
export async function updateCreditCard(
	accountId: string,
	cardId: string,
	input: UpdateCreditCardInput,
) {
	const res = await fetchWithAuth(
		`${API_URL}/accounts/${accountId}/credit-cards/${cardId}`,
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(input),
		},
	);

	revalidatePath("/wallet");
	return res;
}

/**
 * Remove um cartão de crédito de uma conta.
 * @param accountId - ID da conta associada ao cartão
 * @param cardId - ID do cartão de crédito a ser removido
 * @returns Promise<void | any> (ajuste o tipo de retorno conforme a API)
 */
export async function deleteCreditCard(
	accountId: string,
	cardId: string,
): Promise<void> {
	await fetchWithAuth(
		`${API_URL}/accounts/${accountId}/credit-cards/${cardId}`,
		{
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		},
	);
	revalidatePath("/wallet");
}
