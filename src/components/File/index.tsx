"use client";

import React, { useState } from "react";
import Image from "next/image";

import { useToast } from "@/context/toast.context";
import { generateRandomID } from "@/lib/utils";

interface FileUploadComponentProps {
	fileType: "image" | "music";
	acceptedFileType: string;
}

const FileUploadComponent: React.FC<FileUploadComponentProps> = ({
	fileType,
	acceptedFileType,
}) => {
	const { addToast } = useToast();

	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			setSelectedFile(event.target.files[0]);

			const reader = new FileReader();
			reader.onload = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(event.target.files[0]);
		}
	};

	const handleUpload = async () => {
		if (!selectedFile) {
			return;
		}

		const formData = new FormData();
		formData.append("file", selectedFile);

		try {
			const response = await fetch(`/api/file/upload?type=${fileType}`, {
				method: "POST",
				body: formData,
			});

			if (response.ok) {
				addToast({
					type: "success",
					message: "File uploaded successfully",
					id: generateRandomID(),
				});

				// refresh the gallery
				setTimeout(() => {
					window.location.reload();
				}, 1000);
			} else {
				addToast({
					type: "error",
					message: "An error occurred while uploading the file",
					id: generateRandomID(),
				});
			}
		} catch (error) {
			console.error("Error:", error);
			alert("An error occurred while uploading the file");
		}
	};

	return (
		<div>
			<div></div>
			<div>
				<label className={`block text-sm font-medium`}>
					{fileType === "image"
						? "Please provide a .avif file"
						: "Please provide a .mp3 file"}
				</label>
				<label className="rounded-md flex justify-center items-center h-[175px] border-2 border-[#443E4F] cursor-pointer p-2">
					<input
						type="file"
						onChange={handleFileChange}
						accept={acceptedFileType}
						className="hidden"
					/>
					{imagePreview ? (
						fileType === "music" ? (
							<MusicPreview src={imagePreview} />
						) : (
							<Image
								src={imagePreview}
								alt="preview"
								width={256}
								height={170}
								className="object-contain h-full w-64 rounded-md border-2 border-gray-300"
							/>
						)
					) : (
						<p className="text-[14px] leading-[24px] text-[#757575]">
							Drag and Drop or Choose {fileType} File
						</p>
					)}
				</label>
				<div className="flex justify-center mt-2">
					<button
						onClick={handleUpload}
						className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
					>
						Upload {fileType.charAt(0).toUpperCase() + fileType.slice(1)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default FileUploadComponent;

const MusicPreview = ({ src }: { src: string }) => {
	return (
		<div className="flex items-center justify-center h-40 w-48 bg-gray-200 rounded-md">
			<audio controls src={src} className="w-full h-full">
				Your browser does not support the
				<code>audio</code> element.
			</audio>
		</div>
	);
};
