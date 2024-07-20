import path from "path";
import fs from "fs";

import { IMAGE_UPLOAD_DIR, MUSIC_UPLOAD_DIR } from "@/config";

const allowedExtentions = {
	music: ".mp3",
	image: ".avif",
};

const handleFileUpload = async (
	req: Request,
	uploadDir: string,
	allowedExt: string
) => {
	const formData = await req.formData();
	const body = Object.fromEntries(formData);
	const file = (body.file as Blob) || null;

	if (file) {
		const fileName = (body.file as File).name;
		const fileExtention = path.extname(fileName.toLowerCase());

		if (fileExtention !== allowedExt) {
			return new Response(
				`Invalid file type. Only ${allowedExt} files are allowed.`,
				{ status: 400 }
			);
		}

		const buffer = Buffer.from(await file.arrayBuffer());
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir);
		}

		try {
			fs.writeFileSync(path.resolve(uploadDir, fileName), buffer);
		} catch (error) {
			return new Response(`Error uploading file: ${error}`, { status: 500 });
		}

		return new Response(`File uploaded successfully: ${fileName}`, {
			status: 200,
		});
	}

	return new Response("File not found", { status: 400 });
};

export const POST = async (req: Request) => {
	// get the query for the type of file to upload either image or music
	const searchParams = new URL(req.url).searchParams;
	const type = searchParams.get("type");

	if (!type) {
		return new Response("File type not specified", { status: 400 });
	}

	if (type === "image") {
		return handleFileUpload(req, IMAGE_UPLOAD_DIR, allowedExtentions.image);
	} else if (type === "music") {
		return handleFileUpload(req, MUSIC_UPLOAD_DIR, allowedExtentions.music);
	} else {
		return new Response("Invalid file type", { status: 400 });
	}
};
