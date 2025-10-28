import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      }
    ],
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ['@mdxeditor/editor'],
  // webpack: (config) => {
  //   // this will override the experiments
  //   config.experiments = { ...config.experiments, topLevelAwait: true }
  //   // this will just update topLevelAwait property of config.experiments
  //   // config.experiments.topLevelAwait = true
  //   return config
  // },
  // turbopack: {
  //   // ...
  // },
};

export default nextConfig;
