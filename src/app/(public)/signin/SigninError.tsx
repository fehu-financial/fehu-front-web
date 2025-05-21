"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

const mappedErrors: Record<string, string> = {
	missing_code:
		"Não foi possível autenticar com Google. Tente novamente mais tarde!",
};

export default function SigninError() {
	const searchParams = useSearchParams();
	const error = searchParams.get("error");

	return (
		error && (
			<Alert variant="destructive">
				<AlertCircle className="h-4 w-4" />
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>
					{mappedErrors[error] || "Oops! Algo deu errado."}
				</AlertDescription>
			</Alert>
		)
	);
}
