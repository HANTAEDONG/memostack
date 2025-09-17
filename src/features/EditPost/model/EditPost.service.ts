import { Post } from "@prisma/client";
import { PostAPI } from "@/entities/Post/lib/post.api";
import { CreatePostData, UpdatePostData } from "@/entities/Post/lib/post.types";

export class EditPostService {
  /**
   * 드래프트 업데이트 전 비즈니스 로직 검증
   */
  static validateUpdateData(data: UpdatePostData, userId?: string): void {
    if (!userId) {
      throw new Error("로그인이 필요합니다.");
    }

    const hasTitle = !!data.title?.trim();
    const hasContent = !!data.content?.trim();
    const hasCategory = typeof data.category !== "undefined";
    const hasStatus = typeof data.status !== "undefined";

    if (!hasTitle && !hasContent && !hasCategory && !hasStatus) {
      throw new Error("변경할 내용이 없습니다.");
    }
  }

  /**
   * 드래프트 업데이트 (비즈니스 로직 포함)
   */
  static async updateDraft(
    id: string,
    data: UpdatePostData,
    userId: string
  ): Promise<Post> {
    // 비즈니스 로직 검증
    this.validateUpdateData(data, userId);

    // API 호출
    return PostAPI.updatePost(id, data);
  }

  /**
   * 새 드래프트 생성 (비즈니스 로직 포함)
   */
  static async createDraft(
    data: CreatePostData,
    userId: string
  ): Promise<Post> {
    if (!userId) {
      throw new Error("로그인이 필요합니다.");
    }

    // 드래프트는 빈 제목과 내용으로 시작할 수 있음
    const draftData = {
      title: data.title || "",
      content: data.content || "",
      category: data.category || "general",
    };

    return PostAPI.createDraft(draftData);
  }

  /**
   * 드래프트 발행 (비즈니스 로직 포함)
   */
  static async publishDraft(id: string, userId: string): Promise<Post> {
    if (!userId) {
      throw new Error("로그인이 필요합니다.");
    }

    return PostAPI.publishDraft(id);
  }

  /**
   * 드래프트 삭제 (비즈니스 로직 포함)
   */
  static async deleteDraft(id: string, userId: string): Promise<boolean> {
    if (!userId) {
      throw new Error("로그인이 필요합니다.");
    }

    return PostAPI.deleteDraft(id);
  }
}
