import React from "react";

import { useToast } from "@/context/toast.context";

const Toast = () => {
	const { toasts, removeToast } = useToast();
	return (
		<div className="absolute top-0 left-1/2 transform -translate-x-1/2 p-4 z-50 w-full max-w-md">
			{toasts.map(toast => (
				<div
					key={toast.id}
					className={`shadow-lg rounded-lg p-4 ${
						toast.type === "success" ? "bg-green-400" : "bg-red-400"
					}`}
				>
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<svg
								className="h-6 w-6 text-green-400"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path d="M5 13l4 4L19 7"></path>
							</svg>
							<p className="ml-3 font-semibold">{toast.type}</p>
						</div>
						<button className="text-black" onClick={() => removeToast(toast.id)}>
							<svg
								className="h-4 w-4"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path d="M6 18L18 6M6 6l12 12"></path>
							</svg>
						</button>
					</div>
					<p className="text-sm mt-2">{toast.message}</p>
				</div>
			))}
		</div>
	);
};

export default Toast;
