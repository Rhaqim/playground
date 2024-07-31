"use client";

import { useEffect, useState } from "react";

import DeleteConfirmationModal from "@/components/Delete";
import { useToast } from "@/context/toast.context";
import { generateRandomID } from "@/lib/utils";

const MusicGallery = () => {
	const { addToast } = useToast();

	const [musicFiles, setMusicFiles] = useState<string[]>([]);

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [selectedMusic, setSelectedMusic] = useState<string | null>(null);

	const musicName = (music: string) => music.split("/").pop();

	const deleteMusic = async (music: string) => {
		try {
			const musicName = music.split("/").pop();
			const response = await fetch(
				`/api/file/upload?type=music&file=${musicName}`,
				{
					method: "DELETE",
				}
			);
			if (response.ok) {
				setMusicFiles(musicFiles.filter(m => m !== music));

				addToast({
					type: "success",
					message: "Music file deleted successfully",
					id: generateRandomID(),
				});
			} else {
				addToast({
					type: "error",
					message: "Error deleting music file",
					id: generateRandomID(),
				});
			}
		} catch (error) {
			addToast({
				type: "error",
				message: `Error deleting music file: ${error}`,
				id: generateRandomID(),
			});
		}
	};

	useEffect(() => {
		const fetchMusic = async () => {
			try {
				const response = await fetch("/api/file/list?type=music");
				if (response.ok) {
					const data = await response.json();
					setMusicFiles(data);

					addToast({
						type: "success",
						message: "Music files fetched successfully",
						id: generateRandomID(),
					});
				} else {
					addToast({
						type: "error",
						message: "Error fetching music files",
						id: generateRandomID(),
					});
				}
			} catch (error) {
				addToast({
					type: "error",
					message: `Error fetching music files: ${error}`,
					id: generateRandomID(),
				});
			}
		};

		fetchMusic();
	}, []);

	return (
		<div className="flex flex-col items-center space-y-2 w-full">
			<h1>Music Gallery</h1>
			<div
				className="flex flex-col items-center space-y-2"
				style={{ width: "100%" }}
			>
				{musicFiles.map(file => (
					<div
						key={file}
						className="flex flex-col items-center space-y-2 w-full"
					>
						<audio controls>
							<source src={file} type="audio/mp3" />
							Your browser does not support the audio element.
						</audio>
						<div className="flex flex-col items-center space-y-2 w-full">
							<p className="font-bold">{musicName(file)}</p>
							<button
								className="bg-blue-500 text-white p-2 rounded-md"
								onClick={() => {
									setSelectedMusic(file);
									setIsDeleteModalOpen(true);
								}}
							>
								Delete
							</button>
						</div>
					</div>
				))}
			</div>
			{selectedMusic && (
				<DeleteConfirmationModal
					isOpen={isDeleteModalOpen}
					onClose={() => setIsDeleteModalOpen(false)}
					itemName={musicName(selectedMusic) || ""}
					helpText="This music file will be deleted from the gallery."
					onDelete={() => {
						if (selectedMusic) {
							deleteMusic(selectedMusic);
						}
					}}
				/>
			)}
		</div>
	);
};

export default MusicGallery;
