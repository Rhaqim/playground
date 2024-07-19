import path from "path";
import fs from "fs";

const IMAGE_UPLOAD_DIR =
	process.env.IMAGE_UPLOAD_DIR || "/www/conexus-categories/images";

const getFileList = (directory: string) => {
	return fs.readdirSync(directory).filter(file => {
		return file.endsWith(".avif");
	});
};

export const GET = async (req: Request) => {
	try {
		const files = getFileList(IMAGE_UPLOAD_DIR);
		const fileUrls = files.map(file => `/conexus-categories/images/${file}`);
		new Response(JSON.stringify(fileUrls), { status: 200 });
	} catch (error) {
		new Response("An error occurred while fetching the file list", {
			status: 500,
		});
	}

	return new Response("An error occurred while fetching the file list", {
		status: 500,
	});
};
