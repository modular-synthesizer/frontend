import { describe, expect, it } from "vitest";
import type { Parameter as LegacyParameter } from "~/types/modules/Parameter";
import { applyValue, makeEditParameter, previewParameterAdapter, toParameter } from "../parameter.adapter";
import type { ObjectId } from "../../../../shared/data/ObjectId.type";
import type { SynthesizersEffect } from "../../../core/data/Effect.type";
import type { RunEffectFct } from "../../../../shared/facts";
import type { AudioModule } from "~/types/Index";

function createParameter(): LegacyParameter {
  return { mod: { id: "mid" }, id: "test", value: 10, minimum: 0, maximum: 100, targets: [], step: 1, default: 10 } as unknown as LegacyParameter
}

describe("toParameter", () => {
  const param = { id: "id", value: 2, minimum: 0, maximum: 100, step: 1, default: 10 }

  it("converts correctly a legacy parameter linked to a saved module", () => {
    const parameter = { ...param, mod: { id: "test" } } as LegacyParameter
    expect(toParameter(parameter)).toEqual({
      id: "id" as ObjectId,
      moduleId: "test" as ObjectId,
      default: 10,
      value: 2,
      step: 1,
      minimum: 0,
      maximum: 100
    })
  })
  it("converts correctly a legacy parameter linked to a non-saved module", () => {
    const parameter = { ...param, mod: { id: "" } } as LegacyParameter
    expect(toParameter(parameter)).toEqual({
      id: "id" as ObjectId,
      moduleId: null,
      default: 10,
      value: 2,
      step: 1,
      minimum: 0,
      maximum: 100
    })
  })
})

describe("applyValue", () => {
  it("clamps the value when necessary", () => {
    const parameter = { id: "test", value: 10, minimum: 0, maximum: 100, targets: [] } as unknown as LegacyParameter
    applyValue(parameter, -10)
    expect(parameter.value).toEqual(0)
  })
})

describe("previewParameterAdapter", () => {
  it("does not accumulate successive previews of the same gesture", () => {
    const param = createParameter()
    previewParameterAdapter(param, { kind: "drag", pixels: 200 }, 10)
    previewParameterAdapter(param, { kind: "drag", pixels: 200 }, 10)
    expect(param.value).toEqual(30)
  })
})

describe("makeEditParameter", () => {
  const timer = () => 1234
  const createEditParameter = (t: () => number = timer) => {
    const effects: SynthesizersEffect[] = []
    const run: RunEffectFct<SynthesizersEffect> = async (effect) => { effects.push(effect) }
    return { effects, edit: makeEditParameter(run, t) }
  }

  it("correctly applies a change and a timestamp to the legacy parameter", async () => {
    const parameter = createParameter()
    const { edit, effects } = createEditParameter()
    await edit(parameter, { kind: "midi", amount: 64 }, 10)

    expect(parameter.value).toEqual(50)
    expect(parameter.t).toEqual(1234)

    expect(effects).toEqual([ { type: "synthesizers.parameter.save", t: 1234, value: 50, id: "test", moduleId: "mid" } ])
  })
  it("applies the same timestamp to both the effect and the parameter", async () => {
    const parameter = createParameter()
    let beginTime = 0
    const incrementalTimer = () => {
      beginTime += 1
      return beginTime
    }
    const { edit, effects } = createEditParameter(incrementalTimer)
    await edit(parameter, { kind: "midi", amount: 64 }, 10)

    expect(parameter.t).toEqual(1)
    expect(effects).toEqual([ { type: "synthesizers.parameter.save", t: 1, value: 50, id: "test", moduleId: "mid" } ])
  })
  it("does not change the timestamp of the legacy parameter if there is no change", async () => {
    const parameter = createParameter()
    const param = { ...parameter, t: 3214 }
    const { edit, effects } = createEditParameter()
    await edit(param, { kind: "drag", pixels: 1 }, 10)
    
    expect(param.value).toEqual(10)
    expect(param.t).toEqual(3214)

    expect(effects).toEqual([])
  })
  it("does not emit a change effect when getting back to the start of the gesture", async () => {
    const parameter = createParameter()
    const param = { ...parameter, t: 3214 }
    const { edit, effects } = createEditParameter()
    
    previewParameterAdapter(param, { kind: "drag", pixels: 200 }, 10)
    expect(param.value).toEqual(30)

    await edit(param, { kind: "drag", pixels: 0 }, 10)

    expect(param.value).toEqual(10)
    expect(param.t).toEqual(3214)

    expect(effects).toEqual([])
  })
  it("does not apply any effect if the parameter is linked to an unsaved module", async () => {
    const parameter = createParameter()
    const module = { id: "" } as AudioModule
    const param = { ...parameter, t: 3214, mod: module }
    const { edit, effects } = createEditParameter()
    await edit(param, { kind: "drag", pixels: 100 }, 20)

    expect(param.value).toEqual(30)
    expect(param.t).toEqual(3214)

    expect(effects).toEqual([])
  })
})
