// Enums
export enum Tense {
	PastTense = "past",
	PresentTense = "present",
	FutureTense = "future",
}

export enum StoryStyle {
	Description = "description",
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
export interface SideCharacter {
	Name: string;
	Description: string;
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
	Setting: string;
	Exposition?: string;
	FirstAct?: string;
	POV: string;
	WinningScenario: string[];
	LosingScenario: string[];
	Premise: string;
	SideCharacters: SideCharacter[];
	WritingStyle: WritingStyle;
	Tone: StoryTone;
}

export default TestPromptRequest;
