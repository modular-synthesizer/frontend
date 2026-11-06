import { describe, expect, it } from "vitest"
import { toLoginError } from "../toLoginError"

describe("toLoginError", () => {
  it("returns the correct error for an unknown username", () => {
    const result = toLoginError({ status: 404, key: "username", message: "unknown" })
    expect(result).toEqual({ field: "username", reason: "unknown" })
  })
  it("returns the correct error for a forbidden username", () => {
    const result = toLoginError({ status: 403, key: "username", message: "forbidden" })
    expect(result).toEqual({ field: "username", reason: "forbidden" })
  })
  it("returns the correct error for a non-given username", () => {
    const result = toLoginError({ status: 400, key: "username", message: "required" })
    expect(result).toEqual({ field: "username", reason: "required" })
  })
  it("returns the correct error for a non-given password", () => {
    const result = toLoginError({ status: 400, key: "password", message: "required" })
    expect(result).toEqual({ field: "password", reason: "required" })
  })
  it("returns the correct error for an unknown http error", () => {
    const result = toLoginError({ status: 500, key: "password", message: "required" })
    expect(result).toEqual({ field: "form", reason: "unknown" })
  })
  it("returns the correct error for service unavailable error", () => {
    const result = toLoginError({ status: 503, key: "password", message: "required" })
    expect(result).toEqual({ field: "form", reason: "unknown" })
  })
  it("returns the correct error for a wrong key/message couple", () => {
    const result = toLoginError({ status: 403, key: "password", message: "forbidden" })
    expect(result).toEqual({ field: "form", reason: "unknown" })
  })
})
