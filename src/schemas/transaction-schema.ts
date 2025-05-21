import { CreditCardSchema } from "@/schemas/credit-card-schema";
import { RecurrenceFrequency, TransactionType } from "@/types/transaction";
import { z } from "zod";

export const TransactionSchema = z.object({
	title: z.string().min(1, "Título obrigatório"),
	description: z.string().optional(),
	amount: z.number().min(0.01, "Valor deve ser maior que zero"),
	category: z.string().min(1, "Categoria obrigatória"),
	date: z.date(),
	recurrence: z.nativeEnum(RecurrenceFrequency).optional(),
	installments: z
		.object({
			total: z
				.number()
				.min(1, "Mínimo 1 parcelas")
				.max(36, "Máximo 36 parcelas"),
			creditCard: CreditCardSchema.optional(),
		})
		.optional(),
	type: z.nativeEnum(TransactionType),
	workspaceId: z.string().min(1, "Workspace obrigatório"),
	tags: z.array(z.string()).optional(),
});
