import { logger } from "../Logger/logger";

export enum ErrorType {
  DATABASE = "DATABASE",
  VALIDATION = "VALIDATION",
  AUTH = "AUTH",
  NETWORK = "NETWORK",
  UNKNOWN = "UNKNOWN",
}

export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    code: string = "UNKNOWN_ERROR",
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    this.type = type;
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ErrorHandler {
  static async safeAsync<T>(
    fn: () => Promise<T>,
    context: string
  ): Promise<ApiResponse<T>> {
    try {
      const result = await fn();
      return ResponseBuilder.success(result);
    } catch (error) {
      const appError = this.handlePrismaError(error, context);
      this.logError(context, error);
      return ResponseBuilder.error(appError);
    }
  }
  static safe<T>(fn: () => T, context: string): ApiResponse<T> {
    try {
      const result = fn();
      return {
        success: true,
        data: result,
        error: null,
      } as ApiResponse<T>;
    } catch (error) {
      const appError = this.handlePrismaError(error, context);
      this.logError(context, error);
      return {
        success: false,
        error: appError,
      } as ApiResponse<T>;
    }
  }
  static logError(
    context: string,
    error: unknown,
    additionalData?: unknown
  ): void {
    logger.error(`${context} 실패`, error, additionalData);
  }
  static handlePrismaError(error: unknown, context: string): AppError {
    if (error && typeof error === "object" && "code" in error) {
      const prismaError = error as { code: string; message?: string };

      switch (prismaError.code) {
        case "P2002":
          return new AppError(
            "중복된 데이터입니다",
            ErrorType.VALIDATION,
            "DUPLICATE_ENTRY",
            400
          );
        case "P2025":
          return new AppError(
            "요청한 데이터를 찾을 수 없습니다",
            ErrorType.VALIDATION,
            "NOT_FOUND",
            404
          );
        case "P1001":
          return new AppError(
            "데이터베이스 연결에 실패했습니다",
            ErrorType.DATABASE,
            "CONNECTION_FAILED",
            503
          );
        default:
          return new AppError(
            "데이터베이스 오류가 발생했습니다",
            ErrorType.DATABASE,
            prismaError.code,
            500
          );
      }
    }
    return new AppError(
      `${context}에서 예상치 못한 오류가 발생했습니다`,
      ErrorType.UNKNOWN,
      "UNKNOWN_ERROR",
      500
    );
  }
}

export type ApiResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: AppError;
    };

export const ResponseBuilder = {
  success: <T>(data: T): ApiResponse<T> => ({ success: true, data }),
  error: <T>(error: AppError): ApiResponse<T> => ({ success: false, error }),
};
