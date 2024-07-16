"use client";

import React from "react";

import Toast from "@/components/UI/Toast";
import { AuthProvider } from "@/context/auth.context";
import { EnvironmentProvider } from "@/context/env.context";
import { PromptProvider } from "@/context/prompt.context";

import { ToastProvider } from "./toast.context";
import EnvironmentContainer from "@/components/UI/Environment";

export default function AppProviders({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element {
	return (
		<ToastProvider>
			<EnvironmentProvider>
				<EnvironmentContainer />
				<AuthProvider>
					<PromptProvider>
						<Toast />
						{children}
					</PromptProvider>
				</AuthProvider>
			</EnvironmentProvider>
		</ToastProvider>
	);
}
