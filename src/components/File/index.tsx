"use client";

import React, { useState } from "react";

// export const FileUploadComponent = () => {
// 	return (
// 		<input
// 			type="file"
// 			name="file"
// 			onChange={async e => {
// 				if (e.target.files) {
// 					const formData = new FormData();
// 					Object.values(e.target.files).forEach(file => {
// 						formData.append("file", file);
// 					});

// 					const response = await fetch("/api/upload", {
// 						method: "POST",
// 						body: formData,
// 					});

// 					const result = await response.json();
// 					if (result.success) {
// 						alert("Upload ok : " + result.name);
// 					} else {
// 						alert("Upload failed");
// 					}
// 				}
// 			}}
// 		/>
// 	);
// };

const FileUploadComponent: React.FC = () => {
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
        formData.append('file', selectedFile);

        try {
            await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            alert('File uploaded successfully');
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while uploading the file');
        }
    }

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default FileUploadComponent;
