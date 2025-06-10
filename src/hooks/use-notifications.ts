"use client";

import { notificationService } from "@/services/notification-service";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export interface NotificationSettings {
	enabled: boolean;
	sound: boolean;
	vibration: boolean;
}

export interface NotificationState {
	isSupported: boolean;
	permission: NotificationPermission;
	isSubscribed: boolean;
	subscription: PushSubscription | null;
	settings: NotificationSettings;
	isLoading: boolean;
}

const STORAGE_KEY = "notification-settings";

export function useNotifications() {
	const [state, setState] = useState<NotificationState>({
		isSupported: false,
		permission: "default",
		isSubscribed: false,
		subscription: null,
		settings: {
			enabled: false,
			sound: true,
			vibration: true,
		},
		isLoading: false,
	});

	// Load settings from localStorage
	const loadSettings = useCallback((): NotificationSettings => {
		if (typeof window === "undefined") {
			return { enabled: false, sound: true, vibration: true };
		}

		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				return { ...state.settings, ...JSON.parse(stored) };
			}
		} catch (error) {
			console.error("Error loading notification settings:", error);
		}

		return { enabled: false, sound: true, vibration: true };
	}, [state.settings]);

	// Save settings to localStorage
	const saveSettings = useCallback((settings: NotificationSettings) => {
		if (typeof window === "undefined") return;

		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
		} catch (error) {
			console.error("Error saving notification settings:", error);
		}
	}, []);

	// Update settings
	const updateSettings = useCallback(
		(newSettings: Partial<NotificationSettings>) => {
			setState((prev) => {
				const updated = { ...prev.settings, ...newSettings };
				saveSettings(updated);
				return { ...prev, settings: updated };
			});
		},
		[saveSettings],
	);

	// Check support and permissions
	const checkStatus = useCallback(async () => {
		const isSupported = notificationService.isSupported();
		const permission = isSupported ? Notification.permission : "denied";
		const subscription = isSupported
			? await notificationService.getSubscription()
			: null;
		const isSubscribed = subscription !== null;

		setState((prev) => ({
			...prev,
			isSupported,
			permission,
			subscription,
			isSubscribed,
		}));
	}, []);

	// Enable notifications
	const enableNotifications = useCallback(async (): Promise<{
		success: boolean;
		error?: string;
	}> => {
		setState((prev) => ({ ...prev, isLoading: true }));

		try {
			const result = await notificationService.subscribe();

			if (result.success && result.subscription) {
				setState((prev) => ({
					...prev,
					isSubscribed: true,
					subscription: result.subscription!,
					permission: "granted",
				}));

				updateSettings({ enabled: true });
				toast.success("Notificações ativadas com sucesso!");
				return { success: true };
			}

			toast.error(result.error || "Erro ao ativar notificações");
			return { success: false, error: result.error };
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Erro desconhecido";
			toast.error(`Erro ao ativar notificações: ${errorMessage}`);
			return { success: false, error: errorMessage };
		} finally {
			setState((prev) => ({ ...prev, isLoading: false }));
		}
	}, [updateSettings]);

	// Disable notifications
	const disableNotifications = useCallback(async (): Promise<{
		success: boolean;
		error?: string;
	}> => {
		setState((prev) => ({ ...prev, isLoading: true }));

		try {
			const result = await notificationService.unsubscribe();

			if (result.success) {
				setState((prev) => ({
					...prev,
					isSubscribed: false,
					subscription: null,
				}));

				updateSettings({ enabled: false });
				toast.success("Notificações desativadas");
				return { success: true };
			}

			toast.error(result.error || "Erro ao desativar notificações");
			return { success: false, error: result.error };
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Erro desconhecido";
			toast.error(`Erro ao desativar notificações: ${errorMessage}`);
			return { success: false, error: errorMessage };
		} finally {
			setState((prev) => ({ ...prev, isLoading: false }));
		}
	}, [updateSettings]);

	// Send test notification
	const sendTestNotification = useCallback(
		async (message: string): Promise<{ success: boolean; error?: string }> => {
			if (!state.isSubscribed) {
				const error = "Você não está inscrito para receber notificações";
				toast.error(error);
				return { success: false, error };
			}

			if (!message.trim()) {
				const error = "Mensagem não pode estar vazia";
				toast.error(error);
				return { success: false, error };
			}

			setState((prev) => ({ ...prev, isLoading: true }));

			try {
				const result = await notificationService.sendTestNotification(message);

				if (result.success) {
					toast.success("Notificação enviada!");
					return { success: true };
				}

				toast.error(result.error || "Erro ao enviar notificação");
				return { success: false, error: result.error };
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : "Erro desconhecido";
				toast.error(`Erro ao enviar notificação: ${errorMessage}`);
				return { success: false, error: errorMessage };
			} finally {
				setState((prev) => ({ ...prev, isLoading: false }));
			}
		},
		[state.isSubscribed],
	);

	// Request permission only
	const requestPermission = useCallback(async (): Promise<{
		success: boolean;
		permission: NotificationPermission;
	}> => {
		try {
			const permission = await notificationService.requestPermission();
			setState((prev) => ({ ...prev, permission }));
			return { success: permission === "granted", permission };
		} catch (error) {
			console.error("Error requesting notification permission:", error);
			return { success: false, permission: "denied" };
		}
	}, []);

	// Initialize
	useEffect(() => {
		const settings = loadSettings();
		setState((prev) => ({ ...prev, settings }));
		checkStatus();
	}, [loadSettings, checkStatus]);

	// Watch for permission changes
	useEffect(() => {
		if (typeof window === "undefined" || !("permissions" in navigator)) return;

		let isSubscribed = true;

		const watchPermission = async () => {
			try {
				const permission = await navigator.permissions.query({
					name: "notifications" as PermissionName,
				});

				const updatePermission = () => {
					if (isSubscribed) {
						setState((prev) => ({
							...prev,
							permission: permission.state as NotificationPermission,
						}));
					}
				};

				permission.addEventListener("change", updatePermission);
				updatePermission();

				return () => {
					isSubscribed = false;
					permission.removeEventListener("change", updatePermission);
				};
			} catch (error) {
				console.warn("Permission watching not supported:", error);
			}
		};

		watchPermission();

		return () => {
			isSubscribed = false;
		};
	}, []);

	return {
		...state,
		enableNotifications,
		disableNotifications,
		sendTestNotification,
		requestPermission,
		updateSettings,
		checkStatus,
	};
}
