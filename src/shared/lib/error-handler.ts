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

/**
 * 로거 인터페이스
 */
interface Logger {
  info: (message: string, data?: unknown) => void;
  error: (message: string, error?: Error | unknown, data?: unknown) => void;
  warn: (message: string, data?: unknown) => void;
  debug: (message: string, data?: unknown) => void;
}

/**
 * 개발환경용 콘솔 로거
 */
class ConsoleLogger implements Logger {
  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] ${level}: ${message}`;
  }

  info(message: string, data?: unknown): void {
    console.log(this.formatMessage("INFO", message), data || "");
  }

  error(message: string, error?: Error | unknown, data?: unknown): void {
    console.error(this.formatMessage("ERROR", message), {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      data,
    });
  }

  warn(message: string, data?: unknown): void {
    console.warn(this.formatMessage("WARN", message), data || "");
  }

  debug(message: string, data?: unknown): void {
    if (process.env.NODE_ENV === "development") {
      console.debug(this.formatMessage("DEBUG", message), data || "");
    }
  }
}

/**
 * 글로벌 로거 인스턴스
 */
export const logger: Logger = new ConsoleLogger();

/**
 * 에러 핸들러 유틸리티
 */
export class ErrorHandler {
  /**
   * 안전한 비동기 함수 실행
   */
  static async safeAsync<T>(
    fn: () => Promise<T>,
    context: string,
    fallbackValue: T | null = null
  ): Promise<T | null> {
    try {
      return await fn();
    } catch (error) {
      this.logError(context, error);
      return fallbackValue;
    }
  }

  /**
   * 안전한 동기 함수 실행
   */
  static safe<T>(
    fn: () => T,
    context: string,
    fallbackValue: T | null = null
  ): T | null {
    try {
      return fn();
    } catch (error) {
      this.logError(context, error);
      return fallbackValue;
    }
  }

  /**
   * 에러 로깅
   */
  static logError(
    context: string,
    error: unknown,
    additionalData?: unknown
  ): void {
    logger.error(`${context} 실패`, error, additionalData);
  }

  /**
   * Prisma 에러를 AppError로 변환
   */
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

/**
 * 결과 타입 (성공/실패를 명시적으로 처리)
 */
export type Result<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: AppError;
    };

/**
 * 결과 생성 헬퍼
 */
export const createResult = {
  success: <T>(data: T): Result<T> => ({ success: true, data }),
  error: <T>(error: AppError): Result<T> => ({ success: false, error }),
};
