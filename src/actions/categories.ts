"use server";

import { createClient } from "@/lib/supabase/server";
import type { LucideIcon } from "lucide-react";

export interface Subcategory {
	id: string;
	label: string;
	icon: LucideIcon;
}

export interface Category {
	id: string;
	label: string;
	icon: LucideIcon;
	color: string; // Exemplo: "bg-blue-600"
	subcategories?: Subcategory[];
}

interface Categories {
	income: Category[];
	expenses: Category[];
}

export async function fetchCategories(): Promise<Categories> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("app_config")
		.select("value")
		.eq("key", "app_categories")
		.single();

	if (error) {
		throw new Error(`Erro ao buscar categorias: ${error.message}`);
	}

	return data.value as Categories;
}
