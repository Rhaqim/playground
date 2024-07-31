"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import DeleteConfirmationModal from "@/components/Delete";
import { useToast } from "@/context/toast.context";
import { generateRandomID } from "@/lib/utils";

const ImageGallery = () => {
	const { addToast } = useToast();

	const [images, setImages] = useState<string[]>([]);

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);

	const imageName = (image: string) => image.split("/").pop();

	const deleteImage = async (image: string) => {
		try {
			const imageName = image.split("/").pop();
			const response = await fetch(
				`/api/file/upload?type=image&file=${imageName}`,
				{
					method: "DELETE",
				}
			);
			if (response.ok) {
				setImages(images.filter(i => i !== image));

				addToast({
					type: "success",
					message: "Image deleted successfully",
					id: generateRandomID(),
				});
			} else {
				addToast({
					type: "error",
					message: "Error deleting image",
					id: generateRandomID(),
				});
			}
		} catch (error) {
			addToast({
				type: "error",
				message: `Error deleting image: ${error}`,
				id: generateRandomID(),
			});
		}
	};

	useEffect(() => {
		const fetchImages = async () => {
			try {
				const response = await fetch("/api/file/list?type=image");
				if (response.ok) {
					const data = await response.json();
					setImages(data);

					addToast({
						type: "success",
						message: "Images fetched successfully",
						id: generateRandomID(),
					});
				} else {
					addToast({
						type: "error",
						message: "Error fetching images",
						id: generateRandomID(),
					});
				}
			} catch (error) {
				addToast({
					type: "error",
					message: `Error fetching images: ${error}`,
					id: generateRandomID(),
				});
			}
		};

		fetchImages();
	}, []);

	return (
		<div className="flex flex-col items-center space-y-2 w-full">
			<h1>Image Gallery</h1>
			<div
				className="flex flex-col items-center space-y-2"
				style={{ width: "100%" }}
			>
				{images.map(image => (
					<div
						key={image}
						className="flex flex-col items-center space-y-2 w-full"
					>
						<Image
							src={image}
							alt={image}
							width={800}
							height={400}
							// style={{ width: "100px", height: "100px", margin: "10px" }}
							className="p-2 border-2 border-gray-500 w-full"
							priority
						/>
						<div className="flex flex-col items-center space-y-2 w-full">
							<p className="font-bold">{imageName(image)}</p>
							<button
								className="bg-blue-500 text-white p-2 rounded-md"
								onClick={() => {
									setSelectedImage(image);
									setIsDeleteModalOpen(true);
								}}
							>
								Delete
							</button>
						</div>
					</div>
				))}
			</div>
			{selectedImage && (
				<DeleteConfirmationModal
					isOpen={isDeleteModalOpen}
					onClose={() => setIsDeleteModalOpen(false)}
					itemName={imageName(selectedImage) || ""}
					helpText="This image will be deleted from the gallery."
					onDelete={() => {
						if (selectedImage) {
							deleteImage(selectedImage);
						}
					}}
				/>
			)}
		</div>
	);
};

export default ImageGallery;
