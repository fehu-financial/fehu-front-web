"use client";

import { notificationService } from "./notification-service";

interface NavigatorWithStandalone extends Navigator {
	standalone?: boolean;
}

export interface PWACapabilities {
	isSupported: boolean;
	canInstall: boolean;
	isInstalled: boolean;
	hasServiceWorker: boolean;
	hasManifest: boolean;
	hasNotifications: boolean;
	isOnline: boolean;
}

export interface PWAInstallEvent extends Event {
	prompt(): Promise<void>;
	userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export class PWAService {
	private static instance: PWAService;
	private installPromptEvent: PWAInstallEvent | null = null;
	private capabilities: PWACapabilities;
	private listeners: Map<string, Set<(data: Record<string, unknown>) => void>> =
		new Map();

	private constructor() {
		// Only initialize if in browser environment
		if (typeof window !== "undefined") {
			this.capabilities = this.checkCapabilities();
			this.setupEventListeners();
		} else {
			// Server-side default capabilities
			this.capabilities = {
				isSupported: false,
				canInstall: false,
				isInstalled: false,
				hasServiceWorker: false,
				hasManifest: false,
				hasNotifications: false,
				isOnline: false,
			};
		}
	}

	static getInstance(): PWAService {
		if (!PWAService.instance) {
			PWAService.instance = new PWAService();
		}
		return PWAService.instance;
	}

	/**
	 * Check PWA capabilities
	 */
	private checkCapabilities(): PWACapabilities {
		if (typeof window === "undefined") {
			return {
				isSupported: false,
				canInstall: false,
				isInstalled: false,
				hasServiceWorker: false,
				hasManifest: false,
				hasNotifications: false,
				isOnline: false,
			};
		}

		const hasServiceWorker = "serviceWorker" in navigator;
		const hasManifest = document.querySelector('link[rel="manifest"]') !== null;
		const hasNotifications = "Notification" in window;
		const isInstalled =
			window.matchMedia("(display-mode: standalone)").matches ||
			(window.navigator as NavigatorWithStandalone).standalone === true;
		const isOnline = navigator.onLine;

		const isSupported = hasServiceWorker && hasManifest;

		return {
			isSupported,
			canInstall: false, // Will be updated when install prompt is available
			isInstalled,
			hasServiceWorker,
			hasManifest,
			hasNotifications,
			isOnline,
		};
	}

	/**
	 * Get current capabilities
	 */
	getCapabilities(): PWACapabilities {
		return { ...this.capabilities };
	}

	/**
	 * Setup event listeners
	 */
	private setupEventListeners(): void {
		if (typeof window === "undefined") return;

		window.addEventListener("beforeinstallprompt", (event) => {
			event.preventDefault();
			this.installPromptEvent = event as PWAInstallEvent;
			this.capabilities.canInstall = true;
			this.notifyListeners("pwaCapabilitiesChanged", {
				capabilities: this.capabilities,
			});
		});

		window.addEventListener("appinstalled", () => {
			this.capabilities.isInstalled = true;
			this.capabilities.canInstall = false;
			this.notifyListeners("pwaCapabilitiesChanged", {
				capabilities: this.capabilities,
			});
		});

		if ("serviceWorker" in navigator) {
			navigator.serviceWorker.addEventListener("controllerchange", () => {
				setTimeout(() => {
					this.checkForUpdates();
				}, 1000);
			});
		}
	}

	/**
	 * Register service worker
	 */
	private async registerServiceWorker(): Promise<void> {
		if (typeof window === "undefined" || !("serviceWorker" in navigator))
			return;

		try {
			await navigator.serviceWorker.register("/sw.js");
		} catch (error) {
			console.error("Service worker registration failed:", error);
		}
	}

	/**
	 * Check for updates
	 */
	async checkForUpdates(): Promise<void> {
		if (typeof window === "undefined" || !("serviceWorker" in navigator))
			return;

		try {
			const registration = await navigator.serviceWorker.getRegistration();
			if (registration) {
				registration.update();
			}
		} catch (error) {
			console.error("Error checking for updates:", error);
		}
	}

	/**
	 * Add event listener
	 */
	addEventListener(
		event: string,
		listener: (data: Record<string, unknown>) => void,
	): void {
		if (!this.listeners.has(event)) {
			this.listeners.set(event, new Set());
		}
		const eventListeners = this.listeners.get(event);
		if (eventListeners) {
			eventListeners.add(listener);
		}
	}

	/**
	 * Remove event listener
	 */
	removeEventListener(
		event: string,
		listener: (data: Record<string, unknown>) => void,
	): void {
		const eventListeners = this.listeners.get(event);
		if (eventListeners) {
			eventListeners.delete(listener);
		}
	}

	/**
	 * Notify listeners
	 */
	private notifyListeners(event: string, data: Record<string, unknown>): void {
		const eventListeners = this.listeners.get(event);
		if (eventListeners) {
			for (const listener of eventListeners) {
				listener(data);
			}
		}
	}

	/**
	 * Prompt install
	 */
	async promptInstall(): Promise<void> {
		if (typeof window === "undefined" || !this.installPromptEvent) return;

		try {
			this.installPromptEvent.prompt();
			const { outcome } = await this.installPromptEvent.userChoice;
			if (outcome === "accepted") {
				this.capabilities.isInstalled = true;
			}
			this.capabilities.canInstall = false;
			this.notifyListeners("pwaCapabilitiesChanged", {
				capabilities: this.capabilities,
			});
		} catch (error) {
			console.error("Error prompting install:", error);
		}
	}

	/**
	 * Initialize PWA service
	 */
	async initialize(): Promise<void> {
		if (typeof window === "undefined") return;

		// Register service worker
		await this.registerServiceWorker();

		// Check for updates
		await this.checkForUpdates();
	}
}

export const pwaService = PWAService.getInstance();
