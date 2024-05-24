/** @type {import('next').NextConfig} */
const nextConfig = {
    // reactStrictMode: true,
    // proxy config
    async rewrites() {
        return [
            {
                source: "/api/dev/:path*",
                destination: `http://localhost:8080/:path*`,
            },
            {
                source: "/prompts/api/dev/:path*",
                destination: `http://localhost:8080/:path*`,
            },
            {
                source: "/api/prod/:path*",
                destination: `http://localhost:8081/:path*`,

            },
            {
                source: "/prompts/api/prod/:path*",
                destination: `http://localhost:8081/:path*`,

            }
        ];
    },
};

export default nextConfig;
