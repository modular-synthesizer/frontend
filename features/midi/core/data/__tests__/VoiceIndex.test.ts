import { describe, expect, it } from "vitest";
import { toVoiceIndex } from "../VoiceIndex.type";
import type { VoicesCount } from "../VoicesCount.type";

describe("toVoiceIndex", () => {
  const max = 16 as VoicesCount

  it("returns the value for a valid positive integer", () => {
    expect(toVoiceIndex(12, max).orNull()).toEqual(12)
  })
  it("returns the value for a value just before the max", () => {
    expect(toVoiceIndex(15, max).orNull()).toEqual(15)
  })
  it("returns the value for zero", () => {
    expect(toVoiceIndex(0, max).orNull()).toEqual(0)
  })
  it("returns KO for a value above the max allowed number of voices", () => {
    expect(toVoiceIndex(16, max).error()).toEqual("voice.index.invalid")
  })
  it("returns KO for an invalid, positive decimal number", () => {
    expect(toVoiceIndex(1.5, max).error()).toEqual("voice.index.invalid")
  })
  it("returns KO for an invalid, negative number", () => {
    expect(toVoiceIndex(-1, max).error()).toEqual("voice.index.invalid")
  })
})