declare interface Prompt {
	id: number;
	category: string;
	prompt: string;
	available: string;
}

export interface Topic {
	id: number;
	category_id: number;
	name: string;
	image_prompt: string;
}

export interface Category {
	id: number;
	name: string;
}

export default Prompt;
