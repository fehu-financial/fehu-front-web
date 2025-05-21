import { z } from "zod";

export const CreditCardSchema = z.object({
	id: z.string(),
	lastDigits: z.string().min(4).max(4),
	issuer: z.string(),
	brand: z.string(),
	expirationDate: z.date().optional(),
});
