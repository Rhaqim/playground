"use client";

import { useState } from "react";

import TestPromptRequest, {
	Pacing,
	StoryStyle,
	StoryTone,
	Tense,
	VoiceStyle,
	Character,
} from "@/types";
import { routes } from "@/service/api/routes";
import Dropdown from "@/components/Dropdown";

const TestPromptForm = () => {
	const [fullResponse, setFullResponse] = useState<string>("");
	const [response, setResponse] = useState<string>("");
	const [category, setCategory] = useState<number>(0);

	const [losingScenarios, setLosingScenarios] = useState<string[]>([]);
	const [losingScenario, setLosingScenario] = useState<string>("");
	const [winningScenarios, setWinningScenarios] = useState<string[]>([]);
	const [winningScenario, setWinningScenario] = useState<string>("");

	const [mainCharacter, setMainCharacter] = useState<Character>({
		Name: "",
		Description: "",
	});
	const [sideCharacters, setSideCharacters] = useState<Character[]>([]);
	const [newSideCharacter, setNewSideCharacter] = useState<Character>({
		Name: "",
		Description: "",
	});

	const initalFormData: TestPromptRequest = {
		Setting: "",
		Exposition: "",
		FirstAct: "",
		POV: "",
		WinningScenario: winningScenarios,
		LosingScenario: losingScenarios,
		Premise: "",
		MainCharater: mainCharacter,
		SideCharacters: sideCharacters,
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
	};

	const [formData, setFormData] = useState<TestPromptRequest>(initalFormData);

	const handleNewWinningScenarioChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setWinningScenario(e.target.value);
	};

	const handleAddWinningScenario = () => {
		if (winningScenario) {
			setWinningScenarios([...winningScenarios, winningScenario]);
			setWinningScenario("");
		}
	};

	const handleRemoveWinningScenario = (index: number) => {
		const newWinningScenarios = winningScenarios.filter((_, i) => i !== index);
		setWinningScenarios(newWinningScenarios);
	};

	const handleNewLosingScenarioChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setLosingScenario(e.target.value);
	};

	const handleAddLosingScenario = () => {
		if (losingScenario) {
			setLosingScenarios([...losingScenarios, losingScenario]);
			setLosingScenario("");
		}
	};

	const handleRemoveLosingScenario = (index: number) => {
		const newLosingScenarios = losingScenarios.filter((_, i) => i !== index);
		setLosingScenarios(newLosingScenarios);
	};

	const handleMainCharacterChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setMainCharacter({ ...mainCharacter, [e.target.name]: e.target.value });
	};

	const handleNewSideCharacterChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setNewSideCharacter({
			...newSideCharacter,
			[e.target.name]: e.target.value,
		});
	};

	const handleAddSideCharacter = () => {
		// check if the new side character has a name and description
		if (!newSideCharacter.Name || !newSideCharacter.Description) {
			return;
		}

		setSideCharacters([...sideCharacters, newSideCharacter]);
		setNewSideCharacter({ Name: "", Description: "" }); // Clear input fields
	};

	const handleRemoveSideCharacter = (index: number) => {
		const newSideCharacters = sideCharacters.filter((_, i) => i !== index);
		setSideCharacters(newSideCharacters);
	};

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

	const handleSliderChange = (
		newValue: number,
		toneProperty: keyof StoryTone
	) => {
		setFormData(prevFormData => ({
			...prevFormData,
			Tone: {
				...prevFormData.Tone,
				[toneProperty]: newValue,
			},
		}));
	};

	const handleSubmit = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();

		try {
			const { data } = await routes.generatePrompt(formData);
			setFullResponse(data.full);
			setResponse(data.short);
		} catch (error) {
			console.error(error);
		}
	};

	const handleSavePrompt = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();

		try {
			await routes.createPrompt({ prompt: response, category });
		} catch (error) {
			console.error(error);
		}
	};

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
					<input
						type="text"
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
					<input
						type="text"
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
						<ul>
							{winningScenarios.map((scenrio, index) => (
								<li key={index}>
									{scenrio}
									<button
										className="text-red-600"
										onClick={() => handleRemoveWinningScenario(index)}
									>
										X
									</button>
								</li>
							))}
						</ul>
						<input
							type="text"
							id="winningScenario"
							name="WinningScenario"
							value={winningScenario}
							onChange={handleNewWinningScenarioChange}
							className="w-full border-gray-300 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
							// required
						/>
						<button
							className="p-2 rounded-md bg-blue-600"
							onClick={handleAddWinningScenario}
						>
							Add Winning Scenario
						</button>
					</div>

					<div>
						<label htmlFor="losingScenario" className="block mb-1">
							Losing Scenario
						</label>
						<ul>
							{losingScenarios.map((scenrio, index) => (
								<li key={index}>
									{scenrio}
									<button
										className="text-red-600"
										onClick={() => handleRemoveLosingScenario(index)}
									>
										X
									</button>
								</li>
							))}
						</ul>
						<input
							type="text"
							id="losingScenario"
							name="LosingScenario"
							value={losingScenario}
							onChange={handleNewLosingScenarioChange}
							className="w-full border-gray-300 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
							// required
						/>
						<button
							className="p-2 rounded-md bg-blue-600"
							onClick={handleAddLosingScenario}
						>
							Add Losing Scenario
						</button>
					</div>
				</Dropdown>

				<Dropdown name="Characters">
					<div>
						<label htmlFor="sideCharacters" className="block mb-1">
							Main Character
						</label>
						<input
							type="text"
							id="mainCharacter"
							name="Name"
							value={mainCharacter.Name}
							onChange={handleMainCharacterChange}
							placeholder="Name"
							className="w-full border-gray-300 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500 mb-1"
							// required
						/>
						<input
							type="text"
							id="mainCharacterDescription"
							name="Description"
							value={mainCharacter.Description}
							onChange={handleMainCharacterChange}
							placeholder="Description"
							className="w-full border-gray-300 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
							// required
						/>
					</div>

					<div className="flex flex-col space-y-1">
						<label htmlFor="sideCharacters" className="block mb-1">
							Side Characters
						</label>
						<ul>
							{sideCharacters.map((character, index) => (
								<li key={index}>
									{character.Name}: {character.Description}{" "}
									<button
										className="text-red-600"
										onClick={() => handleRemoveSideCharacter(index)}
									>
										X
									</button>
								</li>
							))}
						</ul>
						<input
							type="text"
							id="sideCharacters"
							name="Name"
							value={newSideCharacter.Name}
							placeholder="Side Character Name"
							onChange={handleNewSideCharacterChange}
							className="w-full border-gray-300 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
							// required
						/>
						<input
							type="text"
							id="sideCharacters"
							name="Description"
							value={newSideCharacter.Description}
							placeholder="Side Character Description"
							onChange={handleNewSideCharacterChange}
							className="w-full border-gray-300 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
							// required
						/>
						<button onClick={handleAddSideCharacter}>Add Side Character</button>
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
						onChange={newValue => handleSliderChange(newValue, "Optimistic")}
					/>
					<SliderField
						label="Pessimistic"
						id="pessimistic"
						name="Tone.Pessimistic"
						value={formData.Tone.Pessimistic}
						onChange={newValue => handleSliderChange(newValue, "Pessimistic")}
					/>
					<SliderField
						label="Sarcastic"
						id="sarcastic"
						name="Tone.Sarcastic"
						value={formData.Tone.Sarcastic}
						onChange={newValue => handleSliderChange(newValue, "Sarcastic")}
					/>
					<SliderField
						label="Assertive"
						id="assertive"
						name="Tone.Assertive"
						value={formData.Tone.Assertive}
						onChange={newValue => handleSliderChange(newValue, "Assertive")}
					/>
					<SliderField
						label="Aggressive"
						id="aggressive"
						name="Tone.Aggressive"
						value={formData.Tone.Aggressive}
						onChange={newValue => handleSliderChange(newValue, "Aggressive")}
					/>
					<SliderField
						label="Passionate"
						id="passionate"
						name="Tone.Passionate"
						value={formData.Tone.Passionate}
						onChange={newValue => handleSliderChange(newValue, "Passionate")}
					/>
					<SliderField
						label="Entertaining"
						id="entertaining"
						name="Tone.Entertaining"
						value={formData.Tone.Entertaining}
						onChange={newValue => handleSliderChange(newValue, "Entertaining")}
					/>
					<SliderField
						label="Serious"
						id="serious"
						name="Tone.Serious"
						value={formData.Tone.Serious}
						onChange={newValue => handleSliderChange(newValue, "Serious")}
					/>
					<SliderField
						label="Educational"
						id="educational"
						name="Tone.Educational"
						value={formData.Tone.Educational}
						onChange={newValue => handleSliderChange(newValue, "Educational")}
					/>
					<SliderField
						label="Persuasive"
						id="persuasive"
						name="Tone.Persuasive"
						value={formData.Tone.Persuasive}
						onChange={newValue => handleSliderChange(newValue, "Persuasive")}
					/>
					<SliderField
						label="Motivating"
						id="motivating"
						name="Tone.Motivating"
						value={formData.Tone.Motivating}
						onChange={newValue => handleSliderChange(newValue, "Motivating")}
					/>
					<SliderField
						label="Curious"
						id="curious"
						name="Tone.Curious"
						value={formData.Tone.Curious}
						onChange={newValue => handleSliderChange(newValue, "Curious")}
					/>
					<SliderField
						label="Humoristic"
						id="humoristic"
						name="Tone.Humoristic"
						value={formData.Tone.Humoristic}
						onChange={newValue => handleSliderChange(newValue, "Humoristic")}
					/>
					<SliderField
						label="Surreal"
						id="surreal"
						name="Tone.Surreal"
						value={formData.Tone.Surreal}
						onChange={newValue => handleSliderChange(newValue, "Surreal")}
					/>
				</Dropdown>
				<button
					className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
					onClick={handleSubmit}
				>
					Submit
				</button>
			</div>
			{response && (
				<div>
					<h1>Prompt</h1>
					<input
						type="number"
						id="category"
						name="Category"
						value={category}
						onChange={e => setCategory(parseInt(e.target.value, 10))}
						className="w-full border-gray-300 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
						placeholder="Category"
						required
					/>
					<p>{response}</p>
					<button
						className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
						onClick={handleSavePrompt}
					>
						Save Prompt
					</button>
				</div>
			)}
		</div>
	);
};

export default TestPromptForm;

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
	onChange: (newValue: number) => void; // Update the onChange prop to accept the new value directly
}) => (
	<div>
		<label htmlFor={id} className="block mb-1">
			{label}
		</label>
		<div className="flex space-x-4 items-center">
			<input
				type="range"
				min="1"
				max="100"
				id={id}
				name={id}
				value={value}
				onChange={e => onChange(parseInt(e.target.value, 10))} // Parse the value to integer and call onChange with the new value
				className="w-full border-gray-300 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
				required
			/>
			<h1>{value}</h1>
		</div>
	</div>
);
