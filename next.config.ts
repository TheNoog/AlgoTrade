import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // typescript: {
  //   ignoreBuildErrors: true, // It's generally better to fix these errors
  // },
  // eslint: {
  //   ignoreDuringBuilds: true, // It's generally better to fix linting issues
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
