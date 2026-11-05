import { describe, expect, it } from "vitest";
import { ko, ok } from "../../../../shared/results/result";
import { toObjectId } from "../../../../shared/data/ObjectId.type";
import { receiveLogin } from "../receiveLogin.process";

describe("receiveLogin", () => {
  const account = { id: toObjectId("test"), username: "test.username", email: "test@email.com" }

  it("stores the session then redirects the user if the response was a success", () => {
    const session = { token: "test.token", rights: [], admin: false, account }
    expect(receiveLogin(ok(session))).toEqual({
      effects: [
        { type: "sessions.session.store", session },
        { type: "sessions.navigate", to: "/" }
      ],
      errors: []
    })
  })
  it("returns the correct error for a forbidden user", () => {
    const error = { status: 403, key: "username", message: "forbidden" }
    expect(receiveLogin(ko(error))).toEqual({
      effects: [],
      errors: [
        { field: "username", reason: "forbidden" }
      ]
    })
  })
  it("returns the correct error for an unknown username", () => {
    const error = { status: 404, key: "username", message: "unknown" }
    expect(receiveLogin(ko(error))).toEqual({
      effects: [],
      errors: [
        { field: "username", reason: "unknown" }
      ]
    })
  })
  it("returns the correct error for a required username", () => {
    const error = { status: 400, key: "username", message: "required" }
    expect(receiveLogin(ko(error))).toEqual({
      effects: [],
      errors: [
        { field: "username", reason: "required" }
      ]
    })
  })
  it("returns the correct error for a required password", () => {
    const error = { status: 400, key: "password", message: "required" }
    expect(receiveLogin(ko(error))).toEqual({
      effects: [],
      errors: [
        { field: "password", reason: "required" }
      ]
    })
  })
  it("correctly handles an unknown error", () => {
    const error = { status: 500, key: "unknown", message: "unknown" }
    expect(receiveLogin(ko(error))).toEqual({
      effects: [],
      errors: [
        { field: "form", reason: "unknown" }
      ]
    })
  })
  it("correctly handles an incorrect credentials error", () => {
    const error = { status: 403, key: "password", message: "forbidden" }
    expect(receiveLogin(ko(error))).toEqual({
      effects: [],
      errors: [
        { field: "form", reason: "unknown" }
      ]
    })
  })
})
