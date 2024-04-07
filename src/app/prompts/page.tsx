"use client";

import React, { useEffect, useState } from "react";
import { routes } from "@/service/api/routes";

export default function Page() {
	const [prompts, setPrompts] = useState<
		{ category: string; prompt: string; id: number }[]
	>([]);

	async function generatePrompt() {
		const { data } = await routes.getPrompt();
		setPrompts(data.prompts);
	}

	useEffect(() => {
		generatePrompt();
	}, []);

	return (
		<div>
			<h1 className="text-4xl font-bold text-center">
				Welcome to the Writing Prompt Generator
			</h1>
			<p className="text-center text-lg mt-4">
				Get started by generating a writing prompt or exploring the prompts
				created by others.
			</p>
			<PromptsTable prompts={prompts} />
		</div>
	);
}

const PromptsTable = ({
	prompts,
}: {
	prompts: { category: string; prompt: string; id: number }[];
}) => (
	<table className="w-full mt-4 rounded-md">
		<thead>
			<tr>
				<th className="text-left">Category</th>
				<th className="text-left">Prompt</th>
				<th className="text-left">Action</th>
			</tr>
		</thead>
		<tbody>
			{prompts.map(prompt => (
				<tr key={prompt.id}>
					<td>{prompt.category}</td>
					<td className="text-wrap max-w-[50%]">{prompt.prompt}</td>
					<td className="flex">
						<button className="bg-blue-500 text-white px-4 py-1 rounded-md">
							Edit
						</button>
						<button
							onClick={() => routes.delPrompt(prompt.id.toString())}
							className="bg-red-500 text-white px-4 py-1 rounded-md ml-2"
						>
							Delete
						</button>
						<button
							onClick={() =>
								routes.demoPrompt({ prompt_id: prompt.id.toString() })
							}
							className="bg-green-500 text-white px-4 py-1 rounded-md ml-2"
						>
							Demo
						</button>
					</td>
				</tr>
			))}
		</tbody>
	</table>
);
