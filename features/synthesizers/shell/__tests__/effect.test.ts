import { describe, expect, it } from "vitest";
import { ko, ok } from "../../../shared/results/result";
import { recorder } from "../../../shared/http/__tests__/utils/recorder";
import type { ObjectId } from "../../../shared/data/ObjectId.type";
import type { SynthesizersEffect } from "../../core/data/Effect.type";
import { makeRunEffect } from "../effect";

const id = "00000000-0000-0000-0000-000000000001" as ObjectId

describe("makeRunEffect", () => {

  it("sends the effect's id and viewport to the synthesizer viewport route", async () => {
    const { put, calls } = recorder(ok({}))
    const viewport = { position: { x: 0, y: 1 }, scale: 2.0 }
    const synthesizerEffect: SynthesizersEffect = { type: "synthesizers.viewport.save", id, viewport }
    await expect(makeRunEffect(put)(synthesizerEffect)).resolves.toBeUndefined()

    expect(calls).toEqual([
      { url: `/proxy/synthesizers/${id}`, body: { x: 0, y: 1, scale: 2.0 } }
    ])
  })
  it("sends the effect's id and scale to the synthesizer scale update route", async () => {
    const { put, calls } = recorder(ok({}))
    const synthesizerEffect: SynthesizersEffect = { type: "synthesizers.scale.save", id, scale: 2.0 }
    await expect(makeRunEffect(put)(synthesizerEffect)).resolves.toBeUndefined()

    expect(calls).toEqual([
      { url: `/proxy/synthesizers/${id}`, body: { scale: 2.0 } }
    ])
  })
  it("sends the effect's id, moduleId, value and t to the parameter save route", async () => {
    const { put, calls } = recorder(ok({}))
    const moduleId = "module_id" as ObjectId
    const synthesizerEffect: SynthesizersEffect = { type: "synthesizers.parameter.save", id, moduleId, value: 10, t: 1234 }
    await expect(makeRunEffect(put)(synthesizerEffect)).resolves.toBeUndefined()

    expect(calls).toEqual([
      { url: `/proxy/parameters/${id}`, body: { module_id: moduleId, value: 10, t: 1234 } }
    ])
  })
  it("sends the effect's id and placement to the module update route", async () => {
    const { put, calls } = recorder(ok({}))
    const synthesizerEffect: SynthesizersEffect = { type: "synthesizers.module.save", id, placement: { rack: 0, slot: 10 } }
    await expect(makeRunEffect(put)(synthesizerEffect)).resolves.toBeUndefined()

    expect(calls).toEqual([
      { url: `/proxy/modules/${id}`, body: { rack: 0, slot: 10 } }
    ])
  })
  it("sends only one request if it fails, without retries", async () => {
    const { put, calls } = recorder(ko({ status: 500 }))
    const viewport = { position: { x: 1, y: 2 }, scale: 3.0 }
    const synthesizerEffect: SynthesizersEffect = { type: "synthesizers.viewport.save", id, viewport }
    await expect(makeRunEffect(put)(synthesizerEffect)).resolves.toBeUndefined()

    expect(calls).toEqual([
      { url: `/proxy/synthesizers/${id}`, body: { x: 1, y: 2, scale: 3.0 } }
    ])
  })
  it("forwards the error if the PUT query raises one", async () => {
    const viewport = { position: { x: 2, y: 3 }, scale: 4.0 }
    const synthesizerEffect: SynthesizersEffect = { type: "synthesizers.viewport.save", id, viewport }
    const put = async () => { throw new Error("test error") }

    await expect(makeRunEffect(put)(synthesizerEffect)).rejects.toThrow("test error")
  })
  it("does not handle an unknown effect type", async () => {
    const { put, calls } = recorder(ok({}))
    const effect = { type: "unknown.type" } as unknown as SynthesizersEffect

    await expect(makeRunEffect(put)(effect)).rejects.toThrow(JSON.stringify("unknown.type"))
    expect(calls).toEqual([])
  })
})
