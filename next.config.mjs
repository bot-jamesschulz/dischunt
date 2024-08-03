/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
        remotePatterns: [
          {
            hostname: "**",
          },
        ],
      },
    experimental: {
      missingSuspenseWithCSRBailout: false,
    },
};

export default nextConfig;
