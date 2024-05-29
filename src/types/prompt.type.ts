declare interface Prompt {
	category: string;
	prompt: string;
	id: number;
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
