"use client";

import useToggle from "@/core/hooks/use-toggle";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type React from "react";
import { type ReactNode, createContext } from "react";

export interface LayoutContextProps {
	isDarkMode: boolean;
	isMobileSidebarOpen: boolean;
	toggleDarkMode: () => void;
	toggleMobileSidebar: () => void;
}

export const LayoutContext = createContext<LayoutContextProps | undefined>({
	isDarkMode: false,
	isMobileSidebarOpen: false,
	toggleDarkMode: () => {},
	toggleMobileSidebar: () => {},
});

export const LayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [isDarkMode, toggleDarkMode] = useToggle(true);
	const [isMobileSidebarOpen, toggleMobileSidebar] = useToggle(false);
	const queryClient = new QueryClient();

	return (
		<LayoutContext.Provider
			value={{
				isDarkMode,
				toggleDarkMode,
				isMobileSidebarOpen,
				toggleMobileSidebar,
			}}
		>
			<NuqsAdapter>
				<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
			</NuqsAdapter>
		</LayoutContext.Provider>
	);
};
