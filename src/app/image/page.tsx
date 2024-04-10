"use client";

import React from "react";
import ImageBase64 from "@/components/Image";
import { routes } from "@/service/api/routes";

const ImagePlayground = () => {
	// get base64 from user input
	const [prompt, setPrompt] = React.useState<string>("");
	const [base64, setBase64] = React.useState<string>("");
	const [error, setError] = React.useState<string>("");
	const [loading, setLoading] = React.useState<boolean>(false);

	const handlePrompt = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPrompt(e.target.value);
	};

	const handleLoad = async () => {
		if (!prompt) {
			setError("Please enter a prompt string");
			return;
		}

		setLoading(true);

		try {
			const { data } = await routes.image(prompt);
			setBase64(data.image);
		} catch (error: any) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<h1>Image Playground</h1>
			<input
				type="text"
				placeholder="Enter Prompt"
				value={prompt}
				onChange={handlePrompt}
				className="text-black"
			/>
			<button onClick={handleLoad}>Load Image</button>
			{loading && (
				<div className="flex justify-center items-center">
					<div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
				</div>
			)}
			{error && <p style={{ color: "red" }}>{error}</p>}
			{base64 && <ImageBase64 image={base64} />}
		</div>
	);
};

export default ImagePlayground;
