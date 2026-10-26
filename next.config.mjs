/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        minimumCacheTTL: 31536000,
        formats: ["image/avif", "image/webp"],
        domains: ["mffsmschwooawyhcsovu.supabase.co", "sirxrcuwndrxhjmywucm.supabase.co"],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "mffsmschwooawyhcsovu.supabase.co",
                port: "",
                pathname: "/storage/v1/object/public/**",
            },
            {
                protocol: "https",
                hostname: "sirxrcuwndrxhjmywucm.supabase.co",
                port: "",
                pathname: "/storage/v1/object/public/**",
            },
        ],
    },
};

export default nextConfig;
