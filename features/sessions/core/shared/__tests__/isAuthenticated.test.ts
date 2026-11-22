import { describe, expect, it } from "vitest";
import { isAuthenticated } from "../isAuthenticated";

describe("isAuthenticated", () => {
  it("returns true for a valid token", () => {
    expect(isAuthenticated("test.token")).toBe(true)
  })
  it("returns false for an empty token", () => {
    expect(isAuthenticated("")).toBe(false)
  })
})
