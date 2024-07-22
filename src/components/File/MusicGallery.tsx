"use client";

import { useEffect, useState } from "react";

import { useToast } from "@/context/toast.context";

const MusicGallery = () => {
	const { addToast } = useToast();

	const [musicFiles, setMusicFiles] = useState<string[]>([]);

	const musicName = (music: string) => music.split("/").pop();

	const deleteMusic = async (music: string) => {
		try {
			const response = await fetch(`/api/file/delete?path=${music}`);
			if (response.ok) {
				setMusicFiles(musicFiles.filter(m => m !== music));

				addToast({
					type: "success",
					message: "Music file deleted successfully",
					id: "",
				});
			} else {
				addToast({
					type: "error",
					message: "Error deleting music file",
					id: "",
				});
			}
		} catch (error) {
			addToast({
				type: "error",
				message: `Error deleting music file: ${error}`,
				id: "",
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
						id: "",
					});
				} else {
					addToast({
						type: "error",
						message: "Error fetching music files",
						id: "",
					});
				}
			} catch (error) {
				addToast({
					type: "error",
					message: `Error fetching music files: ${error}`,
					id: "",
				});
			}
		};

		fetchMusic();
	}, []);

	return (
		<div className="flex flex-col items-center space-y-2 w-full">
			<h1>Music Gallery</h1>
			<div
				className="flex flex-row items-center space-x-2"
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
							<p>{musicName(file)}</p>
							<button
								className="bg-blue-500 text-white p-2 rounded-md"
								onClick={() => deleteMusic(file)}
							>
								Delete
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default MusicGallery;
