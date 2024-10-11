import { LayoutContext, type LayoutContextProps } from "@/context/layout";
import { useContext } from "react";

export const useLayout = (): LayoutContextProps => {
	const context = useContext(LayoutContext);
	if (!context) {
		throw new Error("useLayout deve ser usado dentro de um LayoutProvider");
	}
	return context;
};
