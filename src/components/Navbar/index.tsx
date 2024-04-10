"use client";

import React, { useState } from "react";
import Link from "next/link";

const Navbar = ({ children }: Readonly<{ children: React.ReactNode }>) => {
	const [showLinks, setShowLinks] = useState(false);

	const toggleLinks = () => {
		setShowLinks(!showLinks);
	};

	return (
		<div className="min-h-screen bg-black">
			<header className="bg-blue-500 text-white text-center p-4 flex justify-between">
				<button
					onClick={toggleLinks}
					className="block md:hidden focus:outline-none"
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
				<h1 className="text-2xl font-semibold">Story Prompts</h1>
				<nav
					className={`${showLinks ? "flex" : "hidden"} md:flex md:items-center space-x-2`}
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
