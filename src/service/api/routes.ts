import { SignUp, SignIn } from "@/types/auth.type";
import TestPromptRequest from "@/types/craftPrompt.type";
import { apiFunctions, requestBlob } from "./provider";
import { ReferralSignUp } from "@/types/referral.type";

const { get, post, patch, del } = apiFunctions;

export const routes = {
	// Auth
	login: async (wallet: string, signature: string) =>
		post("/login", { wallet, signature }),
	logout: async () => post("/logout", {}),
	getNonce: async (wallet: string) => post("/nonce", { wallet }),
	googleLogin: async () => get("/google/login"),
	signup: async (userDetails: SignUp) => post("/signup", { ...userDetails }),
	confirmEmail: async (token: string, email: string) =>
		get("/confirm-email?token=" + token + "&email=" + email),
	signin: async (signinDetails: SignIn) =>
		post("/signin", { ...signinDetails }),
	// Authenticated
	signout: async () => post("/signout", {}),
	me: async () => get("/me"),
	// Referral
	generateReferralCode: async () => get("/referral/generate"),
	getReferralCode: async () => get("/referral/get"),
	signupReferral: async (signup: ReferralSignUp) =>
		post("/referral/signup", signup),
	// Fetch
	getPrompt: async () => get("/prompts"),
	getTopics: async () => get("/topics"),
	getCategories: async () => get("/categories"),
	updateTopicCategory: async (topic_id: number, category_id: number) =>
		patch(`/topic/${topic_id}`, { category_id }),
	createCategory: async (name: string) => post("/category", { name }),
	// Prompts
	changePromptAvailability: async (prompt_id: number, available: string) =>
		patch("/prompt/availability", { prompt_id, available }),
	generatePrompt: async (data: TestPromptRequest) => post("/gen-prompt", data),
	createPrompt: ({
		prompt,
		category,
		topic,
		image_prompt,
	}: {
		prompt: string;
		image_prompt: string;
		category: number;
		topic: string;
	}) =>
		post("/prompt", {
			prompt,
			category: category.toString(),
			topic,
			image_prompt,
		}),
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
	// Media
	image: async (story_id: string) => post("/image", { story_id }),
	video: async (story_id: string) => post("/video", { story_id }),
	videoStatus: async (job_id: string) => get(`/video-status/${job_id}`),
};
