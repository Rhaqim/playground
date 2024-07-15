"use client";

import React, { useState } from "react";
import Link from "next/link";

import { useEnvironment } from "@/context/env.context";

const Navbar = ({ children }: Readonly<{ children: React.ReactNode }>) => {
	const { toggleEnvironment, environment } = useEnvironment();

	const [showLinks, setShowLinks] = useState(false);

	const toggleLinks = () => {
		setShowLinks(!showLinks);
	};

	return (
		<div className="min-h-screen bg-black">
			<header className="bg-blue-500 text-white text-center p-4 flex justify-between">
				<h1 className="text-2xl font-semibold">Story Prompts</h1>
				<div className="relative inline-flex items-center bg-gray-300 rounded-full p-1">
					<button
						onClick={toggleEnvironment}
						className={`${
							environment === "development" ? "bg-blue-500" : "bg-gray-300"
						} text-white rounded-full px-4 py-1 focus:outline-none transition-colors duration-300`}
					>
						Dev
					</button>
					<button
						onClick={toggleEnvironment}
						className={`${
							environment === "production" ? "bg-green-500" : "bg-gray-300"
						} text-white rounded-full px-4 py-1 focus:outline-none transition-colors duration-300`}
					>
						Prod
					</button>
				</div>
				<button
					onClick={toggleLinks}
					className="block md:hidden focus:outline-none z-20"
				>
					<svg
						className="w-6 h-6 text-white"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						{showLinks ? (
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						) : (
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 6h16M4 12h16m-7 6h7"
							/>
						)}
					</svg>
				</button>
				<nav
					className={`${
						showLinks ? "flex" : "hidden"
					} fixed inset-0 z-10 bg-gray-900 bg-opacity-90 flex-col justify-around items-center md:flex md:relative md:bg-transparent md:bg-opacity-100 md:flex-row md:space-x-2`}
				>
					<Link href="/">
						<p className="text-white">Home</p>
					</Link>
					<Link href="/playground">
						<p className="text-white">Playground</p>
					</Link>
					<Link href="/prompts">
						<p className="text-white">Prompts</p>
					</Link>
					<Link href="/image">
						<p className="text-white">Image</p>
					</Link>
				</nav>
			</header>
			<main className="container mx-auto p-4">{children}</main>
		</div>
	);
};

export default Navbar;
