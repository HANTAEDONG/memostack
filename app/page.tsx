import { Badge } from "@/shared/ui/shadcn/badge";
import { Sparkles } from "lucide-react";
import { Metadata } from "next";
import HeroHeading from "@/shared/ui/HeroHeading";
import FeaturesGrid from "@/shared/ui/FeaturesGrid";
import CTAButtons from "@/shared/ui/CTAButtons";
import { auth } from "@/shared/lib/nextAuth";

export const metadata: Metadata = {
  title: "MemoStack - AI 기반 SEO 최적화 메모 플랫폼",
  description:
    "깔끔하고 모던한 글쓰기 경험. AI 기반 SEO 분석. 모든 콘텐츠 타입 지원.",
  keywords: ["메모", "SEO", "AI", "글쓰기", "블로그", "콘텐츠 최적화"],
  authors: [{ name: "MemoStack Team" }],
  openGraph: {
    title: "MemoStack - AI 기반 SEO 최적화 메모 플랫폼",
    description: "깔끔하고 모던한 글쓰기 경험. AI 기반 SEO 분석.",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "MemoStack - AI 기반 SEO 최적화 메모 플랫폼",
    description: "깔끔하고 모던한 글쓰기 경험. AI 기반 SEO 분석.",
  },
  other: {
    "font-display": "swap",
  },
};

export const dynamic = "force-static";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="flex justify-center">
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              AI 기반 SEO 최적화 메모 플랫폼
            </Badge>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <HeroHeading className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
              스마트 글쓰기를 위한
              <br />
              <span className="text-blue-600 dark:text-blue-400">
                빌딩 블록
              </span>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
                깔끔하고 모던한 글쓰기 경험. AI 기반 SEO 분석.
                <br />
              </p>
            </HeroHeading>
          </div>

          {/* CTA Buttons */}
          <CTAButtons />
        </div>

        {/* Features Grid */}
        <FeaturesGrid />

        {/* How it Works */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            간단한 3단계로 시작하세요
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-12">
            복잡한 설정 없이 바로 글을 작성하고 SEO를 최적화하세요
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold">글 작성</h3>
              <p className="text-slate-600 dark:text-slate-300">
                직관적인 에디터로 아이디어를 자유롭게 작성하세요
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold">SEO 분석</h3>
              <p className="text-slate-600 dark:text-slate-300">
                AI가 실시간으로 SEO 점수를 분석하고 개선점을 제안합니다
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold">최적화 완료</h3>
              <p className="text-slate-600 dark:text-slate-300">
                개선된 콘텐츠로 더 많은 독자에게 도달하세요
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
