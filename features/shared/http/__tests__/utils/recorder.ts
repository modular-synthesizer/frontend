import type { Result } from "../../../results/result";
import type { HttpError, HttpPut } from "../../http";

export const recorder = (response: Result<unknown, HttpError>) => {
  const calls: { url: string, body: unknown }[] = []
  const put: HttpPut = async (url, body) => { calls.push({ url, body }); return response }
  return { put, calls }
}