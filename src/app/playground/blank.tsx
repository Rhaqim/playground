import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { routes } from "@/service/api/routes";
import { useToast } from "@/context/toast.context";
import { generateRandomID } from "@/lib/utils";

interface BlankProps {
	buttonText?: string;
	response: string;
	setResponse: React.Dispatch<React.SetStateAction<string>>;
	categories: { id: number; name: string }[];
	toggleModal: () => void;
	hiddenCloseButton?: boolean;
	setIsModalOpen: (value: boolean) => void;
}

const Blank: React.FC<BlankProps> = ({
	buttonText = "Save Prompt",
	response,
	setResponse,
	categories,
	toggleModal,
	hiddenCloseButton = false,
	setIsModalOpen,
}) => {
	const router = useRouter();

	const { addToast } = useToast();

	const [topicName, setTopicName] = useState<string>("");
	const [imagePrompts, setImagePrompts] = useState<string[]>([]);
	const [newImagePrompt, setNewImagePrompt] = useState<string>("");
	const [categoryId, setCategoryId] = useState<number>(1);

	const handleAddImagePrompt = () => {
		if (newImagePrompt) {
			setImagePrompts([...imagePrompts, newImagePrompt]);
			setNewImagePrompt("");
		}
	};

	const handleRemoveImagePrompt = (index: number) => {
		const newImagePrompts = imagePrompts.filter((_, i) => i !== index);
		setImagePrompts(newImagePrompts);
	};

	const handleSavePrompt = async () => {
		// join image prompts together separated by a comma
		const imagePrompt = imagePrompts.join(", ");

		try {
			await routes.createPrompt({
				prompt: response,
				category: categoryId,
				topic: topicName,
				image_prompt: imagePrompt,
			});

			router.push("/prompts");
		} catch (error: any) {
			// setError("An error occurred while saving the prompt");
			addToast({
				id: generateRandomID(),
				type: "error",
				message: "An error occurred while saving the prompt",
			});
			console.error(error);
		} finally {
			setIsModalOpen(false);
		}
	};
	return (
		<div className="bg-white p-8 rounded-lg shadow-md md:w-[50%] overflow-auto">
			<h1 className="text-lg font-bold mb-4 text-black">Prompt</h1>
			<p className="text-black">Review the prompt and make any changes</p>
			{/* Topic title input */}
			<label htmlFor="topic" className="block mb-1 text-black font-bold">
				Topic
			</label>
			<input
				type="text"
				value={topicName}
				onChange={e => setTopicName(e.target.value)}
				className="w-full border-gray-300 text-white bg-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
				required
			/>
			{/* Image prompts */}
			<div className="flex flex-col space-y-2">
				<label
					htmlFor="imagePrompts"
					className="block mb-1 text-black font-bold"
				>
					Image Prompts
				</label>
				<ul>
					{imagePrompts.map((prompt, index) => (
						<li key={index} className="flex items-center">
							<p
								className="text-black text-md w-full"
								style={{ wordWrap: "break-word" }}
							>
								{prompt}
							</p>
							<button
								className="text-white text-md bg-red-700 rounded-md p-1 m-2"
								onClick={() => handleRemoveImagePrompt(index)}
							>
								Remove
							</button>
						</li>
					))}
				</ul>
				<input
					type="text"
					value={newImagePrompt}
					onChange={e => setNewImagePrompt(e.target.value)}
					className="w-full border-gray-300 text-white bg-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
					required
				/>
				<button
					className="p-2 rounded-md bg-blue-600"
					onClick={handleAddImagePrompt}
				>
					Add Image Prompt
				</button>
			</div>
			<label htmlFor="response" className="block mb-1 text-black font-bold">
				Prompt
			</label>
			<textarea
				value={response}
				rows={10}
				onChange={e => setResponse(e.target.value)}
				className="w-full border-gray-300 text-white bg-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
				required
			/>
			<div>
				<label htmlFor="category" className="block mb-1 text-black font-bold">
					Select Category
				</label>
				<select
					id="category"
					name="Category"
					value={categoryId}
					onChange={e => setCategoryId(parseInt(e.target.value))}
					className="w-full border-black border-2 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
					required
				>
					{categories.map(cat => (
						<option key={cat.id} value={cat.id}>
							{cat.name}
						</option>
					))}
				</select>
			</div>
			<button
				className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
				onClick={handleSavePrompt}
			>
				{buttonText}
			</button>
			<button
				className={`mt-4 bg-gray-300 text-gray-800 px-4 py-2 rounded-md ml-2 hover:bg-gray-400
                ${hiddenCloseButton ? "hidden" : ""}`}
				onClick={toggleModal}
			>
				Close
			</button>
		</div>
	);
};

export default Blank;
