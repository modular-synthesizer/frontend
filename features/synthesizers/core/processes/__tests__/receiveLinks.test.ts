import { describe, expect, it } from "vitest";
import type { LoadingState } from "../../data/Loading.type";
import { deepFreeze } from "../../../../shared/__tests__/utils/deepFreeze";
import { receiveLinks } from "../receiveLinks.process";
import { ko, ok } from "../../../../shared/results/result";

describe("receiveLinks", () => {
  it("plugs the cables if the response is ok and the modules are loaded", () => {
    const state: LoadingState = deepFreeze({ synthesizer: "loading", modules: "loaded", cables: "loading", generators: "failed" })
    expect(receiveLinks(state, deepFreeze(ok(undefined)))).toEqual({ loading: state, plug: true })
  })
  it("does not plug the cables if the response is ko, even with loaded modules", () => {
    const state: LoadingState = deepFreeze({ synthesizer: "loading", modules: "loaded", cables: "loading", generators: "failed" })
    expect(receiveLinks(state, deepFreeze(ko({ status: 500 })))).toEqual({ loading: { ...state, cables: "failed" }, plug: false })
  })
  it("does not plug the cables if the modules are failed, even with a success response", () => {
    const state: LoadingState = deepFreeze({ synthesizer: "loading", modules: "failed", cables: "loading", generators: "failed" })
    expect(receiveLinks(state, deepFreeze(ok(undefined)))).toEqual({ loading: { ...state, cables: "failed" }, plug: false })
  })
})