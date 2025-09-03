import { Post } from "@prisma/client";
import { CreatePostData, UpdatePostData } from "./post.types";

export class PostAPI {
  // 단일 포스트 조회
  static async getPostById(id: string): Promise<Post> {
    const response = await fetch(`/api/posts/${id}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "게시물을 불러오는데 실패했습니다");
    }
    return response.json();
  }

  // 포스트 업데이트
  static async updatePost(id: string, data: UpdatePostData): Promise<Post> {
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
  }

  // 드래프트 목록 조회
  static async getDraftPosts(authorId: string): Promise<Post[]> {
    const response = await fetch(`/api/posts/draft?authorId=${authorId}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || "드래프트 목록을 불러오는데 실패했습니다"
      );
    }
    return response.json();
  }

  // 새 드래프트 생성
  static async createDraft(data: CreatePostData): Promise<Post> {
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
  }

  // 드래프트 발행
  static async publishDraft(id: string): Promise<Post> {
    const response = await fetch(`/api/posts/draft/${id}/publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "드래프트 발행에 실패했습니다");
    }
    return response.json();
  }

  // 드래프트 삭제
  static async deleteDraft(id: string): Promise<boolean> {
    const response = await fetch(`/api/posts/draft/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "드래프트 삭제에 실패했습니다");
    }
    return true;
  }
}
