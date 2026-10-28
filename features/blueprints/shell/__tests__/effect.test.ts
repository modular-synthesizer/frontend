import { describe, expect, it } from "vitest";
import { ko, ok } from "../../../shared/results/result";
import { recorder } from "../../../shared/http/__tests__/utils/recorder";
import type { Uuid } from "../../../shared/data/Uuid.type";
import type { BlueprintsEffect } from "../../core/data/Effect.type";
import { makeRunEffect } from "../effect";

const ID = "00000000-0000-0000-0000-000000000001" as Uuid

describe("makeRunEffect", () => {
  it("sends the effect's id and viewport to the blueprint viewport route", async () => {
    const { put, calls } = recorder(ok({}))
    const viewport = { position: { x: 1, y: 2 }, scale: 3.0 }
    const blueprintEffect: BlueprintsEffect = { type: "blueprints.viewport.save", id: ID, viewport }
    await expect(makeRunEffect(put)(blueprintEffect)).resolves.toBeUndefined()

    expect(calls).toEqual([
      { url: `/proxy/blueprints/${ID}`, body: { x: 1, y: 2, scale: 3.0 } }
    ])
  })
  it("sends only one request if it fails, without retries", async () => {
    const { put, calls } = recorder(ko({ status: 500 }))
    const viewport = { position: { x: 2, y: 3 }, scale: 4.0 }
    const blueprintEffect: BlueprintsEffect = { type: "blueprints.viewport.save", id: ID, viewport }
    await expect(makeRunEffect(put)(blueprintEffect)).resolves.toBeUndefined()

    expect(calls).toEqual([
      { url: `/proxy/blueprints/${ID}`, body: { x: 2, y: 3, scale: 4.0 } }
    ])
  })
  it("forwards the error if the PUT query raises one", async () => {
    const viewport = { position: { x: 3, y: 4 }, scale: 5.0 }
    const blueprintEffect: BlueprintsEffect = { type: "blueprints.viewport.save", id: ID, viewport }
    const put = async () => { throw new Error("test error") }

    await expect(makeRunEffect(put)(blueprintEffect)).rejects.toThrow("test error")
  })
  it("does not handle an unknown effect type", async () => {
    const { put, calls } = recorder(ok({}))
    const effect = { type: "unknown.type" } as unknown as BlueprintsEffect

    await expect(makeRunEffect(put)(effect)).rejects.toThrow(JSON.stringify("unknown.type"))
    expect(calls).toEqual([])
  })
})