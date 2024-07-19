import path from "path";
import fs from "fs";
import { promisify } from "util";

const IMAGE_UPLOAD_DIR =
	process.env.IMAGE_UPLOAD_DIR || "/www/collections/images";

const readFile = promisify(fs.readFile);

export const GET = async (req: Request, params: { slug: string }) => {
	const filename = params.slug;
	const filePath = path.resolve(IMAGE_UPLOAD_DIR, filename);

	try {
		const file = await readFile(filePath);
		const ext = path.extname(filename).toLowerCase();

		let mimeType = "image/avif";
		if (ext === ".avif") {
			mimeType = "image/avif";
		} // Add more types if needed

		return new Response(file, {
			headers: {
				"Content-Type": mimeType,
			},
			status: 200,
		});

		// res.setHeader('Content-Type', mimeType);
		// res.status(200).send(file);
	} catch (error) {
		return new Response("File not found", { status: 404 });
		// console.error('Error reading file:', error);
		// res.status(404).json({ error: 'File not found' });
	}
};
