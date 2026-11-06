import type { Result } from "../results/result"

export type HttpError = { status: number, key?: string, message?: string }

export type HttpRequest = (url: string, body: Record<string, unknown>) => Promise<Result<unknown, HttpError>>

export type HttpMethod = "put" | "post" | "get" | "delete"

export type AuthenticationGuard = (request: HttpRequest, onSessionUnauthorized: () => void | Promise<void>) => HttpRequest

export const withAuthenticationGuard: AuthenticationGuard = (request, onSessionUnauthorized) =>
  async (url, body) => {
    const response = await request(url, body)
    if (response.error()?.key === "auth_token") await onSessionUnauthorized()
    return response
  }