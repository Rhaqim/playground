import TestPromptRequest from "@/types";
import { apiFunctions } from "./provider";

const { get, post, patch, del } = apiFunctions;

export const routes = {
	getPrompt: async () => get("/prompts"),
	generatePrompt: async (data: TestPromptRequest) => post("/gen-prompt", data),
	createPrompt: ({ prompt, category }: { prompt: string; category: string }) =>
		post("/prompt", { prompt, category }),
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
	demoPrompt: async ({ prompt_id }: { prompt_id: string }) =>
		post("/start-prompt", { prompt_id }),
};
