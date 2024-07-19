import React from "react";

import FileUploadComponent from "@/components/File";

const TestENV = () => {
	return (
		<div>
			<FileUploadComponent fileType="image" acceptedFileType=".avif" />
			<FileUploadComponent fileType="music" acceptedFileType=".mp3" />
		</div>
	);
};

export default TestENV;
