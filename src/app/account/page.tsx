"use client";

import React, { useEffect, useState } from "react";

import { useAuth } from "@/context/auth.context";
import { routes } from "@/service/api/routes";
import ReferralCode from "@/types/referral.type";

const Dashboard: React.FC = () => {
	const { user } = useAuth();
	const [referralCodes, setReferralCodes] = useState<ReferralCode[]>([]);

	const generateReferralCode = async () => {
		try {
			await routes.generateReferralCode();
			const { data } = await routes.getReferralCode();
			setReferralCodes(data.codes);
		} catch (error) {
			console.error("Error generating referral code:", error);
		}
	};

	useEffect(() => {
		const fetchCodes = async () => {
			try {
				const { data } = await routes.getReferralCode();
				setReferralCodes(data.codes);
			} catch (error) {
				console.error("Error fetching referral codes:", error);
			}
		};

		fetchCodes();
	}, []);

	return (
		<div className="container mx-auto justify-center items-center flex flex-col p-4">
			<h1 className="text-2xl font-bold mb-4">Dashboard</h1>
			{user && (
				<>
					{user.referral_count === 10 && referralCodes.length === 0 ? (
						<>
							<h1 className="text-2xl font-bold mb-4">
								You have not generated any referral codes yet.
							</h1>
							<button
								onClick={generateReferralCode}
								className="bg-blue-500 text-white px-4 py-2 rounded"
							>
								Generate Referral Code
							</button>
						</>
					) : (
						<>
							<h2 className="text-lg font-semibold mb-2">Referral Codes:</h2>
							<ul>
								{referralCodes.map(code => (
									<li key={code.ID}>
										<ReferralCodeCard code={code} />
									</li>
								))}
							</ul>
						</>
					)}
				</>
			)}
		</div>
	);
};

export default Dashboard;

const ReferralCodeCard: React.FC<{ code: ReferralCode }> = ({ code }) => {
	const { user } = useAuth();
	const [isCopied, setIsCopied] = useState(false);

	const copyCode = () => {
		navigator.clipboard.writeText(code.code);
		setIsCopied(true);
	};

	return (
		<div className="bg-transparent p-4 rounded shadow-md w-full flex justify-between items-center space-x-4">
			<div
				className={`
                ${code.is_used ? "opacity-50" : ""}
                flex flex-row items-center space-x-2
                `}
			>
				<p>{code.code}</p>
				{code.used_by && (
					<p className="text-sm text-gray-500">Used by: {code.used_by}</p>
				)}
			</div>
			<button
				onClick={copyCode}
				disabled={code.is_used}
				className="bg-blue-500 text-white px-4 py-2 rounded"
			>
				{isCopied ? "Copied!" : "Copy"}
			</button>
		</div>
	);
};
