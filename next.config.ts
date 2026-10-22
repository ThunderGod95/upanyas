import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    allowedDevOrigins: process.env.DEV_HOST ? [process.env.DEV_HOST] : [],

    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cfzkhwyhqtjluxmcsljw.supabase.co",
                pathname: "/storage/v1/object/public/**",
            },
        ],
    },

    cacheComponents: true,
    partialPrefetching: true,
    reactCompiler: true,
};

export default nextConfig;
