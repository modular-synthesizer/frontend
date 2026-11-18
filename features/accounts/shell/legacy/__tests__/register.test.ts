import { describe, expect, it } from "vitest"
import { recorder } from "../../../../shared/http/__tests__/utils/recorder"
import { makeCreateAccount } from "../../api/createAccount.http"
import { ko, ok, type Result } from "../../../../shared/results/result"
import { makeRegister } from "../register.adapter"
import type { HttpError } from "../../../../shared/http/http"
import type { Registration } from "../../../core/data/Registration.type"

function mockAdapter(body: Result<unknown, HttpError>) {
  const { calls, requester } = recorder(body)
  return { calls, requester, adapter: makeRegister(makeCreateAccount(requester)) }
}

describe("registerAdapter", () => {
  it("does not make an HTTP call and returns errors for an invalid registration", async () => {
    const { calls, adapter } = mockAdapter(ok(undefined))
    const results = await adapter(
      { username: "username", password: "pass", email: "", password_confirmation: "pass" }
    )
    expect(results).toEqual(ko([ { field: "email", reason: "required" } ]))
    expect(calls).toEqual([])
  })
  it("validates the registration, then gives a copy of it to the account creation", async () => {
    const registration: Registration = {
      username: "username", password: "pass", email: "test@test.com", password_confirmation: "pass"
    }
    const received: Registration[] = []
    const adapter = makeRegister(async r => {
      received.push(r)
      return ok<void, HttpError>(undefined)
    })
    expect(await adapter(registration)).toEqual(ok(undefined))
    expect(received).toEqual([ registration ])
    expect(received[0]).not.toBe(registration)
  })
  it("correctly transforms API error into domain error", async () => {
    const registration = {
      username: "username", password: "pass", email: "test@test.com", password_confirmation: "pass"
    }
    const { calls, adapter } = mockAdapter(ko({ status: 400, key: "username", message: "uniq" }))
    const results = await adapter(registration)
    expect(results).toEqual(ko([ { field: "username", reason: "uniq" } ]))
    expect(calls).toEqual([ { url: "/proxy/accounts", body: registration }])
  })
  it("forwards errors encountered while creating the account", async () => {
    const registration = {
      username: "username", password: "pass", email: "test@test.com", password_confirmation: "pass"
    }
    const adapter = makeRegister(async () => { throw new Error("network down") })
    await expect(adapter(registration)).rejects.toThrow("network down")
  })
})
