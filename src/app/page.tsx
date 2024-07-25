"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth.context";

export default function Home() {
	const { user } = useAuth();
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24 text-white">
			<div className="">
				<h1 className="text-4xl font-bold text-center">
					Welcome to the Degenerous Story Development Playground
				</h1>
				<p className="text-center text-lg mt-4">
					This playground is a tool to help you develop your stories. Get
					started by writing a story or exploring created stories.
				</p>

				<div className="flex justify-center mt-8">
					{user ? (
						<>
							<Link href="/playground">
								<p className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
									Craft Prompt
								</p>
							</Link>
							<Link href="/prompts">
								<p className="ml-4 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
									Explore Prompts
								</p>
							</Link>
						</>
					) : null}
				</div>
				<div className="flex flex-col items-center justify-center mt-8">
					{Features.map(feature => (
						<Feature key={feature.title} {...feature} />
					))}
				</div>
			</div>
		</main>
	);
}

const Features: { title: string; description: string }[] = [
	{
		title: "Generate prompts",
		description: "Generate prompts for your story development",
	},
	{
		title: "Explore prompts",
		description:
			"Explore prompts created by you and others to see how they play out",
	},
	{
		title: "Upload media",
		description: "Upload images and music to enhance your stories",
	},
	{
		title: "Migrate stories to Prod (Admin only)",
		description:
			"Satified with your stories? Migrate them to the production environment",
	},
	{
		title: "Share referral codes (Admin only)",
		description: "Share referral codes to invite others to use the playground",
	},
	{
		title: "Share stories (coming soon)",
		description: "Share your stories with others and get feedback",
	},
];

const Feature = ({
	title,
	description,
}: {
	title: string;
	description: string;
}) => {
	return (
		<div className="flex flex-col items-start justify-center border-2 border-gray-200 rounded-md p-4 w-full hover:bg-gray-300 hover:text-black mb-2 hover:scale-105 duration-300 transition-all ease-in-out">
			<h2 className="text-xl font-bold">{title}</h2>
			<p className="text-sm">{description}</p>
		</div>
	);
};
