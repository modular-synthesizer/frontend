import type { ListStatus } from "../core/data/ListStatus.type";
import type { LoadingState } from "../core/data/Loading.type";

export const INITIAL_LOADING: LoadingState = {
  synthesizer: "loading",
  modules: "loading",
  cables: "loading",
  generators: "loading",
}

export type LoadingStatusFct = (state: LoadingState) => ListStatus

/**
 * Returns a global status for the whole "set of asynchronous lists" that is the LoadingState.
 * @param state the whole set that is currently holding all the async lists.
 * @returns "failed" if one list is failed, if not  :"loading" if one is loading, if not "loaded"
 */
export const loadingStatus: LoadingStatusFct = state => {
  if (Object.values(state).some(v => v === "failed")) return "failed"
  if (Object.values(state).some(v => v === "loading")) return "loading"
  return "loaded"
}