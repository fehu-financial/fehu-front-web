"use server";

import { fetchWithAuth } from "@/data/http-client";
import type {
	CreateTransactionInput,
	RegisterPaymentInput,
	Transaction,
} from "@/types/transaction";

const API_URL = `${process.env.FEHU_BFF_API_URL}/transactions`;

export const createTransaction = async (
	data: CreateTransactionInput,
): Promise<Transaction> => {
	return fetchWithAuth(API_URL, {
		method: "POST",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
		},
	});
};

export const registerPayment = async (
	data: RegisterPaymentInput,
): Promise<Transaction> => {
	return fetchWithAuth(`${API_URL}/${data.transactionId}/payments`, {
		method: "POST",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
		},
	});
};
