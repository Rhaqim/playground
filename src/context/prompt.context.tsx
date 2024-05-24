"use client";

import React, {
	createContext,
	useState,
	useContext,
	ReactNode,
	useEffect,
} from "react";

import { useEnvironment } from "@/context/env.context";
import { routes } from "@/service/api/routes";
import Prompt from "@/types/prompt.type";
import StoryData from "@/types/story.type";

interface PromptContextProps {
	prompts: Prompt[];
	generatePrompt: () => Promise<void>;
	updatePrompt: (
		prompt: Prompt,
		editableRow: (row: number | null) => void
	) => Promise<void>;

	startStory: (
		prompt_id: number,
		setStory: (story: StoryData | null) => void
	) => Promise<void>;
}

const PromptContext = createContext<PromptContextProps | undefined>(undefined);

export const PromptProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const { environment } = useEnvironment();

	const [prompts, setPrompts] = useState<Prompt[]>([]);

	async function generatePrompt() {
		try {
			const { data } = await routes.getPrompt();
			setPrompts(data.prompts);
		} catch (error) {
			console.error(error);
			setPrompts([]);
		}
	}

	async function updatePrompt(
		prompt: Prompt,
		editableRow: (row: number | null) => void
	) {
		try {
			const { data } = await routes.editPrompt({
				prompt_id: prompt.id.toString(),
				category: prompt.category,
				prompt: prompt.prompt,
			});
		} catch (error) {
			console.error(error);
		} finally {
			editableRow(null);
		}
	}

	async function startStory(
		prompt_id: number,
		setStory: (story: StoryData | null) => void
	) {
		try {
			const { data } = await routes.demoPrompt(prompt_id);
			setStory(data);
		} catch (error) {
			console.error(error);
			setStory(null);
		}
	}

	useEffect(() => {
		generatePrompt();
	}, [environment]);

	return (
		<PromptContext.Provider
			value={{ prompts, generatePrompt, updatePrompt, startStory }}
		>
			{children}
		</PromptContext.Provider>
	);
};

export const usePrompt = (): PromptContextProps => {
	const context = useContext(PromptContext);
	if (!context) {
		throw new Error("usePrompt must be used within a PromptProvider");
	}
	return context;
};
