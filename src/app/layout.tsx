import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import AppProviders from "@/context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Degenerous DAO Playground",
	description: "Degenerous DAO Playground",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<AppProviders>
					<Navbar>{children}</Navbar>
				</AppProviders>
			</body>
		</html>
	);
}
