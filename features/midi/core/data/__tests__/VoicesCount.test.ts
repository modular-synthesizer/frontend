import { describe, expect, it } from "vitest";
import { toVoicesCount } from "../VoicesCount.type";

describe("toVoicesCount", () => {
  it("returns the value for a valid positive integer", () => {
    expect(toVoicesCount(12).orNull()).toEqual(12)
  })
  it("returns the value for the value one", () => {
    expect(toVoicesCount(1).orNull()).toEqual(1)
  })
  it("returns KO for an invalid, positive decimal number", () => {
    expect(toVoicesCount(1.5).error()).toEqual("voices.count.invalid")
  })
  it("returns KO for an invalid, negative number", () => {
    expect(toVoicesCount(-1).error()).toEqual("voices.count.invalid")
  })
  it("returns KO for an invalid zero value", () => {
    expect(toVoicesCount(0).error()).toEqual("voices.count.invalid")
  })
  it("returns KO for an invalid zero value", () => {
    expect(toVoicesCount(NaN).error()).toEqual("voices.count.invalid")
  })
})