import { describe, expect, it } from "vitest";
import type { CableAudio } from "../audio/cable.audio";
import type { Connection } from "../../core/data/Cable.type";
import { recorder } from "../../../shared/http/__tests__/utils/recorder";
import { ko, ok } from "../../../shared/results/result";
import type { CablesEffect } from "../../core/data/Effect.type";
import { toObjectId, type ObjectId } from "../../../shared/data/ObjectId.type";
import { makeRunEffect } from "../effect";

function createConnectionRecord() {
  const connections: { action: "connect" | "disconnect", connection: Connection }[] = []
  const push = (action: "connect" | "disconnect") => (connection: Connection) => {
    connections.push({ action, connection })
  }
  const audio: CableAudio = { connect: push("connect"), disconnect: push("disconnect") }
  return { audio, connections }
}

const connection: Connection = {
  origin: { id: toObjectId("id.a"), moduleId: toObjectId("mod.a"), index: 0, node: "node.a", kind: "output" },
  destination: { id: toObjectId("id.b"), moduleId: toObjectId("mod.b"), index: 1, node: "node.a", kind: "input" }
}

const cableId: ObjectId = toObjectId("cable")

describe("makeRunEffect", () => {
  describe("cables.audio.connect", () => {
    it("triggers a connection of the audio on the corresponding event", async () => {
      const { requester: del, calls: deletions } = recorder(ok({}))
      const { requester: put, calls: updates } = recorder(ok({}))
      const { audio, connections } = createConnectionRecord()

      const effect: CablesEffect = { type: "cables.audio.connect", connection }
      await expect(makeRunEffect({ audio, del, put })(effect)).resolves.toBeUndefined()

      expect(deletions).toEqual([])
      expect(updates).toEqual([])
      expect(connections).toEqual([ { action: "connect", connection } ])
    })
  })
  describe("cables.audio.disconnect", () =>  {
    it("triggers a disconnection of the audio on the corresponding event", async () => {
      const { requester: del, calls: deletions } = recorder(ok({}))
      const { requester: put, calls: updates } = recorder(ok({}))
      const { audio, connections } = createConnectionRecord()

      const effect: CablesEffect = { type: "cables.audio.disconnect", connection }
      await expect(makeRunEffect({ audio, del, put })(effect)).resolves.toBeUndefined()

      expect(deletions).toEqual([])
      expect(connections).toEqual([ { action: "disconnect", connection } ])
      expect(updates).toEqual([])
    })
  })
  describe("cables.cable.delete", () => {
    it("triggers an HTTP request on the corresponding event", async () => {
      const { requester: del, calls: deletions } = recorder(ok({}))
      const { requester: put, calls: updates } = recorder(ok({}))
      const { audio } = createConnectionRecord()
      const effect: CablesEffect = { type: "cables.cable.delete", id: cableId }
      await expect(makeRunEffect({ audio, del, put })(effect)).resolves.toBeUndefined()

      expect(deletions).toEqual([ { url: `/proxy/links/cable`, body: {} } ])
      expect(updates).toEqual([])
    })
    it("sends only one request if it fails, without retries", async () => {
      const { requester: del, calls: deletions } = recorder(ko({ status: 500 }))
      const { requester: put, calls: updates } = recorder(ok({}))
      const { audio } = createConnectionRecord()
      const effect: CablesEffect = { type: "cables.cable.delete", id: cableId }
      await expect(makeRunEffect({ audio, del, put })(effect)).resolves.toBeUndefined()

      expect(deletions).toEqual([ { url: `/proxy/links/cable`, body: {} } ])
      expect(updates).toEqual([])
    })
    it("forwards the error if the DELETE query raises one", async () => {
      const { audio } = createConnectionRecord()
      const effect: CablesEffect = { type: "cables.cable.delete", id: cableId }
      const del = async () => { throw new Error("test error") }
      const { requester: put, calls: updates } = recorder(ok({}))

      await expect(makeRunEffect({ audio, del, put })(effect)).rejects.toThrow("test error")
      expect(updates).toEqual([])
    })
  })
  describe("cables.cable.save", () => {
    it("triggers an HTTP request on the corresponding event", async () => {
      const { requester: del, calls: deletions } = recorder(ok({}))
      const { requester: put, calls: updates } = recorder(ok({}))
      const { audio, connections } = createConnectionRecord()
      const effect: CablesEffect = { type: "cables.cable.save", id: cableId, color: "green" }
      await expect(makeRunEffect({ audio, del, put })(effect)).resolves.toBeUndefined()

      expect(deletions).toEqual([])
      expect(connections).toEqual([])
      expect(updates).toEqual([ { url: `/proxy/links/cable`, body: { color: "green" } } ])
    })
    it("sends only one request if it fails, without retries", async () => {
      const { requester: del, calls: deletions } = recorder(ok({}))
      const { requester: put, calls: updates } = recorder(ko({ status: 500 }))
      const { audio } = createConnectionRecord()
      const effect: CablesEffect = { type: "cables.cable.save", id: cableId, color: "green" }
      await expect(makeRunEffect({ audio, del, put })(effect)).resolves.toBeUndefined()

      expect(deletions).toEqual([])
      expect(updates).toEqual([ { url: `/proxy/links/cable`, body: { color: "green" } } ])
    })
    it("forwards the error if the PUT query raises one", async () => {
      const { audio } = createConnectionRecord()
      const effect: CablesEffect = { type: "cables.cable.save", id: cableId, color: "green" }
      const put = async () => { throw new Error("test error") }
      const { requester: del, calls: deletions } = recorder(ok({}))

      await expect(makeRunEffect({ audio, del, put })(effect)).rejects.toThrow("test error")
      expect(deletions).toEqual([])
    })
  })
  it("does not handle an unknown effect type", async () => {
    const { audio } = createConnectionRecord()
    const { requester: del, calls: deletions } = recorder(ok({}))
    const { requester: put, calls: updates } = recorder(ok({}))
    const effect = { type: "unknown.type" } as unknown as CablesEffect

    await expect(makeRunEffect({ audio, del, put })(effect)).rejects.toThrow(JSON.stringify("unknown.type"))
    expect(deletions).toEqual([])
    expect(updates).toEqual([])
  })
})