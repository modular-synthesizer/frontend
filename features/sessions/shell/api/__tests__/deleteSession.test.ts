import { describe, expect, it } from "vitest";
import { recorder } from "../../../../shared/http/__tests__/utils/recorder";
import { ko, ok, type Result } from "../../../../shared/results/result";
import { makeDeleteSession } from "../deleteSession.http";
import type { HttpError } from "~/features/shared/http/http";

async function withResponse(response: Result<unknown, HttpError>) {
  const { requester, calls } = recorder(response)
  const result = await makeDeleteSession(requester)("test.token")
  return { result, calls }
}

describe("deleteSession", () => {
  it("sends only one request to the DELETE /proxy/sessions/:id route", async () => {
    const { calls } = await withResponse(ok({}))
    expect(calls).toEqual([ { url: "/proxy/sessions/test.token", body: {} } ])
  })
  it("translates an OK empty response correctly", async () => {
    const { result } = await withResponse(ok(undefined))
    expect(result).toEqual(ok(undefined))
  })
  it("translates an OK response with a body correctly", async () => {
    const { result } = await withResponse(ok({ foo: "bar" }))
    expect(result).toEqual(ok(undefined))
  })
  it("forwards an error response with status, key and message", async () => {
    const error = ko({ status: 400, key: "auth_token", message: "forbidden" })
    const { result } = await withResponse(error)
    expect(result).toEqual(error)
  })
})