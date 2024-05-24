declare type StoryData = {
	id: string;
	step: string;
	story: string;
	end: boolean;
	options?: Array<string>;
	summary: string;
	traits: string;
};

export default StoryData;