import { describe, expect, it } from "vitest";
import { deepFreeze } from "../../../../shared/__tests__/utils/deepFreeze";
import { ko, ok } from "../../../../shared/results/result";
import { receiveResource } from "../receiveResource.process";
import type { LoadingState } from "../../data/Loading.type";

describe("receiveResource", () => {
  const state: LoadingState = { synthesizer: "loading", modules: "loading", cables: "loading", generators: "loading" }
  const frozenState = deepFreeze(state)

  it("returns the resource as loaded if the response is ok", () => {
    const result = receiveResource(frozenState, "generators", deepFreeze(ok(undefined)))
    expect(result).toEqual({
      synthesizer: "loading", modules: "loading", cables: "loading", generators: "loaded"
    })
    expect(result).not.toBe(frozenState)
  })
  it("returns the response as failed if the response is failed", () => {
    expect(receiveResource(frozenState, "modules", deepFreeze(ko({ status: 500 })))).toEqual({
      synthesizer: "loading", modules: "failed", cables: "loading", generators: "loading"
    })
  })
})