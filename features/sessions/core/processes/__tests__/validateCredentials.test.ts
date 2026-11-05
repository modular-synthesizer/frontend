import { describe , expect, it} from "vitest";
import { validateCredentials } from "../validateCredentials.process";

describe("validateCredentials", () => {
  it("returns OK for valid credentials", () => {
    const credentials = { username: "testusername", password: "testpassword"}
    const result = validateCredentials(credentials)

    expect(result.orNull()).toEqual(credentials)
    expect(result.orNull()).not.toBe(credentials)
  })
  it("returns OK if the username is just the correct length", () => {
    const credentials = { username: "length", password: "testpassword"}
    const result = validateCredentials(credentials)

    expect(result.orNull()).toEqual(credentials)
    expect(result.orNull()).not.toBe(credentials)
  })
  it("returns the correct error for a missing username", () => {
    const credentials = { username: "", password: "testpassword"}
    const result = validateCredentials(credentials)

    expect(result.error()).toEqual([ { field: "username", reason: "required" } ])
  })
  it("returns the correct error for a missing password", () => {
    const credentials = { username: "testusername", password: ""}
    const result = validateCredentials(credentials)

    expect(result.error()).toEqual([ { field: "password", reason: "required" } ])
  })
  it("returns the correct error for a username too short", () => {
    const credentials = { username: "short", password: "testpassword"}
    const result = validateCredentials(credentials)

    expect(result.error()).toEqual([ { field: "username", reason: "minsize" } ])
  })
  it("can combine errors", () => {
    const credentials = { username: "test", password: ""}
    const result = validateCredentials(credentials)

    expect(result.error()).toEqual([
      { field: "username", reason: "minsize" },
      { field: "password", reason: "required" }
    ])
  })
  it("can handle frozen objects", () => {
    const credentials = Object.freeze({ username: "testusername", password: "testpassword"})
    const result = validateCredentials(credentials)

    expect(result.orNull()).toEqual(credentials)
  })
})