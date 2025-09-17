"use client";

import { Post } from "@prisma/client";
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { usePostById, useUpdatePost } from "@/entities/Post/model/usePostQuery";
import { useAuth } from "@/shared/hooks/useAuth";
import { EditPostService } from "./editPost.service";
import { Category } from "@/entities/Post/lib/category.types";
import debounce from "@/shared/lib/debounce";

export const useEditPost = (postId?: string) => {
  const searchParams = useSearchParams();
  const urlPostId = searchParams?.get("id") || "";
  const finalPostId = postId || urlPostId;
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const {
    data: existingPost,
    isLoading: isPostLoading,
    error: postError,
  } = usePostById(finalPostId || undefined);

  const updatePostMutation = useUpdatePost(finalPostId);

  const [postData, setPostData] = useState<
    Omit<Post, "status" | "createdAt" | "updatedAt">
  >({
    id: finalPostId,
    title: "",
    content: "",
    authorId: user?.id || "",
    category: "general",
  });

  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(true);
  const [permissionChecked, setPermissionChecked] = useState<boolean>(false);

  // 최신 입력값을 저장하는 ref (디바운스/비동기 저장 시 최신 값 보장)
  const postDataRef = useRef(postData);
  useEffect(() => {
    postDataRef.current = postData;
  }, [postData]);

  // 권한 검사 로직
  useEffect(() => {
    if (finalPostId && existingPost && user?.id && !permissionChecked) {
      const isOwner = existingPost.authorId === user.id;
      setHasPermission(isOwner);
      setPermissionChecked(true);

      if (!isOwner) {
        console.warn("권한 없음: 본인의 게시글이 아닙니다.", {
          postAuthorId: existingPost.authorId,
          currentUserId: user.id,
        });
      }
    } else if (finalPostId && !existingPost && !isPostLoading && !postError) {
      // 포스트가 존재하지 않는 경우 (새 포스트 작성)
      setHasPermission(true);
      setPermissionChecked(true);
    } else if (!finalPostId) {
      // 새 포스트 작성
      setHasPermission(true);
      setPermissionChecked(true);
    } else if (finalPostId && !user?.id && !authLoading) {
      // 로그인되지 않은 사용자가 기존 포스트에 접근하려는 경우
      setHasPermission(false);
      setPermissionChecked(true);
    }
  }, [
    existingPost,
    finalPostId,
    user?.id,
    isPostLoading,
    postError,
    permissionChecked,
    authLoading,
  ]);

  // 기존 포스트 데이터가 로드되면 상태 업데이트
  useEffect(() => {
    if (existingPost) {
      // 기존 게시글 데이터가 있을 때 상태 업데이트 (권한 검사와 별개)
      setPostData({
        id: existingPost.id,
        title: existingPost.title,
        content: existingPost.content,
        authorId: existingPost.authorId,
        category: existingPost.category,
      });
      console.log("기존 포스트 데이터 로딩 성공:", existingPost);
    } else if (finalPostId && !isPostLoading && !postError && !existingPost) {
      // 포스트 ID는 있지만 데이터가 없는 경우 (새로 생성된 드래프트 등)
      setPostData((prev) => ({ ...prev, id: finalPostId }));
    }
  }, [existingPost, finalPostId, isPostLoading, postError]);

  // 디버깅을 위한 로그 추가
  useEffect(() => {
    console.log("useEditPost 상태 변화:", {
      finalPostId,
      existingPost: existingPost
        ? {
            id: existingPost.id,
            title: existingPost.title,
            content: existingPost.content?.substring(0, 50) + "...",
            category: existingPost.category,
            authorId: existingPost.authorId,
          }
        : null,
      isPostLoading,
      postError: postError?.message,
      hasPermission,
      permissionChecked,
      user: user?.id,
    });
  }, [
    finalPostId,
    existingPost,
    isPostLoading,
    postError,
    hasPermission,
    permissionChecked,
    user?.id,
  ]);

  // 사용자 로그인 상태가 변경될 때 authorId 업데이트
  useEffect(() => {
    if (user?.id && user.id !== postData.authorId) {
      setPostData((prev) => ({ ...prev, authorId: user.id }));
    }
  }, [user?.id, postData.authorId]);

  useEffect(() => {
    const createNewDraft = async () => {
      if (
        !finalPostId &&
        user?.id &&
        isAuthenticated &&
        !authLoading &&
        !existingPost &&
        !isPostLoading
      ) {
        try {
          console.log("새 드래프트 생성 시작...");
          const newDraft = await EditPostService.createDraft(
            {
              title: "",
              content: "",
              category: "general",
            },
            user.id
          );

          if (newDraft?.id) {
            console.log("새 드래프트 생성 성공:", newDraft.id);
            // URL을 새 드래프트 ID로 업데이트
            const newUrl = `/write?id=${newDraft.id}`;
            window.history.replaceState({}, "", newUrl);
            // 상태 업데이트
            setPostData((prev) => ({
              ...prev,
              id: newDraft.id,
              authorId: user.id,
            }));
          }
        } catch (error) {
          console.error("새 드래프트 생성 실패:", error);
        }
      }
    };

    createNewDraft();
  }, [
    finalPostId,
    user?.id,
    isAuthenticated,
    authLoading,
    existingPost,
    isPostLoading,
  ]);

  // URL에서 ID가 변경될 때 새 포스트로 초기화 (새 글 작성 시에만)
  useEffect(() => {
    if (!finalPostId && !existingPost) {
      // 새 글 작성 시에만 초기화
      setPostData((prev) => ({
        ...prev,
        id: "",
        title: "",
        content: "",
        category: "general",
      }));
    }
  }, [finalPostId, existingPost]);

  // 비즈니스 로직을 서비스로 위임
  const updateDraft = useCallback(async () => {
    if (!user?.id) return false;
    if (!finalPostId) return false; // ID가 없으면 업데이트 호출 금지 (405 방지)

    try {
      const current = postDataRef.current;
      const result = await EditPostService.updateDraft(
        finalPostId,
        {
          title: current.title,
          content: current.content,
          category: (current.category || "general") as Category,
        },
        user.id
      );

      setLastSaved(new Date());
      return !!result;
    } catch (error) {
      console.error("드래프트 업데이트 실패:", error);
      return false;
    }
  }, [finalPostId, user?.id]);

  // debounce 함수를 useMemo로 생성
  const debouncedAutoSave = useMemo(
    () =>
      debounce(() => {
        if (!finalPostId) return; // 새 글 생성 전에는 자동 저장하지 않음
        const current = postDataRef.current;
        if (current.title.trim() || current.content.trim()) {
          updateDraft();
        }
      }, 1200),
    [updateDraft, finalPostId]
  );

  const setTitle = (title: string) => {
    setPostData((prev) => ({ ...prev, title }));
    debouncedAutoSave();
  };

  const setContent = (content: string) => {
    setPostData((prev) => ({ ...prev, content }));
    debouncedAutoSave();
  };

  const setCategory = (category: Category) => {
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
    hasPermission,
    permissionChecked,
  };
};
