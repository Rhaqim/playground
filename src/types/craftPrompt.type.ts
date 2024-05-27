// Enums
export enum Tense {
	PastTense = "past",
	PresentTense = "present",
	FutureTense = "future",
}

export enum StoryStyle {
	Descriptive = "descriptive",
	Narrative = "narrative",
	Expository = "expository",
}

export enum VoiceStyle {
	Active = "active",
	Passive = "passive",
}

export enum Pacing {
	SlowPacing = "slow",
	FastPacing = "fast",
	NormalPacing = "normal",
}

// Interfaces
export interface Character {
	name: string;
	description: string;
}

export interface WritingStyle {
	Tense: Tense;
	Style: StoryStyle;
	Voice: VoiceStyle;
	Pacing: Pacing;
}

export interface StoryTone {
	Optimistic: number;
	Pessimistic: number;
	Sarcastic: number;
	Assertive: number;
	Aggressive: number;
	Passionate: number;
	Entertaining: number;
	Serious: number;
	Educational: number;
	Persuasive: number;
	Motivating: number;
	Curious: number;
	Humoristic: number;
	Surreal: number;
}

declare interface TestPromptRequest {
	setting: string;
	premise: string;
	exposition?: string;
	firstAct?: string;
	pov: string;
	winningScenario: string[];
	losingScenario: string[];
	mainCharacter: Character;
	sideCharacters:Character[];
	writingStyle: WritingStyle;
	tone: StoryTone;
}

export default TestPromptRequest;
