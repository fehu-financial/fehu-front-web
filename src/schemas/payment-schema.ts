import { z } from "zod";

export const PaymentSchema = z.object({
	amount: z.number().min(0, "Valor obrigatório"),
	lateFees: z.number().min(0, "Multa/Juros obrigatória"),
	paidAt: z.date(),
	receipt: z.any().optional(), // arquivo
	method: z.string(),
});
