import { describe, expect, it } from "vitest"
import type { Registration } from "../../data/Registration.type"
import { validateRegistration } from "../validateRegistration.process"
import { deepFreeze } from "../../../../shared/__tests__/utils/deepFreeze"

describe("validateRegistration", () => {
  it("returns a new instance of the registration if everything is ok", () => {
    const registration: Registration = {
      username: "TestUsername",
      password: "testPassword",
      password_confirmation: "testPassword",
      email: "test@email.com"
    }
    const result = validateRegistration(registration).orNull()
    expect(result).toEqual(registration)
    expect(result).not.toBe(registration)
  })
  it("succeeds with exactly six characters in the username", () => {
    const registration: Registration = deepFreeze({
      username: "valide",
      password: "testPassword",
      password_confirmation: "testPassword",
      email: "test@email.com"
    })
    const result = validateRegistration(registration).orNull()
    expect(result).toEqual(registration)
  })
  it("fails with an empty username", () => {
    const registration: Registration = deepFreeze({
      username: "",
      password: "testPassword",
      password_confirmation: "testPassword",
      email: "test@email.com"
    })
    const result = validateRegistration(registration).error()
    expect(result).toEqual([ { field: "username", reason: "required" } ])
  })
  it("fails with a username too short", () => {
    const registration: Registration = deepFreeze({
      username: "short",
      password: "testPassword",
      password_confirmation: "testPassword",
      email: "test@email.com"
    })
    const result = validateRegistration(registration).error()
    expect(result).toEqual([ { field: "username", reason: "minsize" } ])
  })
  it("fails with an empty email address", () => {
    const registration: Registration = deepFreeze({
      username: "testUsername",
      password: "testPassword",
      password_confirmation: "testPassword",
      email: ""
    })
    const result = validateRegistration(registration).error()
    expect(result).toEqual([ { field: "email", reason: "required" } ])
  })
  it.each([
    [ "no at sign", "userexample.com" ],
    [ "no domain", "user@" ],
    [ "no local part", "@example.com" ],
    [ "no dot in the domain", "user@examplecom" ],
    [ "space in the local part", "jean dupont@test.com" ],
    [ "space at the end", "test@example.com other" ],
  ])("fails with an invalid email (%s)", (_, email) => {
    const registration: Registration = deepFreeze({
      username: "testUsername",
      password: "testPassword",
      password_confirmation: "testPassword",
      email
    })
    const result = validateRegistration(registration).error()
    expect(result).toEqual([ { field: "email", reason: "format" } ])
  })
  it("accepts complex emails", () => {
    const registration: Registration = deepFreeze({
      username: "testUsername",
      password: "testPassword",
      password_confirmation: "testPassword",
      email: "first.last+tag@sub.domain.fr"
    })
    const result = validateRegistration(registration).orNull()
    expect(result).toEqual(registration)
  })
  it("fails with an empty password but a given confirmation", () => {
    const registration: Registration = deepFreeze({
      username: "testUsername",
      password: "",
      password_confirmation: "testPassword",
      email: "test@email.com"
    })
    const result = validateRegistration(registration).error()
    expect(result).toEqual([
      { field: "password", reason: "required" },
      { field: "password_confirmation", reason: "confirmation" },
    ])
  })
  it("fails with an empty password confirmation", () => {
    const registration: Registration = deepFreeze({
      username: "testUsername",
      password: "testPassword",
      password_confirmation: "",
      email: "test@email.com"
    })
    const result = validateRegistration(registration).error()
    expect(result).toEqual([ { field: "password_confirmation", reason: "required" } ])
  })
  it("fails with a non-matching password confirmation", () => {
    const registration: Registration = deepFreeze({
      username: "testUsername",
      password: "testPassword",
      password_confirmation: "invalidConfirmation",
      email: "test@email.com"
    })
    const result = validateRegistration(registration).error()
    expect(result).toEqual([ { field: "password_confirmation", reason: "confirmation" } ])
  })
  it("fails with a confirmation having one final extra space", () => {
    const registration: Registration = deepFreeze({
      username: "testUsername",
      password: "testPassword",
      password_confirmation: "testPassword ",
      email: "test@email.com"
    })
    const result = validateRegistration(registration).error()
    expect(result).toEqual([ { field: "password_confirmation", reason: "confirmation" } ])
  })
  it("fails with a confirmation having one extra uppercase", () => {
    const registration: Registration = deepFreeze({
      username: "testUsername",
      password: "testPassword",
      password_confirmation: "TestPassword",
      email: "test@email.com"
    })
    const result = validateRegistration(registration).error()
    expect(result).toEqual([ { field: "password_confirmation", reason: "confirmation" } ])
  })
  it("fails if everything is empty", () => {
    const registration: Registration = deepFreeze({
      username: "",
      password: "",
      password_confirmation: "",
      email: ""
    })
    const result = validateRegistration(registration).error()
    expect(result).toEqual([
      { field: "username", reason: "required" },
      { field: "email", reason: "required" },
      { field: "password", reason: "required" },
      { field: "password_confirmation", reason: "required" },
    ])
  })
  it("can show multiple errors in the correct order of failure", () => {
    const registration: Registration = deepFreeze({
      username: "short",
      password: "password",
      password_confirmation: "invalidConfirmation",
      email: "@invalid.com+"
    })
    const result = validateRegistration(registration).error()
    expect(result).toEqual([
      { field: "username", reason: "minsize" },
      { field: "email", reason: "format" },
      { field: "password_confirmation", reason: "confirmation" },
    ])
  })
})