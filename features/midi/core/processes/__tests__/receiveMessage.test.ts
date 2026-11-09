import { describe, expect, it } from "vitest";
import type { MidiMessage } from "../../data/MidiMessage.type";
import { receiveMessage } from "../receiveMessage.process";
import type { Allocation } from "../../data/Allocation.type";
import type { VoicesCount } from "../../data/VoicesCount.type";

describe("receiveMessage", () => {
  it("presses the corresponding key on a note.on message", () => {
    const allocation: Allocation = { voices: [ null, null ], pressed: [], voicesCount: 2 as VoicesCount }
    const message: MidiMessage = { kind: "note.on", note: 93, channel: 1 }
    expect(receiveMessage(allocation, 1, message)).toEqual({
      allocation: { voices: [ 93, null ], pressed: [ 93 ], voicesCount: 2 },
      effects: [
        { type: "midi.voice.gate", voice: 0, state: "open"},
        { type: "midi.voice.pitch", voice: 0, voltage: 2}
      ]
    })
  })
  it("releases the corresponding key on a note.off message", () => {
    const allocation: Allocation = { voices: [ 93, null ], pressed: [ 93 ], voicesCount: 2 as VoicesCount }
    const message: MidiMessage = { kind: "note.off", note: 93, channel: 1 }
    expect(receiveMessage(allocation, 1, message)).toEqual({
      allocation: { voices: [ null, null ], pressed: [], voicesCount: 2 },
      effects: [
        { type: "midi.voice.gate", voice: 0, state: "closed"},
      ]
    })
  })
  it("does not press the corresponding key if both channels are different", () => {
    const allocation: Allocation = { voices: [ null, null ], pressed: [], voicesCount: 2 as VoicesCount }
    const message: MidiMessage = { kind: "note.on", note: 93, channel: 1 }
    expect(receiveMessage(allocation, 2, message)).toEqual({
      allocation: { voices: [ null, null ], pressed: [], voicesCount: 2 },
      effects: []
    })
  })
  it("does not handle the modwheel if it was meant for another channel", () => {
    const allocation: Allocation = { voices: [ null, null ], pressed: [], voicesCount: 2 as VoicesCount }
    const message: MidiMessage = { kind: "control", controller: 1, channel: 1, value: 10 }
    expect(receiveMessage(allocation, 2, message)).toEqual({
      allocation: { voices: [ null, null ], pressed: [], voicesCount: 2 },
      effects: []
    })
  })
  it("does handle the modwheel if it was meant for this channel", () => {
    const allocation: Allocation = { voices: [ null, null ], pressed: [], voicesCount: 2 as VoicesCount }
    const message: MidiMessage = { kind: "control", controller: 1, channel: 1, value: 127 }
    expect(receiveMessage(allocation, 1, message)).toEqual({
      allocation: { voices: [ null, null ], pressed: [], voicesCount: 2 },
      effects: [
        { type: "midi.modwheel", amount: 10 }
      ]
    })
  })
  it("does handle the modwheel at half max value if it was meant for this channel", () => {
    const allocation: Allocation = { voices: [ null, null ], pressed: [], voicesCount: 2 as VoicesCount }
    const message: MidiMessage = { kind: "control", controller: 1, channel: 1, value: 64 }
    expect(receiveMessage(allocation, 1, message)).toEqual({
      allocation: { voices: [ null, null ], pressed: [], voicesCount: 2 },
      effects: [
        { type: "midi.modwheel", amount: expect.closeTo(5.04, 2) }
      ]
    })
  })
  it("does not handle any other control than the modwheel (controller value is 0)", () => {
    const allocation: Allocation = { voices: [ null, null ], pressed: [], voicesCount: 2 as VoicesCount }
    const message: MidiMessage = { kind: "control", controller: 0, channel: 1, value: 64 }
    expect(receiveMessage(allocation, 1, message)).toEqual({
      allocation: { voices: [ null, null ], pressed: [], voicesCount: 2 }, effects: []
    })
  })
  it("does not handle any other control than the modwheel (controller value is above)", () => {
    const allocation: Allocation = { voices: [ null, null ], pressed: [], voicesCount: 2 as VoicesCount }
    const message: MidiMessage = { kind: "control", controller: 12, channel: 1, value: 64 }
    expect(receiveMessage(allocation, 1, message)).toEqual({
      allocation: { voices: [ null, null ], pressed: [], voicesCount: 2 }, effects: []
    })
  })
})