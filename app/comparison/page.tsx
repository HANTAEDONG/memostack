import Link from "next/link";
import { Button } from "@/shared/ui/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/shadcn/Card";
import { Badge } from "@/shared/ui/shadcn/badge";
import { Clock, Zap, Database, Globe, ArrowRight } from "lucide-react";

export const metadata = {
  title: "SSG vs SSR 비교 - MemoStack",
  description:
    "Static Site Generation과 Server-Side Rendering의 차이점을 비교해보세요",
};

export default function ComparisonPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            SSG vs SSR 비교
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            같은 랜딩 페이지를 SSG와 SSR로 구현한 예시를 비교해보세요
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* SSG Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <Badge variant="secondary" className="w-fit mx-auto mb-4">
                <Zap className="w-4 h-4 mr-2" />
                Static Site Generation
              </Badge>
              <CardTitle className="text-2xl">SSG 버전</CardTitle>
              <CardDescription>
                빌드 시점에 HTML이 생성되어 정적 파일로 서빙됩니다
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  특징:
                </h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-center">
                    <Clock className="w-4 h-4 text-green-500 mr-2" />
                    빌드 시점 데이터만 반영
                  </li>
                  <li className="flex items-center">
                    <Globe className="w-4 h-4 text-green-500 mr-2" />
                    CDN 캐싱으로 빠른 로딩
                  </li>
                  <li className="flex items-center">
                    <Database className="w-4 h-4 text-green-500 mr-2" />
                    서버 리소스 사용량 최소
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  장점:
                </h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li>• 최고의 성능 (TTFB ~50ms)</li>
                  <li>• 비용 효율적</li>
                  <li>• 무제한 확장성</li>
                  <li>• SEO 최적화</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  단점:
                </h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li>• 실시간 데이터 제한</li>
                  <li>• 콘텐츠 변경 시 재배포 필요</li>
                </ul>
              </div>

              <Link href="/" className="block">
                <Button className="w-full">
                  SSG 버전 보기
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* SSR Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <Badge variant="secondary" className="w-fit mx-auto mb-4">
                <Database className="w-4 h-4 mr-2" />
                Server-Side Rendering
              </Badge>
              <CardTitle className="text-2xl">SSR 버전</CardTitle>
              <CardDescription>
                매 요청마다 서버에서 HTML을 생성하여 실시간 데이터를 반영합니다
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  특징:
                </h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-center">
                    <Clock className="w-4 h-4 text-blue-500 mr-2" />
                    실시간 데이터 반영
                  </li>
                  <li className="flex items-center">
                    <Database className="w-4 h-4 text-blue-500 mr-2" />
                    서버에서 동적 렌더링
                  </li>
                  <li className="flex items-center">
                    <Globe className="w-4 h-4 text-blue-500 mr-2" />
                    개인화된 콘텐츠
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  장점:
                </h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li>• 실시간 데이터 업데이트</li>
                  <li>• 개인화된 콘텐츠</li>
                  <li>• 동적 SEO 메타데이터</li>
                  <li>• 즉시 콘텐츠 반영</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  단점:
                </h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li>• 느린 로딩 속도 (TTFB ~200-500ms)</li>
                  <li>• 높은 서버 비용</li>
                  <li>• 확장성 제한</li>
                </ul>
              </div>

              <Link href="/page-ssr" className="block">
                <Button className="w-full">
                  SSR 버전 보기
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Performance Comparison */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">성능 비교</CardTitle>
            <CardDescription>
              실제 측정된 성능 지표를 비교해보세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold">지표</th>
                    <th className="text-center p-4 font-semibold">SSG</th>
                    <th className="text-center p-4 font-semibold">SSR</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4">TTFB (Time To First Byte)</td>
                    <td className="p-4 text-center text-green-600 font-semibold">
                      ~50ms
                    </td>
                    <td className="p-4 text-center text-orange-600 font-semibold">
                      ~200-500ms
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">LCP (Largest Contentful Paint)</td>
                    <td className="p-4 text-center text-green-600 font-semibold">
                      ~1.2s
                    </td>
                    <td className="p-4 text-center text-orange-600 font-semibold">
                      ~2.5s
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">서버 비용</td>
                    <td className="p-4 text-center text-green-600 font-semibold">
                      낮음
                    </td>
                    <td className="p-4 text-center text-red-600 font-semibold">
                      높음
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">확장성</td>
                    <td className="p-4 text-center text-green-600 font-semibold">
                      무제한
                    </td>
                    <td className="p-4 text-center text-orange-600 font-semibold">
                      제한적
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4">실시간성</td>
                    <td className="p-4 text-center text-orange-600 font-semibold">
                      낮음
                    </td>
                    <td className="p-4 text-center text-green-600 font-semibold">
                      높음
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* When to Use */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8">
            언제 어떤 방식을 사용할까요?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-green-600 dark:text-green-400">
                  SSG를 사용하세요
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li>• 블로그, 랜딩 페이지</li>
                  <li>• 제품 소개, 문서</li>
                  <li>• SEO가 중요한 페이지</li>
                  <li>• 글로벌 사용자 대상</li>
                  <li>• 비용 효율성이 중요한 경우</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-blue-600 dark:text-blue-400">
                  SSR을 사용하세요
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li>• 실시간 통계, 대시보드</li>
                  <li>• 개인화된 콘텐츠</li>
                  <li>• 사용자별 맞춤 페이지</li>
                  <li>• 동적 SEO 메타데이터</li>
                  <li>• A/B 테스트가 필요한 경우</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}





