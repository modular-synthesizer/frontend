import { describe, expect, it } from "vitest"
import { RACK_HEIGHT, SLOT_SIZE } from "../Constants"
import { hasRoom, overlaps, placementsDiffer, toPlacement, toPosition } from "../rack"
import type { Footprint } from "../../data/Footprint.type"
import type { Uuid } from "../../../../shared/data/Uuid.type"

describe("toPlacement", () => {
  it("rounds the rack up if needed", () => {
    expect(toPlacement({ x: 0, y: RACK_HEIGHT - 1})).toEqual({ slot: 0, rack: 1 })
  })
  it("rounds the rack down if needed", () => {
    expect(toPlacement({ x: 0, y: RACK_HEIGHT + 1})).toEqual({ slot: 0, rack: 1 })
  })
  it("does not round the rack if not needed", () => {
    expect(toPlacement({ x: 0, y: RACK_HEIGHT })).toEqual({ slot: 0, rack: 1 })
  })
  it("rounds the slot up if needed", () => {
    expect(toPlacement({ x: SLOT_SIZE - 1, y: 0 })).toEqual({ slot: 1, rack: 0 })
  })
  it("rounds the slot down if needed", () => {
    expect(toPlacement({ x: SLOT_SIZE + 1, y: 0 })).toEqual({ slot: 1, rack: 0 })
  })
  it("does not round the slot if not needed", () => {
    expect(toPlacement({ x: SLOT_SIZE, y: 0 })).toEqual({ slot: 1, rack: 0 })
  })
  it("works with negative coordinates", () => {
    expect(toPlacement({ x: 1 - SLOT_SIZE, y: 1 - RACK_HEIGHT})).toEqual({ slot: -1, rack: -1 })
  })
})

describe("toPosition", () => {
  it("returns the correct position for a given placement", () => {
    expect(toPosition({ rack: 2, slot: 1 })).toEqual({ x: SLOT_SIZE, y: RACK_HEIGHT * 2 })
  })
  it("returns the correct position for the 0:0 placement", () => {
    expect(toPosition({ rack: 0, slot: 0 })).toEqual({ x: 0, y: 0 })
  })
  it("works with negative position", () => {
    expect(toPosition({ rack: -2, slot: -1 })).toEqual({ x: -SLOT_SIZE, y: RACK_HEIGHT * -2 })
  })
})

describe("placementsDiffer", () => {
  it("detects if two placements differ by their rack", () => {
    expect(placementsDiffer({ rack: 0, slot: 0 }, { rack: 1, slot: 0 })).toEqual(true)
  })
  it("detects if two placements differ by their slot", () => {
    expect(placementsDiffer({ rack: 0, slot: 0 }, { rack: 0, slot: 1 })).toEqual(true)
  })
  it("returns FALSE if two placements are the same", () => {
    expect(placementsDiffer({ rack: 0, slot: 0 }, { rack: 0, slot: 0 })).toEqual(false)
  })
})

describe("overlaps", () => {
  it("returns TRUE if two modules overlap from left to right", () => {
    const first: Footprint = { id: "first" as Uuid, placement: { rack: 0, slot: 0 }, slots: 10 }
    const second: Footprint = { id: "second" as Uuid, placement: { rack: 0, slot: 5 }, slots: 10 }
    expect(overlaps(first, second)).toEqual(true)
  })
  it("returns TRUE if two modules overlap from right to left", () => {
    const first: Footprint = { id: "first" as Uuid, placement: { rack: 0, slot: 5 }, slots: 10 }
    const second: Footprint = { id: "second" as Uuid, placement: { rack: 0, slot: 0 }, slots: 10 }
    expect(overlaps(first, second)).toEqual(true)
  })
  it("returns FALSE for two adjacent modules left to right", () => {
    const first: Footprint = { id: "first" as Uuid, placement: { rack: 0, slot: 0 }, slots: 5 }
    const second: Footprint = { id: "second" as Uuid, placement: { rack: 0, slot: 5 }, slots: 5 }
    expect(overlaps(first, second)).toEqual(false)
  })
  it("returns FALSE for two adjacent modules right to left", () => {
    const first: Footprint = { id: "first" as Uuid, placement: { rack: 0, slot: 5 }, slots: 5 }
    const second: Footprint = { id: "second" as Uuid, placement: { rack: 0, slot: 0 }, slots: 5 }
    expect(overlaps(first, second)).toEqual(false)
  })
  it("returns FALSE if two modules are on different racks but overlapping slots", () => {
    const first: Footprint = { id: "first" as Uuid, placement: { rack: 0, slot: 0 }, slots: 10 }
    const second: Footprint = { id: "second" as Uuid, placement: { rack: 1, slot: 0 }, slots: 10 }
    expect(overlaps(first, second)).toEqual(false)
  })
  it("does not overlap with itself", () => {
    const module: Footprint = { id: "first" as Uuid, placement: { rack: 0, slot: 0 }, slots: 10 }
    expect(overlaps(module, module)).toEqual(false)
  })
  it("returns TRUE if one of the modules is entirely contained in another", () => {
    const first: Footprint = { id: "first" as Uuid, placement: { rack: 0, slot: 0 }, slots: 10 }
    const second: Footprint = { id: "second" as Uuid, placement: { rack: 0, slot: 1 }, slots: 5 }
    expect(overlaps(first, second)).toEqual(true)
  })
})

describe("hasRoom", () => {
  const footprint: Footprint = { id: "first" as Uuid, placement: { rack: 0, slot: 0 }, slots: 10 }

  it("has room in an empty list", () => {
    expect(hasRoom(footprint, [])).toEqual(true)
  })
  it("has room in a list when no other module overlaps", () => {
    const second: Footprint = { id: "second" as Uuid, placement: { rack: 1, slot: 0 }, slots: 10 }
    expect(hasRoom(footprint, [ second ])).toEqual(true)
  })
  it("does not have room in a list with an overlapping module", () => {
    const second: Footprint = { id: "second" as Uuid, placement: { rack: 0, slot: 5 }, slots: 10 }
    const third: Footprint = { id: "second" as Uuid, placement: { rack: 1, slot: 0 }, slots: 10 }
    expect(hasRoom(footprint, [ third, second ])).toEqual(false)
  })
})
