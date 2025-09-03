"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Post } from "@prisma/client";

// API 호출 함수들
const fetchPostById = async (id: string): Promise<Post> => {
  const response = await fetch(`/api/posts/${id}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "게시물을 불러오는데 실패했습니다");
  }
  return response.json();
};

const updatePost = async ({
  id,
  data,
}: {
  id: string;
  data: { title: string; content: string; category: string };
}): Promise<Post> => {
  const response = await fetch(`/api/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "업데이트에 실패했습니다");
  }
  return response.json();
};

const fetchDraftPosts = async (authorId: string): Promise<Post[]> => {
  const response = await fetch(`/api/posts/draft?authorId=${authorId}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "드래프트 목록을 불러오는데 실패했습니다");
  }
  return response.json();
};

const createDraft = async (data: {
  title: string;
  content: string;
  category: string;
}): Promise<Post> => {
  const response = await fetch("/api/posts/draft", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "드래프트 생성에 실패했습니다");
  }
  return response.json();
};

const publishDraft = async (id: string): Promise<Post> => {
  const response = await fetch(`/api/posts/draft/${id}/publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "드래프트 발행에 실패했습니다");
  }
  return response.json();
};

const deleteDraft = async (id: string): Promise<boolean> => {
  const response = await fetch(`/api/posts/draft/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "드래프트 삭제에 실패했습니다");
  }
  return true;
};

// React Query 훅들
export const usePostById = (id?: string) => {
  return useQuery({
    queryKey: ["post", id],
    queryFn: () => fetchPostById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5분
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
    mutationFn: (data: { title: string; content: string; category: string }) =>
      updatePost({ id, data }),
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
    queryFn: () => fetchDraftPosts(authorId!),
    enabled: !!authorId,
    staleTime: 2 * 60 * 1000, // 2분
  });
};

// 새 드래프트 생성
export const useCreateDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDraft,
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
    mutationFn: publishDraft,
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
    mutationFn: deleteDraft,
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
