import { describe, expect, it } from "vitest";
import { recorder } from "../../../../shared/http/__tests__/utils/recorder";
import { ko, ok, type Result } from "../../../../shared/results/result";
import type { HttpError } from "~/features/shared/http/http";
import { makeGetSession } from "../getSession.http";
import { toObjectId } from "../../../../shared/data/ObjectId.type";

async function withResponse(response: Result<unknown, HttpError>) {
  const { requester, calls } = recorder(response)
  const result = await makeGetSession(requester)("test.token")
  return { result, calls }
}

describe("getSession", () => {
  it("sends only one request to the GET /proxy/sessions/:id route", async () => {
    const { calls } = await withResponse(ok({}))
    expect(calls).toEqual([ { url: "/proxy/sessions/test.token", body: {} } ])
  })
  it("translates null into a failure", async () => {
    const { result } = await withResponse(ok(null))
    expect(result).toEqual(ko({ status: 500, key: "unknown", message: "unknown" }))
  })
  it("translates an OK response with a body correctly", async () => {
    const account = { username: "username", email: "test@mail.com", id: toObjectId("acc")}
    const session = { token: "test.token", admin: false, account, rights: [ { label: "test::scope" } ] }
    const { result } = await withResponse(ok({ ...session, duration: 0, created_at: 0 }))
    expect(result).toEqual(ok({ ...session, rights: [ "test::scope" ] }))
  })
  it("forwards an error response with status, key and message", async () => {
    const error = ko({ status: 400, key: "auth_token", message: "forbidden" })
    const { result } = await withResponse(error)
    expect(result).toEqual(error)
  })
})