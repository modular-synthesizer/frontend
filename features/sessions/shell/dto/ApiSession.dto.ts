import type { HttpError } from "../../../shared/http/http"
import { ko, ok, type Result } from "../../../shared/results/result"
import type { Session } from "../../core/data/Session.type"
import { toObjectId } from "../../../shared/data/ObjectId.type"

export type ApiSession = {
  token: string
  admin: boolean
  rights: { label: string }[]
  account: { id: string, username: string, email: string }
}

const isApiSession = (payload: unknown): payload is ApiSession => {
  if (typeof payload !== "object" || payload === null) return false
  const { token, account, rights } = payload as Partial<ApiSession>
  return typeof token === "string" && token !== ""
    && typeof account?.id === "string"
    && Array.isArray(rights)
}

const isRight = (payload: unknown): payload is { label: string } => {
  if (typeof payload !== "object" || payload === null) return false
  const { label } = payload as Partial<{ label: string }>
  return typeof label === "string"
}

const INVALID_SESSION: HttpError = { status: 500, key: "unknown", message: "unknown" }

type SessionParserFct = (payload: unknown) => Result<Session, HttpError>

export const parseSession: SessionParserFct = payload => {
  if (!isApiSession(payload)) return ko<Session, HttpError>(INVALID_SESSION)
  return ok<Session, HttpError>({
    token: payload.token,
    admin: payload.admin === true,
    rights: payload.rights.filter(isRight).map(r => r.label),
    account: {
      id: toObjectId(payload.account.id),
      username: payload.account.username,
      email: payload.account.email,
    },
  })
}
