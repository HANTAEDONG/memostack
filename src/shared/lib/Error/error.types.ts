export enum ErrorType {
  DATABASE = "DATABASE",
  VALIDATION = "VALIDATION",
  AUTH = "AUTH",
  NETWORK = "NETWORK",
  BUSINESS = "BUSINESS",
  UNKNOWN = "UNKNOWN",
}

// 에러 심각도
export enum ErrorSeverity {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}
