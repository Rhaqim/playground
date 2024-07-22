"use client";

import React from "react";
import ImageBase64 from "@/components/Image";
import { routes } from "@/service/api/routes";

const ImagePromptGenerator = () => {
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
		<div className="flex flex-col items-center h-screen bg-black text-white">
			<div className="text-center p-4">
				<h1 className="text-2xl font-semibold">Image Playground</h1>
				<p>Enter a prompt to generate an image</p>
			</div>
			<div className="flex flex-col space-y-4">
				<div className="flex flex-col justify-center items-center space-y-2">
					<input
						type="text"
						placeholder="Enter Prompt"
						value={prompt}
						onChange={handlePrompt}
						className="text-black rounded-md p-2"
					/>
					<button
						className="bg-blue-500 text-white p-2 rounded-md"
						onClick={handleLoad}
					>
						Load Image
					</button>
				</div>
				<div className="flex flex-col justify-center items-center space-y-2">
					{loading && (
						<div className="flex justify-center items-center">
							<div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
						</div>
					)}
					{error && <p style={{ color: "red" }}>{error}</p>}
					{base64 && (
						<div className="flex justify-center items-center rounded-md">
							<ImageBase64 image={base64} />
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ImagePromptGenerator;
