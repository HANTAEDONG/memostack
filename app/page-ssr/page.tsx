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
  ArrowRight,
  BookOpen,
  Target,
  Sparkles,
  Users,
  FileText,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

// SSR을 위한 동적 메타데이터 생성
export async function generateMetadata(): Promise<Metadata> {
  // 실시간 데이터 가져오기 (예시)
  const stats = await getRealTimeStats();

  return {
    title: `MemoStack - AI 기반 SEO 최적화 메모 플랫폼 (${stats.totalUsers}명이 사용 중)`,
    description: `깔끔하고 모던한 글쓰기 경험. AI 기반 SEO 분석. 현재 ${stats.totalPosts}개의 글이 작성되었습니다.`,
    keywords: ["메모", "SEO", "AI", "글쓰기", "블로그", "콘텐츠 최적화"],
    authors: [{ name: "MemoStack Team" }],
    openGraph: {
      title: `MemoStack - AI 기반 SEO 최적화 메모 플랫폼 (${stats.totalUsers}명 사용 중)`,
      description: `깔끔하고 모던한 글쓰기 경험. AI 기반 SEO 분석. ${stats.totalPosts}개 글 작성됨.`,
      type: "website",
      locale: "ko_KR",
    },
    twitter: {
      card: "summary_large_image",
      title: `MemoStack - AI 기반 SEO 최적화 메모 플랫폼 (${stats.totalUsers}명 사용 중)`,
      description: `깔끔하고 모던한 글쓰기 경험. AI 기반 SEO 분석. ${stats.totalPosts}개 글 작성됨.`,
    },
    other: {
      "font-display": "swap",
    },
  };
}

// SSR 강제 설정
export const dynamic = "force-dynamic";

// 실시간 통계 데이터 가져오기 (서버 사이드)
async function getRealTimeStats() {
  // 실제로는 데이터베이스에서 가져오지만, 예시로 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 100)); // 네트워크 지연 시뮬레이션

  return {
    totalUsers: Math.floor(Math.random() * 10000) + 5000, // 5000-15000 사이 랜덤
    totalPosts: Math.floor(Math.random() * 50000) + 20000, // 20000-70000 사이 랜덤
    activeUsers: Math.floor(Math.random() * 500) + 200, // 200-700 사이 랜덤
    postsToday: Math.floor(Math.random() * 100) + 50, // 50-150 사이 랜덤
  };
}

// 최근 작성된 글 가져오기 (서버 사이드)
async function getRecentPosts() {
  // 실제로는 데이터베이스에서 가져오지만, 예시로 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 150)); // 네트워크 지연 시뮬레이션

  const samplePosts = [
    {
      id: 1,
      title: "Next.js 15의 새로운 기능들",
      author: "김개발",
      createdAt: "2분 전",
    },
    {
      id: 2,
      title: "AI SEO 최적화 가이드",
      author: "이작가",
      createdAt: "5분 전",
    },
    {
      id: 3,
      title: "React 19 업데이트 정리",
      author: "박프론트",
      createdAt: "10분 전",
    },
    {
      id: 4,
      title: "TypeScript 고급 패턴",
      author: "최타입",
      createdAt: "15분 전",
    },
    {
      id: 5,
      title: "Tailwind CSS 팁과 트릭",
      author: "정스타일",
      createdAt: "20분 전",
    },
  ];

  return samplePosts.slice(0, Math.floor(Math.random() * 3) + 2); // 2-4개 랜덤 반환
}

export default async function HomeSSR() {
  // 서버에서 실시간 데이터 가져오기
  const [stats, recentPosts] = await Promise.all([
    getRealTimeStats(),
    getRecentPosts(),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          {/* Badge with Real-time Stats */}
          <div className="flex justify-center">
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              AI 기반 SEO 최적화 메모 플랫폼
              <span className="ml-2 text-green-600 dark:text-green-400">
                ({stats.totalUsers.toLocaleString()}명 사용 중)
              </span>
            </Badge>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
              스마트 글쓰기를 위한
              <br />
              <span className="text-blue-600 dark:text-blue-400">
                MemoStack
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              깔끔하고 모던한 글쓰기 경험. AI 기반 SEO 분석.
              <br />
              <span className="text-slate-500 dark:text-slate-400">
                모든 콘텐츠 타입 지원. 오픈소스. 영원히 무료.
              </span>
            </p>
          </div>

          {/* Real-time Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {stats.totalUsers.toLocaleString()}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                총 사용자
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-center mb-2">
                <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {stats.totalPosts.toLocaleString()}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                총 글
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {stats.activeUsers.toLocaleString()}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                활성 사용자
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {stats.postsToday.toLocaleString()}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                오늘 작성
              </div>
            </div>
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

        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              최근 작성된 글
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              실시간으로 업데이트되는 최신 콘텐츠를 확인해보세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <Card
                key={post.id}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="flex items-center justify-between">
                    <span>by {post.author}</span>
                    <span className="text-xs text-slate-500">
                      {post.createdAt}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3">
                    이 글은 실시간으로 서버에서 가져온 최신 콘텐츠입니다. SSR을
                    통해 매 요청마다 최신 데이터를 반영합니다.
                  </p>
                </CardContent>
              </Card>
            ))}
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

        {/* Final CTA with Real-time Stats */}
        <div className="mt-24 text-center bg-slate-900 dark:bg-slate-800 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">지금 바로 시작해보세요</h2>
          <p className="text-slate-300 mb-4 max-w-2xl mx-auto">
            무료로 가입하고 AI 기반 SEO 최적화 기능을 경험해보세요. 첫 번째 글을
            작성하는데 5분도 걸리지 않습니다.
          </p>
          <p className="text-slate-400 mb-8 text-sm">
            현재 {stats.totalUsers.toLocaleString()}명의 사용자가{" "}
            {stats.totalPosts.toLocaleString()}개의 글을 작성했습니다.
          </p>
          <Link href="/write">
            <Button
              size="lg"
              className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-3 text-lg"
            >
              <Target className="w-5 h-5 mr-2" />
              첫 글 작성하기
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
