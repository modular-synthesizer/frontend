import type { HttpError, HttpRequest } from "../../../shared/http/http"
import { del } from "../../../shared/http/nuxt.http"
import { ok, type Result } from "../../../shared/results/result"

export type DeleteSessionFct = (token: string) => Promise<Result<void, HttpError>>

export const makeDeleteSession = (del: HttpRequest): DeleteSessionFct => async token =>
  (await del(`/proxy/sessions/${token}`, {})).flatMap(() => ok<void, HttpError>(undefined))

export const deleteSession = makeDeleteSession(del)