import { describe, expect, it } from "vitest"
import { toObjectId } from "../../../../shared/data/ObjectId.type"
import { recorder } from "../../../../shared/http/__tests__/utils/recorder"
import type { HttpError } from "../../../../shared/http/http"
import { ko, ok, type Result } from "../../../../shared/results/result"
import { makeDeleteSynthesizer } from "../deleteSynthesizer.http"

const id = toObjectId("synth")

async function withResponse(response: Result<unknown, HttpError>) {
  const { requester, calls } = recorder(response)
  const result = await makeDeleteSynthesizer(requester)(id)
  return { result, calls }
}

describe("deleteSynthesizer", () => {
  describe("request", () => {
    it("sends a single request to /proxy/synthesizers/:id with empty parameters", async () => {
      const { calls } = await withResponse(ok(undefined))
      expect(calls).toEqual([ { url: "/proxy/synthesizers/synth", body: {} } ])
    })
  })

  describe("on success", () => {
    it.each([
      [ "an empty response", undefined ],
      [ "a response with content", { id: "link", deleted: true } ],
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
