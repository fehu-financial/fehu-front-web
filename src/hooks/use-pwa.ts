"use client";

import { useEffect, useState } from "react";

interface PWAInstallPrompt extends Event {
	prompt(): Promise<void>;
	userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function usePWA() {
	const [isSupported, setIsSupported] = useState(false);
	const [isInstalled, setIsInstalled] = useState(false);
	const [canInstall, setCanInstall] = useState(false);
	const [installPrompt, setInstallPrompt] = useState<PWAInstallPrompt | null>(
		null,
	);
	const [isOnline, setIsOnline] = useState(true);

	useEffect(() => {
		// Check PWA support
		const checkSupport = () => {
			const hasServiceWorker = "serviceWorker" in navigator;
			const hasManifest = "manifest" in document.documentElement;
			const hasPushManager = "PushManager" in window;

			setIsSupported(hasServiceWorker && hasManifest);
			return hasServiceWorker && hasManifest && hasPushManager;
		};

		// Check if app is installed
		const checkInstalled = () => {
			const isStandalone =
				window.matchMedia("(display-mode: standalone)").matches ||
				(window.navigator as any).standalone === true;
			setIsInstalled(isStandalone);
			return isStandalone;
		};

		// Listen for install prompt
		const handleBeforeInstallPrompt = (e: Event) => {
			e.preventDefault();
			setInstallPrompt(e as PWAInstallPrompt);
			setCanInstall(true);
		};

		// Listen for app installed
		const handleAppInstalled = () => {
			setCanInstall(false);
			setInstallPrompt(null);
			setIsInstalled(true);
		};

		// Listen for online/offline status
		const handleOnline = () => setIsOnline(true);
		const handleOffline = () => setIsOnline(false);

		checkSupport();
		checkInstalled();
		setIsOnline(navigator.onLine);

		window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
		window.addEventListener("appinstalled", handleAppInstalled);
		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		return () => {
			window.removeEventListener(
				"beforeinstallprompt",
				handleBeforeInstallPrompt,
			);
			window.removeEventListener("appinstalled", handleAppInstalled);
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, []);

	const install = async () => {
		if (!installPrompt) return false;

		try {
			await installPrompt.prompt();
			const choice = await installPrompt.userChoice;

			if (choice.outcome === "accepted") {
				setCanInstall(false);
				setInstallPrompt(null);
				return true;
			}
			return false;
		} catch (error) {
			console.error("Installation failed:", error);
			return false;
		}
	};

	const registerServiceWorker = async () => {
		if (!isSupported) return false;

		try {
			const registration = await navigator.serviceWorker.register("/sw.js", {
				scope: "/",
				updateViaCache: "none",
			});

			console.log("Service Worker registered:", registration);
			return registration;
		} catch (error) {
			console.error("Service Worker registration failed:", error);
			return false;
		}
	};

	const getBrowserInfo = () => {
		const userAgent = navigator.userAgent;
		const isIOS =
			/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
		const isAndroid = /Android/.test(userAgent);
		const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
		const isChrome = /Chrome/.test(userAgent);
		const isFirefox = /Firefox/.test(userAgent);
		const isEdge = /Edg/.test(userAgent);

		return {
			isIOS,
			isAndroid,
			isSafari,
			isChrome,
			isFirefox,
			isEdge,
			isMobile: isIOS || isAndroid,
			isDesktop: !isIOS && !isAndroid,
		};
	};

	const getInstallInstructions = () => {
		const browser = getBrowserInfo();

		if (browser.isIOS) {
			return {
				title: "Instalar no iOS",
				steps: [
					"Toque no botão de compartilhar (⎋)",
					'Selecione "Adicionar à Tela Inicial"',
					'Toque em "Adicionar" para confirmar',
				],
			};
		}

		if (browser.isChrome) {
			return {
				title: "Instalar no Chrome",
				steps: [
					"Clique no menu (⋮)",
					'Selecione "Instalar Fehu Financial"',
					"Confirme a instalação",
				],
			};
		}

		if (browser.isEdge) {
			return {
				title: "Instalar no Edge",
				steps: [
					"Clique no menu (⋯)",
					'Vá em "Aplicativos"',
					'Clique em "Instalar este site"',
				],
			};
		}

		if (browser.isFirefox) {
			return {
				title: "Instalar no Firefox",
				steps: [
					"Procure o ícone de instalação na barra de endereços",
					"Clique no ícone",
					"Confirme a instalação",
				],
			};
		}

		return {
			title: "Instalar App",
			steps: [
				"Procure pela opção de instalação no menu do seu navegador",
				'Selecione "Instalar" ou "Adicionar à tela inicial"',
				"Confirme a instalação",
			],
		};
	};

	return {
		isSupported,
		isInstalled,
		canInstall,
		isOnline,
		install,
		registerServiceWorker,
		getBrowserInfo,
		getInstallInstructions,
	};
}
