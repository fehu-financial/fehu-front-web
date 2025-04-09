"use client";

import { apolloClient } from "@/core/data/graphql/client/urql";
import { ApolloProvider } from "@apollo/client/react";

import type { ReactNode } from "react";
import { WorkspaceProvider } from "./workspace";

export function GraphQLProvider({ children }: { children: ReactNode }) {
	return (
		<ApolloProvider client={apolloClient()}>
			<WorkspaceProvider>{children}</WorkspaceProvider>
		</ApolloProvider>
	);
}
