import { describe, expect, it } from "vitest";
import { startLearning } from "../startLearning.process";
import type { Bindings, Learning } from "../../data/Learning.type";
import { toObjectId } from "../../../../shared/data/ObjectId.type";
import { deepFreeze } from "../../../../shared/__tests__/utils/deepFreeze";

describe("startLearning", () => {
  it("assigns the waiting control if the MIDI learn currently holds no pending control", () => {
    const learning: Learning = { bindings: {}, pending: null }
    expect(startLearning(learning, toObjectId("test"))).toEqual({ bindings: {}, pending: "test" })
  })
  it("assigns the new pending control if a previous one was waiting", () => {
    const learning: Learning = { bindings: {}, pending: toObjectId("other") }
    expect(startLearning(learning, toObjectId("test"))).toEqual({ bindings: {}, pending: "test" })
  })
  it("keeps the previously bound keys untouched", () => {
    const bindings: Bindings = { "10:11": [ toObjectId("first") ], "12:13": [ toObjectId("second") ] }
    const learning: Learning = { bindings, pending: null }

    expect(startLearning(learning, toObjectId("first"))).toEqual({
      bindings: { "10:11": [ "first" ], "12:13": [ "second" ]},
      pending: "first"
    })
  })
  it("can handle frozen objects", () => {
    const learning: Learning = deepFreeze({ bindings: { "10:11": [ toObjectId("test") ] }, pending: null })
    const before = structuredClone(learning)

    expect(() => startLearning(learning, toObjectId("test"))).not.toThrow()
    expect(learning).toEqual(before)
  })
})
