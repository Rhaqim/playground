import path from "path";
import fs from "fs";

import { UPLOAD_DIR } from "@/config";

export const POST = async (req: Request) => {
	const formData = await req.formData();
	const body = Object.fromEntries(formData);
	const file = (body.file as Blob) || null;

	if (file) {
		const buffer = Buffer.from(await file.arrayBuffer());
		if (!fs.existsSync(UPLOAD_DIR)) {
			fs.mkdirSync(UPLOAD_DIR);
		}

		fs.writeFileSync(
			path.resolve(UPLOAD_DIR, (body.file as File).name),
			buffer
		);
	} else {
		return new Response("File not found", { status: 400 });
	}

	return new Response(
		`File uploaded successfully: ${(body.file as File).name}`,
		{ status: 200 }
	);
};

export const GET = async (req: Request) => {
	const files = fs.readdirSync(UPLOAD_DIR);
	return new Response(JSON.stringify(files), { status: 200 });
};
