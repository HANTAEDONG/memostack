import { prisma } from "@/shared/lib/prisma";
import { Post } from "@prisma/client";
import {
  ErrorHandler,
  ErrorType,
  AppError,
  ApiResponse,
} from "@/shared/lib/Error/error-handler";
import {
  PostWithAuthor,
  UpdatePostData,
  PostQueryOptions,
} from "../lib/post.types";
import { logger } from "@/shared/lib/Logger/logger";

export class PostService {
  static async findById(
    id: string
  ): Promise<ApiResponse<PostWithAuthor | null>> {
    return await ErrorHandler.safeAsync(async () => {
      const post = await prisma.post.findUnique({
        where: { id },
        include: {
          author: true,
        },
      });
      if (post) {
        logger.debug("게시물 조회 성공", {
          postId: id,
          authorId: post.authorId,
        });
      }
      return post;
    }, "게시물 조회");
  }

  static async findByAuthor(
    authorId: string,
    options: PostQueryOptions = {}
  ): Promise<ApiResponse<Post[]>> {
    return await ErrorHandler.safeAsync(async () => {
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
      return posts;
    }, "사용자별 게시물 조회");
  }

  static async findAll(
    options: PostQueryOptions = {}
  ): Promise<ApiResponse<PostWithAuthor[]>> {
    return await ErrorHandler.safeAsync(async () => {
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

      return posts;
    }, "전체 게시물 조회");
  }

  static async update(
    id: string,
    updateData: UpdatePostData,
    authorId: string
  ): Promise<ApiResponse<Post>> {
    return await ErrorHandler.safeAsync(async () => {
      const existingPost = await prisma.post.findUnique({
        where: { id },
      });

      if (!existingPost) {
        throw new AppError(
          "게시물을 찾을 수 없습니다",
          ErrorType.VALIDATION,
          "POST_NOT_FOUND",
          404
        );
      }

      if (existingPost.authorId !== authorId) {
        throw new AppError(
          "게시물을 수정할 권한이 없습니다",
          ErrorType.AUTH,
          "UNAUTHORIZED_UPDATE",
          403
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

      return post;
    }, "게시물 업데이트");
  }

  static async delete(
    id: string,
    authorId: string
  ): Promise<ApiResponse<boolean>> {
    return await ErrorHandler.safeAsync(async () => {
      // 먼저 게시물이 존재하고 작성자가 맞는지 확인
      const existingPost = await prisma.post.findUnique({
        where: { id },
      });

      if (!existingPost) {
        throw new AppError(
          "게시물을 찾을 수 없습니다",
          ErrorType.VALIDATION,
          "POST_NOT_FOUND",
          404
        );
      }

      if (existingPost.authorId !== authorId) {
        throw new AppError(
          "게시물을 삭제할 권한이 없습니다",
          ErrorType.AUTH,
          "UNAUTHORIZED_DELETE",
          403
        );
      }

      await prisma.post.delete({
        where: { id },
      });

      logger.info("게시물 삭제 완료", { postId: id, authorId });
      return true;
    }, "게시물 삭제");
  }

  static async search(
    query: string,
    options: PostQueryOptions = {}
  ): Promise<ApiResponse<PostWithAuthor[]>> {
    return await ErrorHandler.safeAsync(async () => {
      if (!query.trim()) {
        throw new AppError(
          "검색어를 입력해주세요",
          ErrorType.VALIDATION,
          "EMPTY_SEARCH_QUERY",
          400
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

      return posts;
    }, "게시물 검색");
  }

  static async count(authorId?: string): Promise<ApiResponse<number>> {
    return await ErrorHandler.safeAsync(async () => {
      const count = await prisma.post.count({
        where: authorId ? { authorId } : undefined,
      });
      return count;
    }, "게시물 개수 조회");
  }
}
