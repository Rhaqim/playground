"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";

import { usePrompt } from "@/context/prompt.context";
import { routes } from "@/service/api/routes";
import StoryData from "@/types/story.type";

export default function Page({ params }: { params: { prompt_id: string } }) {
	const { startStory } = usePrompt();

	const [story, setStory] = useState<StoryData | null>(null);

	const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
	const [loadingVideo, setLoadingVideo] = useState<boolean>(false);
	const [videoLoaded, setVideoLoaded] = useState<boolean>(false);

	const [image, setImage] = useState<string>("");
	const [loadingImage, setLoading] = useState<boolean>(false);

	const videoRef = useRef<HTMLVideoElement>(null);

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
		setVideoBlob(null);
		setImage("");
		setStory(response.data);
	};

	useEffect(() => {
		startStory(parseInt(params.prompt_id), setStory);
	}, [params.prompt_id]);

	useEffect(() => {
		if (story && story) {
			const fetchVideo = async (id: string) => {
				try {
					setLoadingVideo(true);
					const blob = await routes.video(id);
					setVideoBlob(blob);
				} catch (error) {
					setVideoLoaded(false);
					setVideoBlob(null);
					console.error(error);
				} finally {
					setLoadingVideo(false);
				}
			};

			const fetchImage = async (id: string) => {
				try {
					setLoading(true);
					const data = await routes.image(id);
					console.log("Image: ", data);
					const img = `data:image/png;base64,${data.data}`;
					setImage(img);
					setPrevImage(img);
				} catch (error) {
					console.error(error);
				} finally {
					setLoading(false);
				}
			};

			// fetchVideo(story.id);
			fetchImage(story.id);
		}
	}, [story]);

	useEffect(() => {
		if (videoRef && videoRef.current) {
			// Check if videoRef exists before manipulating it
			const video = videoRef.current;

			videoRef.current.onloadeddata = () => {
				setVideoLoaded(true);
				video.play().catch(error => console.error(error));
				video.autoplay = true;
				video.loop = true;
			};
		}
	}, [videoRef]);

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
							!videoLoaded &&
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
					{/* {loadingImage && !image ? (
						<div className="w-full h-full flex justify-center items-center bg-gray-500">
							<div className="ease-linear animate-ping rounded-full border-4 border-t-4 border-gray-700 h-12 w-12"></div>
						</div>
					) : (
						!videoLoaded &&
						image && (
							<img
								src={image}
								alt="Generated Image"
								className="w-full object-cover h-full rounded-lg"
							/>
						)
					)} */}
					{/* {loadingVideo && !videoLoaded ? (
						<div className="w-full h-full flex justify-center items-center bg-gray-500">
							<div className="ease-linear animate-ping rounded-full border-4 border-t-4 border-gray-700 h-12 w-12"></div>
						</div>
					) : (
						videoLoaded && (
							<video ref={videoRef} className="w-full" controls autoPlay loop>
								<source src={videoBlob ? URL.createObjectURL(videoBlob) : ""} />
								Your browser does not support the video tag.
							</video>
						)
					)} */}
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
