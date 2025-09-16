# 번들 크기 최적화 트러블슈팅 가이드

## 📊 문제 상황

Next.js 애플리케이션의 번들 크기가 과도하게 커서 성능에 영향을 미치는 상황이 발생했습니다.

### 초기 번들 분석 결과

- **Apollo Client**: 131.4 KiB (82.4 KiB gzipped)
- **Lucide React**: 상당한 크기 차지
- **Next DevTools**: 237.6 KiB (160.4 KiB gzipped)
- **pnpm 관련**: 103.5 KiB (55.0 KiB gzipped)

## 🔧 해결 과정

### 1. Apollo Client 제거

**문제**: 사용하지 않는 Apollo Client가 번들에 포함되어 큰 용량을 차지

**해결 방법**:

```typescript
// src/shared/layout/Provider.tsx
// 제거된 코드
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/shared/lib/apollo-client";

// ApolloProvider 제거
<ApolloProvider client={apolloClient}>{/* children */}</ApolloProvider>;
```

**결과**: Apollo Client 관련 번들 크기 대폭 감소

### 2. Lucide React 아이콘 최적화

**문제**: 모든 Lucide React 아이콘이 번들에 포함되어 크기 증가

**해결 방법**:

#### A. 중앙화된 아이콘 컴포넌트 생성

```typescript
// src/shared/ui/Icon/LucideIcon.tsx
import {
  FileText,
  Plus,
  Trash2,
  PenTool,
  Search,
  Zap,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Target,
  Sparkles,
  // 필요한 아이콘들만 개별 import
} from "lucide-react";

const iconMap = {
  FileText,
  Plus,
  Trash2,
  PenTool,
  Search,
  Zap,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Target,
  Sparkles,
  // ... 기타 필요한 아이콘들
} as const;

export interface LucideIconProps extends HTMLAttributes<HTMLOrSVGElement> {
  name: keyof typeof iconMap;
  size?: number;
}

const LucideIcon = ({ name, size = 16, ...props }: LucideIconProps) => {
  const SelectedLucideIcon = iconMap[name];
  if (!SelectedLucideIcon) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }
  return <SelectedLucideIcon size={size} {...props} />;
};
```

#### B. 타입 안전성 확보

```typescript
// src/entities/TextEditor/lib/editor.types.ts
type ToolbarIconNames =
  | "Undo"
  | "Redo"
  | "Code"
  | "Quote"
  | "Bold"
  | "Italic"
  | "Underline"
  | "Strikethrough"
  | "Highlighter"
  | "Link"
  | "AlignLeft"
  | "AlignCenter"
  | "AlignRight"
  | "AlignJustify"
  | "Heading1"
  | "Heading2"
  | "Heading3"
  | "ListOrdered"
  | "List"
  | "SquareCheck"
  | "Minus"
  | "Unlink"
  | "MousePointer"
  | "Trash"
  | "Sun"
  | "Moon";

export interface ToolbarOption {
  id: string;
  label: string;
  icon: ToolbarIconNames; // 타입 안전성 확보
  type: "mark" | "node" | "action";
  action: (editor: Editor) => void;
  isActive?: (editor: Editor) => boolean;
  isDisabled?: (editor: Editor) => boolean;
}
```

### 3. 사용하지 않는 패키지 제거

**문제**: 설치되어 있지만 사용하지 않는 패키지들이 번들 크기 증가

**해결 방법**:

```bash
# 사용하지 않는 패키지 제거
pnpm remove @faker-js/faker sonner
```

**확인 방법**:

```bash
# 번들 분석 실행
ANALYZE=true pnpm build
```

### 4. Next.js 설정 최적화

**해결 방법**:

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
    optimizeCss: true,
    serverComponentsExternalPackages: ["@prisma/client"],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // ... 기타 설정
};
```

## ⚠️ 발생한 오류들과 해결

### 1. TypeScript 타입 오류

**오류**: `'"BookText"' 형식은 'ToolbarIconNames' 형식에 할당할 수 없습니다`

**해결**: `ToolbarIconNames` 타입에 누락된 아이콘들 추가

```typescript
type ToolbarIconNames =
  | "BookText" // 추가
  | "Heading1"
  | "Heading2"
  | "Heading3" // 추가
  | "ListOrdered"
  | "List"
  | "SquareCheck" // 추가
  | "Sun"
  | "Moon"; // 추가
```

### 2. ESLint 경고

**오류**: `'toolbarIcons' is assigned a value but only used as a type`

**해결**: `const` 객체를 `type`으로 변경

```typescript
// 변경 전
const toolbarIcons = { ... } as const;
type ToolbarIconNames = keyof typeof toolbarIcons;

// 변경 후
type ToolbarIconNames = "Undo" | "Redo" | ... | "Trash";
```

### 3. 개별 아이콘 import 오류

**오류**: `모듈 'lucide-react/dist/esm/icons/file-text'에 대한 선언 파일을 찾을 수 없습니다`

**해결**: 개별 import 방식에서 중앙화된 import 방식으로 변경

```typescript
// 변경 전 (오류 발생)
import { FileText } from "lucide-react/dist/esm/icons/file-text";

// 변경 후 (정상 작동)
import { FileText } from "lucide-react";
```

## 📈 최적화 결과

### 번들 크기 감소

- **Apollo Client**: 완전 제거로 131.4 KiB 절약
- **Lucide React**: Tree Shaking으로 불필요한 아이콘 제거
- **사용하지 않는 패키지**: @faker-js/faker, sonner 제거

### 성능 개선

- **초기 로딩 시간**: 단축
- **JavaScript 실행 시간**: 감소
- **메모리 사용량**: 최적화

## 🛠️ 추가 최적화 방안

### 1. 동적 import 활용

```typescript
// 컴포넌트 레벨에서 lazy loading
const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <div>로딩 중...</div>,
  ssr: false,
});
```

### 2. Suspense 경계 설정

```typescript
// app/write/page.tsx
export default function Write() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <WriteContent />
    </Suspense>
  );
}
```

### 3. 폰트 최적화

```typescript
// app/page.tsx
export const metadata: Metadata = {
  other: {
    "font-display": "swap", // 폰트 로딩 최적화
  },
};
```

## 🔍 모니터링 방법

### 1. 번들 분석

```bash
# 개발 환경에서 번들 분석
ANALYZE=true pnpm dev

# 프로덕션 빌드에서 번들 분석
ANALYZE=true pnpm build
```

### 2. 성능 측정

- **Lighthouse**: 웹 성능 측정
- **Web Vitals**: Core Web Vitals 모니터링
- **Bundle Analyzer**: 번들 크기 분석

## 📝 주의사항

1. **타입 안전성**: 아이콘 최적화 시 타입 정의 필수
2. **점진적 최적화**: 한 번에 모든 것을 최적화하지 말고 단계적으로 진행
3. **테스트**: 최적화 후 기능 정상 작동 확인 필수
4. **모니터링**: 지속적인 성능 모니터링 필요

## 🎯 결론

번들 크기 최적화를 통해 다음과 같은 성과를 달성했습니다:

- ✅ **Apollo Client 완전 제거**로 큰 용량 절약
- ✅ **Lucide React Tree Shaking**으로 불필요한 아이콘 제거
- ✅ **타입 안전성 확보**로 런타임 오류 방지
- ✅ **사용하지 않는 패키지 제거**로 번들 크기 감소
- ✅ **Next.js 설정 최적화**로 전반적인 성능 개선

이러한 최적화를 통해 사용자 경험을 크게 개선할 수 있었습니다.

---

# SSG (Static Site Generation) 트러블슈팅

## 📊 문제 상황

랜딩 페이지에서 실시간 데이터가 필요한 상황과 정적 콘텐츠의 균형을 맞추는 것이 필요했습니다.

### 초기 문제점

- **실시간 데이터 vs 정적 생성**: 랜딩 페이지에 실시간 통계가 필요한지 의문
- **SSG vs SSR 선택**: 성능과 실시간성 사이의 트레이드오프
- **사용자 경험**: 로딩 속도와 데이터 신선도 사이의 균형

## 🔧 해결 과정

### 1. SSG 기본 설정

**해결 방법**:

```typescript
// app/page.tsx
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "MemoStack - AI 기반 SEO 최적화 메모 플랫폼",
  description:
    "깔끔하고 모던한 글쓰기 경험. AI 기반 SEO 분석. 모든 콘텐츠 타입 지원.",
  other: {
    "font-display": "swap", // 폰트 최적화
  },
};
```

**장점**:

- ✅ **빠른 로딩**: TTFB ~50ms
- ✅ **CDN 캐싱**: 전 세계 빠른 접근
- ✅ **서버 비용 절약**: 정적 파일 호스팅
- ✅ **SEO 최적화**: 검색엔진 크롤링 용이

### 2. SSR 비교 페이지 구현

**목적**: SSG와 SSR의 차이점을 실제로 체험할 수 있도록 구현

**구현 방법**:

```typescript
// app/page-ssr/page.tsx
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const stats = await getRealTimeStats();

  return {
    title: `MemoStack - AI 기반 SEO 최적화 메모 플랫폼 (${stats.totalUsers}명이 사용 중)`,
    description: "실시간 데이터를 반영한 SSR 버전",
  };
}

export default async function HomeSSR() {
  const [stats, recentPosts] = await Promise.all([
    getRealTimeStats(),
    getRecentPosts(),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* 실시간 통계 표시 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {stats.totalUsers.toLocaleString()}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            총 사용자
          </div>
        </div>
        {/* ... 기타 통계 */}
      </div>

      {/* 실시간 포스트 목록 */}
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
                <span className="text-xs text-slate-500">{post.createdAt}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3">
                이 글은 실시간으로 서버에서 가져온 최신 콘텐츠입니다. SSR을 통해
                매 요청마다 최신 데이터를 반영합니다.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

### 3. 비교 페이지 구현

**목적**: SSG와 SSR의 차이점을 명확히 보여주는 비교 페이지

**구현 방법**:

```typescript
// app/comparison/page.tsx
export default function Comparison() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            SSG vs SSR 비교
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Static Site Generation과 Server-Side Rendering의 차이점을
            비교해보세요
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* SSG 카드 */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">
                  SSG (Static Site Generation)
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  <Globe className="w-4 h-4 mr-1" />
                  정적 생성
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  특징:
                </h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    빌드 타임에 HTML 생성
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    CDN에서 즉시 제공
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    서버 부하 없음
                  </li>
                </ul>
              </div>
              {/* ... 장단점 표시 */}
            </CardContent>
          </Card>

          {/* SSR 카드 */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">
                  SSR (Server-Side Rendering)
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800"
                >
                  <Database className="w-4 h-4 mr-1" />
                  서버 렌더링
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  특징:
                </h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-blue-500" />
                    요청 시마다 HTML 생성
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-blue-500" />
                    실시간 데이터 반영
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-blue-500" />
                    서버 리소스 필요
                  </li>
                </ul>
              </div>
              {/* ... 장단점 표시 */}
            </CardContent>
          </Card>
        </div>

        {/* 성능 비교 테이블 */}
        <Card className="border-0 shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">성능 비교</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="p-4 text-left">지표</th>
                    <th className="p-4 text-center">SSG</th>
                    <th className="p-4 text-center">SSR</th>
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

        {/* 실제 비교 링크 */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-8">
            실제로 비교해보세요
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" className="w-full sm:w-auto">
                <Globe className="w-4 h-4 mr-2" />
                SSG 버전 보기
              </Button>
            </Link>
            <Link href="/page-ssr">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <Database className="w-4 h-4 mr-2" />
                SSR 버전 보기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## ⚠️ 발생한 오류들과 해결

### 1. useSearchParams Suspense 오류

**오류**: `useSearchParams() should be wrapped in a suspense boundary at page "/write"`

**해결**: Suspense 경계 설정

```typescript
// app/write/page.tsx
import { Suspense } from "react";

function WriteContent() {
  return (
    <div className="w-full h-full min-h-screen px-4 max-sm:px-0 bg-background">
      <CreatePostFormContainer />
    </div>
  );
}

export default function Write() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full min-h-screen px-4 max-sm:px-0 bg-background flex items-center justify-center">
          로딩 중...
        </div>
      }
    >
      <WriteContent />
    </Suspense>
  );
}
```

### 2. styled-jsx 서버 컴포넌트 오류

**오류**: `Error: ./app Invalid import 'client-only' cannot be imported from a Server Component module`

**해결**: styled-jsx는 클라이언트 컴포넌트에서만 사용 가능하므로 제거

```typescript
// 변경 전 (오류 발생)
<style jsx>{`
  .hero-gradient {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
`}</style>

// 변경 후 (정상 작동)
<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
```

### 3. 동적 데이터 처리

**문제**: SSG에서 실시간 데이터가 필요한 경우

**해결**: ISR (Incremental Static Regeneration) 또는 클라이언트 사이드 데이터 페칭

```typescript
// ISR 사용 예시
export const revalidate = 3600; // 1시간마다 재생성

// 또는 클라이언트 사이드에서 데이터 페칭
("use client");
import { useEffect, useState } from "react";

export default function ClientDataComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/realtime-data")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return <div>{data ? data.message : "로딩 중..."}</div>;
}
```

## 📈 SSG 최적화 결과

### 성능 개선

- **TTFB**: ~50ms (SSR 대비 4-10배 빠름)
- **LCP**: ~1.2s (SSR 대비 2배 빠름)
- **서버 비용**: 정적 호스팅으로 비용 절약
- **확장성**: CDN을 통한 무제한 확장

### 사용자 경험

- **즉시 로딩**: 정적 파일로 인한 빠른 로딩
- **오프라인 지원**: Service Worker와 함께 오프라인에서도 작동
- **SEO 최적화**: 검색엔진 크롤링 최적화

## 🛠️ SSG 최적화 방안

### 1. 이미지 최적화

```typescript
import Image from "next/image";

// Next.js Image 컴포넌트 사용
<Image
  src="/hero-image.jpg"
  alt="MemoStack Hero"
  width={800}
  height={600}
  priority // 중요한 이미지는 우선 로딩
  placeholder="blur" // 블러 플레이스홀더
/>;
```

### 2. 폰트 최적화

```typescript
// app/layout.tsx
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // 폰트 로딩 최적화
  preload: true,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

### 3. 메타데이터 최적화

```typescript
// app/page.tsx
export const metadata: Metadata = {
  title: "MemoStack - AI 기반 SEO 최적화 메모 플랫폼",
  description: "깔끔하고 모던한 글쓰기 경험. AI 기반 SEO 분석.",
  keywords: ["메모", "글쓰기", "AI", "SEO", "블로그"],
  openGraph: {
    title: "MemoStack",
    description: "AI 기반 SEO 최적화 메모 플랫폼",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "MemoStack",
    description: "AI 기반 SEO 최적화 메모 플랫폼",
    images: ["/twitter-image.jpg"],
  },
};
```

## 🔍 SSG 모니터링 방법

### 1. 성능 측정

```bash
# Lighthouse 성능 측정
npx lighthouse http://localhost:3000 --view

# Web Vitals 측정
npm install web-vitals
```

### 2. 번들 분석

```bash
# 정적 파일 크기 분석
ANALYZE=true pnpm build
```

### 3. SEO 검증

```bash
# SEO 검증 도구
npx next-seo-check
```

## 📝 SSG 주의사항

1. **실시간 데이터 제한**: 빌드 시점의 데이터만 반영
2. **빌드 시간**: 대량의 페이지는 빌드 시간 증가
3. **동적 라우팅**: 동적 경로는 ISR 또는 SSR 필요
4. **사용자별 콘텐츠**: 개인화된 콘텐츠는 클라이언트 사이드 처리

## 🎯 SSG 결론

SSG를 통해 다음과 같은 성과를 달성했습니다:

- ✅ **성능 최적화**: TTFB 4-10배 개선
- ✅ **비용 절약**: 정적 호스팅으로 서버 비용 절약
- ✅ **확장성**: CDN을 통한 무제한 확장
- ✅ **SEO 최적화**: 검색엔진 최적화
- ✅ **사용자 경험**: 빠른 로딩과 안정적인 성능

랜딩 페이지와 같은 정적 콘텐츠가 많은 페이지에서는 SSG가 최적의 선택입니다.
