import type { HttpError } from "../../../shared/http/http"
import { ko, ok, type Result } from "../../../shared/results/result"

export type ApiMember = { id: string, account_id: string, username: string, type: string }

export type ApiSynthesizer = { id: string, name: string, members: ApiMember[] }

export type ParseSynthesizersFct = (payload: unknown) => Result<ApiSynthesizer[], HttpError>

const INVALID_PAYLOAD: HttpError = { status: 500, key: "unknown", message: "unknown" }

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null

const isString = (value: unknown): value is string => typeof value === "string"

const toMember = (candidate: unknown): ApiMember[] => {
  if (!isObject(candidate)) return []
  const { id, account_id, username, type } = candidate
  if (!isString(id) || !isString(account_id) || !isString(username) || !isString(type)) return []
  return [ { id, account_id, username, type } ]
}

const toSynthesizer = (candidate: unknown): ApiSynthesizer[] => {
  if (!isObject(candidate)) return []
  const { id, name, members } = candidate
  if (!isString(id) || id === "" || !isString(name) || !Array.isArray(members)) return []
  return [ { id, name, members: members.flatMap(toMember) } ]
}

export const parseSynthesizers: ParseSynthesizersFct = payload =>
  Array.isArray(payload)
    ? ok<ApiSynthesizer[], HttpError>(payload.flatMap(toSynthesizer))
    : ko<ApiSynthesizer[], HttpError>(INVALID_PAYLOAD)