"use client";

import { useState, Suspense, lazy } from "react";
import { CreatePostFormProps } from "@/entities/Post/lib/post.types";
import CategorySelect from "@/entities/Post/ui/CategorySelect";

const Tiptap = lazy(() => import("@/entities/TextEditor/ui/Tiptap"));
const SEOAnalysisPanel = lazy(
  () => import("@/entities/TextEditor/ui/SEOAnalysisPanel")
);

export default function CreatePostForm({
  title,
  content,
  category,
  isSaving,
  isLoading,
  authLoading,
  isAuthenticated,
  lastSaved,
  saveError,
  loadError,
  onTitleChange,
  onContentChange,
  onCategoryChange,
}: CreatePostFormProps) {
  const [showSEOAnalysis, setShowSEOAnalysis] = useState(false);

  // 디바운스는 훅(useEditPost)에서 단일 책임으로 처리

  // Tiptap 로딩 fallback UI
  const TiptapFallback = () => (
    <div className="relative border border-gray-200 rounded-lg flex flex-col min-h-[calc(100vh-200px)] sm:min-h-[calc(100vh-200px)]">
      {/* 툴바 영역 - 로딩 상태 */}
      <div className="border-b border-gray-200 p-2">
        <div className="flex items-center gap-2">
          <div className="animate-pulse bg-gray-200 h-6 w-32 rounded"></div>
        </div>
      </div>

      {/* 제목 입력 영역 */}
      <div className="w-full h-14 pt-4 px-3 sm:px-5 focus:outline-none">
        <div className="animate-pulse bg-gray-200 h-10 w-full rounded"></div>
      </div>

      {/* 에디터 영역 - 로딩 상태 */}
      <div className="w-full h-full flex-1 p-0 focus:outline-none">
        <div className="min-h-[calc(100vh-300px)] p-3 sm:p-5">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <div className="text-gray-500">에디터를 로딩 중입니다...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (authLoading || isLoading) {
    return (
      <div className="w-full h-full min-h-screen flex items-center justify-center bg-background px-2 sm:px-4">
        <div className="text-center">
          <div className="text-lg">
            {authLoading ? "인증 확인 중..." : "포스트 데이터 불러오는 중..."}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="w-full h-full min-h-screen flex items-center justify-center bg-background px-2 sm:px-4">
        <div className="text-center">
          <div className="text-xl mb-4">로그인이 필요합니다</div>
          <div className="text-gray-600 mb-6">
            포스트를 작성하려면 먼저 로그인해주세요.
          </div>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            로그인하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-screen px-2 sm:px-4 bg-background">
      {/* 카테고리 선택 영역 */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">카테고리:</span>
          <CategorySelect
            value={category}
            onValueChange={onCategoryChange}
            disabled={isSaving}
          />
        </div>
      </div>

      <Suspense fallback={<TiptapFallback />}>
        <Tiptap
          title={title}
          content={content}
          onTitleChange={onTitleChange}
          onContentChange={onContentChange}
        />
      </Suspense>

      <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
          {isSaving && <div className="text-blue-600">자동 저장 중...</div>}
          {saveError && <div className="text-red-600">{saveError}</div>}
          {loadError && <div className="text-red-600">{loadError}</div>}
          {lastSaved && !isSaving && (
            <div className="text-green-600">
              마지막 저장: {lastSaved.toLocaleString("ko-KR")}
            </div>
          )}
        </div>
        <button
          onClick={() => setShowSEOAnalysis(!showSEOAnalysis)}
          className="px-3 py-2 sm:px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm w-full sm:w-auto"
        >
          {showSEOAnalysis ? "SEO 분석 숨기기" : "SEO 분석"}
        </button>
      </div>

      {showSEOAnalysis && (
        <div className="mt-4 sm:mt-6">
          <Suspense
            fallback={
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            }
          >
            <SEOAnalysisPanel content={content} title={title} />
          </Suspense>
        </div>
      )}
    </div>
  );
}
