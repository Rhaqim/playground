"use client";

import React, { useRef, useEffect, useState } from "react";

import { BASE_URL_DEV } from "@/config";
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
	const imageRef = useRef<HTMLImageElement>(null);

	const promptResponse = async (choice: number, id: string) => {
		const response = await routes.respond(choice, id);
		setVideoBlob(null);
		setStory(response.data);
	};

	useEffect(() => {
		startStory(parseInt(params.prompt_id), setStory);

		// const fetchPrompt = async (id: string) => {
		// 	// convert the id to a number
		// 	const id_ = parseInt(id);

		// 	const response = await routes.demoPrompt(id_);
		// 	setStory(response.data);
		// };
		// fetchPrompt(params.prompt_id);
	}, [params.prompt_id, startStory]);

	useEffect(() => {
		if (story && story) {
			// const fetchVideo = async (id: string) => {
			// 	setLoadingVideo(true);
			// 	try {
			// 		// use fetch POST request passing the id as story_id
			// 		const response = await fetch(`${BASE_URL_DEV}/video`, {
			// 			method: "POST",
			// 			headers: {
			// 				"Content-Type": "application/json",
			// 			},
			// 			body: JSON.stringify({ story_id: id }),
			// 		});

			// 		const blob = await response.blob();

			// 		setVideoBlob(blob);
			// 	} catch (error) {
			// 		setVideoLoaded(false);
			// 		setVideoBlob(null);
			// 		console.error(error);
			// 	} finally {
			// 		setLoadingVideo(false);
			// 	}
			// };

			// const fetchImage = async (id: string) => {
			// 	setLoading(true);
			// 	try {
			// 		const response = await fetch(`${BASE_URL_DEV}/image`, {
			// 			method: "POST",
			// 			headers: {
			// 				"Content-Type": "application/json",
			// 			},
			// 			body: JSON.stringify({ story_id: id }),
			// 		});

			// 		const data = await response.text();
			// 		const img = `data:image/png;base64,${data}`;
			// 		console.log("Image: ", img);
			// 		setImage(img);
			// 	} catch (error) {
			// 		console.error(error);
			// 	} finally {
			// 		setLoading(false);
			// 	}
			// };

			const fetchVideo = async (id: string) => {
				try {
					setLoadingVideo(true);
					const blob = await routes.video(id);
					setVideoBlob(blob);
				} catch (error) {
					setVideoLoaded(false);
					setVideoBlob(null);
					console.error(error);
				}
			};

			const fetchImage = async (id: string) => {
				try {
					setLoading(true);
					const data = await routes.image(id);
					const img = `data:image/png;base64,${data}`;
					setImage(img);
				} catch (error) {
					console.error(error);
				} finally {
					setLoading(false);
				}
			};

			fetchVideo(story.id);
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
			<div className="text-center">
				<h1 className="text-3xl font-bold mb-4">Prompt Page</h1>
				<div className="p-4 relative">
					<div className="p-2 relative flex flex-col space-y-2 w-full max-h-50">
						{loadingImage && !image ? (
							<div className="w-full h-full flex justify-center items-center absolute top-0 left-0 bg-gray-500">
								<div className="ease-linear animate-ping rounded-full border-4 border-t-4 border-gray-700 h-12 w-12"></div>
							</div>
						) : (
							!videoLoaded &&
							image && (
								<img
									src={image}
									alt="Generated Image"
									ref={imageRef}
									className="w-full object-cover h-96 rounded-lg"
								/>
							)
						)}
						{loadingVideo && !videoLoaded ? (
							<div className="w-full h-full flex justify-center items-center absolute top-0 left-0 bg-gray-500">
								<div className="ease-linear animate-ping rounded-full border-4 border-t-4 border-gray-700 h-12 w-12"></div>
							</div>
						) : (
							videoLoaded && (
								<video ref={videoRef} className="w-full" controls autoPlay loop>
									<source
										src={videoBlob ? URL.createObjectURL(videoBlob) : ""}
									/>
									Your browser does not support the video tag.
								</video>
							)
						)}
					</div>
					<div className="max-w-4xl mx-auto bg-cover bg-center rounded-lg overflow-hidden shadow-lg mt-2">
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
			</div>
		);
	}

	return (
		<div className="text-center">
			<h1 className="text-3xl font-bold mb-4">Prompt Page</h1>
			<div className="max-w-lg mx-auto">
				<h2 className="text-xl mb-4">{story.story}</h2>
				<button
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					onClick={() => console.log("Continue")}
				>
					Continue
				</button>
			</div>
		</div>
	);
}
