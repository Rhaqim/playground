"use client";

import ShareButton from "@/components/Share";
import VideoComponent from "@/components/Video";
import Link from "next/link";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24 text-white">
			<div className="">
				<h1 className="text-4xl font-bold text-center">
					Welcome to the Degenerous Prompt Generator
				</h1>
				<p className="text-center text-lg mt-4">
					Get started by generating a writing prompt or exploring the prompts
					created by others.
				</p>

				<div className="flex justify-center mt-8">
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
				</div>
			</div>
		</main>
	);
}
