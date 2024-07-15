"use client";

import React, {
	createContext,
	useState,
	useContext,
	ReactNode,
	useEffect,
} from "react";

import config from "@/config";
import { setApiUrl } from "@/service/api/provider";

import { useToast } from "./toast.context";

type Environment = "development" | "production";

interface EnvironmentContextProps {
	environment: Environment;
	toggleEnvironment: () => void;
	setEnvironment: React.Dispatch<React.SetStateAction<Environment>>;
}

const EnvironmentContext = createContext<EnvironmentContextProps | undefined>(
	undefined
);

export const EnvironmentProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const { addToast } = useToast();

	const [environment, setEnvironment] = useState<Environment>("development");

	console.log("config", environment);

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
		addToast({
			id: "environment",
			type: "success",
			message: `Environment set to ${environment}`,
		});
	}, [environment]);

	useEffect(() => {
		const storedEnvironment = localStorage.getItem(
			"environment"
		) as Environment;
		if (storedEnvironment) {
			setEnvironment(storedEnvironment);
		}
	}, []);

	return (
		<EnvironmentContext.Provider
			value={{ environment, toggleEnvironment, setEnvironment }}
		>
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
