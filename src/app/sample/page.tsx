import React from "react";

import FileUploadComponent from "@/components/File";
import ImageGallery from "@/components/File/ImageGallery";
import MusicGallery from "@/components/File/MusicGallery";

const TestENV = () => {
	return (
		<div>
			<FileUploadComponent fileType="image" acceptedFileType=".avif" />
			<FileUploadComponent fileType="music" acceptedFileType=".mp3" />
			<div className="flex flex-row justify-between">
				<ImageGallery />
				<MusicGallery />
			</div>
		</div>
	);
};

export default TestENV;
