"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import { Web3Provider } from "@/lib/ether";
import { generateRandomID } from "@/lib/utils";
import { routes } from "@/service/api/routes";
import { SignIn, SignUp, User } from "@/types/auth.type";

import { useEnvironment } from "./env.context";
import { useToast } from "./toast.context";

interface AuthContextType {
	user: User | null;
	address: string | null;
	isLoggedIn: boolean;
	setCallbackURL: React.Dispatch<React.SetStateAction<string | null>>;
	signinWeb3: () => Promise<void>;
	signinGoogle: () => Promise<void>;
	signIn: (data: SignIn) => Promise<void>;
	signUp: (data: SignUp) => Promise<void>;
	signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	address: null,
	isLoggedIn: false,
	setCallbackURL: () => {},
	signinWeb3: async () => {},
	signinGoogle: async () => {},
	signIn: async () => {},
	signUp: async () => {},
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
	const router = useRouter();

	const { setEnvironment } = useEnvironment();
	const { addToast } = useToast();

	const [user, setUser] = useState<User | null>(null);
	const [address, setAddress] = useState<string | null>(null);
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
	const [callbackURL, setCallbackURL] = useState<string | null>(null);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await fetch("/api/prod/me");
				const data = await response.json();

				setUser(data.user);
				setIsLoggedIn(true);
			} catch (error: any) {
				console.error(error);
				setIsLoggedIn(false);
			}
		};

		fetchUser();
	}, []);

	const message = (nonce: string) => `
            Sign this message to prove you're an Inception Ark NFT holder.

            It will not cause a blockchain transaction, nor any gas fees.

            Nonce:
            ${nonce}`;

	const getNonce = async () => {
		setEnvironment("production");

		const provider = await Web3Provider.init();

		const address = await provider.userAddress();

		const { data } = await routes.getNonce(address);

		return data;
	};

	const signinWeb3 = async () => {
		setEnvironment("production");

		const provider = await Web3Provider.init();

		const nonce = await getNonce();

		const signature = await provider.sign(message(nonce));

		const address = await provider.userAddress();

		const { data } = await routes.login(address, signature);

		console.log(data);
	};

	const signinGoogle = async () => {
		try {
			await routes.googleLogin();
		} catch (error: any) {
			console.error(error);
			addToast({
				id: generateRandomID(),
				type: "error",
				message:
					error.response.data.error ?? error.response.data ?? error.message,
			});
		}
	};

	const signIn = async (data: SignIn) => {
		setEnvironment("production");
		try {
			const { data: user } = await routes.signin(data);
			setIsLoggedIn(true);
			setUser(user);

			localStorage.setItem("user", JSON.stringify(user));

			if (callbackURL) {
				router.push(callbackURL);
				setCallbackURL(null); // Reset callback URL after redirection
			} else {
				router.push("/"); // Default to home page or any other default page
			}
		} catch (error: any) {
			console.error(error);
			addToast({
				id: generateRandomID(),
				type: "error",
				message:
					error.response.data.error ?? error.response.data ?? error.message,
			});
		}
	};

	const signUp = async (data: SignUp) => {
		setEnvironment("production");
		try {
			const { data: user } = await routes.signup(data);
			setIsLoggedIn(true);
			setUser(user);

			localStorage.setItem("user", JSON.stringify(user));

			if (callbackURL) {
				router.push(callbackURL);
				setCallbackURL(null); // Reset callback URL after redirection
			} else {
				router.push("/"); // Default to home page or any other default page
			}
		} catch (error: any) {
			console.error(error);
			addToast({
				id: generateRandomID(),
				type: "error",
				message:
					error.response.data.error ?? error.response.data ?? error.message,
			});
		}
	};

	const signOut = async () => {
		setEnvironment("production");
		try {
			await routes.logout();
			setAddress(null);
			setIsLoggedIn(false);

			localStorage.removeItem("user");

			router.push("/");
		} catch (error: any) {
			console.error(error);
			addToast({
				id: generateRandomID(),
				type: "error",
				message:
					error.response.data.error ?? error.response.data ?? error.message,
			});
		}
	};

	const value: AuthContextType = {
		user,
		address,
		isLoggedIn,
		setCallbackURL,
		signinWeb3,
		signinGoogle,
		signIn,
		signUp,
		signOut,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function withAuth(
	Component: React.ComponentType<Readonly<{ children: React.ReactNode }>>
) {
	function AuthComponent(props: any) {
		const router = useRouter();
		const pathName = usePathname();

		const { isLoggedIn, setCallbackURL } = useAuth();

		const { addToast } = useToast();

		if (!isLoggedIn) {
			setCallbackURL(pathName);

			router.push("/auth");

			addToast({
				id: generateRandomID(),
				type: "error",
				message: "You must be logged in to access this page.",
			});

			return null;
		}

		return <Component {...props} />;
	}

	AuthComponent.displayName = `withAuth(${
		Component.displayName || Component.name
	})`;

	return AuthComponent;
}

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const router = useRouter();
	const pathName = usePathname();

	const { isLoggedIn, setCallbackURL } = useAuth();

	const { addToast } = useToast();

	useEffect(() => {
		if (!isLoggedIn) {
			setCallbackURL(pathName);

			router.push("/auth");

			addToast({
				id: generateRandomID(),
				type: "error",
				message: "You must be logged in to access this page.",
			});
		}
	}, [isLoggedIn, pathName, router, setCallbackURL]);

	return isLoggedIn ? children : null;
};

export default ProtectedRoute;
