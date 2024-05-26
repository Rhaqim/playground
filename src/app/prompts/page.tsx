"use client";

import React, { useState, useEffect } from "react";

import { routes } from "@/service/api/routes";
import { usePrompt } from "@/context/prompt.context";
import { Topic } from "@/types/prompt.type";
import MobileLayout from "@/components/Prompt/Mobilelayout";
import PromptsTable from "@/components/Prompt/TableLayout";

export default function Page() {
	const {
		prompts,
		topics,
		categories,
		newCategoryName,
		handleCategoryCreation,
		setNewCategoryName,
	} = usePrompt();

	const { updatePrompt } = usePrompt();

	const [topics_, setTopics] = useState<Topic[]>(topics);

	useEffect(() => {
		setTopics(topics_);
	}, [topics_]);

	const [editableRow, setEditableRow] = useState<number | null>(null); // Track the id of the currently editable row

	const handleSave = async (id: number, category: string, prompt: string) => {
		await updatePrompt({ id, category, prompt }, setEditableRow);
	};

	const handleCancel = () => {
		setEditableRow(null);
	};

	const handleDelete = async (id: number) => {
		await routes.delPrompt(id.toString());
	};

	const handleTopicCategoryChange = async (
		topicId: string,
		categoryId: string
	) => {
		const id = parseInt(topicId);
		const catId = parseInt(categoryId);

		const { data } = await routes.updateTopicCategory(id, catId);
		setTopics(prev => prev.map(t => (t.id === data.topic.id ? data.topic : t)));
	};

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
					topics={topics_}
					categories={categories}
					editableRow={editableRow}
					setEditableRow={setEditableRow}
					handleSave={handleSave}
					handleCancel={handleCancel}
					handleDelete={handleDelete}
					handleTopicCategoryChange={handleTopicCategoryChange}
				/>
				<MobileLayout
					prompts={prompts}
					topics={topics_}
					categories={categories}
					editableRow={editableRow}
					setEditableRow={setEditableRow}
					handleSave={handleSave}
					handleCancel={handleCancel}
					handleDelete={handleDelete}
					handleTopicCategoryChange={handleTopicCategoryChange}
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
