import type { Result } from "../../../results/result";
import type { HttpError, HttpRequest } from "../../http";

export const recorder = (response: Result<unknown, HttpError>) => {
  const calls: { url: string, body: unknown }[] = []
  const put: HttpRequest = async (url, body) => { calls.push({ url, body }); return response }
  return { put, calls }
}