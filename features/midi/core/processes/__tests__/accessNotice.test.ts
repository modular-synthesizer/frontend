import { describe, expect, it } from "vitest";
import { accessNotice } from "../accessNotice.process";

describe("accessNotice", () => {
  it("returns null for a ready status", () => {
    expect(accessNotice("ready")).toBe(null)
  })
  it("returns the correct access notice for a denied status", () => {
    expect(accessNotice("denied")).toBe("midi.access.denied")
  })
  it("returns the correct access notice for a unsupported status", () => {
    expect(accessNotice("unsupported")).toBe("midi.access.unsupported")
  })
})