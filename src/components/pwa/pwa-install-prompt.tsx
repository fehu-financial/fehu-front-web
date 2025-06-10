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
import { usePWA } from "@/hooks/use-pwa";
import { CheckCircle, Download, Share, Smartphone, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export function PWAInstallPrompt() {
	const {
		showInstallPrompt,
		canInstall,
		isInstalled,
		install,
		getBrowserInfo,
		hideInstallPrompt,
	} = usePWA();

	const browserInfo = getBrowserInfo();

	if (!showInstallPrompt || isInstalled || !canInstall) {
		return null;
	}

	const handleInstall = async () => {
		const success = await install();
		if (success) {
			hideInstallPrompt();
		}
	};

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0, y: 50, scale: 0.9 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				exit={{ opacity: 0, y: 50, scale: 0.9 }}
				transition={{
					type: "spring",
					stiffness: 300,
					damping: 30,
				}}
				className="fixed bottom-4 right-4 z-50 w-80 max-w-[calc(100vw-2rem)]"
			>
				<Card className="shadow-lg border-2">
					<CardHeader className="pb-3">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Smartphone className="w-5 h-5 text-primary" />
								<CardTitle className="text-lg">Instalar App</CardTitle>
								<Badge variant="secondary" className="text-xs">
									PWA
								</Badge>
							</div>
							<Button
								variant="ghost"
								size="sm"
								onClick={hideInstallPrompt}
								className="h-6 w-6 p-0"
							>
								<X className="w-4 h-4" />
							</Button>
						</div>
						<CardDescription>
							Instale o Fehu Financial para acesso mais rápido e uma melhor
							experiência
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						{/* Install button for supported browsers */}
						{!browserInfo.isIOS ? (
							<Button onClick={handleInstall} className="w-full" size="sm">
								<Download className="w-4 h-4 mr-2" />
								Instalar Agora
							</Button>
						) : (
							<div className="space-y-2">
								<Button variant="outline" className="w-full" size="sm" disabled>
									<Share className="w-4 h-4 mr-2" />
									Adicionar à Tela Inicial
								</Button>
								<p className="text-xs text-muted-foreground text-center">
									Toque em{" "}
									<span className="inline-flex items-center">
										<Share className="w-3 h-3 mx-1" />
									</span>{" "}
									e depois "Adicionar à Tela Inicial"
								</p>
							</div>
						)}

						{/* Benefits */}
						<div className="text-xs text-muted-foreground">
							<div className="flex items-center gap-1 mb-1">
								<CheckCircle className="w-3 h-3 text-green-600" />
								<span>Acesso mais rápido</span>
							</div>
							<div className="flex items-center gap-1 mb-1">
								<CheckCircle className="w-3 h-3 text-green-600" />
								<span>Funciona offline</span>
							</div>
							<div className="flex items-center gap-1">
								<CheckCircle className="w-3 h-3 text-green-600" />
								<span>Notificações push</span>
							</div>
						</div>

						{/* Actions */}
						<div className="flex gap-2 pt-2">
							<Button
								variant="outline"
								size="sm"
								onClick={hideInstallPrompt}
								className="flex-1"
							>
								Agora não
							</Button>
							{!browserInfo.isIOS && (
								<Button size="sm" onClick={handleInstall} className="flex-1">
									Instalar
								</Button>
							)}
						</div>
					</CardContent>
				</Card>
			</motion.div>
		</AnimatePresence>
	);
}
