import { prisma } from "@/shared/lib/prisma";
import { Post } from "@prisma/client";
import {
  ErrorHandler,
  createError,
  ApiResponse,
  ResponseBuilder,
} from "@/shared/lib/Error/error-handler";
import {
  PostWithAuthor,
  UpdatePostData,
  PostQueryOptions,
} from "../lib/post.types";
import { logger } from "@/shared/lib/Logger/logger";

// 드래프트 생성용 데이터 타입
export interface CreatePostDataWithAuth {
  title: string;
  content: string;
  category: string;
  authorId: string;
}

export class PostService {
  // ===== 드래프트 관련 메서드들 =====

  // 드래프트 생성
  static async createDraft(
    data: CreatePostDataWithAuth
  ): Promise<ApiResponse<Post>> {
    try {
      if (!data.authorId) {
        throw createError.validation("로그인이 필요합니다", "AUTH_REQUIRED");
      }

      const post = await prisma.post.create({
        data: {
          title: data.title,
          content: data.content,
          category: data.category || "general",
          status: "draft",
          authorId: data.authorId,
        },
      });

      logger.info("드래프트 생성 완료", {
        postId: post.id,
        authorId: post.authorId,
        title: post.title,
      });

      return ResponseBuilder.success(post);
    } catch (error) {
      return ResponseBuilder.error(ErrorHandler.handleError(error));
    }
  }

  // 드래프트 목록 조회
  static async getDraftPosts(authorId: string): Promise<ApiResponse<Post[]>> {
    try {
      if (!authorId) {
        throw createError.validation("로그인이 필요합니다", "AUTH_REQUIRED");
      }

      const posts = await prisma.post.findMany({
        where: {
          status: "draft",
          authorId: authorId,
        },
        orderBy: { updatedAt: "desc" },
      });

      logger.debug("드래프트 목록 조회 완료", {
        authorId,
        count: posts.length,
      });

      return ResponseBuilder.success(posts);
    } catch (error) {
      return ResponseBuilder.error(ErrorHandler.handleError(error));
    }
  }

  // 드래프트 업데이트
  static async updateDraft(
    id: string,
    data: Partial<CreatePostDataWithAuth>,
    authorId: string
  ): Promise<ApiResponse<Post>> {
    try {
      if (!authorId) {
        throw createError.validation("로그인이 필요합니다", "AUTH_REQUIRED");
      }

      // 먼저 해당 포스트가 존재하고 권한이 있는지 확인
      const existingPost = await prisma.post.findUnique({
        where: { id },
      });

      if (!existingPost) {
        throw createError.validation(
          "게시물을 찾을 수 없습니다",
          "POST_NOT_FOUND"
        );
      }

      if (existingPost.authorId !== authorId) {
        throw createError.auth(
          "게시물을 수정할 권한이 없습니다",
          "UNAUTHORIZED_UPDATE"
        );
      }

      if (existingPost.status !== "draft") {
        throw createError.validation(
          "드래프트 상태의 게시물만 수정할 수 있습니다",
          "NOT_DRAFT_STATUS"
        );
      }

      const post = await prisma.post.update({
        where: { id },
        data: {
          ...(data.title && { title: data.title.trim() }),
          ...(data.content && { content: data.content.trim() }),
          ...(data.category && { category: data.category }),
        },
      });

      logger.info("드래프트 업데이트 완료", {
        postId: id,
        authorId,
        updatedFields: Object.keys(data),
      });

      return ResponseBuilder.success(post);
    } catch (error) {
      return ResponseBuilder.error(ErrorHandler.handleError(error));
    }
  }

  // 드래프트 발행
  static async publishDraft(
    id: string,
    authorId: string
  ): Promise<ApiResponse<Post>> {
    try {
      // 먼저 해당 포스트가 존재하고 권한이 있는지 확인
      const existingPost = await prisma.post.findUnique({
        where: { id },
      });

      if (!existingPost) {
        throw createError.validation(
          "게시물을 찾을 수 없습니다",
          "POST_NOT_FOUND"
        );
      }

      if (existingPost.authorId !== authorId) {
        throw createError.auth(
          "게시물을 발행할 권한이 없습니다",
          "UNAUTHORIZED_PUBLISH"
        );
      }

      if (existingPost.status !== "draft") {
        throw createError.validation(
          "드래프트 상태의 게시물만 발행할 수 있습니다",
          "NOT_DRAFT_STATUS"
        );
      }

      const post = await prisma.post.update({
        where: { id },
        data: {
          status: "published",
        },
      });

      logger.info("드래프트 발행 완료", {
        postId: id,
        authorId,
        newStatus: "published",
      });

      return ResponseBuilder.success(post);
    } catch (error) {
      return ResponseBuilder.error(ErrorHandler.handleError(error));
    }
  }

  // 드래프트 삭제
  static async deleteDraft(
    id: string,
    authorId: string
  ): Promise<ApiResponse<boolean>> {
    try {
      // 먼저 해당 포스트가 존재하고 권한이 있는지 확인
      const existingPost = await prisma.post.findUnique({
        where: { id },
      });

      if (!existingPost) {
        throw createError.validation(
          "게시물을 찾을 수 없습니다",
          "POST_NOT_FOUND"
        );
      }

      if (existingPost.authorId !== authorId) {
        throw createError.auth(
          "게시물을 삭제할 권한이 없습니다",
          "UNAUTHORIZED_DELETE"
        );
      }

      if (existingPost.status !== "draft") {
        throw createError.validation(
          "드래프트 상태의 게시물만 삭제할 수 있습니다",
          "NOT_DRAFT_STATUS"
        );
      }

      await prisma.post.delete({
        where: { id },
      });

      logger.info("드래프트 삭제 완료", {
        postId: id,
        authorId,
      });

      return ResponseBuilder.success(true);
    } catch (error) {
      return ResponseBuilder.error(ErrorHandler.handleError(error));
    }
  }

  // ===== 일반 게시물 관련 메서드들 =====

  static async findById(id: string): Promise<ApiResponse<Post | null>> {
    try {
      const post = await prisma.post.findUnique({
        where: { id },
      });
      if (post) {
        logger.debug("게시물 조회 성공", {
          postId: id,
          authorId: post.authorId,
        });
      }
      return ResponseBuilder.success(post);
    } catch (error) {
      return ResponseBuilder.error(ErrorHandler.handleError(error));
    }
  }

  static async findByAuthor(
    authorId: string,
    options: PostQueryOptions = {}
  ): Promise<ApiResponse<Post[]>> {
    try {
      const {
        limit = 20,
        offset = 0,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = options;
      const posts = await prisma.post.findMany({
        where: { authorId },
        orderBy: { [sortBy]: sortOrder },
        take: limit,
        skip: offset,
      });
      logger.debug("사용자별 게시물 조회 완료", {
        authorId,
        count: posts.length,
        sortBy,
        sortOrder,
      });
      return ResponseBuilder.success(posts);
    } catch (error) {
      return ResponseBuilder.error(ErrorHandler.handleError(error));
    }
  }

  static async findAll(
    options: PostQueryOptions = {}
  ): Promise<ApiResponse<PostWithAuthor[]>> {
    try {
      const {
        limit = 20,
        offset = 0,
        sortBy = "updatedAt",
        sortOrder = "desc",
        filters = {},
      } = options;

      const whereConditions: {
        category?: string;
        status?: string;
        authorId?: string;
        OR?: Array<{
          title?: { contains: string; mode: "insensitive" };
          content?: { contains: string; mode: "insensitive" };
        }>;
      } = {};

      if (filters.category) {
        whereConditions.category = filters.category;
      }
      if (filters.status) {
        whereConditions.status = filters.status;
      }
      if (filters.authorId) {
        whereConditions.authorId = filters.authorId;
      }
      if (filters.search) {
        whereConditions.OR = [
          { title: { contains: filters.search, mode: "insensitive" } },
          { content: { contains: filters.search, mode: "insensitive" } },
        ];
      }
      const posts = await prisma.post.findMany({
        where: whereConditions,
        include: {
          author: true,
        },
        orderBy: { [sortBy]: sortOrder },
        take: limit,
        skip: offset,
      });

      logger.debug("전체 게시물 조회 완료", {
        count: posts.length,
        sortBy,
        sortOrder,
        filters,
      });

      return ResponseBuilder.success(posts);
    } catch (error) {
      return ResponseBuilder.error(ErrorHandler.handleError(error));
    }
  }

  static async update(
    id: string,
    updateData: UpdatePostData,
    authorId: string
  ): Promise<ApiResponse<Post>> {
    try {
      const existingPost = await prisma.post.findUnique({
        where: { id },
      });

      if (!existingPost) {
        throw createError.validation(
          "게시물을 찾을 수 없습니다",
          "POST_NOT_FOUND"
        );
      }

      if (existingPost.authorId !== authorId) {
        throw createError.auth(
          "게시물을 수정할 권한이 없습니다",
          "UNAUTHORIZED_UPDATE"
        );
      }

      const post = await prisma.post.update({
        where: { id },
        data: {
          ...(updateData.title && { title: updateData.title.trim() }),
          ...(updateData.content && { content: updateData.content.trim() }),
          ...(updateData.category && { category: updateData.category }),
          ...(updateData.status && { status: updateData.status }),
        },
      });

      logger.info("게시물 업데이트 완료", {
        postId: id,
        authorId,
        updatedFields: Object.keys(updateData),
      });

      return ResponseBuilder.success(post);
    } catch (error) {
      return ResponseBuilder.error(ErrorHandler.handleError(error));
    }
  }

  static async delete(
    id: string,
    authorId: string
  ): Promise<ApiResponse<boolean>> {
    try {
      // 먼저 게시물이 존재하고 작성자가 맞는지 확인
      const existingPost = await prisma.post.findUnique({
        where: { id },
      });

      if (!existingPost) {
        throw createError.validation(
          "게시물을 찾을 수 없습니다",
          "POST_NOT_FOUND"
        );
      }

      if (existingPost.authorId !== authorId) {
        throw createError.auth(
          "게시물을 삭제할 권한이 없습니다",
          "UNAUTHORIZED_DELETE"
        );
      }

      await prisma.post.delete({
        where: { id },
      });

      logger.info("게시물 삭제 완료", { postId: id, authorId });
      return ResponseBuilder.success(true);
    } catch (error) {
      return ResponseBuilder.error(ErrorHandler.handleError(error));
    }
  }

  static async search(
    query: string,
    options: PostQueryOptions = {}
  ): Promise<ApiResponse<PostWithAuthor[]>> {
    try {
      if (!query.trim()) {
        throw createError.validation(
          "검색어를 입력해주세요",
          "EMPTY_SEARCH_QUERY"
        );
      }

      const {
        limit = 20,
        offset = 0,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = options;

      const posts = await prisma.post.findMany({
        where: {
          OR: [
            { title: { contains: query.trim(), mode: "insensitive" } },
            { content: { contains: query.trim(), mode: "insensitive" } },
          ],
        },
        include: {
          author: true,
        },
        orderBy: { [sortBy]: sortOrder },
        take: limit,
        skip: offset,
      });

      logger.debug("게시물 검색 완료", {
        query: query.trim(),
        count: posts.length,
        sortBy,
        sortOrder,
      });

      return ResponseBuilder.success(posts);
    } catch (error) {
      return ResponseBuilder.error(ErrorHandler.handleError(error));
    }
  }

  static async count(authorId?: string): Promise<ApiResponse<number>> {
    try {
      const count = await prisma.post.count({
        where: authorId ? { authorId } : undefined,
      });
      return ResponseBuilder.success(count);
    } catch (error) {
      return ResponseBuilder.error(ErrorHandler.handleError(error));
    }
  }
}
