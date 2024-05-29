// components/Meta.tsx
import Head from "next/head";

interface MetaProps {
	title: string;
	description: string;
	image: string;
	url: string;
}

const Meta: React.FC<MetaProps> = ({ title, description, image, url }) => {
	return (
		<Head>
			<title>{title}</title>
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:image" content={image} />
			<meta property="og:url" content={url} />
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />
			<meta name="twitter:image" content={image} />
		</Head>
	);
};

export default Meta;
