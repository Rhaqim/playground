"use client";

import { useEffect, useState } from "react";

import { useToast } from "@/context/toast.context";

const MusicGallery = () => {
	const { addToast } = useToast();

	const [musicFiles, setMusicFiles] = useState<string[]>([]);

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
		<div>
			<h1>Music Gallery</h1>
			<div>
				{musicFiles.map(file => (
					<audio key={file} controls>
						<source src={file} type="audio/mp3" />
						Your browser does not support the audio element.
					</audio>
				))}
			</div>
		</div>
	);
};

export default MusicGallery;
