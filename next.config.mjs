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

            },
            // add a rewrite to the file system to get images from /www/images
            // {
            //     source: "/images/:path*",
            //     destination: "/www/images/:path*",
            // },
        ];
    },
};

export default nextConfig;
