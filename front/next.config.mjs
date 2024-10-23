/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'online-chat.storage.yandexcloud.net',
      },
    ],
  },
};

export default nextConfig;
