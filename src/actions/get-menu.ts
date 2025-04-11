"use server";

import { createClient } from "@/lib/supabase/server";

export interface MenuItem {
	icon: string;
	path: string;
	label: string;
	access: boolean;
}

export async function getMenuData(): Promise<MenuItem[]> {
	const supabase = await createClient();
	const { data, error, status } = await supabase
		.from("app_config")
		.select("value")
		.eq("key", "app_menu")
		.single();

	if (error) throw new Error(`Error fetching menu data: ${error.message}`);

	return data.value;
}
