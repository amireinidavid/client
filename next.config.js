/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dcc1bsx86/**",
      },
    ],
    minimumCacheTTL: 60,
    deviceSizes: [64, 128, 256, 384, 512, 640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ["res.cloudinary.com", "res-console.cloudinary.com"],
  },
};

export default nextConfig;
