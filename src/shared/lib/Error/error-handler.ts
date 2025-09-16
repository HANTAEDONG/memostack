import { logger } from "../Logger/logger";

// 간단한 에러 타입
export enum ErrorType {
  VALIDATION = "VALIDATION",
  AUTH = "AUTH",
  DATABASE = "DATABASE",
  NETWORK = "NETWORK",
  UNKNOWN = "UNKNOWN",
}

// 간단한 AppError 클래스
export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly code: string;
  public readonly statusCode: number;

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    code: string = "UNKNOWN_ERROR",
    statusCode: number = 500
  ) {
    super(message);
    this.type = type;
    this.code = code;
    this.statusCode = statusCode;
  }
}

// 간단한 에러 생성 함수들
export const createError = {
  validation: (message: string, code: string = "VALIDATION_ERROR") =>
    new AppError(message, ErrorType.VALIDATION, code, 400),

  auth: (message: string, code: string = "AUTH_ERROR") =>
    new AppError(message, ErrorType.AUTH, code, 401),

  database: (message: string, code: string = "DATABASE_ERROR") =>
    new AppError(message, ErrorType.DATABASE, code, 500),

  network: (message: string, code: string = "NETWORK_ERROR") =>
    new AppError(message, ErrorType.NETWORK, code, 503),
};

// 간단한 에러 핸들러
export class ErrorHandler {
  // 에러 로깅
  static logError(error: AppError, context?: string): void {
    logger.error(`${context || "Error"}: ${error.message}`, {
      type: error.type,
      code: error.code,
      statusCode: error.statusCode,
    });
  }

  // 안전한 비동기 실행
  static async safeAsync<T>(fn: () => Promise<T>, context: string): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      const appError = this.handleError(error);
      this.logError(appError, context);
      throw appError;
    }
  }

  // 안전한 동기 실행
  static safe<T>(fn: () => T, context: string): T {
    try {
      return fn();
    } catch (error) {
      const appError = this.handleError(error);
      this.logError(appError, context);
      throw appError;
    }
  }

  // 에러 변환
  static handleError(error: unknown): AppError {
    // 이미 AppError면 그대로 반환
    if (error instanceof AppError) {
      return error;
    }

    // Prisma 에러 처리
    if (error && typeof error === "object" && "code" in error) {
      const dbError = error as { code: string; message?: string };

      const prismaErrorMap: Record<string, { message: string; code: string }> =
        {
          P2002: { message: "중복된 데이터입니다", code: "DUPLICATE_ENTRY" },
          P2025: {
            message: "요청한 데이터를 찾을 수 없습니다",
            code: "NOT_FOUND",
          },
          P1001: {
            message: "데이터베이스 연결에 실패했습니다",
            code: "CONNECTION_FAILED",
          },
          P2003: {
            message: "참조 무결성 제약 조건 위반",
            code: "FOREIGN_KEY_CONSTRAINT",
          },
        };

      const mappedError = prismaErrorMap[dbError.code];
      if (mappedError) {
        return createError.database(mappedError.message, mappedError.code);
      }
    }

    // 일반 에러
    if (error instanceof Error) {
      return createError.database(error.message, "UNKNOWN_DB_ERROR");
    }

    // 알 수 없는 에러
    return createError.database(
      "예상치 못한 오류가 발생했습니다",
      "UNKNOWN_ERROR"
    );
  }
}

// API 응답 타입
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: AppError };

// 응답 빌더
export const ResponseBuilder = {
  success: <T>(data: T): ApiResponse<T> => ({ success: true, data }),
  error: <T>(error: AppError): ApiResponse<T> => ({ success: false, error }),
};

// 유틸리티 함수들
export const errorUtils = {
  // 사용자 친화적 메시지
  getUserFriendlyMessage: (error: AppError): string => {
    switch (error.type) {
      case ErrorType.VALIDATION:
        return error.message;
      case ErrorType.AUTH:
        return "로그인이 필요하거나 권한이 없습니다";
      case ErrorType.DATABASE:
        return "데이터 처리 중 오류가 발생했습니다";
      case ErrorType.NETWORK:
        return "네트워크 연결에 문제가 있습니다";
      default:
        return "오류가 발생했습니다. 잠시 후 다시 시도해주세요";
    }
  },

  // 에러 메시지 추출
  getErrorMessage: (error: unknown): string => {
    if (error instanceof AppError) return error.message;
    if (error instanceof Error) return error.message;
    return String(error);
  },
};
