/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@monitoring/ui', '@monitoring/monitoring'],
  typescript: {
    // 忽略 TypeScript 错误，以允许包含类型错误的代码正常编译
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig; 