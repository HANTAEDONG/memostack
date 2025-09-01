import { supabase, Post, CreatePostData } from "@/shared/lib/supabase";
import {
  ErrorHandler,
  AppError,
  ErrorType,
  ApiResponse,
} from "@/shared/lib/Error/error-handler";

export interface CreatePostDataWithAuth extends CreatePostData {
  authorId: string;
}

export class DraftPostService {
  static async createDraft(
    data: CreatePostDataWithAuth
  ): Promise<ApiResponse<Post>> {
    return ErrorHandler.safeAsync(async () => {
      if (!data.authorId) {
        throw new AppError(
          "로그인이 필요합니다",
          ErrorType.VALIDATION,
          "AUTH_REQUIRED",
          401
        );
      }

      const { data: post, error } = await supabase
        .from("Post")
        .insert({
          title: data.title,
          content: data.content,
          category: data.category || "general",
          status: "draft",
          authorId: data.authorId, // ✅ authorId 설정
        })
        .select()
        .single();

      if (error) {
        throw error; // ErrorHandler가 처리하도록 직접 throw
      }

      return post;
    }, "DraftPostService.createDraft");
  }

  // 사용자의 draft post 목록 조회 (현재 로그인한 사용자만)
  static async getDraftPosts(authorId: string): Promise<ApiResponse<Post[]>> {
    return ErrorHandler.safeAsync(async () => {
      if (!authorId) {
        throw new AppError(
          "로그인이 필요합니다",
          ErrorType.VALIDATION,
          "AUTH_REQUIRED",
          401
        );
      }

      const { data: posts, error } = await supabase
        .from("Post")
        .select("*")
        .eq("status", "draft")
        .eq("authorId", authorId) // ✅ 현재 사용자의 포스트만
        .order("updatedAt", { ascending: false });

      if (error) {
        throw error; // ErrorHandler가 처리하도록 직접 throw
      }

      return posts || [];
    }, "DraftPostService.getDraftPosts");
  }

  // Draft post 업데이트 (권한 체크 포함)
  static async updateDraft(
    id: string,
    data: Partial<CreatePostData>,
    authorId: string
  ): Promise<ApiResponse<Post>> {
    return ErrorHandler.safeAsync(async () => {
      console.log("🔍 UPDATE 요청 파라미터:", {
        id,
        authorId,
        data,
      });

      if (!authorId) {
        throw new AppError(
          "로그인이 필요합니다",
          ErrorType.VALIDATION,
          "AUTH_REQUIRED",
          401
        );
      }

      // 먼저 해당 포스트가 존재하는지 확인
      const { data: existingPost, error: selectError } = await supabase
        .from("Post")
        .select("*")
        .eq("id", id)
        .single();

      console.log("📋 기존 포스트 조회 결과:", {
        existingPost,
        selectError,
        requestedId: id,
        currentAuthorId: authorId,
      });

      if (selectError) {
        console.error("❌ 포스트 조회 실패:", selectError);
        throw new AppError(
          `포스트 조회 실패: ${selectError.message}`,
          ErrorType.VALIDATION,
          "POST_SELECT_FAILED",
          404
        );
      }

      if (!existingPost) {
        throw new AppError(
          `ID '${id}'에 해당하는 포스트를 찾을 수 없습니다`,
          ErrorType.VALIDATION,
          "POST_NOT_FOUND",
          404
        );
      }

      if (existingPost.authorId !== authorId) {
        throw new AppError(
          `이 포스트를 수정할 권한이 없습니다. (포스트 작성자: ${existingPost.authorId}, 현재 사용자: ${authorId})`,
          ErrorType.VALIDATION,
          "NO_PERMISSION",
          403
        );
      }
      const { data: updatedPosts, error } = await supabase
        .from("Post")
        .update({
          title: data.title,
          content: data.content,
          category: data.category,
        })
        .eq("id", id)
        .eq("authorId", authorId)
        .select();

      console.log("📊 Supabase UPDATE 결과:", {
        updatedPosts,
        error,
        postsLength: updatedPosts?.length,
        hasError: !!error,
        authorId,
        postId: id,
      });

      if (error) {
        console.error("❌ Supabase 에러:", error);
        throw error;
      }

      if (!updatedPosts || updatedPosts.length === 0) {
        throw new AppError(
          "포스트를 찾을 수 없거나 수정 권한이 없습니다. ID와 권한을 확인해주세요.",
          ErrorType.VALIDATION,
          "POST_NOT_FOUND_OR_NO_PERMISSION",
          404
        );
      }

      console.log("✅ 업데이트 성공:", updatedPosts[0]);
      return updatedPosts[0];
    }, "DraftPostService.updateDraft");
  }

  static async publishDraft(id: string): Promise<ApiResponse<Post>> {
    return ErrorHandler.safeAsync(async () => {
      const { data: post, error } = await supabase
        .from("Post")
        .update({
          status: "published",
          updatedAt: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("status", "draft")
        .select()
        .single();

      if (error) {
        throw error; // ErrorHandler가 처리하도록 직접 throw
      }

      return post;
    }, "DraftPostService.publishDraft");
  }

  // Draft post 삭제
  static async deleteDraft(id: string): Promise<ApiResponse<boolean>> {
    return ErrorHandler.safeAsync(async () => {
      const { error } = await supabase
        .from("Post")
        .delete()
        .eq("id", id)
        .eq("status", "draft");

      if (error) {
        throw error; // ErrorHandler가 처리하도록 직접 throw
      }

      return true;
    }, "DraftPostService.deleteDraft");
  }
}
