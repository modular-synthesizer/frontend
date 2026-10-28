import { describe, expect, it } from "vitest";
import type { Uuid } from "../../../../shared/data/Uuid.type";
import type { ScaledCoordinates } from "~/types/utils/Coordinates";
import type { ViewportFacts } from "../../../../viewports/shell/legacy/viewport.adapter";
import { makePanBlueprint } from "../viewport.adapter";
import type { BlueprintsEffect } from "../../../core/data/Effect.type";
import type { Blueprint } from "~/types/blueprints/Blueprint";

describe("makePanBlueprint", () => {
  const createApplier = () => {
    const called: { blueprint: ScaledCoordinates, facts: ViewportFacts<BlueprintsEffect> }[] = []
    const pan = makePanBlueprint(async (blueprint, facts) => { called.push({ blueprint, facts }) })
    return { called, pan }
  }
  it("saves the blueprint if the stage has been moved, keeping the scale", async () => {
    const blueprint: Blueprint = { id: "id", x: 10, y: 10, scale: 2.0 } as Blueprint
    const applier = createApplier()
    await applier.pan(blueprint, { x: 0, y: 0 }, { x: 10, y: 10 })
    const viewport = { position: { x: 10, y: 10 }, scale: 2.0 }

    expect(applier.called).toHaveLength(1)
    expect(applier.called[0]?.blueprint).toBe(blueprint)
    expect(applier.called[0]?.facts).toEqual({
      viewport,
      effects: [ { type: "blueprints.viewport.save", id: "id" as Uuid, viewport } ]
    })
  })
  it("does not save the blueprint if it has not been moved", async () => {
    const blueprint: Blueprint = { id: "id", x: 0, y: 0, scale: 2.0 } as Blueprint
    const applier = createApplier()
    await applier.pan(blueprint, { x: 0, y: 0 }, { x: 0, y: 0 })
    const viewport = { position: { x: 0, y: 0 }, scale: 2.0 }

    expect(applier.called).toHaveLength(1)
    expect(applier.called[0]?.blueprint).toBe(blueprint)
    expect(applier.called[0]?.facts).toEqual({ viewport, effects: [] })
  })
  it("does not save the blueprint if the ID is empty as the blueprint has not been created yet", async () => {
    const blueprint: Blueprint = { id: "", x: 10, y: 10, scale: 2.0 } as Blueprint
    const applier = createApplier()
    await applier.pan(blueprint, { x: 0, y: 0 }, { x: 10, y: 10 })
    const viewport = { position: { x: 10, y: 10 }, scale: 2.0 }

    expect(applier.called).toHaveLength(1)
    expect(applier.called[0]?.blueprint).toBe(blueprint)
    expect(applier.called[0]?.facts).toEqual({ viewport, effects: [] })
  })
  it("propagates the error of the facts applier", async () => {
    const blueprint: Blueprint = { id: "id", x: 0, y: 0, scale: 1.0 } as Blueprint
    const pan = makePanBlueprint(async () => { throw new Error("apply failed") })

    await expect(pan(blueprint, { x: 0, y: 0 }, { x: 0, y: 0 })).rejects.toThrow("apply failed")
  })
})