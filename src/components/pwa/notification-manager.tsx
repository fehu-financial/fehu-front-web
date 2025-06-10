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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useNotifications } from "@/hooks/use-notifications";
import {
	AlertTriangle,
	Bell,
	BellOff,
	CheckCircle,
	Loader2,
	Send,
	Settings,
	Vibrate,
	Volume2,
	VolumeX,
} from "lucide-react";
import { useState } from "react";

export function NotificationManager() {
	const {
		isSupported,
		permission,
		isSubscribed,
		settings,
		isLoading,
		enableNotifications,
		disableNotifications,
		sendTestNotification,
		requestPermission,
		updateSettings,
	} = useNotifications();

	const [testMessage, setTestMessage] = useState("");

	const handleToggleNotifications = async () => {
		if (isSubscribed) {
			await disableNotifications();
		} else {
			await enableNotifications();
		}
	};

	const handleSendTest = async () => {
		if (testMessage.trim()) {
			const result = await sendTestNotification(testMessage);
			if (result.success) {
				setTestMessage("");
			}
		}
	};

	const handleRequestPermission = async () => {
		await requestPermission();
	};

	// Not supported
	if (!isSupported) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<BellOff className="w-5 h-5 text-muted-foreground" />
						Notificações não suportadas
					</CardTitle>
					<CardDescription>
						Seu navegador não suporta notificações push
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Alert>
						<AlertTriangle className="w-4 h-4" />
						<AlertDescription>
							Atualize para uma versão mais recente do seu navegador para
							receber notificações.
						</AlertDescription>
					</Alert>
				</CardContent>
			</Card>
		);
	}

	// Permission denied
	if (permission === "denied") {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<BellOff className="w-5 h-5 text-red-500" />
						Notificações bloqueadas
					</CardTitle>
					<CardDescription>
						As notificações foram negadas para este site
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<Alert>
						<AlertTriangle className="w-4 h-4" />
						<AlertDescription>
							Para ativar as notificações, você precisa permitir nas
							configurações do seu navegador.
						</AlertDescription>
					</Alert>

					<div className="text-sm text-muted-foreground">
						<p className="font-medium mb-2">Como permitir notificações:</p>
						<ol className="list-decimal list-inside space-y-1">
							<li>
								Clique no ícone de bloqueio/informações na barra de endereços
							</li>
							<li>Altere as configurações de notificações para "Permitir"</li>
							<li>Recarregue a página</li>
						</ol>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Bell className="w-5 h-5" />
					Notificações Push
					{isSubscribed && (
						<Badge variant="secondary" className="bg-green-100 text-green-800">
							Ativo
						</Badge>
					)}
				</CardTitle>
				<CardDescription>
					Receba notificações sobre suas transações e investimentos
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Main toggle */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						{isSubscribed ? (
							<CheckCircle className="w-5 h-5 text-green-600" />
						) : (
							<Bell className="w-5 h-5 text-muted-foreground" />
						)}
						<div>
							<p className="font-medium">
								{isSubscribed ? "Notificações ativadas" : "Ativar notificações"}
							</p>
							<p className="text-sm text-muted-foreground">
								{isSubscribed
									? "Você receberá alertas importantes"
									: "Receba alertas sobre suas finanças"}
							</p>
						</div>
					</div>
					<Button
						onClick={
							permission === "default"
								? handleRequestPermission
								: handleToggleNotifications
						}
						disabled={isLoading}
						variant={isSubscribed ? "outline" : "default"}
						size="sm"
					>
						{isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
						{isSubscribed ? (
							<>
								<BellOff className="w-4 h-4 mr-2" />
								Desativar
							</>
						) : (
							<>
								<Bell className="w-4 h-4 mr-2" />
								{permission === "default" ? "Permitir" : "Ativar"}
							</>
						)}
					</Button>
				</div>

				{/* Settings when subscribed */}
				{isSubscribed && (
					<>
						<Separator />
						<div className="space-y-4">
							<div className="flex items-center gap-2">
								<Settings className="w-4 h-4" />
								<h4 className="font-medium">Configurações</h4>
							</div>

							{/* Sound setting */}
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									{settings.sound ? (
										<Volume2 className="w-4 h-4" />
									) : (
										<VolumeX className="w-4 h-4" />
									)}
									<div>
										<p className="text-sm font-medium">Som</p>
										<p className="text-xs text-muted-foreground">
											Reproduzir som nas notificações
										</p>
									</div>
								</div>
								<Switch
									checked={settings.sound}
									onCheckedChange={(checked) =>
										updateSettings({ sound: checked })
									}
								/>
							</div>

							{/* Vibration setting */}
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<Vibrate className="w-4 h-4" />
									<div>
										<p className="text-sm font-medium">Vibração</p>
										<p className="text-xs text-muted-foreground">
											Vibrar ao receber notificações
										</p>
									</div>
								</div>
								<Switch
									checked={settings.vibration}
									onCheckedChange={(checked) =>
										updateSettings({ vibration: checked })
									}
								/>
							</div>
						</div>

						<Separator />

						{/* Test notification */}
						<div className="space-y-3">
							<Label htmlFor="test-message">Enviar notificação de teste</Label>
							<div className="flex gap-2">
								<Input
									id="test-message"
									type="text"
									placeholder="Digite uma mensagem de teste"
									value={testMessage}
									onChange={(e) => setTestMessage(e.target.value)}
									disabled={isLoading}
									onKeyDown={(e) => {
										if (e.key === "Enter" && testMessage.trim()) {
											handleSendTest();
										}
									}}
								/>
								<Button
									onClick={handleSendTest}
									disabled={!testMessage.trim() || isLoading}
									size="sm"
								>
									{isLoading ? (
										<Loader2 className="w-4 h-4 animate-spin" />
									) : (
										<Send className="w-4 h-4" />
									)}
								</Button>
							</div>
						</div>
					</>
				)}

				{/* Permission required message */}
				{permission === "default" && (
					<Alert>
						<AlertTriangle className="w-4 h-4" />
						<AlertDescription>
							Clique em "Permitir" para ativar as notificações push.
						</AlertDescription>
					</Alert>
				)}

				{/* Info section */}
				<div className="pt-2 border-t">
					<div className="text-xs text-muted-foreground">
						<p className="font-medium mb-1">Tipos de notificações:</p>
						<ul className="space-y-1">
							<li>• Novas transações registradas</li>
							<li>• Alertas de orçamento</li>
							<li>• Vencimento de contas</li>
							<li>• Atualizações de investimentos</li>
							<li>• Lembretes importantes</li>
						</ul>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
