import nextPWA from '@ducanh2912/next-pwa';
import { composePlugins, withNx } from '@nx/next';

const isProd = process.env.NODE_ENV === 'production';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH;

const withPWA = nextPWA({
  dest: 'public',
  register: true,
  workboxOptions: {
    skipWaiting: true,
  },
});

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  compress: isProd,
  basePath,
  reactStrictMode: true,
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
  ...(isProd ? [withPWA] : [])
];

export default composePlugins(...plugins)(nextConfig);
