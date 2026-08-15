/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // jsdom (via isomorphic-dompurify) must stay external or Vercel prerender
  // looks for a missing default-stylesheet.css under .next/server/browser/
  experimental: {
    serverComponentsExternalPackages: ["isomorphic-dompurify", "jsdom"],
  },
}

export default nextConfig
