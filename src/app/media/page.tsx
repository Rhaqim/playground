"use client";

import React, { useState } from "react";

import ImagePromptGenerator from "./ImagePrompt";
import Uploads from "./Uploads";

const Media = () => {
	const [section, setSection] = useState<"generator" | "uploads">("uploads");
	return (
		<div className="flex flex-col items-center h-screen bg-black text-white w-full">
			<div className="text-center p-4">
				<h1 className="text-2xl font-semibold">Media</h1>
				<p>Upload images and music, for the story prompts</p>
			</div>
			<div className="flex flex-col space-y-4 w-full">
				<div className="flex flex-row justify-center items-center space-x-2">
					<button
						className="bg-blue-500 text-white p-2 rounded-md"
						onClick={() => setSection("uploads")}
					>
						Uploads
					</button>
					<button
						className="bg-blue-500 text-white p-2 rounded-md"
						onClick={() => setSection("generator")}
					>
						Generator
					</button>
				</div>
				{section === "generator" && <ImagePromptGenerator />}
				{section === "uploads" && <Uploads />}
			</div>
		</div>
	);
};

export default Media;
