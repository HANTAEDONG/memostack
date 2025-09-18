"use client";

import CreatePostForm from "../ui/CreatePostForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Category } from "@/entities/Post/lib/category.types";
import { useEditPost } from "../model/useEditPost";

interface CreatePostFormContainerProps {
  postId?: string;
}

export default function CreatePostFormContainer({
  postId,
}: CreatePostFormContainerProps) {
  const router = useRouter();
  const {
    setContent,
    setTitle,
    setCategory,
    postData,
    updateDraft,
    publishNow,
    isSaving,
    lastSaved,
    saveError,
    isLoading,
    loadError,
    isAuthenticated,
    authLoading,
    hasPermission,
    permissionChecked,
  } = useEditPost(postId);

  // 권한이 없으면 대시보드로 리다이렉트
  useEffect(() => {
    if (permissionChecked && !hasPermission) {
      alert("본인의 게시글만 편집할 수 있습니다.");
      router.push("/dashboard");
    }
  }, [hasPermission, permissionChecked, router]);

  const handleManualSave = async (): Promise<boolean> => {
    return await updateDraft();
  };

  const handleClearDraft = () => {
    setTitle("");
    setContent("");
    setCategory("general");
  };

  const handlePublish = async () => {
    const ok = await publishNow();
    if (ok) {
      alert("작성 완료되었습니다.");
      // 대시보드로 이동
      router.push("/dashboard");
    }
  };

  // 권한이 없거나 로딩 중이면 로딩 표시
  if (!permissionChecked || !hasPermission) {
    return (
      <div className="w-full h-full min-h-screen px-4 max-sm:px-0 bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">
            {!permissionChecked ? "권한 확인 중..." : "접근 권한이 없습니다."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <CreatePostForm
      title={postData.title}
      content={postData.content}
      category={postData.category as Category}
      isSaving={isSaving}
      isLoading={isLoading}
      authLoading={authLoading}
      isAuthenticated={isAuthenticated}
      lastSaved={lastSaved || undefined}
      saveError={saveError || undefined}
      loadError={loadError || undefined}
      onTitleChange={setTitle}
      onContentChange={setContent}
      onCategoryChange={setCategory}
      onManualSave={handleManualSave}
      onClearDraft={handleClearDraft}
      onPublish={handlePublish}
    />
  );
}
