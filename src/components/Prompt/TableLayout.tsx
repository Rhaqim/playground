"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";

// import { routes } from "@/service/api/routes";
import Prompt, { Topic, Category } from "@/types/prompt.type";
import DeleteConfirmationModal from "../Delete";

interface TableLayoutProps {
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

const PromptsTable: React.FC<TableLayoutProps> = ({
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
		<table className="w-full mt-2 rounded-md hidden md:block">
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
						category => category.id === topic?.category_id
					);

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
										value={promptText[prompt.id] || prompt.prompt}
										rows={10}
										onChange={e => {
											setPromptText({
												...promptText,
												[prompt.id]: e.target.value,
											});
										}}
										className="w-full border-gray-300 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
									/>
								) : (
									prompt.prompt
								)}
							</td>
							<td className="flex flex-col space-y-4 my-4 ml-4">
								{editableRow === prompt.id ? ( // If editing is enabled for this row
									<>
										<button
											title="Save changes"
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
											title="Cancel changes"
											onClick={handleCancel}
											className="bg-gray-500 text-white px-4 py-1 rounded-md"
										>
											Cancel
										</button>
									</>
								) : (
									<button
										title="Edit story"
										onClick={() => handleEdit(prompt.id)}
										className="bg-blue-500 text-white px-4 py-1 rounded-md"
									>
										Edit
									</button>
								)}
								<button
									title="Delete story"
									// onClick={() => handleDelete(prompt.id)}
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
									title="Demo story"
									onClick={() =>
										// routes.demoPrompt({ prompt_id: prompt.id.toString() })
										router.push(`/prompts/${prompt.id}`)
									}
									className="bg-green-500 text-white px-4 py-1 rounded-md"
								>
									Demo
								</button>
								<button
									title="Migrate story to production"
									onClick={() => handleMigrate(prompt)}
									className="bg-purple-500 text-white px-4 py-1 rounded-md"
								>
									Migrate
								</button>
								<button
									title={`Make story ${
										prompt.available === "available"
											? "unavailable"
											: "available"
									}`}
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
									{prompt.available === "available"
										? "Unavailable"
										: "Available"}
								</button>
							</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};

export default PromptsTable;
