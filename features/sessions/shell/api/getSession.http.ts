import type { Result } from "../../../shared/results/result"
import type { Session } from "../../core/data/Session.type"
import type { HttpError, HttpRequest } from "../../../shared/http/http"
import { parseSession } from "../dto/ApiSession.dto"
import { get } from "../../../shared/http/nuxt.http"

export type GetSessionFct = (token: string) => Promise<Result<Session, HttpError>>

export const makeGetSession = (get: HttpRequest): GetSessionFct => async token =>
  (await get(`/proxy/sessions/${token}`, {})).flatMap(parseSession)

export const getSession = makeGetSession(get)