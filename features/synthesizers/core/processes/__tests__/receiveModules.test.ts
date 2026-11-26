import { describe, expect, it } from "vitest";
import { deepFreeze } from "../../../../shared/__tests__/utils/deepFreeze";
import { ko, ok } from "../../../../shared/results/result";
import { receiveModules } from "../receiveModules.process";
import type { LoadingState } from "../../data/Loading.type";

describe("receiveModules", () => {
  const state: LoadingState = { synthesizer: "loading", modules: "loading", cables: "loading", generators: "loading" }
  const success = deepFreeze(ok(undefined))
  const failure = deepFreeze(ko({ status: 500 }))
  const frozen = deepFreeze(state)

  it("decides to instantiate nodes if both responses are ok", () => {
    const expected = { ...state, modules: "loading", generators: "loaded" }
    expect(receiveModules(frozen, success, success)).toEqual({ loading: expected, instantiate: true })
  })
  it("does not instantiate the nodes if the modules are failed", () => {
    const expected = { ...state, modules: "failed", generators: "loaded" }
    expect(receiveModules(frozen, failure, success)).toEqual({ loading: expected, instantiate: false })
  })
  it("does not instantiate the nodes if the generators are failed", () => {
    const expected = { ...state, modules: "failed", generators: "failed" }
    expect(receiveModules(frozen, success, failure)).toEqual({ loading: expected, instantiate: false })
  })
  it("does not instantiate the nodes if both lists are failed", () => {
    const expected = { ...state, modules: "failed", generators: "failed" }
    expect(receiveModules(frozen, failure, failure)).toEqual({ loading: expected, instantiate: false })
  })
})