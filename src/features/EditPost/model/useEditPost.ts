"use client";

import { Post } from "@prisma/client";
import { useState, useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { usePostById, useUpdatePost } from "@/entities/Post/model/usePostQuery";
import { useAuth } from "@/shared/hooks/useAuth";
import { EditPostService } from "./editPost.service";
import debounce from "@/shared/lib/debounce";

export const useEditPost = () => {
  const searchParams = useSearchParams();
  const postId = searchParams?.get("id") || "";
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const {
    data: existingPost,
    isLoading: isPostLoading,
    error: postError,
  } = usePostById(postId || undefined);

  const updatePostMutation = useUpdatePost(postId);

  const [postData, setPostData] = useState<
    Omit<Post, "status" | "createdAt" | "updatedAt">
  >({
    id: postId,
    title: "",
    content: "",
    authorId: user?.id || "",
    category: "general",
  });

  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // 기존 포스트 데이터가 로드되면 상태 업데이트
  useEffect(() => {
    if (existingPost) {
      setPostData({
        id: existingPost.id,
        title: existingPost.title,
        content: existingPost.content,
        authorId: existingPost.authorId,
        category: existingPost.category,
      });
      console.log("기존 포스트 데이터 로딩 성공:", existingPost);
    } else if (postId && !isPostLoading && !postError) {
      // 포스트가 없으면 새 포스트로 초기화
      setPostData((prev) => ({ ...prev, id: postId }));
    }
  }, [existingPost, postId, isPostLoading, postError]);

  // 사용자 로그인 상태가 변경될 때 authorId 업데이트
  useEffect(() => {
    if (user?.id && user.id !== postData.authorId) {
      setPostData((prev) => ({ ...prev, authorId: user.id }));
    }
  }, [user?.id, postData.authorId]);

  // URL에서 ID가 변경될 때 새 포스트로 초기화
  useEffect(() => {
    if (!postId) {
      setPostData((prev) => ({
        ...prev,
        id: "",
        title: "",
        content: "",
        category: "general",
      }));
    }
  }, [postId]);

  // 비즈니스 로직을 서비스로 위임
  const updateDraft = useCallback(async () => {
    if (!user?.id) return false;

    try {
      const result = await EditPostService.updateDraft(
        postId,
        {
          title: postData.title,
          content: postData.content,
          category: postData.category,
        },
        user.id
      );

      setLastSaved(new Date());
      return !!result;
    } catch (error) {
      console.error("드래프트 업데이트 실패:", error);
      return false;
    }
  }, [postData.title, postData.content, postData.category, postId, user?.id]);

  // debounce 함수를 useMemo로 생성
  const debouncedAutoSave = useMemo(
    () =>
      debounce(() => {
        if (postData.title.trim() || postData.content.trim()) {
          updateDraft();
        }
      }, 2000),
    [postData.title, postData.content, updateDraft]
  );

  const setTitle = (title: string) => {
    setPostData((prev) => ({ ...prev, title }));
    debouncedAutoSave();
  };

  const setContent = (content: string) => {
    setPostData((prev) => ({ ...prev, content }));
    debouncedAutoSave();
  };

  const setCategory = (category: string) => {
    setPostData((prev) => ({ ...prev, category }));
    debouncedAutoSave();
  };

  return {
    postData,
    setTitle,
    setContent,
    setCategory,
    updateDraft,
    isSaving: updatePostMutation.isPending,
    lastSaved,
    saveError: updatePostMutation.error?.message || null,
    isLoading: isPostLoading,
    loadError: postError?.message || null,
    isAuthenticated,
    authLoading,
    user,
  };
};
