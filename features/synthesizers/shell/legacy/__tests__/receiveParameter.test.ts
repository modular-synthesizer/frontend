import { describe, expect, it } from "vitest"
import type { Parameter } from "~/types/modules/Parameter"
import { receiveParameterAdapter } from "../receiveParameter.adapter"

describe("receiveParameter", () => {
  const param = { targets: [], mod: { id: "test" } }
  it("applies a more recent update to a local parameter", () => {
    const parameter = { ...param, value: 0, t: 10 } as unknown as Parameter
    const update = { value: 20, t: 11 }

    receiveParameterAdapter(parameter, update)

    expect(parameter).toMatchObject({ value: 20, t: 11 })
  })
  it("does not apply change if the timestamps are equal", () => {
    const parameter = { ...param, value: 0, t: 10 } as unknown as Parameter
    const update = { value: 20, t: 10 }

    receiveParameterAdapter(parameter, update)

    expect(parameter).toMatchObject({ value: 0, t: 10 })
  })
  it("applies the change even if the timestamp is given as a string", () => {
    const parameter = { ...param, value: 0, t: 10 } as unknown as Parameter
    const update = { value: 20, t: "12" }

    receiveParameterAdapter(parameter, update)

    expect(parameter).toMatchObject({ value: 20, t: 12 })
  })
  it("ignores the change if the local one has a higher timestamp", () => {
    const parameter = { ...param, value: 0, t: 11 } as unknown as Parameter
    const update = { value: 20, t: 10 }

    receiveParameterAdapter(parameter, update)

    expect(parameter).toMatchObject({ value: 0, t: 11 })
  })
})