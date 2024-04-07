"use client";

import { useState } from "react";

import TestPromptRequest, {
	Pacing,
	StoryStyle,
	Tense,
	VoiceStyle,
} from "@/types";
import { routes } from "@/service/api/routes";
import Dropdown from "@/components/Dropdown";

const TestPromptForm = () => {
	const [formData, setFormData] = useState<TestPromptRequest>({
		Setting: "",
		Exposition: "",
		FirstAct: "",
		POV: "",
		WinningScenario: [],
		LosingScenario: [],
		Premise: "",
		MainCharater: {
			Name: "",
			Description: "",
		},
		SideCharacters: [],
		WritingStyle: {
			Tense: Tense.PastTense,
			Style: StoryStyle.Description,
			Voice: VoiceStyle.Active,
			Pacing: Pacing.NormalPacing,
		},
		Tone: {
			Optimistic: 1,
			Pessimistic: 1,
			Sarcastic: 1,
			Assertive: 1,
			Aggressive: 1,
			Passionate: 1,
			Entertaining: 1,
			Serious: 1,
			Educational: 1,
			Persuasive: 1,
			Motivating: 1,
			Curious: 1,
			Humoristic: 1,
			Surreal: 1,
		},
	});

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value } = e.target;
		setFormData(prevData => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();

		try {
			const data = await routes.generatePrompt(formData);
			console.log(data);
		} catch (error) {
			console.error(error);
		}
	};

	const SliderField = ({
		label,
		id,
		name,
		value,
		onChange,
	}: {
		label: string;
		id: string;
		name: string;
		value: number;
		onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	}) => (
		<div>
			<label htmlFor={id} className="block mb-1">
				{label}
			</label>
			<input
				type="range"
				min="1"
				max="100"
				id={id}
				name={id}
				value={value}
				onChange={onChange}
				className="w-full border-gray-300 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
				required
			/>
		</div>
	);

	return (
		<div className="max-w-md mx-auto">
			<div>
				<div>
					<label htmlFor="setting" className="block mb-1">
						Setting
					</label>
					<input
						type="text"
						id="setting"
						name="Setting"
						value={formData.Setting}
						onChange={handleChange}
						className="w-full border-gray-300 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
						required
					/>
				</div>

				<div>
					<label htmlFor="premise" className="block mb-1">
						Premise
					</label>
					<textarea
						id="premise"
						name="Premise"
						rows={6}
						value={formData.Premise}
						onChange={handleChange}
						className="w-full border-gray-300 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
						required
					/>
				</div>

				<div>
					<label htmlFor="exposition" className="block mb-1">
						Exposition
					</label>
					<textarea
						id="exposition"
						name="Exposition"
						value={formData.Exposition}
						onChange={handleChange}
						className="w-full border-gray-300 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>

				<div>
					<label htmlFor="firstAct" className="block mb-1">
						First Act
					</label>
					<textarea
						id="firstAct"
						name="FirstAct"
						value={formData.FirstAct}
						onChange={handleChange}
						className="w-full border-gray-300 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>

				<div>
					<label htmlFor="pov" className="block mb-1">
						Point of View
					</label>
					<input
						type="text"
						id="pov"
						name="POV"
						value={formData.POV}
						onChange={handleChange}
						className="w-full border-gray-300 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
						required
					/>
				</div>

				<Dropdown name="Scenarios">
					<div>
						<label htmlFor="winningScenario" className="block mb-1">
							Winning Scenario
						</label>
						<input
							type="text"
							id="winningScenario"
							name="WinningScenario"
							value={formData.WinningScenario.join(", ")}
							onChange={handleChange}
							className="w-full border-gray-300 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
							// required
						/>
					</div>

					<div>
						<label htmlFor="losingScenario" className="block mb-1">
							Losing Scenario
						</label>
						<input
							type="text"
							id="losingScenario"
							name="LosingScenario"
							value={formData.LosingScenario.join(", ")}
							onChange={handleChange}
							className="w-full border-gray-300 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
							// required
						/>
					</div>
				</Dropdown>

				<Dropdown name="Characters">
					<div>
						<label htmlFor="sideCharacters" className="block mb-1">
							Side Characters
						</label>
						<input
							type="text"
							id="mainCharacter"
							name="MainCharacter"
							value={formData.MainCharater.Name}
							onChange={handleChange}
							className="w-full border-gray-300 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
							// required
						/>
					</div>

					<div>
						<label htmlFor="sideCharacters" className="block mb-1">
							Side Characters
						</label>
						<input
							type="text"
							id="sideCharacters"
							name="SideCharacters"
							value={formData.SideCharacters.map(c => c.Name).join(", ")}
							onChange={handleChange}
							className="w-full border-gray-300 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
							// required
						/>
					</div>
				</Dropdown>

				<Dropdown name="Writing Style">
					<div>
						<label htmlFor="tense" className="block mb-1">
							Tense
						</label>
						<select
							id="tense"
							name="Tense"
							value={formData.WritingStyle.Tense}
							onChange={handleChange}
							className="w-full border-gray-300 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
							required
						>
							<option value={Tense.PastTense}>Past Tense</option>
							<option value={Tense.PresentTense}>Present Tense</option>
							<option value={Tense.FutureTense}>Future Tense</option>
						</select>
					</div>

					<div>
						<label htmlFor="style" className="block mb-1">
							Style
						</label>
						<select
							id="style"
							name="Style"
							value={formData.WritingStyle.Style}
							onChange={handleChange}
							className="w-full border-gray-300 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
							required
						>
							<option value={StoryStyle.Description}>Description</option>
							<option value={StoryStyle.Narrative}>Narrative</option>
							<option value={StoryStyle.Expository}>Expository</option>
						</select>
					</div>

					<div>
						<label htmlFor="voice" className="block mb-1">
							Voice
						</label>
						<select
							id="voice"
							name="Voice"
							value={formData.WritingStyle.Voice}
							onChange={handleChange}
							className="w-full border-gray-300 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
							required
						>
							<option value={VoiceStyle.Active}>Active</option>
							<option value={VoiceStyle.Passive}>Passive</option>
						</select>
					</div>

					<div>
						<label htmlFor="pacing" className="block mb-1">
							Pacing
						</label>
						<select
							id="pacing"
							name="Pacing"
							value={formData.WritingStyle.Pacing}
							onChange={handleChange}
							className="w-full border-gray-300 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
							required
						>
							<option value={Pacing.SlowPacing}>Slow Pacing</option>
							<option value={Pacing.NormalPacing}>Normal Pacing</option>
							<option value={Pacing.FastPacing}>Fast Pacing</option>
						</select>
					</div>
				</Dropdown>

				<Dropdown name="Story Characteristics">
					<SliderField
						label="Optimistic"
						id="optimistic"
						name="Tone.Optimistic"
						value={formData.Tone.Optimistic}
						onChange={handleChange}
					/>
					<SliderField
						label="Pessimistic"
						id="pessimistic"
						name="Tone.Pessimistic"
						value={formData.Tone.Pessimistic}
						onChange={handleChange}
					/>
					<SliderField
						label="Sarcastic"
						id="sarcastic"
						name="Tone.Sarcastic"
						value={formData.Tone.Sarcastic}
						onChange={handleChange}
					/>
					<SliderField
						label="Assertive"
						id="assertive"
						name="Tone.Assertive"
						value={formData.Tone.Assertive}
						onChange={handleChange}
					/>
					<SliderField
						label="Aggressive"
						id="aggressive"
						name="Tone.Aggressive"
						value={formData.Tone.Aggressive}
						onChange={handleChange}
					/>
					<SliderField
						label="Passionate"
						id="passionate"
						name="Tone.Passionate"
						value={formData.Tone.Passionate}
						onChange={handleChange}
					/>
					<SliderField
						label="Entertaining"
						id="entertaining"
						name="Tone.Entertaining"
						value={formData.Tone.Entertaining}
						onChange={handleChange}
					/>
					<SliderField
						label="Serious"
						id="serious"
						name="Tone.Serious"
						value={formData.Tone.Serious}
						onChange={handleChange}
					/>
					<SliderField
						label="Educational"
						id="educational"
						name="Tone.Educational"
						value={formData.Tone.Educational}
						onChange={handleChange}
					/>
					<SliderField
						label="Persuasive"
						id="persuasive"
						name="Tone.Persuasive"
						value={formData.Tone.Persuasive}
						onChange={handleChange}
					/>
					<SliderField
						label="Motivating"
						id="motivating"
						name="Tone.Motivating"
						value={formData.Tone.Motivating}
						onChange={handleChange}
					/>
					<SliderField
						label="Curious"
						id="curious"
						name="Tone.Curious"
						value={formData.Tone.Curious}
						onChange={handleChange}
					/>
					<SliderField
						label="Humoristic"
						id="humoristic"
						name="Tone.Humoristic"
						value={formData.Tone.Humoristic}
						onChange={handleChange}
					/>
					<SliderField
						label="Surreal"
						id="surreal"
						name="Tone.Surreal"
						value={formData.Tone.Surreal}
						onChange={handleChange}
					/>
				</Dropdown>
				<button
					className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
					onClick={handleSubmit}
				>
					Submit
				</button>
			</div>
		</div>
	);
};

export default TestPromptForm;
