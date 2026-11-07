import { describe, expect, it } from "vitest";
import { createAllocation } from "../createAllocation.process";

describe("createAllocation", () => {
  it("creates the allocation with 1 voice", () => {
    expect(createAllocation(1).orNull()).toEqual({ voices: [ null ], pressed: [], voicesCount: 1 })
  })
  it("creates the allocation with several voices", () => {
    expect(createAllocation(4).orNull()).toEqual({ voices: [ null, null, null, null ], pressed: [], voicesCount: 4 })
  })
  it("does not create the allocation if the number of voices is invalid", () => {
    expect(createAllocation(0).error()).toEqual("voices.count.invalid")
  })
})