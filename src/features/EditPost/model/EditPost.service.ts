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

    if (!data.title?.trim() && !data.content?.trim()) {
      throw new Error("제목이나 내용을 입력해주세요.");
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

    if (!data.title?.trim() || !data.content?.trim()) {
      throw new Error("제목과 내용을 모두 입력해주세요.");
    }

    return PostAPI.createDraft(data);
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
