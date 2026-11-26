import type { Result } from "../../../shared/results/result"
import type { LoadingState } from "../data/Loading.type"
import type { HttpError } from "../../../shared/http/http"
import { receiveResource } from "./receiveResource.process"

export type ReceivedModules = { loading: LoadingState, instantiate: boolean }
export type ReceiveModulesFct = (
  state: LoadingState,
  modules: Result<unknown, HttpError>,
  generators: Result<unknown, HttpError>,
) => ReceivedModules

export const receiveModules: ReceiveModulesFct = (state, modules, generators) => {
  const instantiate = modules.ok && generators.ok
  const withGenerators = receiveResource(state, "generators", generators)
  const loading: LoadingState = instantiate ? withGenerators : { ...withGenerators, modules: "failed" }
  return { loading, instantiate }
}