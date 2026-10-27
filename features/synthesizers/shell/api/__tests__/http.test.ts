import { describe, expect, it } from "vitest"
import { withAuthenticationGuard, type HttpError } from "../http"
import { ko, ok, type Result } from "../../../../shared/results/result"
import { recorder } from "./utils/recorder"

const tryResponse = async (response: Result<unknown, HttpError>) => {
  let called = 0
  const result = await withAuthenticationGuard(recorder(response).put, () => { called++ })("/anything", {})
  return { result, called }
}

describe("withAuthenticationGuard", () => {
  it("calls the callback on a forbidden auth_token error", async () => {
    const response = ko({ status: 403, key: "auth_token", message: "forbidden" })
    const { called, result } = await tryResponse(response)
    expect(called).toEqual(1)
    expect(result).toBe(response)
  })
  it("does not call the callback on a forbidden error about something else", async () => {
    const response = ko({ status: 403, key: "anything", message: "else" })
    const { called, result } = await tryResponse(response)
    expect(called).toEqual(0)
    expect(result).toBe(response)
  })
  it("calls the callback on an unknown auth_token error", async () => {
    const response = ko({ status: 404, key: "auth_token", message: "unknown" })
    const { called, result } = await tryResponse(response)
    expect(called).toEqual(1)
    expect(result).toBe(response)
  })
  it("does not call the callback on an error about something else than the auth token", async () => {
    const response = ko({ status: 500, key: "anything", message: "else" })
    const { called, result } = await tryResponse(response)
    expect(called).toEqual(0)
    expect(result).toBe(response)
  })
  it("does not call the callback if the response was not an error, and was about the auth_token field", async () => {
    const response = ok({ status: 200, key: "auth_token" })
    const { called, result } = await tryResponse(response)
    expect(called).toEqual(0)
    expect(result).toBe(response)
  })
  it("forwards url and body untouched and returns the underlying response", async () => {
    const response = ok("anything")
    const { put, calls } = recorder(response)
    const body = { x: 1, nested: { y: 2 } }

    const result = await withAuthenticationGuard(put, () => {})("/url", body)

    expect(calls).toEqual([{ url: "/url", body }])
    expect(result).toBe(response)
  })
})