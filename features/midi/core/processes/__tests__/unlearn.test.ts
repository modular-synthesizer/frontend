import { describe, expect, it } from "vitest";
import type { Learning } from "../../data/Learning.type";
import { toObjectId } from "../../../../shared/data/ObjectId.type";
import { unlearn } from "../unlearn.process";
import { deepFreeze } from "../../../../shared/__tests__/utils/deepFreeze";

describe("unlearn", () => {
  it("removes the objectId from any binding list it is in", () => {
    const learning: Learning = {
      bindings: {
        "10:11": [ toObjectId("second"), toObjectId("first") ],
        "12:13": [ toObjectId("first"), toObjectId("third") ]
      },
      pending: null
    }
    expect(unlearn(learning, toObjectId("first"))).toEqual({
      pending: null, bindings: { "10:11": [ "second" ], "12:13": [ "third" ] }
    })
  })
  it("removes all occurrences in a given tuple", () => {
    const learning: Learning = {
      bindings: { "10:11": [ toObjectId("first"), toObjectId("second"), toObjectId("first") ] },
      pending: null
    }
    expect(unlearn(learning, toObjectId("first"))).toEqual({ pending: null, bindings: { "10:11": [ "second" ] } })
  })
  it("does not modify a tuple if the value is not found in it", () => {
    const learning: Learning = {
      bindings: { "10:11": [ toObjectId("first"), toObjectId("second"), toObjectId("first") ] },
      pending: null
    }
    expect(unlearn(learning, toObjectId("test"))).toEqual({
      pending: null, bindings: { "10:11": [ "first", "second", "first" ] }
    })
  })
  it("removes the objectId from the pending key if it was pending", () => {
    const learning: Learning = { bindings: { "10:11": [ toObjectId("test") ] }, pending: toObjectId("test") }
    expect(unlearn(learning, toObjectId("test"))).toEqual({ pending: null, bindings: {} })
  })
  it("does not remove the pending objectId if it's not the same", () => {
    const learning: Learning = { bindings: {}, pending: toObjectId("test") }
    expect(unlearn(learning, toObjectId("first"))).toEqual({ pending: "test", bindings: {} })
  })
  it("can handle frozen objects", () => {
    const learning: Learning = deepFreeze({ bindings: { "10:11": [ toObjectId("test") ]}, pending: null })
    const before = structuredClone(learning)

    expect(() => unlearn(learning, toObjectId("test"))).not.toThrow()
    expect(learning).toEqual(before)
  })
})