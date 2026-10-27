import type { Result } from "../../../shared/results/result"

export type HttpError = { status: number, key?: string, message?: string }
export type HttpPut = (url: string, body: Record<string, unknown>) => Promise<Result<unknown, HttpError>>

export type AuthenticationGuard = (put: HttpPut, onSessionUnauthorized: () => void | Promise<void>) => HttpPut

export const withAuthenticationGuard: AuthenticationGuard = (put, onSessionUnauthorized) =>
  async (url, body) => {
    const response = await put(url, body)
    if (response.error()?.key === "auth_token") await onSessionUnauthorized()
    return response
  }