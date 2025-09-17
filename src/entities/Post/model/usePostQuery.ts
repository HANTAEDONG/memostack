"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Post } from "@prisma/client";
import { PostAPI } from "../lib/post.api";
import { UpdatePostData } from "../lib/post.types";

// React Query 훅들
export const usePostById = (id?: string) => {
  return useQuery({
    queryKey: ["post", id],
    queryFn: () => PostAPI.getPostById(id!),
    enabled: !!id,
    // 목록 → 상세 재진입 시 항상 최신화
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    staleTime: 0,
    retry: (failureCount, error) => {
      // 404 에러는 재시도하지 않음
      if (
        error instanceof Error &&
        error.message.includes("찾을 수 없습니다")
      ) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

export const useUpdatePost = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePostData) => PostAPI.updatePost(id, data),
    onSuccess: (updatedPost) => {
      // 캐시 업데이트
      queryClient.setQueryData(["post", id], updatedPost);
      // 관련 쿼리들 무효화
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      console.error("포스트 업데이트 실패:", error);
    },
  });
};

// 드래프트 포스트 목록 조회
export const useDraftPosts = (authorId?: string) => {
  return useQuery({
    queryKey: ["draft-posts", authorId],
    queryFn: () => PostAPI.getDraftPosts(authorId!),
    enabled: !!authorId,
    staleTime: 2 * 60 * 1000, // 2분
  });
};

// 새 드래프트 생성
export const useCreateDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: PostAPI.createDraft,
    onSuccess: () => {
      // 드래프트 목록 무효화
      queryClient.invalidateQueries({ queryKey: ["draft-posts"] });
    },
  });
};

// 드래프트 발행
export const usePublishDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: PostAPI.publishDraft,
    onSuccess: (publishedPost) => {
      // 드래프트 목록에서 제거
      queryClient.setQueryData(
        ["draft-posts"],
        (oldData: Post[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.filter((post) => post.id !== publishedPost.id);
        }
      );
      // 게시물 목록 무효화
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

// 드래프트 삭제
export const useDeleteDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: PostAPI.deleteDraft,
    onSuccess: (_, deletedId) => {
      // 드래프트 목록에서 제거
      queryClient.setQueryData(
        ["draft-posts"],
        (oldData: Post[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.filter((post) => post.id !== deletedId);
        }
      );
    },
  });
};
