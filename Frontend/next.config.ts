import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["react-force-graph-2d", "3d-force-graph-vr", "d3-force"],
  // Use empty turbopack config to silence Next 16 warning; no custom webpack needed
  turbopack: {},
};

export default nextConfig;
