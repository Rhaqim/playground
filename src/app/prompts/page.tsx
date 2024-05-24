"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/service/api/routes";
import { usePrompt } from "@/context/prompt.context";

export default function Page() {
	const { prompts } = usePrompt();

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
}) => {
	const router = useRouter();

	const { updatePrompt } = usePrompt();

	const [editableRow, setEditableRow] = useState<number | null>(null); // Track the id of the currently editable row
	const editRef = useRef<HTMLTextAreaElement>(null);

	const handleEdit = (id: number) => {
		setEditableRow(id); // Enable editing for the selected row
		setTimeout(() => editRef.current?.focus(), 0); // Focus the textarea after a short delay to ensure it's mounted
	};

	const handleSave = async (id: number, category: string, prompt: string) => {
		await updatePrompt({ id, category, prompt }, setEditableRow);
	}

	const handleCancel = () => {
		setEditableRow(null);
	};

	return (
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
						<td className="text-wrap max-w-[50%]">
							{editableRow === prompt.id ? ( // If editing is enabled for this row
								<textarea
									ref={editRef}
									value={prompt.prompt}
									rows={10}
									onChange={e => {} /* Handle changes if needed */}
									className="w-full border-gray-300 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
								/>
							) : (
								prompt.prompt
							)}
						</td>
						<td className="flex">
							{editableRow === prompt.id ? ( // If editing is enabled for this row
								<>
									<button
										onClick={() =>
											handleSave(prompt.id, prompt.category, prompt.prompt)
										}
										className="bg-green-500 text-white px-4 py-1 rounded-md"
									>
										Save
									</button>
									<button
										onClick={handleCancel}
										className="bg-gray-500 text-white px-4 py-1 rounded-md ml-2"
									>
										Cancel
									</button>
								</>
							) : (
								<button
									onClick={() => handleEdit(prompt.id)}
									className="bg-blue-500 text-white px-4 py-1 rounded-md"
								>
									Edit
								</button>
							)}
							<button
								onClick={() => routes.delPrompt(prompt.id.toString())}
								className="bg-red-500 text-white px-4 py-1 rounded-md ml-2"
							>
								Delete
							</button>
							<button
								onClick={() =>
									// routes.demoPrompt({ prompt_id: prompt.id.toString() })
									router.push(`/prompts/${prompt.id}`)
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
};
