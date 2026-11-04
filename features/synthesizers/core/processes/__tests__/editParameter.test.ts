import { describe, expect, it } from "vitest";
import { editParameter, previewParameter, receiveParameter } from "../editParameter.process";
import type { Parameter, ParameterChange } from "../../data/Parameter.type";
import type { Uuid } from "../../../../shared/data/Uuid.type";

const parameter: Parameter = {
  id: "test" as Uuid, moduleId: "m_id" as Uuid, value: 1, minimum: 0, maximum: 100, step: 1, default: 10
}

describe("previewParameter", () => {
  it("clamps the value up if it's below the minimum", () =>  {
    const change: ParameterChange = { kind: "drag", pixels: -1000 }
    expect(previewParameter(parameter, change)).toEqual(0)
  })
  it("clamps the value down if it's above the maximum", () => {
    const change: ParameterChange = { kind: "drag", pixels: 1000 }
    expect(previewParameter(parameter, change)).toEqual(100)
  })
  it("works with a wheel event", () => {
    const change: ParameterChange = { kind: "wheel", deltaY: -1, shift: false }
    expect(previewParameter(parameter, change)).toEqual(2)
  })
  it("works with a MIDI event", () => {
    const change: ParameterChange = { kind: "midi", amount: 64 }
    expect(previewParameter(parameter, change)).toEqual(50)
  })
  it("works with a reset event", () => {
    const change: ParameterChange = { kind: "reset" }
    expect(previewParameter(parameter, change)).toEqual(10)
  })
})

describe("editParameter", () => {
  const t = 1234
  const id = "id" as Uuid
  const moduleId = "mid" as Uuid
  const param = { id, moduleId, step: 1, minimum: 0, maximum: 100, default: 10, value: 10 }

  it("sends the save effect if the value has been changed", () => {
    expect(editParameter(param, { kind: "drag", pixels: 30 }, t)).toEqual({
      value: 13, effects: [
        { type: "synthesizers.parameter.save", id, moduleId, t, value: 13 }
      ]
    })
  })
  it("does not send the event if the value has not changed because it was clamped", () => {
    const parameter: Parameter = { ...param, value: 100 }
    expect(editParameter(parameter, { kind: "drag", pixels: 100 }, t)).toEqual({
      value: 100, effects: []
    })
  })
  it("does not send the event if the moduleId is null", () => {
    const parameter: Parameter = { ...param, moduleId: null }
    expect(editParameter(parameter, { kind: "drag", pixels: 100 }, t)).toEqual({
      value: 20, effects: []
    })
  })
  it("does not send the event if the value has not changed", () => {
    expect(editParameter(param, { kind: "drag", pixels: 0 }, t)).toEqual({
      value: 10, effects: []
    })
  })
  it("does not send a change event if a reset change is made on a parameter with the default value", () => {
    expect(editParameter(param, { kind: "reset"}, t)).toEqual({ value: 10, effects: [] })
  })
})

describe("receiveParameter", () => {
  it("returns the local version if it has been edited more recently", () => {
    const result = receiveParameter({ value: 0, t: 1 }, { value: 2, t: 0 })
    expect(result).toEqual({ value: 0, t: 1})
  })
  it("returns the remote one if is has been edited more recently", () => {
    const result = receiveParameter({ value: 2, t: 0 }, { value: 0, t: 1 })
    expect(result).toEqual({ value: 0, t: 1})
  })
})