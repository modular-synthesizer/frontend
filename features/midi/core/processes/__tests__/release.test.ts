import { describe, expect, it } from "vitest";
import type { Allocation } from "../../data/Allocation.type";
import type { VoicesCount } from "../../data/VoicesCount.type";
import { release } from "../release.process";
import { deepFreeze } from "../../../../shared/__tests__/utils/deepFreeze";

describe("release", () => {
  it("does nothing if the note is nowhere to be found", () => {
    const allocation: Allocation = {
      pressed: [ 60, 93 ], voices: [ 60, 93 ], voicesCount: 2 as VoicesCount
    }
    expect(release(allocation, 81)).toEqual({
      allocation: { pressed: [ 60, 93 ], voices: [ 60, 93 ], voicesCount: 2 }, effects: []
    })
  })
  it("releases the note if the released key is found in the currently pressed keys and voices", () => {
    const allocation: Allocation = {
      pressed: [ 60, 93 ], voices: [ 60, 93 ], voicesCount: 2 as VoicesCount
    }
    expect(release(allocation, 93)).toEqual({
      allocation: { pressed: [ 60 ], voices: [ 60, null ], voicesCount: 2 },
      effects: [ { type: "midi.voice.gate", state: "closed", voice: 1 } ]
    })
  })
  it("releases the first voice if the released note was played on it", () => {
    const allocation: Allocation = {
      pressed: [ 60, 93 ], voices: [ 60, 93 ], voicesCount: 2 as VoicesCount
    }
    expect(release(allocation, 60)).toEqual({
      allocation: { pressed: [ 93 ], voices: [ null, 93 ], voicesCount: 2 },
      effects: [ { type: "midi.voice.gate", state: "closed", voice: 0 } ]
    })
  })
  it("triggers no effect if the released key is in pressed, but was previously stolen", () => {
    const allocation: Allocation = {
      pressed: [ 60, 81, 93 ], voices: [ 60, 93 ], voicesCount: 2 as VoicesCount
    }
    expect(release(allocation, 81)).toEqual({
      allocation: { pressed: [ 60, 93 ], voices: [ 60, 93 ], voicesCount: 2 }, effects: []
    })
  })
  it("replaces the note in the release voice with 0 if it's in the pressed but stolen notes", () => {
    const allocation: Allocation = {
      pressed: [ 60, 0, 93 ], voices: [ 60, 93 ], voicesCount: 2 as VoicesCount
    }
    expect(release(allocation, 93)).toEqual({
      allocation: { pressed: [ 60, 0 ], voices: [ 60, 0 ], voicesCount: 2 },
      effects: [ { type: "midi.voice.pitch", voice: 1, voltage: -5.75 } ]
    })
  })
  it("looks for a previously stolen note in the pressed ones to change the pitch", () => {
    const allocation: Allocation = {
      pressed: [ 60, 81, 93 ], voices: [ 60, 93 ], voicesCount: 2 as VoicesCount
    }
    expect(release(allocation, 93)).toEqual({
      allocation: { pressed: [ 60, 81 ], voices: [ 60, 81 ], voicesCount: 2 },
      effects: [ { type: "midi.voice.pitch", voice: 1, voltage: 1 } ]
    })
  })
  it("looks for a previously stolen note between several ones in the pressed notes to change the pitch", () => {
    const allocation: Allocation = {
      pressed: [ 60, 64, 69, 72 ], voices: [ 60, 72 ], voicesCount: 2 as VoicesCount
    }
    expect(release(allocation, 72)).toEqual({
      allocation: { pressed: [ 60, 64, 69 ], voices: [ 60, 69 ], voicesCount: 2 },
      effects: [ { type: "midi.voice.pitch", voice: 1, voltage: 0 } ]
    })
  })
  describe("frozen objects", () => {
    it.each(
      [
        { name: "released unknown note", allocation: { voices: [ null, null ], pressed: [], voicesCount: 2 as VoicesCount }, note: 60 },
        { name: "released voice", allocation: { voices: [ 60, 67 ], pressed: [ 60, 67 ], voicesCount: 2 as VoicesCount }, note: 60 },
        { name: "restored stolen voice", allocation: { voices: [ 60, 67 ], pressed: [ 60, 82, 67 ], voicesCount: 2 as VoicesCount }, note: 60 },
      ]
    )("does not modify the allocation it receives ($name)", ({ allocation, note }) => {
      const before = structuredClone(allocation)
      const frozen: Allocation = deepFreeze(allocation)

      expect(() => release(frozen, note)).not.toThrow()
      expect(frozen).toEqual(before)
    })
  })
})
