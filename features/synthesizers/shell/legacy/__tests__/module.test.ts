import { describe, expect, it } from "vitest"
import type { AudioModule } from "~/types/Index"
import { acceptsModuleAt, applyPlacement, makeMoveModule, obstacles, syncModule, toFootprint } from "../module.adapter"
import { RACK_HEIGHT, SLOT_SIZE } from "../../../core/shared/Constants"
import type { Placement } from "../../../../synthesizers/core/data/Placement.type"
import type { SynthesizersEffect } from "../../../../synthesizers/core/data/Effect.type"
import type { RunEffectFct } from "../../../../shared/facts"

describe("toFootprint", () => {
  const module = { id: "test", rack: 1, slot: 2, slots: 10 } as AudioModule
  it("returns the footprint of the module if there is no overwriting placement", () => {
    expect(toFootprint(module)).toEqual({ id: "test", placement: { rack: 1, slot: 2 }, slots: 10 })
  })
  it("overwrites the placement if one is given", () => {
    const placement: Placement = { rack: 2, slot: 20 }
    expect(toFootprint(module, placement)).toEqual({ id: "test", placement: { rack: 2, slot: 20 }, slots: 10 })
  })
})

describe("applyPlacement", () => {
  it("correctly applies all the coordinates", () => {
    const module = { rack: 0, slot: 0, x: 0, y: 0 } as AudioModule
    applyPlacement(module, { rack: 1, slot: 10 })
    expect(module).toMatchObject({ rack: 1, slot: 10, x: 10 * SLOT_SIZE, y: RACK_HEIGHT })
  })
})

describe("obstacles", () => {
  it("returns an empty array for an empty list of modules", () => {
    expect(obstacles([])).toEqual([])
  })
  it("returns only non deleted modules", () => {
    const notDeleted = { id: "notDeleted", slot: 20, rack: 0, slots: 10, deleted: false } as AudioModule
    const deleted = { id: "deleted", slot: 5, rack: 1, slots: 5, deleted: true } as AudioModule
    expect(obstacles([ deleted, notDeleted ])).toEqual([ { id: notDeleted.id, placement: { rack: 0, slot: 20 }, slots: 10 }])
  })
})

describe("syncModule", () => {
  it("updates the coordinates of an out-of-sync module", () => {
    const module = { x: SLOT_SIZE - 1, y: RACK_HEIGHT + 1, rack: 0, slot: 0 } as AudioModule
    syncModule(module)
    expect(module).toMatchObject({ slot: 1, rack: 1 })
  })
})

describe("acceptsModuleAt", () => {
  it("accepts a module in an empty context", () => {
    const module = { id: "test", rack: 0, slot: 0, slots: 10 } as AudioModule
    expect(acceptsModuleAt(module, { x: 0, y: 0 }, [])).toBe(true)
  })
  it("accepts a module at the position of a deleted one", () => {
    const module = { id: "test", rack: 0, slot: 0, slots: 10 } as AudioModule
    const deleted = { id: "obstacle", rack: 1, slot: 1, slots: 10, deleted: true } as AudioModule
    expect(acceptsModuleAt(module, { x: SLOT_SIZE, y: RACK_HEIGHT }, [ deleted ])).toBe(true)
  })
  it("accepts a module at an empty position", () => {
    const module = { id: "test", rack: 0, slot: 0, slots: 10 } as AudioModule
    const obstacle = { id: "obstacle", rack: 1, slot: 11, slots: 10 } as AudioModule
    expect(acceptsModuleAt(module, { x: 0, y: RACK_HEIGHT }, [ obstacle ])).toBe(true)
  })
  it("does not accept a module at an occupied position", () => {
    const module = { id: "test", rack: 0, slot: 0, slots: 10 } as AudioModule
    const obstacle = { id: "obstacle", rack: 1, slot: 1, slots: 10 } as AudioModule
    expect(acceptsModuleAt(module, { x: 0, y: RACK_HEIGHT }, [ obstacle ])).toBe(false)
  })
})

describe("makeMoveModule", () => {
  const createMoveModule = () => {
    const effects: SynthesizersEffect[] = []
    const run: RunEffectFct<SynthesizersEffect> = async (effect) => { effects.push(effect) }
    return { effects, move: makeMoveModule(run) }
  }
  it("sends the effect if the module is already at the destination", async () => {
    const module = { id: "test", rack: 1, slot: 1, slots: 10, x: SLOT_SIZE, y: RACK_HEIGHT } as AudioModule
    const { effects, move } = createMoveModule()
    await move(module, { x: 0, y: 0 }, { x: SLOT_SIZE, y: RACK_HEIGHT }, [ module ])

    expect(effects).toEqual([ { type: "synthesizers.module.save", id: "test", placement: { rack: 1, slot: 1 } } ])
  })
  it("does not send an effect if the module has not moved", async () => {
    const module = { id: "test", rack: 0, slot: 0, slots: 10 } as AudioModule
    const { effects, move } = createMoveModule()
    await move(module, { x: 0, y: 0 }, { x: 0, y: 0 }, [])

    expect(effects).toEqual([])
  })
  it("returns a module dropped on an occupied place to its original position", async () => {
    const module = { id: "test", rack: 1, slot: 1, slots: 10, x: SLOT_SIZE, y: RACK_HEIGHT } as AudioModule
    const obstacle = { id: "obstacle", rack: 1, slot: 1, slots: 10, x: SLOT_SIZE, y: RACK_HEIGHT } as AudioModule
    const { effects, move } = createMoveModule()
    await move(module, { x: 0, y: 0 }, { x: SLOT_SIZE, y: RACK_HEIGHT }, [ obstacle ])

    expect(effects).toEqual([])
    expect(module).toMatchObject({ rack: 0, slot: 0, x: 0, y: 0 })
  })
  it("runs the effect if the module can be dropped at the position", async () => {
    const module = { id: "test", rack: 0, slot: 0, slots: 10 } as AudioModule
    const { effects, move } = createMoveModule()
    await move(module, { x: 0, y: 0 }, { x: SLOT_SIZE, y: RACK_HEIGHT }, [])

    expect(effects).toEqual([ { type: "synthesizers.module.save", id: "test", placement: { rack: 1, slot: 1 } } ])
  })
  it("propagates the error if there is any", async () => {
    const module = { rack: 0, slot: 0, slots: 10 } as AudioModule
    const moveModule = makeMoveModule(async () => { throw new Error("apply failed") })

    await expect(moveModule(module, { x: 0, y: 0 }, { x: 10, y: 10 }, [])).rejects.toThrow("apply failed")
  })
})