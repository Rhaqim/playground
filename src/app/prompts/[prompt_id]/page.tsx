"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

import { usePrompt } from "@/context/prompt.context";
import { routes } from "@/service/api/routes";
import StoryData from "@/types/story.type";
import VideoComponent from "@/components/Video";

export default function Page({ params }: { params: { prompt_id: string } }) {
	const { startStory } = usePrompt();

	const hasFetched = useRef(false);

	const [story, setStory] = useState<StoryData | null>(null);

	const [videoData, setVideoData] = useState<string | null>(null);

	const [image, setImage] = useState<string>("");
	const [loadingImage, setLoading] = useState<boolean>(false);

	const [prevImage, setPrevImage] = useState<string | null>(null);
	const [showModal, setShowModal] = useState(false);

	const handleOpenModal = () => {
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
	};

	const promptResponse = async (choice: number, id: string) => {
		const response = await routes.respond(choice, id);
		setVideoData(null);
		setImage("");
		setStory(response.data);
	};

	// Use useCallback to memoize the startStory function
	const fetchStory = useCallback(() => {
		if (!hasFetched.current) {
			hasFetched.current = true;
			startStory(parseInt(params.prompt_id), setStory);
		}
	}, [params.prompt_id, startStory]);

	useEffect(() => {
		fetchStory();
	}, [fetchStory]);

	useEffect(() => {
		if (story && story) {
			const fetchImage = async (id: string) => {
				try {
					setLoading(true);
					const data = await routes.image(id);
					const img = `data:image/png;base64,${data.data}`;
					setImage(img);
					setPrevImage(img);
				} catch (error) {
					console.error(error);
				} finally {
					setLoading(false);
				}
			};

			fetchImage(story.id);
		}
	}, [story]);

	if (!story) {
		return <div>Loading...</div>;
	}

	if (story.options && !story.end) {
		return (
			<div className="items-center text-white">
				<h1 className="text-3xl text-center font-bold mb-4">Prompt Page</h1>
				<div className="p-2 flex flex-col flex-1 space-y-2 w-full h-96">
					<div className="relative w-full h-full">
						{loadingImage && !image ? (
							<div className="w-full h-full flex justify-center items-center">
								{prevImage && (
									<img
										src={prevImage}
										alt="Previous Image"
										className="w-full object-cover h-full rounded-lg absolute"
									/>
								)}
								<div className="ease-linear animate-ping rounded-full border-4 border-t-4 border-gray-700 h-12 w-12 z-10"></div>
							</div>
						) : (
							image && (
								<div className="relative w-full h-full">
									<img
										src={image}
										alt="Generated Image"
										className="w-full object-cover h-full rounded-lg"
									/>
									<button
										onClick={handleOpenModal}
										className="absolute bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md"
									>
										View Fullscreen
									</button>
								</div>
							)
						)}
						{/* Image modal */}
						{showModal && (
							<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
								<div className="relative w-full h-full max-w-4xl max-h-4xl">
									<img
										src={image}
										alt="Fullscreen Image"
										className="w-full h-full object-cover rounded-lg"
									/>
									<button
										onClick={handleCloseModal}
										className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md"
									>
										Close
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
				<div>
					{story.id && (
						<VideoComponent
							story_id={story.id}
							videoData={videoData}
							setVideoData={setVideoData}
						/>
					)}
				</div>
				<div className="max-w-4xl mx-auto bg-cover bg-center rounded-lg shadow-lg mt-2">
					<h2 className="text-xl text-white mb-4 border border-gray-400 rounded-md p-4">
						{story.story}
					</h2>
					<ul className="text-white text-left list-none border border-gray-400 rounded-md p-4">
						{story.options.map((option, index) => (
							<li key={index}>
								<button
									className="focus:outline-none bg-transparent text-white hover:bg-gray-800 py-2 px-4 rounded-lg transition duration-300 ease-in-out"
									onClick={() => promptResponse(index + 1, story.id)}
								>
									{option}
								</button>
							</li>
						))}
					</ul>
				</div>
			</div>
		);
	}

	return (
		<div className="text-center text-white">
			<h1 className="text-3xl font-bold mb-4">Story End</h1>
			<div className="max-w-lg mx-auto">
				<h2 className="text-xl mb-4">{story.story}</h2>
				<Link
					href="/prompts"
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				>
					Other Stories
				</Link>
			</div>
		</div>
	);
}
