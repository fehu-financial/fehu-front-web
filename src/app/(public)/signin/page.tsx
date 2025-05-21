import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import SigninError from "./SigninError";

export default function SignIn() {
	return (
		<div className="flex min-h-svh items-center justify-center bg-background px-4 py-10">
			<div className="mx-auto w-full max-w-sm space-y-6 rounded-lg border border-border bg-card p-8 shadow-sm">
				<Suspense
					fallback={
						<div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
					}
				>
					<SigninError />
				</Suspense>
				<div className="flex flex-col items-center space-y-2 text-center">
					<Image
						className="dark:invert"
						src="/fehu-logo.svg"
						alt="Fehu Financial Logo"
						width={40}
						height={40}
					/>
					<h1 className="text-2xl font-bold tracking-tight">Fehu Financial</h1>
					<p className="text-muted-foreground">
						Sign in to access your financial dashboard
					</p>
				</div>

				<div className="space-y-4">
					<Link href="/api/auth/signin">
						<Button
							variant="outline"
							className="w-full h-11 flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
						>
							<Image
								src="https://www.svgrepo.com/show/303108/google-icon-logo.svg"
								alt="Google Logo"
								width={20}
								height={20}
							/>
							Sign in with Google
						</Button>
					</Link>
				</div>

				<div className="text-center text-sm text-muted-foreground">
					By continuing, you agree to our{" "}
					<a
						href="/terms"
						className="underline underline-offset-4 hover:text-primary"
					>
						Terms of Service
					</a>{" "}
					and{" "}
					<a
						href="/privacy"
						className="underline underline-offset-4 hover:text-primary"
					>
						Privacy Policy
					</a>
					.
				</div>
			</div>
		</div>
	);
}
