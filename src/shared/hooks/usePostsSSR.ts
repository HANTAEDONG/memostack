"use client";

import { useState, useEffect } from "react";
import { PostService } from "@/entities/Post";

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  category: string;
  status: string;
}

export const usePostsSSR = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        // API Route 대신 직접 PostService 호출
        const result = await PostService.findAll();

        if (!result.success) {
          setError(result.error.message);
          return;
        }

        // 데이터 변환
        const transformedPosts = (result.data || []).map((post) => ({
          id: post.id,
          title: post.title,
          content: post.content,
          authorId: post.authorId,
          createdAt: post.createdAt.toISOString(),
          updatedAt: post.updatedAt.toISOString(),
          category: post.category,
          status: post.status,
        }));

        setPosts(transformedPosts);
      } catch (err) {
        console.error("포스트 가져오기 실패:", err);
        setError("서버 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { posts, loading, error, refetch: () => window.location.reload() };
};
