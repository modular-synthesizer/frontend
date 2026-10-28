import { describe, expect, it } from "vitest";
import { applyViewport, makeApplyFacts, toViewport } from "../viewport.adapter"
import type { Viewport } from "../../../core/data/Viewport.type";
import type { ScaledCoordinates } from "~/types/utils/Coordinates";
import type { Effect, RunEffectFct } from "../../../../shared/facts";

describe("toViewport", () => {
  it("correctly transforms the legacy in a viewport", () => {
    const legacy: ScaledCoordinates = { x: 10, y: 20, scale: 2.0 }
    expect(toViewport(legacy)).toEqual({ position: { x: 10, y: 20 }, scale: 2.0 })
  })
})

describe("applyViewport", () => {
  it("correctly sets all keys on the legacy from the viewport", () => {
    const legacy: ScaledCoordinates = { x: 0, y: 0, scale: 1.0 }
    applyViewport(legacy, { position: { x: 1, y: 2 }, scale: 1.5 })
    expect(legacy).toMatchObject({ x: 1, y: 2, scale: 1.5 })
  })
})

describe("applyFacts", () => {
  const createRunner = () => {
    const called: Effect[] = []
    const run: RunEffectFct<Effect> = async effect => { called.push(effect) }
    return { called, run }
  }
  const viewport: Viewport = { position: { x: 10, y: 20 }, scale: 2.5 }

  it("runs effects and applies the viewport if there are effects to run", async () => {
    const legacy: ScaledCoordinates = { x: 0, y: 0, scale: 1.0 }
    const runner = createRunner()
    const applyFacts = makeApplyFacts(runner.run)
    const effect: Effect = { type: "test.effect" }
    await applyFacts(legacy, { viewport, effects: [effect] })

    expect(runner.called).toEqual([ effect ])
    expect(legacy).toMatchObject({ x: 10, y: 20, scale: 2.5 })
  })
  it("only applies the viewport if there are no effects to run", async () => {
    const legacy: ScaledCoordinates = { x: 0, y: 0, scale: 1.0 }
    const runner = createRunner()
    const applyFacts = makeApplyFacts(runner.run)
    await applyFacts(legacy, { viewport, effects: [ ] })

    expect(runner.called).toEqual([ ])
    expect(legacy).toMatchObject({ x: 10, y: 20, scale: 2.5 })
  })
  it("propagates the error of a failing effect", async () => {
    const legacy: ScaledCoordinates = { x: 0, y: 0, scale: 1.0 }
    const failing: RunEffectFct<Effect> = async () => { throw new Error("save failed") }
    const effect: Effect = { type: "test.effect" }

    await expect(makeApplyFacts(failing)(legacy, { viewport, effects: [ effect ] })).rejects.toThrow("save failed")
    expect(legacy).toMatchObject({ x: 10, y: 20, scale: 2.5 })
  })
})