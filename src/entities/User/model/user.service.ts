import { prisma } from "@/shared/lib/prisma";
import { User } from "@prisma/client";
import {
  ErrorHandler,
  ErrorType,
  AppError,
  Result,
  createResult,
  logger,
} from "@/shared/lib/error-handler";

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
  static async findByEmail(email: string): Promise<Result<User | null>> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (user) {
        logger.debug("사용자 조회 성공", { email, userId: user.id });
      }

      return createResult.success(user);
    } catch (error) {
      const appError = ErrorHandler.handlePrismaError(
        error,
        "이메일로 사용자 조회"
      );
      ErrorHandler.logError("이메일로 사용자 조회", error, { email });
      return createResult.error(appError);
    }
  }

  /**
   * ID로 사용자 조회
   */
  static async findById(id: string): Promise<Result<User | null>> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (user) {
        logger.debug("사용자 ID 조회 성공", { userId: id });
      }

      return createResult.success(user);
    } catch (error) {
      const appError = ErrorHandler.handlePrismaError(
        error,
        "ID로 사용자 조회"
      );
      ErrorHandler.logError("ID로 사용자 조회", error, { id });
      return createResult.error(appError);
    }
  }

  /**
   * 새 사용자 생성
   */
  static async create(userData: CreateUserData): Promise<Result<User>> {
    try {
      // 입력 유효성 검사
      if (!userData.email || !userData.email.includes("@")) {
        return createResult.error(
          new AppError(
            "올바른 이메일 주소를 입력해주세요",
            ErrorType.VALIDATION,
            "INVALID_EMAIL",
            400
          )
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

      return createResult.success(user);
    } catch (error) {
      const appError = ErrorHandler.handlePrismaError(error, "사용자 생성");
      ErrorHandler.logError("사용자 생성", error, userData);
      return createResult.error(appError);
    }
  }

  /**
   * 기존 사용자가 있으면 조회, 없으면 생성
   */
  static async findOrCreate(userData: CreateUserData): Promise<Result<User>> {
    try {
      // 먼저 기존 사용자 조회
      const existingUserResult = await this.findByEmail(userData.email);

      if (!existingUserResult.success) {
        return existingUserResult;
      }

      const existingUser = existingUserResult.data;

      if (existingUser) {
        // 기존 사용자가 있으면 정보 업데이트
        logger.debug("기존 사용자 발견, 정보 업데이트", {
          userId: existingUser.id,
        });

        return await this.update(existingUser.id, {
          name: userData.name,
          image: userData.image,
        });
      }

      // 기존 사용자가 없으면 새로 생성
      logger.debug("새 사용자 생성 필요", { email: userData.email });
      return await this.create(userData);
    } catch (error) {
      const appError = ErrorHandler.handlePrismaError(
        error,
        "사용자 찾기/생성"
      );
      ErrorHandler.logError("사용자 찾기/생성", error, userData);
      return createResult.error(appError);
    }
  }

  /**
   * 사용자 정보 업데이트
   */
  static async update(
    id: string,
    updateData: UpdateUserData
  ): Promise<Result<User>> {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: updateData,
      });

      logger.info("사용자 정보 업데이트 완료", {
        userId: id,
        updatedFields: Object.keys(updateData),
      });

      return createResult.success(user);
    } catch (error) {
      const appError = ErrorHandler.handlePrismaError(error, "사용자 업데이트");
      ErrorHandler.logError("사용자 업데이트", error, { id, updateData });
      return createResult.error(appError);
    }
  }

  /**
   * 사용자 삭제
   */
  static async delete(id: string): Promise<Result<boolean>> {
    try {
      await prisma.user.delete({
        where: { id },
      });

      logger.info("사용자 삭제 완료", { userId: id });
      return createResult.success(true);
    } catch (error) {
      const appError = ErrorHandler.handlePrismaError(error, "사용자 삭제");
      ErrorHandler.logError("사용자 삭제", error, { id });
      return createResult.error(appError);
    }
  }

  /**
   * 모든 사용자 조회 (관리자용)
   */
  static async findAll(limit: number = 50): Promise<Result<User[]>> {
    try {
      const users = await prisma.user.findMany({
        take: limit,
        orderBy: { createdAt: "desc" },
      });

      logger.debug("사용자 목록 조회 완료", { count: users.length });
      return createResult.success(users);
    } catch (error) {
      const appError = ErrorHandler.handlePrismaError(
        error,
        "사용자 목록 조회"
      );
      ErrorHandler.logError("사용자 목록 조회", error, { limit });
      return createResult.error(appError);
    }
  }
}
