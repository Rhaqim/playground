import TestPromptRequest from "@/types/craftPrompt.type";
import { apiFunctions, requestBlob } from "./provider";

const { get, post, patch, del } = apiFunctions;

export const routes = {
	getPrompt: async () => get("/prompts"),
	generatePrompt: async (data: TestPromptRequest) => post("/gen-prompt", data),
	createPrompt: ({ prompt, category }: { prompt: string; category: string }) =>
		post("/prompt", { prompt, category: category.toString() }),
	editPrompt: ({
		prompt,
		category,
		prompt_id,
	}: {
		prompt: string;
		category: string;
		prompt_id: string;
	}) => patch(`/prompt`, { prompt, category, prompt_id }),
	delPrompt: (id: string) => del(`/prompt/${id}`),
	demoPrompt: async (prompt_id: number) =>
		post("/start-prompt", { prompt_id: prompt_id }),
	respond: async (choice: number, story_id: string) =>
		post("/respond", { choice, story_id }),

	login: async (wallet: string, signature: string) =>
		post("/login", { wallet, signature }),
	logout: async () => post("/logout", {}),
	getNonce: async (wallet: string) => post("/nonce", { wallet }),
	image: async (story_id: string) => post("/image", { story_id }),
	video: async (story_id: string) =>
		requestBlob("post", "/video", { story_id }),
};
