/** @type {import('next').NextConfig} */
const nextConfig = {
    // reactStrictMode: true,
    // proxy config
    async rewrites() {
        return [
            {
                source: "/api/dev/:path*",
                destination: `http://localhost:8001/:path*`,
            },
            {
                source: "/api/prod/:path*",
                destination: `http://localhost:8000/:path*`,

            }
        ];
    },
};

export default nextConfig;
