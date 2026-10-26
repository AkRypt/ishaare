/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        minimumCacheTTL: 31536000,
        formats: ["image/avif", "image/webp"],
    },
};

export default nextConfig;
