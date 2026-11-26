import type { Result } from "../../../shared/results/result";
import type { LoadedResource, LoadingState } from "../data/Loading.type";
import type { HttpError } from "../../../shared/http/http";

export type ReceiveResourceFct = (state: LoadingState, resource: LoadedResource, response: Result<unknown, HttpError>) => LoadingState

export const receiveResource: ReceiveResourceFct = (state, resource, response) => {
  return { ...state, [resource]: response.ok ? "loaded" : "failed" }
}