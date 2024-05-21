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
	const [environment, setEnvironment] = useState<Environment>("development");

	useEffect(() => {
		setApiUrl(config[environment]);
	}, [environment]);

	const toggleEnvironment = () => {
		setEnvironment(prev =>
			prev === "development" ? "production" : "development"
		);
	};

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
