export const BASE_URL_DEV =
	process.env.NEXT_PUBLIC_BACKEND_DEV || `http://localhost:8080`;
export const BASE_URL_PROD =
	process.env.NEXT_PUBLIC_BACKEND_PROD || `http://localhost:8080`;

const config = {
	development: BASE_URL_DEV,
	production: BASE_URL_PROD,
};

export default config;
