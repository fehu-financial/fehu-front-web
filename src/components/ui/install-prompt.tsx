"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Download, Monitor, Share, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";

export function InstallPrompt() {
	const [isIOS, setIsIOS] = useState(false);
	const [isStandalone, setIsStandalone] = useState(false);
	const [canInstall, setCanInstall] = useState(false);
	const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

	useEffect(() => {
		// Detect iOS
		setIsIOS(
			/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream,
		);

		// Check if already installed (standalone mode)
		setIsStandalone(
			window.matchMedia("(display-mode: standalone)").matches ||
				(window.navigator as any).standalone === true,
		);

		// Listen for the beforeinstallprompt event
		const handleBeforeInstallPrompt = (e: Event) => {
			// Prevent the mini-infobar from appearing on mobile
			e.preventDefault();
			// Stash the event so it can be triggered later
			setDeferredPrompt(e);
			setCanInstall(true);
		};

		window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

		// Check if app is already installed
		const handleAppInstalled = () => {
			setCanInstall(false);
			setDeferredPrompt(null);
			setIsStandalone(true);
		};

		window.addEventListener("appinstalled", handleAppInstalled);

		return () => {
			window.removeEventListener(
				"beforeinstallprompt",
				handleBeforeInstallPrompt,
			);
			window.removeEventListener("appinstalled", handleAppInstalled);
		};
	}, []);

	const handleInstallClick = async () => {
		if (!deferredPrompt) return;

		// Show the install prompt
		deferredPrompt.prompt();

		// Wait for the user to respond to the prompt
		const { outcome } = await deferredPrompt.userChoice;

		if (outcome === "accepted") {
			console.log("User accepted the install prompt");
		} else {
			console.log("User dismissed the install prompt");
		}

		// Clear the deferredPrompt
		setDeferredPrompt(null);
		setCanInstall(false);
	};

	// Don't show install button if already installed
	if (isStandalone) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Smartphone className="w-5 h-5" />
						App Instalado
						<Badge variant="secondary">PWA Ativo</Badge>
					</CardTitle>
					<CardDescription>
						O Fehu Financial está funcionando como um aplicativo nativo!
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
						<Monitor className="w-4 h-4" />
						Funcionando em modo standalone
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Download className="w-5 h-5" />
					Instalar App
				</CardTitle>
				<CardDescription>
					Instale o Fehu Financial para uma experiência mais rápida e
					conveniente
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{canInstall && !isIOS && (
					<Button onClick={handleInstallClick} className="w-full">
						<Download className="w-4 h-4 mr-2" />
						Instalar Aplicativo
					</Button>
				)}

				{isIOS && (
					<div className="space-y-3">
						<Button variant="outline" className="w-full" disabled>
							<Download className="w-4 h-4 mr-2" />
							Adicionar à Tela Inicial
						</Button>
						<div className="text-sm text-muted-foreground space-y-2">
							<p className="font-medium">Para instalar no iOS:</p>
							<ol className="list-decimal list-inside space-y-1">
								<li>
									Toque no botão de compartilhar{" "}
									<span className="inline-flex items-center justify-center w-5 h-5 bg-blue-100 dark:bg-blue-900 rounded text-xs">
										<Share className="w-3 h-3" />
									</span>
								</li>
								<li>
									Selecione "Adicionar à Tela Inicial"{" "}
									<span className="inline-flex items-center justify-center w-5 h-5 bg-green-100 dark:bg-green-900 rounded text-xs">
										➕
									</span>
								</li>
								<li>Toque em "Adicionar" para confirmar</li>
							</ol>
						</div>
					</div>
				)}

				{!canInstall && !isIOS && (
					<div className="text-sm text-muted-foreground">
						<p className="mb-2">Para instalar:</p>
						<ul className="list-disc list-inside space-y-1">
							<li>Chrome: Menu → "Instalar Fehu Financial"</li>
							<li>Edge: Menu → "Aplicativos" → "Instalar este site"</li>
							<li>Firefox: Ícone de instalação na barra de endereços</li>
						</ul>
					</div>
				)}

				<div className="pt-2 border-t">
					<div className="text-xs text-muted-foreground">
						<p className="font-medium mb-1">Benefícios da instalação:</p>
						<ul className="space-y-1">
							<li>• Acesso mais rápido</li>
							<li>• Funciona offline (básico)</li>
							<li>• Notificações push</li>
							<li>• Experiência como app nativo</li>
						</ul>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
