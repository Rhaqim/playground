import React from "react";

import FileUploadComponent from "@/components/File";
import ImageGallery from "@/components/File/ImageGallery";
import MusicGallery from "@/components/File/MusicGallery";

const Uploads = () => {
	return (
		<div className="flex flex-row justify-between items-center w-full h-full">
			<div className="flex flex-col items-center space-y-2 w-full">
				<FileUploadComponent fileType="image" acceptedFileType=".avif" />
				<div
					className="flex flex-col items-center space-y-2 w-full"
					style={{ width: "400px" }}
				>
					<ImageGallery />
				</div>
			</div>
			<div className="flex flex-col items-center space-y-2 w-full">
				<FileUploadComponent fileType="music" acceptedFileType=".mp3" />
				<div
					className="flex flex-col items-center space-y-2 w-full"
					style={{ width: "400px" }}
				>
					<MusicGallery />
				</div>
			</div>
		</div>
	);
};

export default Uploads;
