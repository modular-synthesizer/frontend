import type { Result } from "../../../shared/results/result"

export type HttpError = { status: number, key?: string, message?: string }
export type HttpPut = (url: string, body: Record<string, unknown>) => Promise<Result<unknown, HttpError>>