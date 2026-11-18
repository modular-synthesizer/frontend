import { describe, expect, it } from "vitest";
import { toRegistrationError } from "../toRegistrationError";

describe("toRegistrationError", () => {
  it.each([
    [ "username", "required", "username", "required" ],
    [ "username", "uniq", "username", "uniq" ],
    [ "username", "length", "username", "minsize" ],
    [ "email", "required", "email", "required" ],
    [ "email", "uniq", "email", "uniq" ],
    [ "email", "format", "email", "format" ],
    [ "password", "required", "password", "required" ],
    [ "password_confirmation", "required", "password_confirmation", "required" ],
    [ "password_confirmation", "confirmation", "password_confirmation", "confirmation" ],
  ])("correctly translates an API error %s.%s into a domain error %s.%s", (key, message, field, reason) => {
    const result = toRegistrationError({ status: 400, key, message })
    expect(result).toEqual({ field, reason })
  })
  it("fails with an unknown error if the known API error is >= 500", () => {
    expect(toRegistrationError({ status: 500, key: "username", message: "uniq" })).toEqual({ field: "form", reason: "unknown" })
  })
  it("fails with an unknown error if the key/message couple is unknown", () => {
    expect(toRegistrationError({ status: 400, key: "foo", message: "bar" })).toEqual({ field: "form", reason: "unknown" })
  })
  it.each([
    [ "username", "forbidden" ],
    [ "password", "uniq" ],
  ])("fails with an unknown error if message is unknown for the key", (key, message) => {
    expect(toRegistrationError({ status: 400, key, message })).toEqual({ field: "form", reason: "unknown" })
  })
  it("fails with an unknown error if the API error lacks some fields", () => {
    expect(toRegistrationError({ status: 400 })).toEqual({ field: "form", reason: "unknown" })
  })
})