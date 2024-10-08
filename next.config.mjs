/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        minimumCacheTTL: 31536000,
        formats: ["image/avif", "image/webp"],
        domains: ["sirxrcuwndrxhjmywucm.supabase.co"],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "sirxrcuwndrxhjmywucm.supabase.co",
                port: "",
                pathname: "/image/upload/**",
            },
        ],
    },
};

export default nextConfig;
