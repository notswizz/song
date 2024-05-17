/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    RAPIDAPI_KEY: process.env.RAPIDAPI_KEY,
  },
};

export default nextConfig;
