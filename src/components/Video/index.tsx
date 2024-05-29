"use client";

import { useState, useEffect, useRef } from "react";
import { routes } from "@/service/api/routes";

const VideoComponent = ({
	story_id,
	videoData,
	setVideoData,
}: {
	story_id: string;
	videoData: string | null;
	setVideoData: (data: string | null) => void;
}) => {
	const [jobID, setJobID] = useState(null);
	const [status, setStatus] = useState("idle");
	const [errorMsg, setErrorMsg] = useState("");

	const videoRef = useRef<HTMLVideoElement>(null);

	const hasFetched = useRef(false);

	useEffect(() => {
		if (!jobID) return;

		const interval = setInterval(async () => {
			const { data } = await routes.videoStatus(jobID);
			if (data.status === "error") {
				setStatus("error");
				setErrorMsg(data.error);
				clearInterval(interval);
			}

			if (data.status === "ready") {
				setVideoData(data.video);
				setStatus("ready");
				clearInterval(interval);

				// Reset hasFetched after a delay
				setTimeout(() => {
					hasFetched.current = false;
				}, 500); // Adjust the delay as needed
			}
		}, 10000);

		return () => clearInterval(interval);
	}, [jobID, setVideoData]);

	useEffect(() => {
		if (videoRef && videoRef.current) {
			// Check if videoRef exists before manipulating it
			const video = videoRef.current;

			videoRef.current.onloadeddata = () => {
				video.play().catch(error => console.error(error));
				video.autoplay = true;
				video.loop = true;
			};
		}
	}, [videoRef]);

	useEffect(() => {
		const startVideoGeneration = async (story_id: string) => {
			setStatus("starting");
			try {
				const { data } = await routes.video(story_id);
				setJobID(data.jobID);
				setStatus("pending");
			} catch (error) {
				console.error(error);
				setStatus("error");
			}
		};

		if (story_id && !hasFetched.current) {
			hasFetched.current = true;
			startVideoGeneration(story_id);
		}
	}, [story_id]);

	return (
		<div
			className={`flex flex-col items-center justify-center ${
				status === "ready" ? "h-auto" : "h-10"
			}`}
		>
			{/* <button onClick={startVideoGeneration}>Generate Video</button> */}
			{status === "starting" && <EllipsisLoadingAnimation />}
			{status === "pending" && <EllipsisLoadingAnimation color="green" />}
			{status === "ready" && (
				<video ref={videoRef} className="w-full" controls autoPlay loop>
					<source src={`data:video/mp4;base64,${videoData}`} type="video/mp4" />
				</video>
			)}
		</div>
	);
};

export default VideoComponent;

const EllipsisLoadingAnimation = ({ color = "blue" }: { color?: string }) => {
	return (
		<div className="flex flex-col items-center justify-center text-center">
			<div className="flex mb-4 items-end">
				<div
					className={`w-2 h-4 mx-1 bg-${color}-500 rounded-full animate-pulse`}
				></div>
				<div
					className={`w-2 h-6 mx-1 bg-${color}-500 rounded-full animate-pulse`}
				></div>
				<div
					className={`w-2 h-8 mx-1 bg-${color}-500 rounded-full animate-pulse`}
				></div>
				<div
					className={`w-2 h-10 mx-1 bg-${color}-500 rounded-full animate-pulse`}
				></div>
			</div>
		</div>
	);
};
