/** @type {import("next").NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    if (!isProd) return []; // pas de CSP en dev (évite l'erreur unsafe-eval)
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; connect-src 'self';" }
        ]
      }
    ];
  }
};
export default nextConfig;
