import { describe, expect, it } from "vitest";
import type { Synthesizer } from "~/types/Index";
import type { Uuid } from "../../../../shared/data/Uuid.type";
import { DEFAULT_VIEWPORT } from "../../../../viewports/core/shared/Constants";
import { makePanSynthesizer, makeResetSynthesizer, makeZoomSynthesizer } from "../viewport.adapter";
import type { ScaledCoordinates } from "~/types/utils/Coordinates";
import type { ViewportFacts } from "../../../../viewports/shell/legacy/viewport.adapter";
import type { SynthesizersEffect } from "../../../../synthesizers/core/data/Effect.type";

describe("makeResetSynthesizer", () => {
  const createApplier = () => {
    const called: { synthesizer: ScaledCoordinates, facts: ViewportFacts<SynthesizersEffect> }[] = []
    const reset = makeResetSynthesizer(async (synthesizer, facts) => { called.push({ synthesizer, facts }) })
    return { called, reset }
  }
  it("saves the synthesizer if the reset has moved its position", async () => {
    const synthesizer: Synthesizer = { id: "id", x: 10, y: 10, scale: 1.0 } as Synthesizer
    const applier = createApplier()
    await applier.reset(synthesizer)
    const viewport = DEFAULT_VIEWPORT

    expect(applier.called).toHaveLength(1)
    expect(applier.called[0]?.synthesizer).toBe(synthesizer)
    expect(applier.called[0]?.facts).toEqual({
      viewport,
      effects: [ { type: "synthesizers.viewport.save", id: "id" as Uuid, viewport } ]
    })
  })
  it("does not save the synthesizer if it was already at the origin", async () => {
    const synthesizer: Synthesizer = { id: "id", x: 0, y: 0, scale: 1.0 } as Synthesizer
    const applier = createApplier()
    await applier.reset(synthesizer)
    const viewport = DEFAULT_VIEWPORT

    expect(applier.called).toHaveLength(1)
    expect(applier.called[0]?.synthesizer).toBe(synthesizer)
    expect(applier.called[0]?.facts).toEqual({ viewport, effects: [] })
  })
  it("propagates the error of the facts applier", async () => {
    const synthesizer: Synthesizer = { id: "id", x: 10, y: 10, scale: 1.0 } as Synthesizer
    const reset = makeResetSynthesizer(async () => { throw new Error("apply failed") })

    await expect(reset(synthesizer)).rejects.toThrow("apply failed")
  })
})

describe("makePanSynthesizer", () => {
  const createApplier = () => {
    const called: { synthesizer: ScaledCoordinates, facts: ViewportFacts<SynthesizersEffect> }[] = []
    const pan = makePanSynthesizer(async (synthesizer, facts) => { called.push({ synthesizer, facts }) })
    return { called, pan }
  }
  it("saves the synthesizer if the stage has been moved, keeping the scale", async () => {
    const synthesizer: Synthesizer = { id: "id", x: 10, y: 10, scale: 2.0 } as Synthesizer
    const applier = createApplier()
    await applier.pan(synthesizer, { x: 0, y: 0 }, { x: 10, y: 10 })
    const viewport = { position: { x: 10, y: 10 }, scale: 2.0 }

    expect(applier.called).toHaveLength(1)
    expect(applier.called[0]?.synthesizer).toBe(synthesizer)
    expect(applier.called[0]?.facts).toEqual({
      viewport,
      effects: [ { type: "synthesizers.viewport.save", id: "id" as Uuid, viewport } ]
    })
  })
  it("does not save the synthesizer if it has not been moved", async () => {
    const synthesizer: Synthesizer = { id: "id", x: 0, y: 0, scale: 2.0 } as Synthesizer
    const applier = createApplier()
    await applier.pan(synthesizer, { x: 0, y: 0 }, { x: 0, y: 0 })
    const viewport = { position: { x: 0, y: 0 }, scale: 2.0 }

    expect(applier.called).toHaveLength(1)
    expect(applier.called[0]?.synthesizer).toBe(synthesizer)
    expect(applier.called[0]?.facts).toEqual({ viewport, effects: [] })
  })
  it("propagates the error of the facts applier", async () => {
    const synthesizer: Synthesizer = { id: "id", x: 0, y: 0, scale: 1.0 } as Synthesizer
    const pan = makePanSynthesizer(async () => { throw new Error("apply failed") })

    await expect(pan(synthesizer, { x: 0, y: 0 }, { x: 0, y: 0 })).rejects.toThrow("apply failed")
  })
})

describe("makeZoomSynthesizer", () => {
  const createApplier = () => {
    const called: { synthesizer: ScaledCoordinates, facts: ViewportFacts<SynthesizersEffect> }[] = []
    const zoom = makeZoomSynthesizer(async (synthesizer, facts) => { called.push({ synthesizer, facts }) })
    return { called, zoom }
  }
  it("saves the synthesizer if the zoom has been changed", async () => {
    const synthesizer: Synthesizer = { id: "id", x: 10, y: 10, scale: 1.5 } as Synthesizer
    const applier = createApplier()
    await applier.zoom(synthesizer, 100)
    const viewport = { position: { x: 10, y: 10 }, scale: 1.0 }

    expect(applier.called).toHaveLength(1)
    expect(applier.called[0]?.synthesizer).toBe(synthesizer)
    expect(applier.called[0]?.facts).toEqual({
      viewport,
      effects: [ { type: "synthesizers.scale.save", id: "id" as Uuid, scale: 1.0 } ]
    })
  })
  it("does not save the synthesizer scale if it's zoom out from the minimum", async () => {
    const synthesizer: Synthesizer = { id: "id", x: 10, y: 10, scale: 0.5 } as Synthesizer
    const applier = createApplier()
    await applier.zoom(synthesizer, 100)
    const viewport = { position: { x: 10, y: 10 }, scale: 0.5 }

    expect(applier.called).toHaveLength(1)
    expect(applier.called[0]?.synthesizer).toBe(synthesizer)
    expect(applier.called[0]?.facts).toEqual({
      viewport,
      effects: []
    })
  })
  it("does not save the synthesizer if the zoom has not been moved", async () => {
    const synthesizer: Synthesizer = { id: "id", x: 0, y: 0, scale: 2.0 } as Synthesizer
    const applier = createApplier()
    await applier.zoom(synthesizer, 0)
    const viewport = { position: { x: 0, y: 0 }, scale: 2.0 }

    expect(applier.called).toHaveLength(1)
    expect(applier.called[0]?.synthesizer).toBe(synthesizer)
    expect(applier.called[0]?.facts).toEqual({ viewport, effects: [] })
  })
  it("propagates the error of the facts applier", async () => {
    const synthesizer: Synthesizer = { id: "id", x: 0, y: 0, scale: 1.0 } as Synthesizer
    const zoom = makeZoomSynthesizer(async () => { throw new Error("apply failed") })

    await expect(zoom(synthesizer, 0)).rejects.toThrow("apply failed")
  })
})