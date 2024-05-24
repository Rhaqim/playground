declare interface Prompt {
	category: string;
	prompt: string;
	id: number;
}

export interface Topic {
	id: number;
	categoryId: number;
	name: string;
}

export interface Category {
	id: number;
	name: string;
}

export default Prompt;
