import { describe, expect, it } from "vitest"
import { recorder } from "../../../../shared/http/__tests__/utils/recorder"
import { ko, ok } from "../../../../shared/results/result"
import { makeCreateAccount } from "../createAccount.http"
import type { Registration } from "../../../core/data/Registration.type"

const registration: Registration = {
  username: "username", password: "password", password_confirmation: "password", email: "test@test.com"
}

describe("createAccount", () => {
  it("Sends a request to POST /proxy/accounts with the correct body", async () => {
    const { calls, requester } = recorder(ok(undefined))
    const createAccount = makeCreateAccount(requester)
    await createAccount(registration)
    expect(calls).toEqual([ { url: "/proxy/accounts", body: registration } ])
  })
  it("does not send additional fields useless for the request", async () => {
    const { calls, requester } = recorder(ok(undefined))
    const createAccount = makeCreateAccount(requester)
    await createAccount({ ...registration, id: "" } as Registration)
    expect(calls).toEqual([ { url: "/proxy/accounts", body: registration } ])
  })
  it("returns ok if the API returns ok", async () => {
    const { requester } = recorder(ok(undefined))
    const createAccount = makeCreateAccount(requester)
    expect(await createAccount(registration)).toEqual(ok(undefined))
  })
  it("returns ok with undefined even if the API answers anything", async () => {
    const { requester } = recorder(ok({
      username: "username", password: "password", password_confirmation: "password", email: "test@test.com"
    }))
    const createAccount = makeCreateAccount(requester)
    expect(await createAccount(registration)).toEqual(ok(undefined))
  })
  it("forwards errors as is", async () => {
    const error = ko({ status: 400, key: "username", message: "uniq" })
    const { requester } = recorder(error)
    const createAccount = makeCreateAccount(requester)
    expect(await createAccount(registration)).toEqual(error)
  })
})
