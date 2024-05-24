"use client";

import React, {
	createContext,
	useState,
	useContext,
	ReactNode,
	useEffect,
} from "react";
import { useRouter } from "next/navigation";

import config from "@/config";
import { setApiUrl } from "@/service/api/provider";

type Environment = "development" | "production";

interface EnvironmentContextProps {
	environment: Environment;
	toggleEnvironment: () => void;
}

const EnvironmentContext = createContext<EnvironmentContextProps | undefined>(
	undefined
);

export const EnvironmentProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const router = useRouter();

	const [environment, setEnvironment] = useState<Environment>("development");

	const toggleEnvironment = () => {
		localStorage.setItem(
			"environment",
			environment === "development" ? "production" : "development"
		);

		setEnvironment(prev =>
			prev === "development" ? "production" : "development"
		);
	};

	useEffect(() => {
		setApiUrl(config[environment]);
	}, [environment]);

	useEffect(() => {
		const storedEnvironment = localStorage.getItem("environment") as Environment;
		if (storedEnvironment) {
			setEnvironment(storedEnvironment);
		}
	}, []);

	return (
		<EnvironmentContext.Provider value={{ environment, toggleEnvironment }}>
			{children}
		</EnvironmentContext.Provider>
	);
};

export const useEnvironment = (): EnvironmentContextProps => {
	const context = useContext(EnvironmentContext);
	if (!context) {
		throw new Error(
			"useEnvironment must be used within an EnvironmentProvider"
		);
	}
	return context;
};
