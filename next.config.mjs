/** @type {import('next').NextConfig} */
const nextConfig = {
    siteUrl: "https://playground.degenerousdao.com",
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
    // // proxy config
    // async rewrites() {
    //     return [
    //         {
    //             source: "/api/:path*",
    //             destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
    //         },
    //     ];
    // },
};

export default nextConfig;
