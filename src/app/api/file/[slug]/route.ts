import path from "path";
import fs from "fs";
import { promisify } from "util";

import { IMAGE_UPLOAD_DIR, MUSIC_UPLOAD_DIR } from "@/config";

const readFile = promisify(fs.readFile);

export const GET = async (req: Request, params: { slug: string }) => {
	const searchParams = new URL(req.url).searchParams;
	const type = searchParams.get("type");

	const filename = params.slug;
	// const filePath = path.resolve(IMAGE_UPLOAD_DIR, filename);

	let filePath = "";

	if (!type) {
		return new Response("File type not specified", { status: 400 });
	}

	if (type === "image") {
		filePath = path.resolve(IMAGE_UPLOAD_DIR, filename);
	} else if (type === "music") {
		filePath = path.resolve(MUSIC_UPLOAD_DIR, filename);
	} else {
		return new Response("Invalid file type", { status: 400 });
	}

	const file = await readFile(filePath);
	const ext = path.extname(filename).toLowerCase();

	let mimeType = "image/avif";
	if (ext === ".avif") {
		mimeType = "image/avif";
	} else if (ext === ".mp3") {
		mimeType = "audio/mpeg";
	}

	return new Response(file, {
		headers: {
			"Content-Type": mimeType,
		},
		status: 200,
	});
};
