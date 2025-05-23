"use client";

import {
	sendNotification,
	subscribeUser,
	unsubscribeUser,
} from "@/actions/pwa";
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
import { Bell, BellOff, Send, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function urlBase64ToUint8Array(base64String: string) {
	const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

export function PushNotificationManager() {
	const [isSupported, setIsSupported] = useState(false);
	const [subscription, setSubscription] = useState<PushSubscription | null>(
		null,
	);
	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		console.log(navigator.serviceWorker, window.PushManager);
		if ("serviceWorker" in navigator && "PushManager" in window) {
			setIsSupported(true);
			registerServiceWorker();
		}
	}, []);

	async function registerServiceWorker() {
		try {
			// Check if we're in development mode
			const isDev = process.env.NODE_ENV === "development";
			console.log("Registering service worker, isDev:", isDev);
			console.log("Current location:", window.location.href);

			const registration = await navigator.serviceWorker.register("/sw.js", {
				scope: "/",
				updateViaCache: "none",
			});

			console.log("Service Worker registered:", registration);

			const sub = await registration.pushManager.getSubscription();
			setSubscription(sub);
		} catch (error) {
			console.error("Service Worker registration failed:", error);

			// More detailed error logging
			if (error instanceof Error) {
				console.error(error);
			}

			toast.error(
				`Falha ao registrar Service Worker: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
			);
		}
	}

	async function subscribeToPush() {
		console.log("Subscribing to push notifications...");
		setIsLoading(true);
		try {
			const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
			if (!vapidKey) {
				console.error("VAPID public key is not set in environment variables.");
				throw new Error(
					"VAPID public key is not set in environment variables.",
				);
			}
			const registration = await navigator.serviceWorker.ready;
			const sub = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array(vapidKey),
			});

			setSubscription(sub);
			const serializedSub = JSON.parse(JSON.stringify(sub));
			const result = await subscribeUser(serializedSub);

			if (result.success) {
				toast.success("Notificações ativadas com sucesso!");
			} else {
				toast.error("Erro ao ativar notificações");
			}
		} catch (error) {
			console.error("Error subscribing to push notifications:", error);
			toast.error("Erro ao ativar notificações");
		} finally {
			setIsLoading(false);
		}
	}

	async function unsubscribeFromPush() {
		setIsLoading(true);
		try {
			await subscription?.unsubscribe();
			setSubscription(null);
			await unsubscribeUser(subscription?.endpoint);
			toast.success("Notificações desativadas");
		} catch (error) {
			console.error("Error unsubscribing from push notifications:", error);
			toast.error("Erro ao desativar notificações");
		} finally {
			setIsLoading(false);
		}
	}

	async function sendTestNotification() {
		if (!subscription || !message.trim()) return;

		setIsLoading(true);
		try {
			const result = await sendNotification(message, "Fehu Financial - Teste");
			if (result.success) {
				toast.success("Notificação enviada!");
				setMessage("");
			} else {
				toast.error("Erro ao enviar notificação");
			}
		} catch (error) {
			console.error("Error sending test notification:", error);
			toast.error("Erro ao enviar notificação");
		} finally {
			setIsLoading(false);
		}
	}

	if (!isSupported) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<BellOff className="w-5 h-5" />
						Notificações não suportadas
					</CardTitle>
					<CardDescription>
						Seu navegador não suporta notificações push. Atualize para uma
						versão mais recente.
					</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Bell className="w-5 h-5" />
					Notificações Push
					{subscription && <Badge variant="secondary">Ativo</Badge>}
				</CardTitle>
				<CardDescription>
					Receba notificações sobre suas transações e investimentos
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{subscription ? (
					<>
						<div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
							<Bell className="w-4 h-4" />
							Você está inscrito para receber notificações
						</div>

						<div className="space-y-2">
							<Input
								type="text"
								placeholder="Digite uma mensagem de teste"
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								disabled={isLoading}
							/>
							<div className="flex gap-2">
								<Button
									onClick={sendTestNotification}
									disabled={!message.trim() || isLoading}
									size="sm"
								>
									<Send className="w-4 h-4 mr-2" />
									Enviar Teste
								</Button>
								<Button
									variant="outline"
									onClick={unsubscribeFromPush}
									disabled={isLoading}
									size="sm"
								>
									<BellOff className="w-4 h-4 mr-2" />
									Desativar
								</Button>
							</div>
						</div>
					</>
				) : (
					<div className="space-y-4">
						<div className="text-sm text-muted-foreground">
							Ative as notificações para receber alertas importantes sobre suas
							finanças
						</div>
						<Button
							onClick={subscribeToPush}
							disabled={isLoading}
							className="w-full"
						>
							<Bell className="w-4 h-4 mr-2" />
							Ativar Notificações
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
