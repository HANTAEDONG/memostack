import { prisma } from "@/shared/lib/prisma";
import { Post, User } from "@prisma/client";
import {
  ErrorHandler,
  ErrorType,
  AppError,
  Result,
  createResult,
  logger,
} from "@/shared/lib/Error/error-handler";

export interface CreatePostData {
  title: string;
  content: string;
  authorId: string;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
}

export interface PostWithAuthor extends Post {
  author: User;
}

export class PostService {
  static async create(postData: CreatePostData): Promise<Result<Post>> {
    try {
      if (!postData.title.trim()) {
        return createResult.error(
          new AppError(
            "제목을 입력해주세요",
            ErrorType.VALIDATION,
            "EMPTY_TITLE",
            400
          )
        );
      }
      if (!postData.content.trim()) {
        return createResult.error(
          new AppError(
            "내용을 입력해주세요",
            ErrorType.VALIDATION,
            "EMPTY_CONTENT",
            400
          )
        );
      }
      const post = await prisma.post.create({
        data: {
          title: postData.title.trim(),
          content: postData.content.trim(),
          authorId: postData.authorId,
        },
      });
      logger.info("새 게시물 생성 완료", {
        postId: post.id,
        authorId: post.authorId,
        title: post.title.substring(0, 50) + "...",
      });
      return createResult.success(post);
    } catch (error) {
      const appError = ErrorHandler.handlePrismaError(error, "게시물 생성");
      ErrorHandler.logError("게시물 생성", error, postData);
      return createResult.error(appError);
    }
  }
  static async findById(id: string): Promise<Result<PostWithAuthor | null>> {
    try {
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

      return createResult.success(post);
    } catch (error) {
      const appError = ErrorHandler.handlePrismaError(error, "게시물 조회");
      ErrorHandler.logError("게시물 조회", error, { id });
      return createResult.error(appError);
    }
  }

  static async findByAuthor(
    authorId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<Result<Post[]>> {
    try {
      const posts = await prisma.post.findMany({
        where: { authorId },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      });

      logger.debug("사용자별 게시물 조회 완료", {
        authorId,
        count: posts.length,
      });

      return createResult.success(posts);
    } catch (error) {
      const appError = ErrorHandler.handlePrismaError(
        error,
        "사용자별 게시물 조회"
      );
      ErrorHandler.logError("사용자별 게시물 조회", error, {
        authorId,
        limit,
        offset,
      });
      return createResult.error(appError);
    }
  }

  static async findAll(
    limit: number = 20,
    offset: number = 0
  ): Promise<Result<PostWithAuthor[]>> {
    try {
      const posts = await prisma.post.findMany({
        include: {
          author: true,
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      });
      logger.debug("전체 게시물 조회 완료", { count: posts.length });
      return createResult.success(posts);
    } catch (error) {
      const appError = ErrorHandler.handlePrismaError(
        error,
        "전체 게시물 조회"
      );
      ErrorHandler.logError("전체 게시물 조회", error, { limit, offset });
      return createResult.error(appError);
    }
  }

  static async update(
    id: string,
    updateData: UpdatePostData,
    authorId: string // 권한 확인용
  ): Promise<Result<Post>> {
    try {
      // 먼저 게시물이 존재하고 작성자가 맞는지 확인
      const existingPost = await prisma.post.findUnique({
        where: { id },
      });

      if (!existingPost) {
        return createResult.error(
          new AppError(
            "게시물을 찾을 수 없습니다",
            ErrorType.VALIDATION,
            "POST_NOT_FOUND",
            404
          )
        );
      }

      if (existingPost.authorId !== authorId) {
        return createResult.error(
          new AppError(
            "게시물을 수정할 권한이 없습니다",
            ErrorType.AUTH,
            "UNAUTHORIZED_UPDATE",
            403
          )
        );
      }

      const post = await prisma.post.update({
        where: { id },
        data: {
          ...(updateData.title && { title: updateData.title.trim() }),
          ...(updateData.content && { content: updateData.content.trim() }),
        },
      });

      logger.info("게시물 업데이트 완료", {
        postId: id,
        authorId,
        updatedFields: Object.keys(updateData),
      });

      return createResult.success(post);
    } catch (error) {
      const appError = ErrorHandler.handlePrismaError(error, "게시물 업데이트");
      ErrorHandler.logError("게시물 업데이트", error, {
        id,
        updateData,
        authorId,
      });
      return createResult.error(appError);
    }
  }

  static async delete(id: string, authorId: string): Promise<Result<boolean>> {
    try {
      // 먼저 게시물이 존재하고 작성자가 맞는지 확인
      const existingPost = await prisma.post.findUnique({
        where: { id },
      });

      if (!existingPost) {
        return createResult.error(
          new AppError(
            "게시물을 찾을 수 없습니다",
            ErrorType.VALIDATION,
            "POST_NOT_FOUND",
            404
          )
        );
      }

      if (existingPost.authorId !== authorId) {
        return createResult.error(
          new AppError(
            "게시물을 삭제할 권한이 없습니다",
            ErrorType.AUTH,
            "UNAUTHORIZED_DELETE",
            403
          )
        );
      }

      await prisma.post.delete({
        where: { id },
      });

      logger.info("게시물 삭제 완료", { postId: id, authorId });
      return createResult.success(true);
    } catch (error) {
      const appError = ErrorHandler.handlePrismaError(error, "게시물 삭제");
      ErrorHandler.logError("게시물 삭제", error, { id, authorId });
      return createResult.error(appError);
    }
  }

  static async search(
    query: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<Result<PostWithAuthor[]>> {
    try {
      if (!query.trim()) {
        return createResult.error(
          new AppError(
            "검색어를 입력해주세요",
            ErrorType.VALIDATION,
            "EMPTY_SEARCH_QUERY",
            400
          )
        );
      }

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
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      });

      logger.debug("게시물 검색 완료", {
        query: query.trim(),
        count: posts.length,
      });

      return createResult.success(posts);
    } catch (error) {
      const appError = ErrorHandler.handlePrismaError(error, "게시물 검색");
      ErrorHandler.logError("게시물 검색", error, { query, limit, offset });
      return createResult.error(appError);
    }
  }

  static async count(authorId?: string): Promise<Result<number>> {
    try {
      const count = await prisma.post.count({
        where: authorId ? { authorId } : undefined,
      });

      return createResult.success(count);
    } catch (error) {
      const appError = ErrorHandler.handlePrismaError(
        error,
        "게시물 개수 조회"
      );
      ErrorHandler.logError("게시물 개수 조회", error, { authorId });
      return createResult.error(appError);
    }
  }
}
