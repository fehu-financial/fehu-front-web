import { InstallPrompt } from "@/components/ui/install-prompt";
import { PushNotificationManager } from "@/components/ui/push-notification-manager";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Configurações PWA - Fehu Financial",
	description: "Configure as funcionalidades do aplicativo Fehu Financial",
};

export default function PWASettingsPage() {
	return (
		<div className="container mx-auto py-6 space-y-6">
			<div className="space-y-2">
				<h1 className="text-3xl font-bold tracking-tight">
					Configurações do App
				</h1>
				<p className="text-muted-foreground">
					Gerencie as funcionalidades do aplicativo Fehu Financial
				</p>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<InstallPrompt />
				<PushNotificationManager />
			</div>
		</div>
	);
}
