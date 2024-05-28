"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { routes } from "@/service/api/routes";
import Dropdown from "@/components/Dropdown";
import { usePrompt } from "@/context/prompt.context";
import TestPromptRequest, {
	Pacing,
	StoryStyle,
	StoryTone,
	Tense,
	VoiceStyle,
	Character,
} from "@/types/craftPrompt.type";

const TestPromptForm = () => {
	const router = useRouter();

	const { categories } = usePrompt();

	const [error, setError] = useState<string>("");

	const [fullResponse, setFullResponse] = useState<string>("");
	const [response, setResponse] = useState<string>("");

	const [topicName, setTopicName] = useState<string>("");
	const [imagePrompts, setImagePrompts] = useState<string[]>([]);
	const [newImagePrompt, setNewImagePrompt] = useState<string>("");
	const [categoryId, setCategoryId] = useState<number>(1);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const [losingScenarios, setLosingScenarios] = useState<string[]>([]);
	const [losingScenario, setLosingScenario] = useState<string>("");
	const [winningScenarios, setWinningScenarios] = useState<string[]>([]);
	const [winningScenario, setWinningScenario] = useState<string>("");

	const [mainCharacter, setMainCharacter] = useState<Character>({
		name: "",
		description: "",
	});
	const [sideCharacters, setSideCharacters] = useState<Character[]>([]);
	const [newSideCharacter, setNewSideCharacter] = useState<Character>({
		name: "",
		description: "",
	});

	const initalFormData: TestPromptRequest = {
		setting: "",
		exposition: "",
		firstAct: "",
		pov: "",
		winningScenario: winningScenarios,
		losingScenario: losingScenarios,
		premise: "",
		mainCharacter: mainCharacter,
		sideCharacters: sideCharacters,
		writingStyle: {
			Tense: Tense.PastTense,
			Style: StoryStyle.Descriptive,
			Voice: VoiceStyle.Active,
			Pacing: Pacing.NormalPacing,
		},
		tone: {
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
		if (!newSideCharacter.name || !newSideCharacter.description) {
			return;
		}

		setSideCharacters([...sideCharacters, newSideCharacter]);
		setNewSideCharacter({ name: "", description: "" }); // Clear input fields
	};

	const handleRemoveSideCharacter = (index: number) => {
		const newSideCharacters = sideCharacters.filter((_, i) => i !== index);
		setSideCharacters(newSideCharacters);
	};

	const handleAddImagePrompt = () => {
		if (newImagePrompt) {
			setImagePrompts([...imagePrompts, newImagePrompt]);
			setNewImagePrompt("");
		}
	};

	const handleRemoveImagePrompt = (index: number) => {
		const newImagePrompts = imagePrompts.filter((_, i) => i !== index);
		setImagePrompts(newImagePrompts);
	};

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>,
		key?: string
	) => {
		const { name, value } = e.target;
		setFormData(prevData => ({
			...prevData,
			[key ?? name]: value,
		}));
	};

	const handleSliderChange = (
		newValue: number,
		toneProperty: keyof StoryTone
	) => {
		setFormData(prevFormData => ({
			...prevFormData,
			tone: {
				...prevFormData.tone,
				[toneProperty]: newValue,
			},
		}));
	};

	const handleSubmit = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();

		formData.winningScenario = winningScenarios;
		formData.losingScenario = losingScenarios;
		formData.mainCharacter = mainCharacter;
		formData.sideCharacters = sideCharacters;

		console.log("Form Data: ", formData);

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
		// e.preventDefault();

		// join image prompts together separated by a comma
		const imagePrompt = imagePrompts.join(",");

		try {
			await routes.createPrompt({
				prompt: response,
				category: categoryId,
				topic: topicName,
				image_prompt: imagePrompt,
			});

			router.push("/prompts");
		} catch (error: any) {
			setError("An error occurred while saving the prompt");
			console.error(error);
		} finally {
			setIsModalOpen(false);
		}
	};

	const toggleModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	useEffect(() => {
		// Update isModalOpen when response changes
		setIsModalOpen(response !== "");
	}, [response]);

	return (
		<div className="mx-auto text-white">
			{/* Error */}
			{error && (
				<div className="relative w-full h-96 bg-opacity-50 flex justify-center items-center rounded-md mb-4">
					<div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-2 rounded-t-md">
						{error}
					</div>
				</div>
			)}
			{/* Form */}
			<div
				className="w-full p-4 bg-black bg-opacity-50 rounded-md"
				style={{ backdropFilter: "blur(10px)" }}
			>
				<div
					className="text-lg font-bold text-center mb-4"
					style={{ color: "white" }}
				>
					<label htmlFor="setting" className="block mb-1">
						Setting
					</label>
					<input
						type="text"
						id="setting"
						name="setting"
						value={formData.setting}
						onChange={handleChange}
						placeholder="Set in a world where..."
						className="w-full border-gray-300 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
						required
					/>
				</div>

				<div
					className="text-lg font-bold text-center mb-4"
					style={{ color: "white" }}
				>
					<label htmlFor="premise" className="block mb-1">
						Premise
					</label>
					<textarea
						id="premise"
						name="premise"
						rows={6}
						value={formData.premise}
						placeholder="The story is about..."
						onChange={handleChange}
						className="w-full border-gray-300 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
						required
					/>
				</div>

				<div
					className="text-lg font-bold text-center mb-4"
					style={{ color: "white" }}
				>
					<label htmlFor="exposition" className="block mb-1">
						Exposition
					</label>
					<input
						type="text"
						id="exposition"
						name="exposition"
						placeholder="The story begins with..."
						value={formData.exposition}
						onChange={handleChange}
						className="w-full border-gray-300 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>

				<div
					className="text-lg font-bold text-center mb-4"
					style={{ color: "white" }}
				>
					<label htmlFor="firstAct" className="block mb-1">
						First Act
					</label>
					<input
						type="text"
						id="firstAct"
						name="firstAct"
						placeholder="The story progresses when..."
						value={formData.firstAct}
						onChange={handleChange}
						className="w-full border-gray-300 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>

				<div
					className="text-lg font-bold text-center mb-4"
					style={{ color: "white" }}
				>
					<label htmlFor="pov" className="block mb-1">
						Point of View
					</label>
					<input
						type="text"
						id="pov"
						name="pov"
						value={formData.pov}
						placeholder="The story is told from the perspective of..."
						onChange={handleChange}
						className="w-full border-gray-300 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
						required
					/>
				</div>

				<Dropdown name="Scenarios">
					<div
						className="text-lg font-bold text-center mb-4"
						style={{ color: "white" }}
					>
						<label htmlFor="winningScenario" className="block mb-1">
							Winning Scenario
						</label>
						<ul>
							{winningScenarios.map((scenrio, index) => (
								<li key={index}>
									{scenrio}
									<button
										className="text-white text-md bg-red-700 rounded-md p-1 m-2"
										onClick={() => handleRemoveWinningScenario(index)}
									>
										Remove
									</button>
								</li>
							))}
						</ul>
						<input
							type="text"
							id="winningScenario"
							name="WinningScenario"
							value={winningScenario}
							placeholder="The story ends when..."
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

					<div
						className="text-lg font-bold text-center mb-4"
						style={{ color: "white" }}
					>
						<label htmlFor="losingScenario" className="block mb-1">
							Losing Scenario
						</label>
						<ul>
							{losingScenarios.map((scenrio, index) => (
								<li key={index}>
									{scenrio}
									<button
										className="text-white text-md bg-red-700 rounded-md p-1 m-2"
										onClick={() => handleRemoveLosingScenario(index)}
									>
										Remove
									</button>
								</li>
							))}
						</ul>
						<input
							type="text"
							id="losingScenario"
							name="LosingScenario"
							value={losingScenario}
							placeholder="The story ends when..."
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
					<div
						className="text-lg font-bold text-center mb-4"
						style={{ color: "white" }}
					>
						<label htmlFor="sideCharacters" className="block mb-1">
							Main Character
						</label>
						<input
							type="text"
							id="mainCharacter"
							name="name"
							value={mainCharacter.name}
							onChange={handleMainCharacterChange}
							placeholder="Cassandra"
							className="w-full border-gray-300 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500 mb-1"
							// required
						/>
						<input
							type="text"
							id="mainCharacterDescription"
							name="description"
							value={mainCharacter.description}
							onChange={handleMainCharacterChange}
							placeholder="A warrior princess"
							className="w-full border-gray-300 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
							// required
						/>
					</div>

					<div
						className="text-lg font-bold flex flex-col space-y-1 text-center items-center mb-4"
						style={{ color: "white" }}
					>
						<label htmlFor="sideCharacters" className="block mb-1">
							Side Characters
						</label>
						<ul>
							{sideCharacters.map((character, index) => (
								<li key={index}>
									{character.name}: {character.description}{" "}
									<button
										className="text-white text-md bg-red-700 rounded-md p-1 m-2"
										onClick={() => handleRemoveSideCharacter(index)}
									>
										Remove
									</button>
								</li>
							))}
						</ul>
						<input
							type="text"
							id="sideCharacters"
							name="name"
							value={newSideCharacter.name}
							placeholder="Morgan"
							onChange={handleNewSideCharacterChange}
							className="w-full border-gray-300 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
							// required
						/>
						<input
							type="text"
							id="sideCharacters"
							name="description"
							value={newSideCharacter.description}
							placeholder="A wise old wizard"
							onChange={handleNewSideCharacterChange}
							className="w-full border-gray-300 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
							// required
						/>
						<button
							className="p-2 rounded-md bg-blue-600"
							onClick={handleAddSideCharacter}
						>
							Add Side Character
						</button>
					</div>
				</Dropdown>

				<Dropdown name="Writing Style">
					<div
						className="text-lg font-bold text-center mb-4"
						style={{ color: "white" }}
					>
						<label htmlFor="tense" className="block mb-1">
							Tense
						</label>
						<select
							id="tense"
							name="writingStyle.Tense"
							value={formData.writingStyle.Tense}
							onChange={e => handleChange(e, "WritingStyle.Tense")}
							className="w-full border-gray-300 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
							required
						>
							<option value={Tense.PastTense}>Past Tense</option>
							<option value={Tense.PresentTense}>Present Tense</option>
							<option value={Tense.FutureTense}>Future Tense</option>
						</select>
					</div>

					<div
						className="text-lg font-bold text-center mb-4"
						style={{ color: "white" }}
					>
						<label htmlFor="style" className="block mb-1">
							Style
						</label>
						<select
							id="style"
							name="writingStyle.Style"
							value={formData.writingStyle.Style}
							onChange={e => handleChange(e, "WritingStyle.Style")}
							className="w-full border-gray-300 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
							required
						>
							<option value={StoryStyle.Descriptive}>Description</option>
							<option value={StoryStyle.Narrative}>Narrative</option>
							<option value={StoryStyle.Expository}>Expository</option>
						</select>
					</div>

					<div
						className="text-lg font-bold text-center mb-4"
						style={{ color: "white" }}
					>
						<label htmlFor="voice" className="block mb-1">
							Voice
						</label>
						<select
							id="voice"
							name="Voice"
							value={formData.writingStyle.Voice}
							onChange={handleChange}
							className="w-full border-gray-300 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
							required
						>
							<option value={VoiceStyle.Active}>Active</option>
							<option value={VoiceStyle.Passive}>Passive</option>
						</select>
					</div>

					<div
						className="text-lg font-bold text-center mb-4"
						style={{ color: "white" }}
					>
						<label htmlFor="pacing" className="block mb-1">
							Pacing
						</label>
						<select
							id="pacing"
							name="Pacing"
							value={formData.writingStyle.Pacing}
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
						name="tone.Optimistic"
						value={formData.tone.Optimistic}
						onChange={newValue => handleSliderChange(newValue, "Optimistic")}
					/>
					<SliderField
						label="Pessimistic"
						id="pessimistic"
						name="tone.Pessimistic"
						value={formData.tone.Pessimistic}
						onChange={newValue => handleSliderChange(newValue, "Pessimistic")}
					/>
					<SliderField
						label="Sarcastic"
						id="sarcastic"
						name="tone.Sarcastic"
						value={formData.tone.Sarcastic}
						onChange={newValue => handleSliderChange(newValue, "Sarcastic")}
					/>
					<SliderField
						label="Assertive"
						id="assertive"
						name="tone.Assertive"
						value={formData.tone.Assertive}
						onChange={newValue => handleSliderChange(newValue, "Assertive")}
					/>
					<SliderField
						label="Aggressive"
						id="aggressive"
						name="tone.Aggressive"
						value={formData.tone.Aggressive}
						onChange={newValue => handleSliderChange(newValue, "Aggressive")}
					/>
					<SliderField
						label="Passionate"
						id="passionate"
						name="tone.Passionate"
						value={formData.tone.Passionate}
						onChange={newValue => handleSliderChange(newValue, "Passionate")}
					/>
					<SliderField
						label="Entertaining"
						id="entertaining"
						name="tone.Entertaining"
						value={formData.tone.Entertaining}
						onChange={newValue => handleSliderChange(newValue, "Entertaining")}
					/>
					<SliderField
						label="Serious"
						id="serious"
						name="tone.Serious"
						value={formData.tone.Serious}
						onChange={newValue => handleSliderChange(newValue, "Serious")}
					/>
					<SliderField
						label="Educational"
						id="educational"
						name="tone.Educational"
						value={formData.tone.Educational}
						onChange={newValue => handleSliderChange(newValue, "Educational")}
					/>
					<SliderField
						label="Persuasive"
						id="persuasive"
						name="tone.Persuasive"
						value={formData.tone.Persuasive}
						onChange={newValue => handleSliderChange(newValue, "Persuasive")}
					/>
					<SliderField
						label="Motivating"
						id="motivating"
						name="tone.Motivating"
						value={formData.tone.Motivating}
						onChange={newValue => handleSliderChange(newValue, "Motivating")}
					/>
					<SliderField
						label="Curious"
						id="curious"
						name="tone.Curious"
						value={formData.tone.Curious}
						onChange={newValue => handleSliderChange(newValue, "Curious")}
					/>
					<SliderField
						label="Humoristic"
						id="humoristic"
						name="tone.Humoristic"
						value={formData.tone.Humoristic}
						onChange={newValue => handleSliderChange(newValue, "Humoristic")}
					/>
					<SliderField
						label="Surreal"
						id="surreal"
						name="tone.Surreal"
						value={formData.tone.Surreal}
						onChange={newValue => handleSliderChange(newValue, "Surreal")}
					/>
				</Dropdown>
				<div className="flex justify-between items-center">
					<button
						className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
						onClick={handleSubmit}
					>
						Submit
					</button>
					{response && (
						<button
							className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
							onClick={toggleModal}
						>
							View Prompt
						</button>
					)}
				</div>
			</div>
			<div>
				{isModalOpen && (
					<div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-75">
						<div className="bg-white p-8 rounded-lg shadow-md w-[50%]">
							<h1 className="text-lg font-bold mb-4 text-black">Prompt</h1>
							<p className="text-black">
								Review the prompt and make any changes
							</p>
							{/* Topic title input */}
							<label
								htmlFor="topic"
								className="block mb-1 text-black font-bold"
							>
								Topic
							</label>
							<input
								type="text"
								value={topicName}
								onChange={e => setTopicName(e.target.value)}
								className="w-full border-gray-300 text-white bg-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
								required
							/>
							{/* Image prompts */}
							<div className="flex flex-col space-y-2">
								<label
									htmlFor="imagePrompts"
									className="block mb-1 text-black font-bold"
								>
									Image Prompts
								</label>
								<ul>
									{imagePrompts.map((prompt, index) => (
										<li key={index} className="flex items-center">
											<p
												className="text-black text-md w-full"
												style={{ wordWrap: "break-word" }}
											>
												{prompt}
											</p>
											<button
												className="text-white text-md bg-red-700 rounded-md p-1 m-2"
												onClick={() => handleRemoveImagePrompt(index)}
											>
												Remove
											</button>
										</li>
									))}
								</ul>
								<input
									type="text"
									value={newImagePrompt}
									onChange={e => setNewImagePrompt(e.target.value)}
									className="w-full border-gray-300 text-white bg-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
									required
								/>
								<button
									className="p-2 rounded-md bg-blue-600"
									onClick={handleAddImagePrompt}
								>
									Add Image Prompt
								</button>
							</div>
							<label
								htmlFor="response"
								className="block mb-1 text-black font-bold"
							>
								Response
							</label>
							<textarea
								value={response}
								rows={10}
								onChange={e => setResponse(e.target.value)}
								className="w-full border-gray-300 text-white bg-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
								required
							/>
							<div>
								<label
									htmlFor="category"
									className="block mb-1 text-black font-bold"
								>
									Select Category
								</label>
								<select
									id="category"
									name="Category"
									value={categoryId}
									onChange={e => setCategoryId(parseInt(e.target.value))}
									className="w-full border-black border-2 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
									required
								>
									{categories.map(cat => (
										<option key={cat.id} value={cat.id}>
											{cat.name}
										</option>
									))}
									{/* <option value="1">Escape</option> */}
								</select>
							</div>
							<button
								className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
								onClick={handleSavePrompt}
							>
								Save Prompt
							</button>
							<button
								className="mt-4 bg-gray-300 text-gray-800 px-4 py-2 rounded-md ml-2 hover:bg-gray-400"
								onClick={toggleModal}
							>
								Close
							</button>
						</div>
					</div>
				)}
			</div>
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
	onChange: (newValue: number) => void;
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
