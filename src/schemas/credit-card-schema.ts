import { z } from "zod";

export const CreditCardSchema = z.object({
	id: z.string().optional(),
	lastFourDigits: z.string().length(4, "Informe os 4 últimos dígitos"),
	brand: z.string().min(1, "Bandeira obrigatória"),
	issuer: z.string().min(1, "Emissor obrigatório"),
	accountId: z.string().min(1, "Conta obrigatória"),
	workspaceId: z.string().min(1, "Workspace obrigatório"),
	expiration: z.date().min(new Date(), "Validade obrigatória"),
	closingDay: z.coerce.number().min(1).max(31),
	dueDay: z.coerce.number().min(1).max(31),
	color: z.string().min(1, "Cor obrigatória"),
});

export type CreditCardSchemaType = z.infer<typeof CreditCardSchema>;

export const UpdateCreditCardSchema = z.object({
	lastFourDigits: z
		.string()
		.length(4, "Informe os 4 últimos dígitos")
		.optional(),
	brand: z.string().min(1, "Bandeira obrigatória").optional(),
	issuer: z.string().min(1, "Emissor obrigatório").optional(),
	workspaceId: z.string().min(1, "Workspace obrigatório").optional(),
	expiration: z.string().min(1, "Validade obrigatória").optional(),
	closingDay: z.coerce.number().min(1).max(31).optional(),
	dueDay: z.coerce.number().min(1).max(31).optional(),
	color: z.string().min(1, "Cor obrigatória").optional(),
});

export type UpdateCreditCardSchemaType = z.infer<typeof UpdateCreditCardSchema>;
