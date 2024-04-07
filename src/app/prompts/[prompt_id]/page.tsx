"use client";

import React, { use, useEffect, useState } from "react";
import { routes } from "@/service/api/routes";

type ReturnData = {
	id: string;
	step: string;
	story: string;
	end: boolean;
	options?: Array<string>;
	summary: string;
	traits: string;
};

export default function Page({ params }: { params: { prompt_id: string } }) {
	const [prompt, setPrompt] = useState<ReturnData | null>(null);

	const promptResponse = async (choice: number, id: string) => {
		const response = await routes.respond(choice, id);
		setPrompt(response.data);
	};

	useEffect(() => {
		const fetchPrompt = async (id: string) => {
			// convert the id to a number
			const id_ = parseInt(id);

			const response = await routes.demoPrompt(id_);
			setPrompt(response.data);
		};
		fetchPrompt(params.prompt_id);
	}, [params.prompt_id]);


	if (!prompt) {
		return <div>Loading...</div>;
	}

	if (prompt.options && !prompt.end) {
		return (
			<div className="text-center">
				<h1 className="text-3xl font-bold mb-4">Prompt Page</h1>
				<div className="max-w-lg mx-auto bg-cover bg-center rounded-lg overflow-hidden shadow-lg">
					<div className="p-8">
						<h2 className="text-xl text-white mb-4 border border-gray-400 rounded-md p-4">
							{prompt.story}
						</h2>
						<ul className="text-white text-left list-none border border-gray-400 rounded-md p-4">
							{prompt.options.map((option, index) => (
								<li key={index}>
									<button
										className="focus:outline-none bg-transparent text-white hover:bg-gray-800 py-2 px-4 rounded-lg transition duration-300 ease-in-out"
										onClick={() => promptResponse(index + 1, prompt.id)}
									>
										{option}
									</button>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="text-center">
			<h1 className="text-3xl font-bold mb-4">Prompt Page</h1>
			<div className="max-w-lg mx-auto">
				<h2 className="text-xl mb-4">{prompt.story}</h2>
				<button
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					onClick={() => console.log("Continue")}
				>
					Continue
				</button>
			</div>
		</div>
	);
}
