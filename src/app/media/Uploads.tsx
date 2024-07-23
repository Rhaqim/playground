"use client";

import React, { useState } from "react";

import FileUploadComponent from "@/components/File";
import ImageGallery from "@/components/File/ImageGallery";
import MusicGallery from "@/components/File/MusicGallery";

const Uploads = () => {
	const [section, setSection] = useState<"image" | "music">("image");

	return (
		<div className="flex flex-col items-center h-screen bg-black text-white w-full">
			<div className="flex flex-col space-y-4 w-full">
				<div className="flex flex-row justify-center items-center space-x-2">
					<button
						className={`bg-blue-500 text-white p-2 rounded-md
							${section === "image" ? "bg-blue-500 text-white" : "bg-gray-500 text-white"}
							`}
						onClick={() => setSection("image")}
					>
						Image
					</button>
					<button
						className={`bg-blue-500 text-white p-2 rounded-md
							${section === "music" ? "bg-blue-500 text-white" : "bg-gray-500 text-white"}
							`}
						onClick={() => setSection("music")}
					>
						Music
					</button>
				</div>
				{section === "image" && (
					<div className="flex flex-col items-center space-y-2 w-full">
						<FileUploadComponent fileType="image" acceptedFileType=".avif" />
						<div className="flex flex-col items-center space-y-2 w-full">
							<ImageGallery />
						</div>
					</div>
				)}
				{section === "music" && (
					<div className="flex flex-col items-center space-y-2 w-full">
						<FileUploadComponent fileType="music" acceptedFileType=".mp3" />
						<div className="flex flex-col items-center space-y-2 w-full">
							<MusicGallery />
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Uploads;
