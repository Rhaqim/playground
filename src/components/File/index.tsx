"use client";

import React, { useState } from "react";

import { useToast } from "@/context/toast.context";

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

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			setSelectedFile(event.target.files[0]);
		}
	};

	const handleUpload = async () => {
		if (!selectedFile) {
			return;
		}

		const formData = new FormData();
		formData.append("file", selectedFile);

		try {
			const response = await fetch(`/api/upload?type=${fileType}`, {
				method: "POST",
				body: formData,
			});

			if (response.ok) {
				addToast({
					type: "success",
					message: "File uploaded successfully",
					id: "",
				});
			} else {
				addToast({
					type: "error",
					message: "An error occurred while uploading the file",
					id: "",
				});
			}
		} catch (error) {
			console.error("Error:", error);
			alert("An error occurred while uploading the file");
		}
	};

	return (
		<div>
			<input
				type="file"
				onChange={handleFileChange}
				accept={acceptedFileType}
			/>
			<button onClick={handleUpload}>
				Upload {fileType.charAt(0).toUpperCase() + fileType.slice(1)}
			</button>
		</div>
	);
};

export default FileUploadComponent;
