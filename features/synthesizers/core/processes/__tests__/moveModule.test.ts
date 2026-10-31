import { describe, expect, it } from "vitest";
import { moveModule } from "../moveModule.process";
import type { Footprint } from "../../data/Footprint.type";
import type { Placement } from "../../data/Placement.type";
import type { Uuid } from "../../../../shared/data/Uuid.type";
import type { SynthesizersEffect } from "../../data/Effect.type";

describe("moveModule", () => {
  it("returns a save module effect if the module can be moved to the destination", () => {
    const to: Placement = { rack: 2, slot: 5 }
    const from: Footprint = { id: "first" as Uuid, placement: { rack: 0, slot: 0 }, slots: 10 }
    const context: Footprint[] = [ { id: "second" as Uuid, placement: { rack: 1, slot: 0 }, slots: 10 } ]
    const effect: SynthesizersEffect = { type: "synthesizers.module.save", id: "first" as Uuid, placement: { rack: 2, slot: 5 }}
    expect(moveModule(from, to, context)).toEqual({ placement: to, effects: [ effect ] })
  })
  it("does not return a save module effect when a module has no room in its context", () => {
    const to: Placement = { rack: 1, slot: 5 }
    const from: Footprint = { id: "first" as Uuid, placement: { rack: 0, slot: 0 }, slots: 10 }
    const context: Footprint[] = [ { id: "second" as Uuid, placement: { rack: 1, slot: 0 }, slots: 10 }]
    expect(moveModule(from, to, context)).toEqual({ placement: from.placement, effects: [] })
  })
  it("does not return a save module effect if the module has not moved", () => {
    const to: Placement = { rack: 0, slot: 0 }
    const from: Footprint = { id: "first" as Uuid, placement: to, slots: 10 }
    const context: Footprint[] = [ { id: "second" as Uuid, placement: { rack: 1, slot: 0 }, slots: 10 }]
    expect(moveModule(from, to, context)).toEqual({ placement: from.placement, effects: [] })
  })
  it("can move the module if it only intersects with itself", () => {
    const from: Footprint = { id: "first" as Uuid, placement: { slot: 0, rack: 0 }, slots: 10 }
    const to: Placement = { rack: 0, slot: 5 }
    expect(moveModule(from, to, [ from ])).toEqual({
      placement: to,
      effects: [
        { type: "synthesizers.module.save", id: "first" as Uuid, placement: { rack: 0, slot: 5 }}
      ]
    })
  })
})
