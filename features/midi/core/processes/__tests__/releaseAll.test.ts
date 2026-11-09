import { describe, expect, it } from "vitest";
import type { VoicesCount } from "../../data/VoicesCount.type";
import type { Allocation } from "../../data/Allocation.type";
import { releaseAll } from "../releaseAll.process";
import { deepFreeze } from "../../../../shared/__tests__/utils/deepFreeze";

describe("releaseAll", () => {
  it("releases voices if there are some busy ones", () => {
    const allocation: Allocation = {
      pressed: [ 60, 64 ], voices: [ 60, 64 ], voicesCount: 2 as VoicesCount
    }
    expect(releaseAll(allocation)).toEqual({
      allocation: { pressed: [], voices: [ null, null ], voicesCount: 2 },
      effects: [
        { type: "midi.voice.gate", state: "closed", voice: 0 },
        { type: "midi.voice.gate", state: "closed", voice: 1 },
      ]
    })
  })
  it("releases voices even if there's an empty one in the middle", () => {
    const allocation: Allocation = {
      pressed: [ 60, 64 ], voices: [ 60, null, 64 ], voicesCount: 3 as VoicesCount
    }
    expect(releaseAll(allocation)).toEqual({
      allocation: { pressed: [], voices: [ null, null, null ], voicesCount: 3 },
      effects: [
        { type: "midi.voice.gate", state: "closed", voice: 0 },
        { type: "midi.voice.gate", state: "closed", voice: 2 },
      ]
    })
  })
  it("ignores the stolen notes and releases all the others", () => {
    const allocation: Allocation = {
      pressed: [ 60, 82, 64 ], voices: [ 60, 64 ], voicesCount: 2 as VoicesCount
    }
    expect(releaseAll(allocation)).toEqual({
      allocation: { pressed: [], voices: [ null, null ], voicesCount: 2 },
      effects: [
        { type: "midi.voice.gate", state: "closed", voice: 0 },
        { type: "midi.voice.gate", state: "closed", voice: 1 },
      ]
    })
  })
  it("does nothing if no note was currently played", () => {
    const allocation: Allocation = {
      pressed: [], voices: [ null, null ], voicesCount: 2 as VoicesCount
    }
    expect(releaseAll(allocation)).toEqual({
      allocation: { pressed: [], voices: [ null, null ], voicesCount: 2 }, effects: []
    })
  })

  describe("frozen objects", () => {
    it("does not modify the allocation it receives a releaseAll", () => {
      const allocation = { voices: [ 60, 67 ], pressed: [], voicesCount: 2 as VoicesCount }
      const before = structuredClone(allocation)
      const frozen: Allocation = deepFreeze(allocation)

      expect(() => releaseAll(frozen)).not.toThrow()
      expect(frozen).toEqual(before)
    })
  })
})
