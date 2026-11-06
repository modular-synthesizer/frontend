import axios from "axios"
import type { HttpError, HttpMethod, HttpRequest } from "./http"
import { ko, ok } from "../results/result"

export type Tokens = { auth_token: string, tab_id: string }

export type ToHttpErrorFct = (e: unknown) => HttpError

const UNKNOWN_ERROR = { status: 500, key: "unknown", message: "unknown" }

export const toHttpError: ToHttpErrorFct = e => {
  if (!axios.isAxiosError(e) || !e.response) return UNKNOWN_ERROR
  const { key, message } = e.response.data ?? { }
  return { status: e.response.status, key, message }
}

export type RequesterFactory = (tokens: () => Tokens) => HttpRequest

const parseBody = (method: HttpMethod, body: Record<string, any>, tokens: () => Tokens): Record<string, any> => {
  return (["get", "delete"].includes(method)) ? {} : { ...body, ...tokens() }
}
const parseParams = (method: HttpMethod, body: Record<string, any>, tokens: () => Tokens): Record<string, any> => {
  return (["get", "delete"].includes(method)) ? { ...body, ...tokens() } : {}
}

export const createRequester = (method: HttpMethod, request: typeof axios.request): RequesterFactory => tokens => (url, body) =>
  request({
    method,
    url,
    data: parseBody(method, body, tokens),
    params: parseParams(method, body, tokens)
  }).then(
    r => ok<unknown, HttpError>(r.data),
    e => ko<unknown, HttpError>(toHttpError(e))
  )

export const createPut: RequesterFactory = createRequester("put", axios.request)

export const createPost: RequesterFactory = createRequester("post", axios.request)

export const createGet: RequesterFactory = createRequester("get", axios.request)

export const createDelete: RequesterFactory = createRequester("delete", axios.request)
