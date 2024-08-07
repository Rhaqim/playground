"use client";

import React, { useState, useEffect, useRef } from "react";

import MobileLayout from "@/components/Prompt/Mobilelayout";
import PromptsTable from "@/components/Prompt/TableLayout";
import Search from "@/components/Search";
import { usePrompt } from "@/context/prompt.context";
import { useEnvironment } from "@/context/env.context";
import { routes } from "@/service/api/routes";
import Prompt, { Topic } from "@/types/prompt.type";

import Blank from "../playground/blank";

export default function Page() {
	const {
		prompts,
		topics,
		categories,
		newCategoryName,
		handleCategoryCreation,
		setNewCategoryName,
	} = usePrompt();
	const { setEnvironment, environment } = useEnvironment();

	const hasFetched = useRef(false);

	const { updatePrompt, reloadAll } = usePrompt();

	const [topics_, setTopics] = useState<Topic[]>(topics);

	const [filteredPrompts, setFilteredPrompts] = useState(prompts);

	const [response, setResponse] = useState<string>("");
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const toggleModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	const handleSearch = (data: any) => {
		setFilteredPrompts(data);
	};

	const [editableRow, setEditableRow] = useState<number | null>(null); // Track the id of the currently editable row

	const [promptText, setPromptText] = useState<{ [key: number]: string }>({}); // Track the prompt text of the currently editable row

	const handleSave = async (
		id: number,
		category: string,
		prompt: string,
		available: string
	) => {
		await updatePrompt({ id, category, prompt, available }, setEditableRow);
	};

	const handleCancel = () => {
		setEditableRow(null);
	};

	const handleDelete = async (id: number) => {
		await routes.delPrompt(id.toString());
		await reloadAll();
	};

	const handleMigrate = async (prompt: Prompt) => {
		setEnvironment(
			environment === "development" ? "production" : "development"
		);
		setResponse(prompt.prompt);
		toggleModal();
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

	const makeAvailable = async (id: number, available: string = "available") => {
		await routes.changePromptAvailability(id, available);
		await reloadAll();
	};

	useEffect(() => {
		setTopics(topics);
	}, [topics]);

	useEffect(() => {
		setFilteredPrompts(prompts);
	}, [prompts]);

	useEffect(() => {
		if (!hasFetched.current) {
			hasFetched.current = true;
			reloadAll();
		}
	}, []);

	return (
		<div className="w-full mx-auto p-2 text-white">
			<h1 className="text-4xl font-bold text-center">
				Welcome to the Writing Prompt Explorer
			</h1>
			<p className="text-center text-lg mt-4">
				Explore and manage the writing prompts available in the system.
			</p>
			<div className="flex justify-center items-center m-2 border rounded-md">
				<Search
					placeholder="Search for a prompt"
					data={prompts}
					searchFields={["prompt"]}
					callBack={handleSearch}
				/>
			</div>
			<div className="flex flex-col items-center mt-4 p-2 border rounded-md">
				<PromptsTable
					prompts={filteredPrompts}
					topics={topics_}
					categories={categories}
					editableRow={editableRow}
					promptText={promptText}
					setPromptText={setPromptText}
					setEditableRow={setEditableRow}
					handleSave={handleSave}
					handleCancel={handleCancel}
					handleDelete={handleDelete}
					handleMigrate={handleMigrate}
					makeAvailable={makeAvailable}
					handleTopicCategoryChange={handleTopicCategoryChange}
				/>
				<MobileLayout
					prompts={filteredPrompts}
					topics={topics_}
					categories={categories}
					editableRow={editableRow}
					promptText={promptText}
					setPromptText={setPromptText}
					setEditableRow={setEditableRow}
					handleSave={handleSave}
					handleCancel={handleCancel}
					handleDelete={handleDelete}
					handleMigrate={handleMigrate}
					makeAvailable={makeAvailable}
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
			{isModalOpen && (
				<div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-75 z-45">
					<Blank
						buttonText={`Migrate to ${environment}`}
						response={response}
						setResponse={setResponse}
						categories={categories}
						toggleModal={toggleModal}
						setIsModalOpen={setIsModalOpen}
					/>
				</div>
			)}
		</div>
	);
}
