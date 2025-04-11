import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
	// Create a supabase client on the browser with project's credentials
	return createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL ||
			(() => {
				throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined");
			})(),
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
			(() => {
				throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined");
			})(),
	);
}
