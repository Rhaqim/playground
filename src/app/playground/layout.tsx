import React from "react";
import Link from "next/link";

export default function Layout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<div className="min-h-screen bg-black">
			<header className="bg-blue-500 text-white text-center p-4 flex justify-between">
				<Link href="/">
					<p className="text-white">Home</p>
				</Link>
				<h1 className="text-2xl font-semibold">Writing Prompt Generator</h1>
				<Link href="/prompts">
					<p className="text-white">Prompts</p>
				</Link>
			</header>
			<main className="container mx-auto p-4">{children}</main>
		</div>
	);
}
