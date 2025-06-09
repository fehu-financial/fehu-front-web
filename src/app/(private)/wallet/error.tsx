"use client";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/ui/page-container";
import { useEffect } from "react";

// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<PageContainer
			title="Carteira Digital"
			description="Gerencie seus cartões de crédito e contas bancárias em um só lugar."
		>
			<div className="flex items-center justify-center h-64">
				<div className="text-center">
					<p className="text-muted-foreground mb-4">
						Erro ao carregar dados da carteira
					</p>
					<Button onClick={() => reset()}>Tentar novamente</Button>
				</div>
			</div>
		</PageContainer>
	);
}
