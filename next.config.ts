import type { NextConfig } from "next";
import path from "node:path";

const config: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname),
  async redirects() {
    // /products retired — funnel to the new /coverage atlas (preserves SEO).
    return [{ source: "/products", destination: "/coverage", permanent: true }];
  },
};

export default config;
