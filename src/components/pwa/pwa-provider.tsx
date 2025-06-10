"use client";

import { pwaService } from "@/services/pwa-service";
import { useEffect } from "react";

interface PWAProviderProps {
	children: React.ReactNode;
}

function PWAProvider({ children }: PWAProviderProps) {
	useEffect(() => {
		// Initialize PWA service on mount
		const initializePWA = async () => {
			try {
				await pwaService.initialize();
				console.log("PWA initialized successfully");
			} catch (error) {
				console.error("Failed to initialize PWA:", error);
			}
		};

		// Only initialize in browser environment
		if (typeof window !== "undefined") {
			initializePWA();
		}
	}, []);

	return <>{children}</>;
}

export default PWAProvider;
