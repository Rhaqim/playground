"use client";

import React, { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";

import { Web3Provider } from "@/lib/ether";
import { routes } from "@/service/api/routes";
import { SignIn, SignUp, User } from "@/types/auth.type";

interface AuthContextType {
	user: User | null;
	address: string | null;
	isLoggedIn: boolean;
	signIn: (data: SignIn) => Promise<void>;
	signUp: (data: SignUp) => Promise<void>;
	signinWeb3: () => Promise<void>;
	signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	address: null,
	isLoggedIn: false,
	signIn: async () => {},
	signUp: async () => {},
	signinWeb3: async () => {},
	signOut: async () => {},
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
	const [user, setUser] = useState<User | null>(null);
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

		return data;
	};

	const signinWeb3 = async () => {
		const provider = await Web3Provider.init();

		const nonce = await getNonce();

		const signature = await provider.sign(message(nonce));

		const address = await provider.userAddress();

		const { data } = await routes.login(address, signature);

		console.log(data);
	};

	const signIn = async (data: SignIn) => {
		const { data: user } = await routes.signin(data);
		setUser(user);
		localStorage.setItem("user", JSON.stringify(user));
	};

	const signUp = async (data: SignUp) => {
		const { data: user } = await routes.signup(data);
		setUser(user);
		localStorage.setItem("user", JSON.stringify(user));
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

	const value: AuthContextType = {
		user,
		address,
		isLoggedIn,
		signIn,
		signUp,
		signinWeb3,
		signOut,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
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
	}

	AuthComponent.displayName = `withAuth(${
		Component.displayName || Component.name
	})`;

	return AuthComponent;
}
