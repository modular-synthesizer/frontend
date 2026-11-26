import { describe, expect, it } from "vitest";
import type { LoadingState } from "../../core/data/Loading.type";
import { INITIAL_LOADING, loadingStatus } from "../Loading";
import { deepFreeze } from "../../../shared/__tests__/utils/deepFreeze";

describe("loadingStatus", () => {
  it("returns the correct global state for the initial loading", () => {
    expect(loadingStatus(INITIAL_LOADING)).toEqual("loading")
  })
  it("returns failed if one of the resources is failed among loaded resources", () => {
    const state: LoadingState = { cables: "failed", synthesizer: "loaded", modules: "loaded", generators: "loaded" }
    expect(loadingStatus(deepFreeze(state))).toEqual("failed")
  })
  it("returns failed if one of the resources is failed among loading resources", () => {
    const state: LoadingState = { cables: "loading", synthesizer: "loading", modules: "failed", generators: "loading" }
    expect(loadingStatus(deepFreeze(state))).toEqual("failed")
  })
  it("returns loading if a resource is loading among loaded resources", () => {
    const state: LoadingState = { cables: "loaded", synthesizer: "loading", modules: "loaded", generators: "loaded" }
    expect(loadingStatus(deepFreeze(state))).toEqual("loading")
  })
  it("returns loaded if all resources are loaded", () => {
    const state: LoadingState = { cables: "loaded", synthesizer: "loaded", modules: "loaded", generators: "loaded" }
    expect(loadingStatus(deepFreeze(state))).toEqual("loaded")
  })
})