export type AppErrorCode =
  | "USAGE_LIMIT_EXCEEDED"
  | "TEXT_TOO_LONG"
  | "INVALID_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "AI_OVERLOADED"
  | "GENERATION_FAILED"
  | "INVALID_DOCUMENT";

export class AppError extends Error {
  readonly code: AppErrorCode;

  constructor(code: AppErrorCode, message: string) {
    super(message);
    this.name = "AppError";
    this.code = code;
  }
}

export const HTTP_STATUS: Record<AppErrorCode, number> = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INVALID_REQUEST: 400,
  INVALID_DOCUMENT: 400,
  USAGE_LIMIT_EXCEEDED: 403,
  TEXT_TOO_LONG: 422,
  GENERATION_FAILED: 500,
  AI_OVERLOADED: 503,
};

export function createApiErrorResponse(error: unknown): {
  code: AppErrorCode;
  message: string;
  status: number;
} {
  if (error instanceof AppError) {
    return {
      code: error.code,
      message: error.message,
      status: HTTP_STATUS[error.code],
    };
  }

  return {
    code: "GENERATION_FAILED",
    message: "An unexpected error occurred. Please try again.",
    status: 500,
  };
}
