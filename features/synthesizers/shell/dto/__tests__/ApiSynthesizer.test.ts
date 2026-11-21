import { describe, expect, it } from "vitest"
import { parseSynthesizers } from "../ApiSynthesizer.dto"
import { ko, ok } from "../../../../shared/results/result"
import { deepFreeze } from "../../../../shared/__tests__/utils/deepFreeze"

describe("parseSynthesizers", () => {
  const first = { id: "id.a", name: "first", members: [] }
  const second = { id: "id.b", name: "second", members: [] }

  it("correctly parses valid synthesizers", () => {
    const overloaded = { ...first, x: 0, y: 10, scale: 1.0, voices: 16, sample_rate: 44100 }
    const list = deepFreeze([ overloaded, second ])
    expect(parseSynthesizers(list)).toEqual(ok([ first, second ]))
  })
  it("parses an empty array of synthesizers", () => {
    expect(parseSynthesizers(deepFreeze([]))).toEqual(ok([]))
  })
  it.each([ [ "null", null ], [ "an object", {} ], [ "a string", "" ] ])("fails with %s", (_, value) => {
    const frozen = deepFreeze(value)
    expect(parseSynthesizers(frozen)).toEqual(ko({ status: 500, key: "unknown", message: "unknown" }))
  })
  it("does not add a synthesizer without ID to the list", () => {
    const list = deepFreeze([ { name: "invalid", members: [] }, first, { ...second, id: "" } ])
    expect(parseSynthesizers(list)).toEqual(ok([ first ]))
  })
  it("does not add a synthesizer with an invalid name to the list", () => {
    const list = deepFreeze([ { id: "id.a", members: [] }, second ])
    expect(parseSynthesizers(list)).toEqual(ok([ second ]))
  })
  it("does not add a synthesizer with an invalid members field to the list", () => {
    const list = deepFreeze([ { ...first, members: false }, second ])
    expect(parseSynthesizers(list)).toEqual(ok([ second ]))
  })
  it("does not add an invalid member to the list of members of a synthesizer", () => {
    const membership = { id: "id.c", account_id: "id.d", type: "creator", username: "username" }
    const invalid = { id: "id.e", account_id: "id.f", type: "read" }
    const list = deepFreeze([ { ...first, members: [ "invalid", membership, invalid, { foo: "bar" } ] } ])
    expect(parseSynthesizers(list)).toEqual(ok([ { ...first, members: [ membership ] } ]))
  })
})