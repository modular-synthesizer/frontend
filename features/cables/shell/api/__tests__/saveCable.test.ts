import { toObjectId } from "../../../../shared/data/ObjectId.type"
import { httpRecorder } from "../../../../shared/http/__tests__/utils/recorder"
import type { HttpError } from "../../../../shared/http/http"
import { ko, ok, type Result } from "../../../../shared/results/result"
import { describe, expect, it } from "vitest"
import { saveCable } from "../saveCable.http"

const id = toObjectId("link")

async function withResponse(response: Result<unknown, HttpError>) {
  const { requester, calls } = httpRecorder(response)
  const result = await saveCable(requester)(id, "green")
  return { result, calls }
}

describe("saveCable", () => {
  describe("request", () => {
    it("sends a single request to /proxy/links/:id with the color in the body", async () => {
      const { calls } = await withResponse(ok(undefined))
      expect(calls).toEqual([ { url: "/proxy/links/link", body: { color: "green" } } ])
    })
  })

  describe("on success", () => {
    it.each([
      [ "an empty response", undefined ],
      [ "a response with content", { id: "link", from: "test", to: "test", color: "green" } ],
    ])("returns ok(undefined) for %s", async (_, payload) => {
      const { result } = await withResponse(ok(payload))
      expect(result.ok).toBe(true)
      expect(result.orNull()).toBeUndefined()
    })
  })

  describe("on an HTTP error", () => {
    it("returns the same error, untouched", async () => {
      const error: HttpError = { status: 404, key: "link_id", message: "unknown" }
      const { result, calls } = await withResponse(ko(error))
      expect(result.ok).toBe(false)
      expect(result.error()).toEqual(error)
      expect(calls).toHaveLength(1)
    })
  })
})
