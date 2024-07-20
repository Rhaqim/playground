import fs from "fs";
import path from "path";

export const BASE_URL_DEV =
	process.env.NEXT_PUBLIC_BACKEND_DEV || `http://localhost:8080`;
export const BASE_URL_PROD =
	process.env.NEXT_PUBLIC_BACKEND_PROD || `http://localhost:8080`;

export const UPLOAD_DIR = process.env.NEXT_UPLOAD_DIR || path.resolve(process.cwd(), "public");

console.log("UPLOAD_DIR", UPLOAD_DIR);
// print the current directory
console.log("Current directory: ", process.cwd());
// list files and folders in the current directory
console.log("Files and folders in the current directory: ");
fs.readdirSync(process.cwd()).forEach((file: any) => {
	console.log(file);
});
export const IMAGE_UPLOAD_DIR = path.resolve(UPLOAD_DIR, "images");
export const MUSIC_UPLOAD_DIR = path.resolve(UPLOAD_DIR, "music");

const config = {
	development: BASE_URL_DEV,
	production: BASE_URL_PROD,
};

export default config;
