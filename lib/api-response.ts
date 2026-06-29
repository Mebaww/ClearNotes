import { NextResponse } from "next/server";
import { createApiErrorResponse, type AppErrorCode, HTTP_STATUS } from "./errors";

/**
 * Returns a standard success response envelope.
 *
 * @example
 * return ok({ noteId });
 * // → { success: true, noteId: "…" }
 */
export function ok<T extends Record<string, unknown>>(data: T): NextResponse {
  return NextResponse.json({ success: true, ...data });
}

/**
 * Returns a standard error response envelope with an explicit code + status.
 * Prefer `handleError()` in catch blocks; use this only when constructing
 * errors directly in route logic (e.g. failed auth check).
 */
export function apiErr(
  code: AppErrorCode,
  message: string
): NextResponse {
  return NextResponse.json(
    { success: false, error: { code, message } },
    { status: HTTP_STATUS[code] }
  );
}

/**
 * Catch-all error handler for API route catch blocks.
 * Reads `error.code` from AppError instances — never does string matching.
 * Falls back to GENERATION_FAILED for unknown errors.
 *
 * @example
 * } catch (error) {
 *   return handleError(error);
 * }
 */
export function handleError(error: unknown): NextResponse {
  const { code, message, status } = createApiErrorResponse(error);
  return NextResponse.json(
    { success: false, error: { code, message } },
    { status }
  );
}
