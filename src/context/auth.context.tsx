"use client";

import React, { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";

import { Web3Provider } from "@/lib/ether";
import { routes } from "@/service/api/routes";

interface AuthContextType {
	address: string | null;
	isLoggedIn: boolean;
	signIn: () => void;
	signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
	address: null,
	isLoggedIn: false,
	signIn: () => {},
	signOut: () => {},
});

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}

type AuthProviderProps = {
	children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [address, setAddress] = useState<string | null>(null);
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

	const message = (nonce: string) => `
            Sign this message to prove you're an Inception Ark NFT holder.

            It will not cause a blockchain transaction, nor any gas fees.

            Nonce:
            ${nonce}`;

	const getNonce = async () => {
		const provider = await Web3Provider.init();

		const address = await provider.userAddress();

		const { data } = await routes.getNonce(address);

		return data
	};

	const signIn = async () => {
		const provider = await Web3Provider.init();

        const nonce = await getNonce();

		const signature = await provider.sign(message(nonce));

		const address = await provider.userAddress();

		const { data } = await routes.login(address, signature);

		console.log(data);
	};

	const signOut = async () => {
		try {
			await routes.logout();
			setAddress(null);
			setIsLoggedIn(false);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<AuthContext.Provider value={{ address, isLoggedIn, signIn, signOut }}>
			{children}
		</AuthContext.Provider>
	);
};

export function withAuth(Component: React.ComponentType) {
	function AuthComponent(props: any) {
		const { isLoggedIn } = useAuth();

		const router = useRouter();

		if (!isLoggedIn) {
			router.push("/");
			return null;
		}

		return <Component {...props} />;
	};

	AuthComponent.displayName = `withAuth(${Component.displayName || Component.name})`;

	return AuthComponent;
}