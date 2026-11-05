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

export const createPut = (tokens: () => Tokens): HttpRequest => createRequester(tokens, "put")

export const createPost = (tokens: () => Tokens): HttpRequest => createRequester(tokens, "post")

const createRequester = (tokens: () => Tokens, method: HttpMethod): HttpRequest => (url, body) =>
  axios.request({ method, url, data: { ...body, ...tokens() } })
    .then(
      r => ok<unknown, HttpError>(r.data),
      e => ko<unknown, HttpError>(toHttpError(e))
    )
