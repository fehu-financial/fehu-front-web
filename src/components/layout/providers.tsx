"use client";

import { LayoutProvider } from "@/context/layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function Providers({
	children,
}: {
	children: React.ReactNode;
}) {
	const queryClient = new QueryClient();

	return (
		<NuqsAdapter>
			<QueryClientProvider client={queryClient}>
				<LayoutProvider>{children}</LayoutProvider>
			</QueryClientProvider>
		</NuqsAdapter>
	);
}
