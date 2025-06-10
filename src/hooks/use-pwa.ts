"use client";

import { type PWACapabilities, pwaService } from "@/services/pwa-service";
import { useCallback, useEffect, useState } from "react";

interface WindowWithMSStream extends Window {
	MSStream?: unknown;
}

export interface BrowserInfo {
	isIOS: boolean;
	isAndroid: boolean;
	isSafari: boolean;
	isChrome: boolean;
	isFirefox: boolean;
	isEdge: boolean;
	isMobile: boolean;
	isDesktop: boolean;
}

export interface InstallInstructions {
	title: string;
	steps: string[];
}

export function usePWA() {
	const [capabilities, setCapabilities] = useState<PWACapabilities>(() =>
		pwaService.getCapabilities(),
	);
	const [showInstallPrompt, setShowInstallPrompt] = useState(false);

	// Update capabilities when they change
	useEffect(() => {
		const handleCapabilitiesChange = (data: Record<string, unknown>) => {
			if (data.capabilities) {
				setCapabilities(data.capabilities as PWACapabilities);
			}
		};

		pwaService.addEventListener(
			"pwaCapabilitiesChanged",
			handleCapabilitiesChange,
		);

		return () => {
			pwaService.removeEventListener(
				"pwaCapabilitiesChanged",
				handleCapabilitiesChange,
			);
		};
	}, []);

	// Auto-show install prompt with delay
	useEffect(() => {
		if (capabilities.canInstall && !capabilities.isInstalled) {
			const timer = setTimeout(() => {
				setShowInstallPrompt(true);
			}, 2000);

			return () => clearTimeout(timer);
		}
	}, [capabilities.canInstall, capabilities.isInstalled]);

	// Get browser information
	const getBrowserInfo = useCallback((): BrowserInfo => {
		if (typeof window === "undefined") {
			return {
				isIOS: false,
				isAndroid: false,
				isSafari: false,
				isChrome: false,
				isFirefox: false,
				isEdge: false,
				isMobile: false,
				isDesktop: true,
			};
		}

		const userAgent = navigator.userAgent;
		const isIOS =
			/iPad|iPhone|iPod/.test(userAgent) &&
			!(window as WindowWithMSStream).MSStream;
		const isAndroid = /Android/.test(userAgent);
		const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
		const isChrome = /Chrome/.test(userAgent);
		const isFirefox = /Firefox/.test(userAgent);
		const isEdge = /Edg/.test(userAgent);
		const isMobile = window.innerWidth < 768;

		return {
			isIOS,
			isAndroid,
			isSafari,
			isChrome,
			isFirefox,
			isEdge,
			isMobile,
			isDesktop: !isMobile,
		};
	}, []);

	// Get install instructions based on browser
	const getInstallInstructions = useCallback((): InstallInstructions => {
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
	}, [getBrowserInfo]);

	// Install the PWA
	const install = useCallback(async (): Promise<boolean> => {
		try {
			await pwaService.promptInstall();
			setShowInstallPrompt(false);
			return true;
		} catch (error) {
			console.error("Installation failed:", error);
			return false;
		}
	}, []);

	// Register service worker
	const registerServiceWorker = useCallback(async () => {
		return pwaService.initialize();
	}, []);

	// Hide install prompt
	const hideInstallPrompt = useCallback(() => {
		setShowInstallPrompt(false);
	}, []);

	return {
		...capabilities,
		showInstallPrompt,
		install,
		registerServiceWorker,
		getBrowserInfo,
		getInstallInstructions,
		hideInstallPrompt,
	};
}
