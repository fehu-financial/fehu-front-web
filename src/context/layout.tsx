"use client";

import useToggle from "@/hooks/use-toggle";
import type React from "react";
import { type ReactNode, createContext } from "react";

export interface LayoutContextProps {
	isDarkMode: boolean;
	isMobileSidebarOpen: boolean;
	toggleDarkMode: () => void;
	toggleMobileSidebar: () => void;
}

export const LayoutContext = createContext<LayoutContextProps | undefined>({
	isDarkMode: true,
	isMobileSidebarOpen: false,
	toggleDarkMode: () => {},
	toggleMobileSidebar: () => {},
});

export const LayoutProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [isDarkMode, toggleDarkMode] = useToggle(true);
	const [isMobileSidebarOpen, toggleMobileSidebar] = useToggle(false);

	return (
		<LayoutContext.Provider
			value={{
				isDarkMode,
				toggleDarkMode,
				isMobileSidebarOpen,
				toggleMobileSidebar,
			}}
		>
			{children}
		</LayoutContext.Provider>
	);
};
