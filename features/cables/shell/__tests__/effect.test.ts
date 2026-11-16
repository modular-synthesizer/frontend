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
  it("triggers a connection of the audio on the corresponding event", async () => {
    const { put: del, calls } = recorder(ok({}))
    const { audio, connections } = createConnectionRecord()

    const effect: CablesEffect = { type: "cables.audio.connect", connection }
    await expect(makeRunEffect({ audio, del })(effect)).resolves.toBeUndefined()

    expect(calls).toEqual([])
    expect(connections).toEqual([ { action: "connect", connection } ])
  })
  it("triggers a disconnection of the audio on the corresponding event", async () => {
    const { put: del, calls } = recorder(ok({}))
    const { audio, connections } = createConnectionRecord()

    const effect: CablesEffect = { type: "cables.audio.disconnect", connection }
    await expect(makeRunEffect({ audio, del })(effect)).resolves.toBeUndefined()

    expect(calls).toEqual([])
    expect(connections).toEqual([ { action: "disconnect", connection } ])
  })
  it("triggers an HTTP request on the corresponding event", async () => {
    const { put: del, calls } = recorder(ok({}))
    const { audio } = createConnectionRecord()
    const effect: CablesEffect = { type: "cables.cable.delete", id: cableId }
    await expect(makeRunEffect({ audio, del })(effect)).resolves.toBeUndefined()

    expect(calls).toEqual([ { url: `/proxy/links/cable`, body: {} } ])
  })
  it("sends only one request if it fails, without retries", async () => {
    const { put: del, calls } = recorder(ko({ status: 500 }))
    const { audio } = createConnectionRecord()
    const effect: CablesEffect = { type: "cables.cable.delete", id: cableId }
    await expect(makeRunEffect({ audio, del })(effect)).resolves.toBeUndefined()

    expect(calls).toEqual([ { url: `/proxy/links/cable`, body: {} } ])
  })
  it("forwards the error if the DELETE query raises one", async () => {
    const { audio } = createConnectionRecord()
    const effect: CablesEffect = { type: "cables.cable.delete", id: cableId }
    const del = async () => { throw new Error("test error") }

    await expect(makeRunEffect({ audio, del })(effect)).rejects.toThrow("test error")
  })
  it("does not handle an unknown effect type", async () => {
    const { audio } = createConnectionRecord()
    const { put: del, calls } = recorder(ok({}))
    const effect = { type: "unknown.type" } as unknown as CablesEffect

    await expect(makeRunEffect({ audio, del })(effect)).rejects.toThrow(JSON.stringify("unknown.type"))
    expect(calls).toEqual([])
  })
})