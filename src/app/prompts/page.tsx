"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

import { routes } from "@/service/api/routes";
import { usePrompt } from "@/context/prompt.context";
import Prompt, { Topic, Category } from "@/types/prompt.type";

export default function Page() {
	const {
		prompts,
		topics,
		categories,
		newCategoryName,
		handleCategoryCreation,
		setNewCategoryName,
	} = usePrompt();

	return (
		<div className="w-full mx-auto p-4 text-white">
			<h1 className="text-4xl font-bold text-center">
				Welcome to the Writing Prompt Explorer
			</h1>
			<p className="text-center text-lg mt-4">
				Explore and manage the writing prompts available in the system.
			</p>
			<div className="flex flex-col items-center mt-4 p-4 border rounded-md">
				<PromptsTable
					prompts={prompts}
					topics_={topics}
					categories={categories}
				/>
			</div>
			<div
				className="flex flex-col items-center mt-4 p-4 border rounded-md"
				style={{ maxWidth: "300px" }}
			>
				<h2
					className="text-xl font-bold text-center"
					style={{ borderBottom: "1px solid black" }}
				>
					Create New Category
				</h2>
				<input
					className="border-gray-300 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
					type="text"
					value={newCategoryName}
					onChange={e => setNewCategoryName(e.target.value)}
				/>
				<button
					className="bg-blue-500 text-white px-4 py-1 rounded-md mt-2"
					onClick={handleCategoryCreation}
				>
					Create
				</button>
			</div>
		</div>
	);
}

const PromptsTable = ({
	prompts,
	topics_,
	categories,
}: {
	prompts: Prompt[];
	topics_: Topic[];
	categories: Category[];
}) => {
	const router = useRouter();

	const { updatePrompt } = usePrompt();

	const [topics, setTopics] = useState<Topic[]>(topics_);

	useEffect(() => {
		setTopics(topics_);
	}, [topics_]);

	const [editableRow, setEditableRow] = useState<number | null>(null); // Track the id of the currently editable row
	const editRef = useRef<HTMLTextAreaElement>(null);

	const handleEdit = (id: number) => {
		setEditableRow(id); // Enable editing for the selected row
		setTimeout(() => editRef.current?.focus(), 0); // Focus the textarea after a short delay to ensure it's mounted
	};

	const handleSave = async (id: number, category: string, prompt: string) => {
		await updatePrompt({ id, category, prompt }, setEditableRow);
	};

	const handleCancel = () => {
		setEditableRow(null);
	};

	return (
		<table className="w-full mt-2 rounded-md">
			<thead>
				<tr className="text-white">
					<th className="text-left" style={{ borderTopLeftRadius: "0.5rem" }}>
						Topic
					</th>
					<th className="text-left" style={{ borderTopRightRadius: "0.5rem" }}>
						Category
					</th>
					<th className="text-left" style={{ borderTopRightRadius: "0.5rem" }}>
						Prompt
					</th>
					<th className="text-left" style={{ borderTopRightRadius: "0.5rem" }}>
						Actions
					</th>
				</tr>
			</thead>
			<tbody>
				{prompts.map(prompt => {
					const topic_id = parseInt(prompt.category);

					const topic = topics.find(topic => topic.id === topic_id);

					const category = categories.find(
						category => category.id === topic?.categoryId
					);

					const handleTopicCategoryChange = async (
						topicId: string,
						categoryId: string
					) => {
						const id = parseInt(topicId);
						const catId = parseInt(categoryId);

						const { data } = await routes.updateTopicCategory(id, catId);
						setTopics(prev =>
							prev.map(t => (t.id === data.topic.id ? data.topic : t))
						);
					};

					return (
						<tr className="border-t border-gray-300 text-white" key={prompt.id}>
							<td
								className="text-left"
								style={{ borderTopLeftRadius: "0.5rem" }}
							>
								{topic?.name}
							</td>
							<td
								className="text-left"
								style={{ borderTopRightRadius: "0.5rem" }}
							>
								<select
									className="border-gray-300 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
									value={category?.id}
									onChange={e =>
										handleTopicCategoryChange(prompt.category, e.target.value)
									}
								>
									{categories.map(category => (
										<option key={category.id} value={category.id}>
											{category.name}
										</option>
									))}
								</select>
							</td>

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
							<td className="flex flex-col md:flex-row">
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
									onClick={() =>
										routes.delPrompt(prompt.id.toString())
										// console.log("Delete prompt")
									}
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
					);
				})}
			</tbody>
		</table>
	);
};
