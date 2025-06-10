"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { usePWA } from "@/hooks/use-pwa";
import {
	CheckCircle,
	Download,
	Monitor,
	Share,
	Smartphone,
	WifiOff,
} from "lucide-react";

export function PWAInstallCard() {
	const {
		isSupported,
		isInstalled,
		canInstall,
		isOnline,
		install,
		getBrowserInfo,
		getInstallInstructions,
	} = usePWA();

	const browserInfo = getBrowserInfo();
	const instructions = getInstallInstructions();

	// Not supported
	if (!isSupported) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Smartphone className="w-5 h-5" />
						PWA não suportado
					</CardTitle>
					<CardDescription>
						Seu navegador não suporta aplicações web progressivas
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Alert>
						<AlertDescription>
							Atualize para uma versão mais recente do seu navegador para
							instalar o aplicativo.
						</AlertDescription>
					</Alert>
				</CardContent>
			</Card>
		);
	}

	// Already installed
	if (isInstalled) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<CheckCircle className="w-5 h-5 text-green-600" />
						App Instalado
						<Badge variant="secondary" className="bg-green-100 text-green-800">
							PWA Ativo
						</Badge>
					</CardTitle>
					<CardDescription>
						O Fehu Financial está funcionando como um aplicativo nativo!
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
						<Monitor className="w-4 h-4" />
						Funcionando em modo standalone
					</div>

					{!isOnline && (
						<Alert>
							<WifiOff className="w-4 h-4" />
							<AlertDescription>
								Você está offline. Algumas funcionalidades podem estar
								limitadas.
							</AlertDescription>
						</Alert>
					)}

					<div className="pt-2 border-t">
						<div className="text-xs text-muted-foreground space-y-1">
							<p className="font-medium">Benefícios ativos:</p>
							<ul className="space-y-1">
								<li>• ✅ Acesso mais rápido</li>
								<li>• ✅ Funciona offline (básico)</li>
								<li>• ✅ Notificações push</li>
								<li>• ✅ Experiência como app nativo</li>
							</ul>
						</div>
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
				{/* Install button for supported browsers */}
				{canInstall && !browserInfo.isIOS && (
					<Button onClick={install} className="w-full" size="lg">
						<Download className="w-4 h-4 mr-2" />
						Instalar Aplicativo
					</Button>
				)}

				{/* iOS specific instructions */}
				{browserInfo.isIOS && (
					<div className="space-y-3">
						<Button variant="outline" className="w-full" disabled>
							<Share className="w-4 h-4 mr-2" />
							Adicionar à Tela Inicial
						</Button>
						<div className="text-sm text-muted-foreground space-y-2">
							<p className="font-medium">{instructions.title}:</p>
							<ol className="list-decimal list-inside space-y-1">
								{instructions.steps.map((step) => (
									<li key={step}>{step}</li>
								))}
							</ol>
						</div>
					</div>
				)}

				{/* Generic instructions for other browsers */}
				{!canInstall && !browserInfo.isIOS && (
					<div className="text-sm text-muted-foreground space-y-2">
						<p className="font-medium">{instructions.title}:</p>
						<ul className="list-disc list-inside space-y-1">
							{instructions.steps.map((step) => (
								<li key={step}>{step}</li>
							))}
						</ul>
					</div>
				)}

				{/* Offline indicator */}
				{!isOnline && (
					<Alert>
						<WifiOff className="w-4 h-4" />
						<AlertDescription>
							Você está offline. A instalação pode não funcionar corretamente.
						</AlertDescription>
					</Alert>
				)}

				{/* Benefits section */}
				<div className="pt-2 border-t">
					<div className="text-xs text-muted-foreground">
						<p className="font-medium mb-1">Benefícios da instalação:</p>
						<ul className="space-y-1">
							<li>• Acesso mais rápido</li>
							<li>• Funciona offline (básico)</li>
							<li>• Notificações push</li>
							<li>• Experiência como app nativo</li>
							<li>• Menor consumo de dados</li>
						</ul>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
