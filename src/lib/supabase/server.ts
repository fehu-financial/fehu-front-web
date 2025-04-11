import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
	const cookieStore = await cookies();

	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL ??
			(() => {
				throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined");
			})(),
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
			(() => {
				throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined");
			})(),
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						for (const { name, value, options } of cookiesToSet) {
							cookieStore.set(name, value, options);
						}
					} catch {}
				},
			},
		},
	);
}
