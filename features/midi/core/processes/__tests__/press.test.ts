import { describe, expect, it } from "vitest";
import { press } from "../press.process";
import type { Allocation } from "../../data/Allocation.type";
import type { VoicesCount } from "../../data/VoicesCount.type";
import { deepFreeze } from "../../../../shared/__tests__/utils/deepFreeze";

describe("press", () => {
  describe("monophonic allocation", () => {
    it("does not trigger any effect if the pressed key was already pressed", () => {
      const allocation: Allocation = { voices: [ 93 ], pressed: [ 93 ], voicesCount: 1 as VoicesCount }
      expect(press(allocation, 93)).toEqual({
        allocation: { voices: [ 93 ], pressed: [ 93 ], voicesCount: 1 }, effects: []
      })
    })
    it("triggers only the pitch effect if the only voice was occupied", () => {
      const allocation: Allocation = { voices: [ 60 ], pressed: [ 55, 60 ], voicesCount: 1 as VoicesCount }

      expect(press(allocation, 81)).toEqual({
        allocation: { voices: [ 81 ], pressed: [ 55, 60, 81 ], voicesCount: 1 },
        effects: [ { type: "midi.voice.pitch", voice: 0, voltage: 1 } ]
      })
    })
    it("triggers both effects if the only voice was free", () => {
      const allocation: Allocation = { voices: [ null ], pressed: [ ], voicesCount: 1 as VoicesCount }

      expect(press(allocation, 93)).toEqual({
        allocation: { voices: [ 93 ], pressed: [ 93 ], voicesCount: 1 },
        effects: [
          { type: "midi.voice.gate", voice: 0, state: "open" },
          { type: "midi.voice.pitch", voice: 0, voltage: 2 }
        ]
      })
    })
  })
  describe("polyphonic allocation", () => {
    it("does not trigger any effect if the key was already pressed in one of the voices", () => {
      const allocation: Allocation = { voices: [ 60, 93 ], pressed: [ 60, 93 ], voicesCount: 2 as VoicesCount }
      expect(press(allocation, 93)).toEqual({
        allocation: { voices: [ 60, 93 ], pressed: [ 60, 93 ], voicesCount: 2 }, effects: []
      })
    })
    it("triggers both effects if all voices are free when pressing the key", () => {
      const allocation: Allocation = { voices: [ null, null ], pressed: [ ], voicesCount: 2 as VoicesCount }
      
      expect(press(allocation, 81)).toEqual({
        allocation: { voices: [ 81, null ], pressed: [ 81 ], voicesCount: 2 },
        effects: [
          { type: "midi.voice.gate", voice: 0, state: "open" },
          { type: "midi.voice.pitch", voice: 0, voltage: 1 }
        ]
      })
    })
    it("triggers both effects if only the last voice is free", () => {
      const allocation: Allocation = { voices: [ 60, 67, null ], pressed: [ 60, 67 ], voicesCount: 3 as VoicesCount }

      expect(press(allocation, 93)).toEqual({
        allocation: { voices: [ 60, 67, 93 ], pressed: [ 60, 67, 93 ], voicesCount: 3 },
        effects: [
          { type: "midi.voice.gate", voice: 2, state: "open" },
          { type: "midi.voice.pitch", voice: 2, voltage: 2 }
        ]
      })
    })
    it("triggers both effects if one voice in the middle is still free", () => {
      const allocation: Allocation = { voices: [ 60, null, 67 ], pressed: [ 60, 67 ], voicesCount: 3 as VoicesCount }

      expect(press(allocation, 93)).toEqual({
        allocation: { voices: [ 60, 93, 67 ], pressed: [ 60, 67, 93 ], voicesCount: 3 },
        effects: [
          { type: "midi.voice.gate", voice: 1, state: "open" },
          { type: "midi.voice.pitch", voice: 1, voltage: 2 }
        ]
      })
    })
    it("triggers both effects if only the first voice is free", () => {
      const allocation: Allocation = { voices: [ null, 60, 67 ], pressed: [ 60, 67 ], voicesCount: 3 as VoicesCount }

      expect(press(allocation, 93)).toEqual({
        allocation: { voices: [ 93, 60, 67 ], pressed: [ 60, 67, 93 ], voicesCount: 3 },
        effects: [
          { type: "midi.voice.gate", voice: 0, state: "open" },
          { type: "midi.voice.pitch", voice: 0, voltage: 2 }
        ]
      })
    })
    it("triggers only the pitch effect if all voices are occupied by other notes", () => {
      const allocation: Allocation = { voices: [ 60, 67, 81 ], pressed: [ 60, 67, 81 ], voicesCount: 3 as VoicesCount }

      expect(press(allocation, 93)).toEqual({
        allocation: { voices: [ 60, 67, 93 ], pressed: [ 60, 67, 81, 93 ], voicesCount: 3 },
        effects: [
          { type: "midi.voice.pitch", voice: 2, voltage: 2 }
        ]
      })
    })
  })
  describe("frozen objects", () => {
    it.each(
      [
        { name: "free voice", allocation: { voices: [ null, null ], pressed: [], voicesCount: 2 as VoicesCount }, note: 93 },
        { name: "stolen voice", allocation: { voices: [ 60, 67 ], pressed: [ 60, 67 ], voicesCount: 2 as VoicesCount }, note: 93 },
      ]
    )("does not modify the allocation it receives ($name)", ({ allocation, note }) => {
      const before = structuredClone(allocation)
      const frozen: Allocation = deepFreeze(allocation)

      expect(() => press(frozen, note)).not.toThrow()
      expect(frozen).toEqual(before)
    })
  })
})