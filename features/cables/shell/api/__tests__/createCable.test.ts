import { describe, expect, it } from "vitest"
import { deepFreeze } from "../../../../shared/__tests__/utils/deepFreeze"
import { toObjectId } from "../../../../shared/data/ObjectId.type"
import { INVALID_LINK, makeCreateCable } from "../createCable.http"
import { recorder } from "../../../../shared/http/__tests__/utils/recorder"
import { ko, ok, type Result } from "../../../../shared/results/result"
import type { HttpError } from "../../../../shared/http/http"
import type { InputPort, OutputPort } from "../../../core/data/Port.type"
import type { Cable } from "../../../core/data/Cable.type"

const moduleId = toObjectId("module")
const origin: OutputPort = deepFreeze({ id: toObjectId("out"), moduleId, index: 0, kind: "output", node: "out" })
const destination: InputPort = deepFreeze({ id: toObjectId("in"), moduleId, index: 0, kind: "input", node: "in" })
const cable: Cable = deepFreeze({ origin, destination, id: null, color: "blue" })
const synthesizerId = toObjectId("synth")

const expectedCall = { url: "/proxy/links", body: { synthesizer_id: synthesizerId, from: origin.id, to: destination.id, color: "blue" } }

async function withResponse(response: Result<unknown, HttpError>) {
  const { requester, calls } = recorder(response)
  const result = await makeCreateCable(requester)(synthesizerId, cable)
  return { result, calls }
}

describe("makeCreateCable", () => {
  describe("request", () => {
    it("sends a single request to /proxy/links with exactly the expected body", async () => {
      const { calls } = await withResponse(ok({ id: "link", from: "out", to: "in", color: "blue" }))
      expect(calls).toEqual([ expectedCall ])
    })
    it("sends the color of the cable, not the default one", async () => {
      const { requester, calls } = recorder(ok({ id: "link", from: "out", to: "in" }))
      await makeCreateCable(requester)(synthesizerId, deepFreeze({ ...cable, color: "yellow" }))
      expect(calls[0]?.body).toEqual({ ...expectedCall.body, color: "yellow" })
    })
  })

  describe("on success", () => {
    it("returns the id read from the response", async () => {
      const { result } = await withResponse(ok({ id: "link", from: "out", to: "in", color: "blue" }))
      expect(result.orNull()).toBe(toObjectId("link"))
    })
    it("ignores the extra fields of the response", async () => {
      const { result } = await withResponse(ok({ id: "link", from: "out", to: "in", synthesizer_id: "synth", tab_id: "tab" }))
      expect(result.orNull()).toBe(toObjectId("link"))
    })
  })

  describe("on an invalid response", () => {
    it.each([
      [ "without id", { from: "out", to: "in", color: "blue" } ],
      [ "with an empty id", { id: "", from: "out", to: "in" } ],
      [ "null", null ],
      [ "a string", "link" ],
    ])("returns INVALID_LINK for a response %s", async (_, payload) => {
      const { result } = await withResponse(ok(payload))
      expect(result.error()).toEqual(INVALID_LINK)
    })
  })

  describe("on an HTTP error", () => {
    it("returns the same error, untouched", async () => {
      const error: HttpError = { status: 403, key: "forbidden", message: "forbidden" }
      const { result, calls } = await withResponse(ko(error))
      expect(result.error()).toEqual(error)
      expect(calls).toEqual([ expectedCall ])
    })
  })
})
