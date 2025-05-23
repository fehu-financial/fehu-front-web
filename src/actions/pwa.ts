"use server";

import webpush from "web-push";

// Configure VAPID keys
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

if (!vapidPublicKey || !vapidPrivateKey) {
	throw new Error("VAPID keys are not set in environment variables.");
}

webpush.setVapidDetails(
	"mailto:support@fehufinancial.com",
	vapidPublicKey,
	vapidPrivateKey,
);

// Define a compatible subscription type
interface StoredPushSubscription {
	endpoint: string;
	keys: {
		p256dh: string;
		auth: string;
	};
}

// In-memory subscription storage (in production, use a database)
let subscriptions: StoredPushSubscription[] = [];

export async function subscribeUser(sub: PushSubscription) {
	try {
		// Convert browser PushSubscription to our stored format
		const p256dhKey = sub.getKey("p256dh");
		const authKey = sub.getKey("auth");

		if (!p256dhKey || !authKey) {
			throw new Error("Missing required keys in push subscription");
		}

		const storedSub: StoredPushSubscription = {
			endpoint: sub.endpoint,
			keys: {
				p256dh: btoa(String.fromCharCode(...new Uint8Array(p256dhKey))),
				auth: btoa(String.fromCharCode(...new Uint8Array(authKey))),
			},
		};

		// In production, store in database
		// await db.subscriptions.create({ data: storedSub })

		// For now, store in memory
		const existingIndex = subscriptions.findIndex(
			(s) => s.endpoint === storedSub.endpoint,
		);

		if (existingIndex >= 0) {
			subscriptions[existingIndex] = storedSub;
		} else {
			subscriptions.push(storedSub);
		}

		console.log("User subscribed to push notifications");
		return { success: true };
	} catch (error) {
		console.error("Error subscribing user:", error);
		return { success: false, error: "Failed to subscribe user" };
	}
}

export async function unsubscribeUser(endpoint?: string) {
	try {
		if (endpoint) {
			// Remove specific subscription
			subscriptions = subscriptions.filter((s) => s.endpoint !== endpoint);
		} else {
			// Remove all subscriptions (for demo purposes)
			subscriptions = [];
		}

		// In production, remove from database
		// await db.subscriptions.delete({ where: { endpoint } })

		console.log("User unsubscribed from push notifications");
		return { success: true };
	} catch (error) {
		console.error("Error unsubscribing user:", error);
		return { success: false, error: "Failed to unsubscribe user" };
	}
}

export async function sendNotification(
	message: string,
	title?: string,
	url?: string,
) {
	if (subscriptions.length === 0) {
		return { success: false, error: "No subscriptions available" };
	}

	const payload = JSON.stringify({
		title: title || "Fehu Financial",
		body: message,
		icon: "/icon-192x192.png",
		badge: "/icon-192x192.png",
		url: url || "/",
		tag: "fehu-notification",
		data: {
			url: url || "/",
			timestamp: Date.now(),
		},
	});

	const results = await Promise.allSettled(
		subscriptions.map(async (subscription) => {
			try {
				await webpush.sendNotification(subscription, payload);
				return { success: true, endpoint: subscription.endpoint };
			} catch (error) {
				console.error(
					"Error sending notification to:",
					subscription.endpoint,
					error,
				);

				// If subscription is invalid, remove it
				if (error && typeof error === "object" && "statusCode" in error) {
					const webPushError = error as { statusCode: number };
					if (
						webPushError.statusCode === 410 ||
						webPushError.statusCode === 404
					) {
						subscriptions = subscriptions.filter(
							(s) => s.endpoint !== subscription.endpoint,
						);
					}
				}

				return { success: false, endpoint: subscription.endpoint, error };
			}
		}),
	);

	const successful = results.filter(
		(result) => result.status === "fulfilled" && result.value.success,
	).length;

	const failed = results.length - successful;

	return {
		success: successful > 0,
		sent: successful,
		failed,
		total: results.length,
	};
}

// Helper function to send transaction notifications
export async function sendTransactionNotification(
	transactionType: "income" | "expense" | "transfer",
	amount: number,
	description: string,
) {
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

	return await sendNotification(
		messages[transactionType],
		titles[transactionType],
		"/transactions",
	);
}

// Helper function to send investment notifications
export async function sendInvestmentNotification(
	type: "gain" | "loss" | "dividend",
	amount: number,
	asset?: string,
) {
	const formatAmount = (value: number) =>
		new Intl.NumberFormat("pt-BR", {
			style: "currency",
			currency: "BRL",
		}).format(value);

	const messages = {
		gain: `📈 Valorização: ${formatAmount(amount)}${
			asset ? ` em ${asset}` : ""
		}`,
		loss: `📉 Desvalorização: ${formatAmount(amount)}${
			asset ? ` em ${asset}` : ""
		}`,
		dividend: `💎 Dividendo recebido: ${formatAmount(amount)}${
			asset ? ` de ${asset}` : ""
		}`,
	};

	const titles = {
		gain: "📈 Investimento Valorizado",
		loss: "📉 Investimento Desvalorizado",
		dividend: "💎 Dividendo Recebido",
	};

	return await sendNotification(messages[type], titles[type], "/investments");
}
