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
import Prompt, { Topic, Category } from "@/types/prompt.type";
import StoryData from "@/types/story.type";
import { useAuth } from "./auth.context";

interface PromptContextProps {
	prompts: Prompt[];
	topics: Topic[];
	categories: Category[];
	newCategoryName: string;
	handleCategoryCreation: () => void;
	reloadAll: () => Promise<void>;
	fetchPrompts: () => Promise<void>;
	setNewCategoryName: (name: string) => void;
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
	const { user } = useAuth();

	const [prompts, setPrompts] = useState<Prompt[]>([]);
	const [topics, setTopics] = useState<Topic[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [newCategoryName, setNewCategoryName] = useState<string>("");

	async function fetchPrompts() {
		try {
			const { data } = await routes.getPrompt();
			setPrompts(data.prompts);
		} catch (error) {
			console.error(error);
			setPrompts([]);
		}
	}

	async function fetchTopics() {
		try {
			const { data } = await routes.getTopics();
			setTopics(data.topics);
		} catch (error) {
			console.error(error);
			setTopics([]);
		}
	}

	async function fetchCategories() {
		try {
			const { data } = await routes.getCategories();
			setCategories(data.categories);
		} catch (error) {
			console.error(error);
			setCategories([]);
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

	const handleTopicCategoryChange = async (
		topicId: number,
		categoryId: number
	) => {
		const { data } = await routes.updateTopicCategory(topicId, categoryId);
		setTopics(prev => prev.map(t => (t.id === data.topic.id ? data.topic : t)));
	};

	const handleCategoryCreation = async () => {
		const { data } = await routes.createCategory(newCategoryName);
		setCategories(prev => [...prev, data.category]);
		setNewCategoryName("");
	};

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

	const reloadAll = async () => {
		await fetchPrompts();
		await fetchTopics();
		await fetchCategories();
	};

	const [hasFetched, setHasFetched] = useState({
		development: false,
		production: false,
	});

	const handleReloadAll = React.useCallback(async () => {
		if (hasFetched[environment]) return;
		await reloadAll();
		setHasFetched(prev => ({
			...prev,
			[environment]: true,
			[environment === "development" ? "production" : "development"]: false,
		}));
	}, [environment, hasFetched]);

	useEffect(() => {
		if (user && !hasFetched[environment]) {
			handleReloadAll();
		}
	}, [user, environment, hasFetched, handleReloadAll]);

	return (
		<PromptContext.Provider
			value={{
				prompts,
				topics,
				categories,
				newCategoryName,
				reloadAll,
				handleCategoryCreation,
				setNewCategoryName,
				fetchPrompts,
				updatePrompt,
				startStory,
			}}
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
