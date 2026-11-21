import { describe, expect, it } from "vitest"
import { recorder } from "../../../../shared/http/__tests__/utils/recorder"
import type { HttpError } from "../../../../shared/http/http"
import { ko, ok, type Result } from "../../../../shared/results/result"
import { deepFreeze } from "../../../../shared/__tests__/utils/deepFreeze"
import { makeListSynthesizers } from "../listSynthesizers.http"

async function withResponse(response: Result<unknown, HttpError>) {
  const { requester, calls } = recorder(response)
  const result = await makeListSynthesizers(requester)()
  return { result, calls }
}

describe("listSynthesizers", () => {
  describe("request", () => {
    it("sends a single request to /proxy/synthesizers with empty parameters", async () => {
      const { calls } = await withResponse(ok([]))
      expect(calls).toEqual([ { url: "/proxy/synthesizers", body: {} } ])
    })
  })

  describe("on success", () => {
    it("returns the parsed list of synthesizers", async () => {
      const member = { id: "id.m", account_id: "id.acc", username: "username", type: "creator" }
      const synthesizer = { id: "id.a", name: "first", members: [ member ] }
      const payload = deepFreeze([ { ...synthesizer, x: 0, y: 0, scale: 1, voices: 16, sample_rate: 44100 } ])
      const { result } = await withResponse(ok(payload))
      expect(result).toEqual(ok([ synthesizer ]))
    })

    it("fails with a 500 error when the body is not an array", async () => {
      const { result } = await withResponse(ok(deepFreeze({ id: "id.a" })))
      expect(result).toEqual(ko({ status: 500, key: "unknown", message: "unknown" }))
    })
  })

  describe("on an HTTP error", () => {
    it("returns the same error, untouched", async () => {
      const error: HttpError = { status: 403, key: "auth_token", message: "forbidden" }
      const { result, calls } = await withResponse(ko(error))
      expect(result.ok).toBe(false)
      expect(result.error()).toEqual(error)
      expect(calls).toHaveLength(1)
    })
  })
})