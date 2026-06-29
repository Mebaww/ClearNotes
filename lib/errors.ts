/**
 * Exhaustive union of every allowed API error code.
 * Adding a new code here automatically enforces it through HTTP_STATUS and
 * any switch statement that covers this type.
 */
export type AppErrorCode =
  | "USAGE_LIMIT_EXCEEDED"
  | "TEXT_TOO_LONG"
  | "INVALID_REQUEST"
  | "UNAUTHORIZED"
  | "AI_OVERLOADED"
  | "GENERATION_FAILED"
  | "INVALID_DOCUMENT";

/**
 * Typed application error. All service-layer errors MUST use this class so
 * that API routes can reliably read `error.code` without string matching.
 */
export class AppError extends Error {
  readonly code: AppErrorCode;

  constructor(code: AppErrorCode, message: string) {
    super(message);
    this.name = "AppError";
    this.code = code;
  }
}

/**
 * Maps every AppErrorCode to its canonical HTTP status code.
 * The Record type ensures every code in the union is covered — a missing
 * entry is a compile-time error.
 */
export const HTTP_STATUS: Record<AppErrorCode, number> = {
  UNAUTHORIZED: 401,
  INVALID_REQUEST: 400,
  INVALID_DOCUMENT: 400,
  USAGE_LIMIT_EXCEEDED: 403,
  TEXT_TOO_LONG: 422,
  GENERATION_FAILED: 500,
  AI_OVERLOADED: 503,
};

/**
 * Converts any thrown value into the standard API error shape.
 * - AppError  → uses its own code + message
 * - anything else → GENERATION_FAILED / 500
 *
 * This is the ONLY place that translates raw errors into API responses.
 * API routes must call this; they must NOT do string matching themselves.
 */
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

  // Unknown errors — never expose internal details to the client
  return {
    code: "GENERATION_FAILED",
    message: "An unexpected error occurred. Please try again.",
    status: 500,
  };
}
