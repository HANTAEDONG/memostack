import { prisma } from "@/shared/lib/prisma";
import { User } from "@prisma/client";
import {
  ErrorHandler,
  ErrorType,
  AppError,
  ApiResponse,
} from "@/shared/lib/Error/error-handler";
import { logger } from "@/shared/lib/Logger/logger";

export interface CreateUserData {
  email: string;
  name?: string | null;
  image?: string | null;
}

export interface UpdateUserData {
  name?: string | null;
  image?: string | null;
}

export class UserService {
  /**
   * 이메일로 사용자 조회
   */
  static async findByEmail(email: string): Promise<ApiResponse<User | null>> {
    return await ErrorHandler.safeAsync(async () => {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (user) {
        logger.debug("사용자 조회 성공", { email, userId: user.id });
      }

      return user;
    }, "이메일로 사용자 조회");
  }

  /**
   * ID로 사용자 조회
   */
  static async findById(id: string): Promise<ApiResponse<User | null>> {
    return await ErrorHandler.safeAsync(async () => {
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (user) {
        logger.debug("사용자 ID 조회 성공", { userId: id });
      }

      return user;
    }, "ID로 사용자 조회");
  }

  /**
   * 새 사용자 생성
   */
  static async create(userData: CreateUserData): Promise<ApiResponse<User>> {
    return await ErrorHandler.safeAsync(async () => {
      // 입력 유효성 검사
      if (!userData.email || !userData.email.includes("@")) {
        throw new AppError(
          "올바른 이메일 주소를 입력해주세요",
          ErrorType.VALIDATION,
          "INVALID_EMAIL",
          400
        );
      }

      const user = await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          image: userData.image,
        },
      });

      logger.info("새 사용자 생성 완료", {
        userId: user.id,
        email: user.email,
      });

      return user;
    }, "사용자 생성");
  }

  /**
   * 기존 사용자가 있으면 조회, 없으면 생성
   */
  static async findOrCreate(
    userData: CreateUserData
  ): Promise<ApiResponse<User>> {
    return await ErrorHandler.safeAsync(async () => {
      // 먼저 기존 사용자 조회
      const existingUserResult = await this.findByEmail(userData.email);

      if (!existingUserResult.success) {
        throw new AppError(
          existingUserResult.error.message,
          existingUserResult.error.type,
          existingUserResult.error.code,
          existingUserResult.error.statusCode
        );
      }

      const existingUser = existingUserResult.data;

      if (existingUser) {
        // 기존 사용자가 있으면 정보 업데이트
        logger.debug("기존 사용자 발견, 정보 업데이트", {
          userId: existingUser.id,
        });

        const updateResult = await this.update(existingUser.id, {
          name: userData.name,
          image: userData.image,
        });

        if (!updateResult.success) {
          throw new AppError(
            updateResult.error.message,
            updateResult.error.type,
            updateResult.error.code,
            updateResult.error.statusCode
          );
        }

        return updateResult.data;
      }

      // 기존 사용자가 없으면 새로 생성
      logger.debug("새 사용자 생성 필요", { email: userData.email });
      const createResult = await this.create(userData);

      if (!createResult.success) {
        throw new AppError(
          createResult.error.message,
          createResult.error.type,
          createResult.error.code,
          createResult.error.statusCode
        );
      }

      return createResult.data;
    }, "사용자 찾기/생성");
  }

  /**
   * 사용자 정보 업데이트
   */
  static async update(
    id: string,
    updateData: UpdateUserData
  ): Promise<ApiResponse<User>> {
    return await ErrorHandler.safeAsync(async () => {
      const user = await prisma.user.update({
        where: { id },
        data: updateData,
      });

      logger.info("사용자 정보 업데이트 완료", {
        userId: id,
        updatedFields: Object.keys(updateData),
      });

      return user;
    }, "사용자 업데이트");
  }

  /**
   * 사용자 삭제
   */
  static async delete(id: string): Promise<ApiResponse<boolean>> {
    return await ErrorHandler.safeAsync(async () => {
      await prisma.user.delete({
        where: { id },
      });

      logger.info("사용자 삭제 완료", { userId: id });
      return true;
    }, "사용자 삭제");
  }

  /**
   * 모든 사용자 조회 (관리자용)
   */
  static async findAll(limit: number = 50): Promise<ApiResponse<User[]>> {
    return await ErrorHandler.safeAsync(async () => {
      const users = await prisma.user.findMany({
        take: limit,
        orderBy: { createdAt: "desc" },
      });

      logger.debug("사용자 목록 조회 완료", { count: users.length });
      return users;
    }, "사용자 목록 조회");
  }
}
