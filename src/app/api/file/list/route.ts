import fs from "fs";

import { IMAGE_UPLOAD_DIR, MUSIC_UPLOAD_DIR } from "@/config";

const getFileList = (directory: string): string[] => {
	let files: string[] = [];
	try {
		files = fs.readdirSync(directory).filter(file => {
			return file.endsWith(".avif");
		});
	} catch (error) {
		console.error("Error:", error);
	} finally {
		return files;
	}
};

export const GET = async (req: Request) => {
	const searchParams = new URL(req.url).searchParams;
	const type = searchParams.get("type");

	let Urls: string[] = [];

	if (!type) {
		return new Response("File type not specified", { status: 400 });
	}

	if (type === "image") {
		const files = getFileList(IMAGE_UPLOAD_DIR);
		const fileUrls = files.map(file => `/uploads/images/${file}`);

		Urls = fileUrls;
	} else if (type === "music") {
		const files = getFileList(MUSIC_UPLOAD_DIR);

		const fileUrls = files.map(file => `/uploads/music/${file}`);

		Urls = fileUrls;
	}

	return new Response(JSON.stringify(Urls), { status: 200 });
};
