import type { Result } from "../../../shared/results/result"
import type { LoadingState } from "../data/Loading.type"
import type { HttpError } from "../../../shared/http/http"

export type ReceivedLinks = { loading: LoadingState, plug: boolean }

export type ReceiveLinksFct = (state: LoadingState, links: Result<unknown, HttpError>) => ReceivedLinks

export const receiveLinks: ReceiveLinksFct = (state, links) => {
  const plug = links.ok && state.modules === "loaded"
  const loading: LoadingState = plug ? state : { ...state, cables: "failed" }
  return { loading, plug }
}