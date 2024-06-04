"use client";

import React, { useState, useRef } from "react";
import { toPng } from "html-to-image";

const ShareButton: React.FC = () => {
	const [showOptions, setShowOptions] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	const handleShareClick = () => {
		setShowOptions(!showOptions);
	};

	const handleOptionClick = async (option: string) => {
		if (!ref.current) return;

		const dataUrl = await toPng(ref.current, {
			quality: 1,
			pixelRatio: 2,
			backgroundColor: "white",
		});

		console.log(dataUrl);

		let shareUrl = "";
		// const message = `Check out the current step I'm at for @degen story game from link.website.com ✨\nUnlock Your Potential at opensea.io/collection/potential-eth`;
		const message = `Check out the current step I'm at for @degen story game from link.website.com ✨\nUnlock Your Potential`;

		switch (option) {
			case "copy":
				navigator.clipboard.writeText(`${message}\n${dataUrl}`);
				alert("Copied to clipboard!");
				break;
			case "discord":
				shareUrl = `https://discord.com/channels/@me?message=${encodeURIComponent(
					`${message}\n${dataUrl}`
				)}`;
				window.open(shareUrl, "_blank");
				break;
			case "twitter":
				shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
					message
				)}&url=${encodeURIComponent(dataUrl)}`;
				window.open(shareUrl, "_blank");
				break;
		}

		setShowOptions(false);
	};

	return (
		<div className="relative">
			<button
				className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
				onClick={handleShareClick}
			>
				Share
			</button>
			{showOptions && (
				<div className="absolute mt-2 bg-white shadow-lg rounded flex flex-col">
					<div
						className="py-2 px-4 text-left hover:bg-gray-100 text-black transition"
						onClick={() => handleOptionClick("copy")}
					>
						Copy
					</div>
					<div
						className="py-2 px-4 text-left hover:bg-gray-100 text-black transition"
						onClick={() => handleOptionClick("discord")}
					>
						Discord
					</div>
					<div
						className="py-2 px-4 text-left hover:bg-gray-100 text-black transition"
						onClick={() => handleOptionClick("twitter")}
					>
						Twitter
					</div>
				</div>
			)}
			{/* This is the content you want to screenshot */}
			<div ref={ref}>
				{/* Add the content you want to capture in the screenshot here */}
				<h1 className="text-4xl font-bold text-center text-black">
					Your Content
				</h1>
				<p className="text-center text-lg mt-4 text-black">
					This is the content you want to screenshot
				</p>
			</div>
		</div>
	);
};

export default ShareButton;
