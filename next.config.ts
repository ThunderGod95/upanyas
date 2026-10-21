import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
