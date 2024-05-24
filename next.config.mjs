/** @type {import('next').NextConfig} */
const nextConfig = {
    // siteUrl: "https://playground.degenerousdao.com",
    // reactStrictMode: true,
    // images: {
    //     domains: ["playground.degenerousdao.com"],
    // },
    // async headers() {
    //     return [
    //         {
    //             source: "/(.*)",
    //             headers: securityHeaders,
    //         },
    //     ];
    // },
    // proxy config
    async rewrites() {
        return [
            {
                source: "/api/dev/:path*",
                destination: `http://localhost:8080/:path*`,
            },
            {
                source: "/api/prod/:path*",
                destination: `http://localhost:8081/:path*`,

            }
        ];
    },
};

export default nextConfig;
