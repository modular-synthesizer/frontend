import { describe, expect, it } from "vitest"
import { keyToMessage } from "../keyboard.process"

describe("keyToMessage", () => {
  it("handles a keydown with a known key", () => {
    expect(keyToMessage("KeyQ", "keydown")).toEqual({ kind: "note.on", channel: 0, note: 60 })
  })
  it("handles a keyup with a known key", () => {
    expect(keyToMessage("KeyQ", "keyup")).toEqual({ kind: "note.off", channel: 0, note: 60 })
  })
  it("handles an unknown key by returning null", () => {
    expect(keyToMessage("unknown", "keydown")).toBe(null)
  })
})