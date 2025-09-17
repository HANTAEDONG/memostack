import { Post } from "@prisma/client";
import { CreatePostData, UpdatePostData } from "./post.types";

export class PostAPI {
  private static async parseJsonSafe<T = unknown>(
    response: Response
  ): Promise<T | null> {
    try {
      const text = await response.text();
      if (!text) return null;
      return JSON.parse(text) as T;
    } catch {
      return null;
    }
  }

  private static async getErrorMessage(response: Response, fallback: string) {
    const data = await this.parseJsonSafe<{ message?: string }>(response);
    return data?.message || fallback;
  }
  // 단일 포스트 조회
  static async getPostById(id: string): Promise<Post> {
    const response = await fetch(`/api/posts/${id}`);
    if (!response.ok) {
      throw new Error(
        await this.getErrorMessage(response, "게시물을 불러오는데 실패했습니다")
      );
    }
    return response.json();
  }

  // 포스트 업데이트
  static async updatePost(id: string, data: UpdatePostData): Promise<Post> {
    const response = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "same-origin",
    });
    if (!response.ok) {
      throw new Error(
        await this.getErrorMessage(response, "업데이트에 실패했습니다")
      );
    }
    return response.json();
  }

  // 드래프트 목록 조회
  static async getDraftPosts(authorId: string): Promise<Post[]> {
    const response = await fetch(`/api/posts/draft?authorId=${authorId}`);
    if (!response.ok) {
      throw new Error(
        await this.getErrorMessage(
          response,
          "드래프트 목록을 불러오는데 실패했습니다"
        )
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
      throw new Error(
        await this.getErrorMessage(response, "드래프트 생성에 실패했습니다")
      );
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
      throw new Error(
        await this.getErrorMessage(response, "드래프트 발행에 실패했습니다")
      );
    }
    return response.json();
  }

  // 드래프트 삭제
  static async deleteDraft(id: string): Promise<boolean> {
    const response = await fetch(`/api/posts/draft/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(
        await this.getErrorMessage(response, "드래프트 삭제에 실패했습니다")
      );
    }
    return true;
  }
}
