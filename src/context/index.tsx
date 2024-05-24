import React from "react";

import { AuthProvider } from "@/context/auth.context";
import { EnvironmentProvider } from "@/context/env.context";
import { PromptProvider } from "@/context/prompt.context";

export default function AppProviders({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element {
	return (
		<EnvironmentProvider>
			<PromptProvider>{children}</PromptProvider>
		</EnvironmentProvider>
	);
}
