import { describe, expect, it } from "vitest";
import type { Synthesizer } from "~/types/Index";
import { applyViewport, makeApplyFacts, makePanSynthesizer, makeResetSynthesizer, toViewport, type ViewportFacts } from "../viewport.adapter";
import type { RunEffectFct } from "../../effect";
import type { SynthesizersEffects } from "../../../core/data/Effect.type";
import type { Viewport } from "../../../core/data/Synthesizer.type";
import type { Uuid } from "../../../core/data/Uuid.type";
import { DEFAULT_VIEWPORT } from "../../../core/shared/Constants";

describe("toViewport", () => {
  it("correctly transforms the synthesizer in a viewport", () => {
    const synthesizer: Synthesizer = { x: 10, y: 20, scale: 2.0 } as Synthesizer
    expect(toViewport(synthesizer)).toEqual({ position: { x: 10, y: 20 }, scale: 2.0 })
  })
})

describe("applyViewport", () => {
  it("correctly sets all keys on the synthesizer from the viewport", () => {
    const synthesizer: Synthesizer = { x: 0, y: 0, scale: 1.0 } as Synthesizer
    applyViewport(synthesizer, { position: { x: 1, y: 2 }, scale: 1.5 })
    expect(synthesizer).toMatchObject({ x: 1, y: 2, scale: 1.5 })
  })
})

describe("applyFacts", () => {
  const createRunner = () => {
    const called: SynthesizersEffects[] = []
    const run: RunEffectFct = async effect => { called.push(effect) }
    return { called, run }
  }
  const viewport: Viewport = { position: { x: 10, y: 20 }, scale: 2.5 }

  it("runs effects and applies the viewport if there are effects to run", async () => {
    const synthesizer: Synthesizer = { x: 0, y: 0, scale: 1.0 } as Synthesizer
    const runner = createRunner()
    const applyFacts = makeApplyFacts(runner.run)
    const effect: SynthesizersEffects = { type: "synthesizers.viewport.save", id: "ID" as Uuid, viewport }
    await applyFacts(synthesizer, { viewport, effects: [effect] })

    expect(runner.called).toEqual([ effect ])
    expect(synthesizer).toMatchObject({ x: 10, y: 20, scale: 2.5 })
  })
  it("only applies the viewport if there are no effects to run", async () => {
    const synthesizer: Synthesizer = { x: 0, y: 0, scale: 1.0 } as Synthesizer
    const runner = createRunner()
    const applyFacts = makeApplyFacts(runner.run)
    await applyFacts(synthesizer, { viewport, effects: [ ] })

    expect(runner.called).toEqual([ ])
    expect(synthesizer).toMatchObject({ x: 10, y: 20, scale: 2.5 })
  })
  it("propagates the error of a failing effect", async () => {
    const synthesizer: Synthesizer = { x: 0, y: 0, scale: 1.0 } as Synthesizer
    const failing: RunEffectFct = async () => { throw new Error("save failed") }
    const effect: SynthesizersEffects = { type: "synthesizers.viewport.save", id: "ID" as Uuid, viewport }

    await expect(makeApplyFacts(failing)(synthesizer, { viewport, effects: [ effect ] })).rejects.toThrow("save failed")
    expect(synthesizer).toMatchObject({ x: 10, y: 20, scale: 2.5 })
  })
})

describe("makeResetSynthesizer", () => {
  const createApplier = () => {
    const called: { synthesizer: Synthesizer, facts: ViewportFacts }[] = []
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
    const called: { synthesizer: Synthesizer, facts: ViewportFacts }[] = []
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