import { describe, expect, it } from "vitest"
import { receiveParameter } from "../receiveParameter.process"

describe("receiveParameter", () => {
  it("returns the local version if it has been edited more recently", () => {
    const result = receiveParameter({ value: 0, t: 1 }, { value: 2, t: 0 })
    expect(result).toEqual({ value: 0, t: 1 })
  })
  it("returns the local version if both timestamps are the same", () => {
    const result = receiveParameter({ value: 0, t: 0 }, { value: 2, t: 0 })
    expect(result).toEqual({ value: 0, t: 0 })
  })
  it("returns the remote one if is has been edited more recently", () => {
    const result = receiveParameter({ value: 2, t: 0 }, { value: 0, t: 1 })
    expect(result).toEqual({ value: 0, t: 1 })
  })
})