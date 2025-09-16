import type { NextConfig } from "next";
import type { Configuration } from "webpack";

const nextConfig: NextConfig = {
  // 번들 분석을 위해 ESLint 비활성화
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 번들 최적화 설정
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
    // optimizeCss: true, // 임시 비활성화 - critters 의존성 문제
  },

  // CSS 최적화 설정
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // 성능 최적화
  poweredByHeader: false,

  // 번들 분석기 설정
  ...(process.env.ANALYZE === "true" && {
    webpack: (config: Configuration, { isServer }: { isServer: boolean }) => {
      if (!isServer) {
        config.plugins = config.plugins || [];
        config.plugins.push(
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          new (require("webpack-bundle-analyzer").BundleAnalyzerPlugin)({
            analyzerMode: "static",
            openAnalyzer: false,
          })
        );
      }
      return config;
    },
  }),
};

export default nextConfig;
