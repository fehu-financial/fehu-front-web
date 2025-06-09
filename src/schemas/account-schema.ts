import { z } from "zod";

export const AccountSchema = z.object({
	type: z.enum(["CHECKING", "SAVINGS", "PAYMENT"]),
	institution: z.string().min(1, "Instituição é obrigatória"),
	number: z.string().min(1, "Número é obrigatório"),
	agency: z.string().min(1, "Agência é obrigatória"),
});

export type AccountSchemaType = z.infer<typeof AccountSchema>;

export const UpdateAccountSchema = z.object({
	type: z.enum(["CHECKING", "SAVINGS", "PAYMENT"]).optional(),
	institution: z.string().min(1, "Instituição é obrigatória").optional(),
	number: z.string().min(1, "Número é obrigatório").optional(),
	agency: z.string().min(1, "Agência é obrigatória").optional(),
});

export type UpdateAccountSchemaType = z.infer<typeof UpdateAccountSchema>;
