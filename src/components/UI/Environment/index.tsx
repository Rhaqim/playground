import React from "react";

import { useEnvironment } from "@/context/env.context";

const EnvironmentContainer = () => {
	const { environment } = useEnvironment();

	return (
		<div className="absolute top-20 left-0 p-4 z-50 md:w-[15%]">
			<div className="flex flex-row items-center text-center border-2 border-green-500 rounded-lg p-4 bg-blue-400 w-full animate-pulse">
				<svg
					className="h-6 w-6 text-red-400"
					fill="none"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path d="M5 13l4 4L19 7"></path>
				</svg>
				<p className="font-semibold text-center">{environment}</p>
			</div>
		</div>
	);
};

export default EnvironmentContainer;
