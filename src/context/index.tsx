'use client';

import React from "react";

import { AuthProvider } from "@/context/auth.context";
import { EnvironmentProvider } from "@/context/env.context";
import { PromptProvider } from "@/context/prompt.context";
import { ToastProvider } from "./toast.context";
import Toast from "@/components/UI/Toast";

export default function AppProviders({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element {
	return (
		<ToastProvider>
			<EnvironmentProvider>
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
