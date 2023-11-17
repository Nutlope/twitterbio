const dotenvExpand = require("dotenv-expand");

dotenvExpand.expand({ parsed: { ...process.env } });

/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.clerk.dev",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "upcdn.io",
      },
    ],
  },
};

const withVercelToolbar = require("@vercel/toolbar/plugins/next")();
module.exports = withVercelToolbar(nextConfig);
