"use client";

import {
	sendNotification,
	subscribeUser,
	unsubscribeUser,
} from "@/actions/pwa";

export interface NotificationSubscription {
	endpoint: string;
	keys: {
		p256dh: string;
		auth: string;
	};
}

export interface NotificationPayload {
	title: string;
	body: string;
	icon?: string;
	badge?: string;
	url?: string;
	tag?: string;
}

export class NotificationService {
	private static instance: NotificationService;
	private vapidPublicKey: string | null = null;

	private constructor() {
		this.vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || null;
	}

	static getInstance(): NotificationService {
		if (!NotificationService.instance) {
			NotificationService.instance = new NotificationService();
		}
		return NotificationService.instance;
	}

	/**
	 * Convert VAPID key from base64 to Uint8Array
	 */
	private urlBase64ToUint8Array(base64String: string): Uint8Array {
		const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
		const base64 = (base64String + padding)
			.replace(/-/g, "+")
			.replace(/_/g, "/");
		const rawData = window.atob(base64);
		const outputArray = new Uint8Array(rawData.length);

		for (let i = 0; i < rawData.length; ++i) {
			outputArray[i] = rawData.charCodeAt(i);
		}
		return outputArray;
	}

	/**
	 * Check if notifications are supported
	 */
	isSupported(): boolean {
		return (
			"serviceWorker" in navigator &&
			"PushManager" in window &&
			"Notification" in window
		);
	}

	/**
	 * Check if notification permission is granted
	 */
	isPermissionGranted(): boolean {
		return Notification.permission === "granted";
	}

	/**
	 * Request notification permission
	 */
	async requestPermission(): Promise<NotificationPermission> {
		if (!this.isSupported()) {
			throw new Error("Notifications are not supported");
		}

		return await Notification.requestPermission();
	}

	/**
	 * Get existing push subscription
	 */
	async getSubscription(): Promise<PushSubscription | null> {
		if (!this.isSupported()) return null;

		const registration = await navigator.serviceWorker.ready;
		return await registration.pushManager.getSubscription();
	}

	/**
	 * Subscribe to push notifications
	 */
	async subscribe(): Promise<{
		success: boolean;
		subscription?: PushSubscription;
		error?: string;
	}> {
		try {
			if (!this.isSupported()) {
				throw new Error("Push notifications are not supported");
			}

			if (!this.vapidPublicKey) {
				throw new Error("VAPID public key is not configured");
			}

			// Request permission first
			const permission = await this.requestPermission();
			if (permission !== "granted") {
				throw new Error("Notification permission denied");
			}

			const registration = await navigator.serviceWorker.ready;
			const subscription = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey),
			});

			// Convert to serializable format and save to server
			const serializedSub = JSON.parse(JSON.stringify(subscription));
			const result = await subscribeUser(serializedSub);

			if (!result.success) {
				throw new Error(result.error || "Failed to save subscription");
			}

			return { success: true, subscription };
		} catch (error) {
			console.error("Error subscribing to push notifications:", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	/**
	 * Unsubscribe from push notifications
	 */
	async unsubscribe(): Promise<{ success: boolean; error?: string }> {
		try {
			const subscription = await this.getSubscription();
			if (!subscription) {
				return { success: true }; // Already unsubscribed
			}

			await subscription.unsubscribe();
			await unsubscribeUser(subscription.endpoint);

			return { success: true };
		} catch (error) {
			console.error("Error unsubscribing from push notifications:", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	/**
	 * Send a test notification
	 */
	async sendTestNotification(
		message: string,
		title = "Fehu Financial - Teste",
	): Promise<{ success: boolean; error?: string }> {
		try {
			const result = await sendNotification(message, title);
			return { success: result.success, error: result.error };
		} catch (error) {
			console.error("Error sending test notification:", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	/**
	 * Send a transaction notification
	 */
	async sendTransactionNotification(
		type: "income" | "expense" | "transfer",
		amount: number,
		description: string,
	): Promise<{ success: boolean; error?: string }> {
		const formatAmount = (value: number) =>
			new Intl.NumberFormat("pt-BR", {
				style: "currency",
				currency: "BRL",
			}).format(value);

		const messages = {
			income: `Nova receita: ${formatAmount(amount)} - ${description}`,
			expense: `Nova despesa: ${formatAmount(amount)} - ${description}`,
			transfer: `Nova transferência: ${formatAmount(amount)} - ${description}`,
		};

		const titles = {
			income: "💰 Receita Adicionada",
			expense: "💸 Despesa Registrada",
			transfer: "🔄 Transferência Realizada",
		};

		return await this.sendTestNotification(messages[type], titles[type]);
	}
}

export const notificationService = NotificationService.getInstance();
