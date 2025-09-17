import { Button } from "@/shared/ui/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/shadcn/Card";
import { Badge } from "@/shared/ui/shadcn/badge";
import {
  PenTool,
  Search,
  Zap,
  CheckCircle,
  BookOpen,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import HeroHeading from "@/shared/ui/HeroHeading";

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
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/write">
              <Button size="lg" className="px-8 py-3 text-lg">
                <PenTool className="w-5 h-5 mr-2" />글 작성하기
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                <BookOpen className="w-5 h-5 mr-2" />
                메모 둘러보기
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <PenTool className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-xl">스마트 에디터</CardTitle>
              <CardDescription>
                직관적이고 강력한 텍스트 에디터로 아이디어를 자유롭게 표현하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  리치 텍스트 편집
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  실시간 미리보기
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  마크다운 지원
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-xl">AI SEO 분석</CardTitle>
              <CardDescription>
                AI가 실시간으로 SEO 점수를 분석하고 개선 방안을 제안합니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  키워드 최적화
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  메타데이터 생성
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  가독성 분석
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-xl">빠른 작업</CardTitle>
              <CardDescription>
                효율적인 워크플로우로 아이디어를 빠르게 정리하고 공유하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  드래프트 저장
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  버전 관리
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  즉시 공유
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

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
