"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";

import Prompt, { Topic, Category } from "@/types/prompt.type";
import DeleteConfirmationModal from "../Delete";

interface MobileLayoutProps {
	prompts: Prompt[];
	topics: Topic[];
	categories: Category[];
	editableRow: number | null;
	promptText: { [key: number]: string };
	setPromptText: React.Dispatch<
		React.SetStateAction<{ [key: number]: string }>
	>;
	setEditableRow: React.Dispatch<React.SetStateAction<number | null>>;
	handleSave: (
		id: number,
		category: string,
		prompt: string,
		available: string
	) => void;
	handleCancel: () => void;
	handleDelete: (id: number) => void;
	handleMigrate: (prompt: Prompt) => void;
	makeAvailable: (id: number, available: string) => void;
	handleTopicCategoryChange: (topicId: string, categoryId: string) => void;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
	prompts,
	topics,
	categories,
	editableRow,
	promptText,
	setPromptText,
	setEditableRow,
	handleSave,
	handleCancel,
	handleDelete,
	handleMigrate,
	makeAvailable,
	handleTopicCategoryChange,
}) => {
	const router = useRouter();
	const editRef = useRef<HTMLTextAreaElement>(null);

	const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
	const [selectedPrompt, setSelectedPrompt] = React.useState<{
		id: number;
		prompt: string | undefined;
	} | null>(null);

	const handleOpenDeleteModal = (id: number, prompt: string | undefined) => {
		setSelectedPrompt({ id, prompt });
		setIsDeleteModalOpen(true);
	};

	const handleCloseDeleteModal = () => {
		setIsDeleteModalOpen(false);
		setSelectedPrompt(null);
	};

	const handleEdit = (id: number) => {
		setEditableRow(id); // Enable editing for the selected row
		setTimeout(() => editRef.current?.focus(), 0); // Focus the textarea after a short delay to ensure it's mounted
	};

	return (
		<div className="block md:hidden">
			{prompts.map(prompt => {
				const topicId = parseInt(prompt.category);
				const topic = topics.find(topic => topic.id === topicId);
				const category = categories.find(
					category => category.id === topic?.category_id
				);

				return (
					<div key={prompt.id} className="p-2 mb-2 rounded">
						<div className="mb-2 flex space-x-2">
							<strong>Topic:</strong>{" "}
							<span className="font-bold">{topic?.name}</span>
						</div>
						<div className="mb-2 flex space-x-2 items-center">
							<strong>Category:</strong>
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
						</div>
						<div className="mb-2">
							<strong>Prompt:</strong>
							{editableRow === prompt.id ? (
								<textarea
									ref={editRef}
									value={promptText[prompt.id] || prompt.prompt}
									rows={8}
									onChange={e => {
										setPromptText({
											...promptText,
											[prompt.id]: e.target.value,
										});
									}}
									className="w-full border-gray-300 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
								/>
							) : (
								<div>{prompt.prompt}</div>
							)}
						</div>
						<div className="flex flex-col space-y-2">
							{editableRow === prompt.id ? (
								<>
									<button
										onClick={() =>
											handleSave(
												prompt.id,
												prompt.category,
												promptText[prompt.id] || prompt.prompt,
												prompt.available
											)
										}
										className="bg-green-500 text-white px-4 py-1 rounded-md"
									>
										Save
									</button>
									<button
										onClick={handleCancel}
										className="bg-gray-500 text-white px-4 py-1 rounded-md"
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
								onClick={() => handleOpenDeleteModal(prompt.id, topic?.name)}
								className="bg-red-500 text-white px-4 py-1 rounded-md"
							>
								Delete
							</button>
							<DeleteConfirmationModal
								isOpen={isDeleteModalOpen}
								onClose={handleCloseDeleteModal}
								itemName={selectedPrompt?.prompt || ""}
								onDelete={() => {
									if (selectedPrompt) {
										handleDelete(selectedPrompt.id);
									}
								}}
							/>
							<button
								onClick={() => router.push(`/prompts/${prompt.id}`)}
								className="bg-green-500 text-white px-4 py-1 rounded-md"
							>
								Demo
							</button>
							<button
								onClick={() => handleMigrate(prompt)}
								className="bg-purple-500 text-white px-4 py-1 rounded-md"
							>
								Migrate
							</button>
							˝
							<button
								onClick={() =>
									makeAvailable(
										prompt.id,
										prompt.available === "available"
											? "unavailable"
											: "available"
									)
								}
								className={`
									${
										prompt.available === "available"
											? "bg-rose-500"
											: "bg-cyan-500"
									} text-white px-4 py-1 rounded-md
									`}
							>
								{prompt.available === "available" ? "Unavailable" : "Available"}
							</button>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default MobileLayout;
