import {
	WorkspaceContext,
	type WorkspaceContextProps,
} from "@/context/workspace";
import { useContext } from "react";

export const useWorkspace = (): WorkspaceContextProps => {
	const context = useContext(WorkspaceContext);
	if (!context) {
		throw new Error(
			"useWorkspace deve ser usado dentro de um WorkspaceProvider",
		);
	}
	return context;
};
