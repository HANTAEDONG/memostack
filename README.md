# MemoStack

MemoStack은 Next.js와 Tiptap을 기반으로 한 리치 텍스트 메모 관리 애플리케이션입니다.

## 🚀 시작하기

### 개발 서버 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 시작
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어서 결과를 확인하세요.

## 🛠️ 기술 스택

- **Framework**: Next.js 15 (App Router)
- **UI**: Tailwind CSS, Shadcn/ui
- **Rich Text Editor**: Tiptap
- **Authentication**: NextAuth.js
- **Database**: Supabase
- **TypeScript**: 타입 안전성

## 📦 스크립트

```bash
# 개발 서버 시작
pnpm dev

# 빌드
pnpm build

# 프로덕션 서버 시작
pnpm start

# 린트
pnpm lint
```

## 🌟 주요 특징

- **리치 텍스트 에디터**: Tiptap 기반의 강력한 메모 편집기
- **실시간 저장**: 메모 내용 자동 저장
- **반응형 UI**: 모바일과 데스크톱 모두 지원
- **다크모드**: 테마 토글 지원
- **사이드바**: 접을 수 있는 네비게이션

## 📁 프로젝트 구조

```
memostack/
├── app/                   # Next.js App Router
├── src/                   # 소스 코드
│   ├── components/        # 공통 컴포넌트
│   ├── entities/          # 비즈니스 엔티티
│   ├── features/          # 기능별 컴포넌트
│   ├── shared/            # 공유 유틸리티
│   └── widgets/           # 위젯 컴포넌트
├── public/                # 정적 파일
└── package.json           # 의존성 관리
```
