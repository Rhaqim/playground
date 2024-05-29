// components/ShareButton.tsx
import React from "react";

interface ShareButtonProps {
	title: string;
	url: string;
	text: string;
    image?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ title, url, text, image }) => {
	const handleShare = () => {
		if (navigator.share) {
			navigator
				.share({
					title: title,
					text: text,
					url: url,
				})
				.catch(error => console.log("Error sharing", error));
		} else {
			// Fallback for browsers that don't support the Web Share API
			navigator.clipboard.writeText(url);
			alert("Link copied to clipboard!");
		}
	};

	return (
		<div>
			<button
				onClick={handleShare}
				className="p-2 bg-blue-500 text-white rounded"
			>
				Share
			</button>
			<div className="mt-2">
				<a
					href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
						url
					)}`}
					target="_blank"
					rel="noopener noreferrer"
					className="p-2 bg-blue-600 text-white rounded mr-2"
				>
					Share on Facebook
				</a>
				<a
					href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
						url
					)}&text=${encodeURIComponent(text)}${image ? `&media=${encodeURIComponent(image)}` : ""}`}
					target="_blank"
					rel="noopener noreferrer"
					className="p-2 bg-blue-400 text-white rounded mr-2"
				>
					Share on Twitter
				</a>
                {/* Shar eon Discord */}
                <a
                    href={`https://discord.com/channels/@me`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-blue-300 text-white rounded mr-2"
                >
                    Share on Discord
                </a>
				<a
					href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
						url
					)}`}
					target="_blank"
					rel="noopener noreferrer"
					className="p-2 bg-blue-700 text-white rounded"
				>
					Share on LinkedIn
				</a>
			</div>
		</div>
	);
};

export default ShareButton;
