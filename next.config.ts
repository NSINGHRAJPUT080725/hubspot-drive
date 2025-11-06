import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // User avatars / icons
      },
      {
        protocol: "https",
        hostname: "drive-thirdparty.googleusercontent.com", // File type icons
      },
      {
        protocol: "https",
        hostname: "ssl.gstatic.com", // Google static assets
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com", // Wildcard for other Google content sources
      },
      {
        protocol: "https",
        hostname: "*.google.com", // General Google assets (previews, etc.)
      },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
