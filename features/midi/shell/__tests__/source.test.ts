import { describe, expect, it, vi } from "vitest"
import type { MidiMessage } from "../../core/data/MidiMessage.type"
import { makeWebMidiSource, type MidiInputLike } from "../webmidi"

describe("makeWebMidiSource", () => {
  const makeInput = (id: string) => Object.assign(new EventTarget(), { id })
  const makeAccess = (...inputs: MidiInputLike[]) =>
    Object.assign(new EventTarget(), { inputs: new Map(inputs.map(input => [ input.id, input ])) })
  const midiMessage = (...data: number[]) =>
    Object.assign(new Event("midimessage"), { data: new Uint8Array(data) })
  const stateChange = (port: MidiInputLike, type: string, state: string) =>
    Object.assign(new Event("statechange"), { port: Object.assign(port, { type, state }) })

  describe("receiving messages on already existing inputs", () => {
    it("emits the decoded messages of an input present at start", () => {
      const input = makeInput("keyboard")
      const received: MidiMessage[] = []
      makeWebMidiSource(makeAccess(input), message => { received.push(message) })

      input.dispatchEvent(midiMessage(0x92, 60, 100))

      expect(received).toEqual([ { kind: "note.on", channel: 3, note: 60 } ])
    })

    it("emits the messages of every input present at start", () => {
      const first = makeInput("first")
      const second = makeInput("second")
      const received: MidiMessage[] = []
      makeWebMidiSource(makeAccess(first, second), message => { received.push(message) })

      first.dispatchEvent(midiMessage(0x90, 60, 100))
      second.dispatchEvent(midiMessage(0x91, 64, 100))

      expect(received).toEqual([
        { kind: "note.on", channel: 1, note: 60 },
        { kind: "note.on", channel: 2, note: 64 }
      ])
    })

    it("does not emit the system messages ignored by the decoder", () => {
      const input = makeInput("keyboard")
      const received: MidiMessage[] = []
      makeWebMidiSource(makeAccess(input), message => { received.push(message) })

      input.dispatchEvent(midiMessage(0xF8))
      input.dispatchEvent(midiMessage(0xFE))

      expect(received).toEqual([])
    })

    it("ignores the events carrying no data, without throwing", () => {
      const input = makeInput("keyboard")
      const addEventListener = vi.spyOn(input, "addEventListener")
      const received: MidiMessage[] = []
      makeWebMidiSource(makeAccess(input), message => { received.push(message) })
      const listener = addEventListener.mock.calls[0]?.[1] as (event: Event) => void

      expect(() => listener(new Event("midimessage"))).not.toThrow()
      expect(() => listener(Object.assign(new Event("midimessage"), { data: null }))).not.toThrow()
      expect(received).toEqual([])
    })
  })
  describe("connecting new inputs when the MIDI is already created", () => {
    it("emits the messages of an input connected after start", () => {
      const access = makeAccess()
      const input = makeInput("keyboard")
      const received: MidiMessage[] = []
      makeWebMidiSource(access, message => { received.push(message) })

      access.dispatchEvent(stateChange(input, "input", "connected"))
      input.dispatchEvent(midiMessage(0x90, 60, 100))

      expect(received).toEqual([ { kind: "note.on", channel: 1, note: 60 } ])
    })
    it("emits only once when the same input is announced connected twice", () => {
      const access = makeAccess()
      const input = makeInput("keyboard")
      const received: MidiMessage[] = []
      makeWebMidiSource(access, message => { received.push(message) })

      access.dispatchEvent(stateChange(input, "input", "connected"))
      access.dispatchEvent(stateChange(input, "input", "connected"))
      input.dispatchEvent(midiMessage(0x90, 60, 100))

      expect(received).toEqual([ { kind: "note.on", channel: 1, note: 60 } ])
    })
    it("emits only once when an input present at start is announced connected", () => {
      const input = makeInput("keyboard")
      const access = makeAccess(input)
      const received: MidiMessage[] = []
      makeWebMidiSource(access, message => { received.push(message) })

      access.dispatchEvent(stateChange(input, "input", "connected"))
      input.dispatchEvent(midiMessage(0x90, 60, 100))

      expect(received).toEqual([ { kind: "note.on", channel: 1, note: 60 } ])
    })
    it("does not plug an output", () => {
      const access = makeAccess()
      const output = makeInput("synthesizer")
      const received: MidiMessage[] = []
      makeWebMidiSource(access, message => { received.push(message) })

      access.dispatchEvent(stateChange(output, "output", "connected"))
      output.dispatchEvent(midiMessage(0x90, 60, 100))

      expect(received).toEqual([])
    })
    it("ignores a state change carrying no port, without throwing", () => {
      const access = makeAccess()
      const addEventListener = vi.spyOn(access, "addEventListener")
      makeWebMidiSource(access, () => {})
      const listener = addEventListener.mock.calls[0]?.[1] as (event: Event) => void

      expect(() => listener(new Event("statechange"))).not.toThrow()
    })
  })

  describe("when disconnecting and reconnecting inputs", () => {
    it("stops emitting the messages of a disconnected input", () => {
      const input = makeInput("keyboard")
      const access = makeAccess(input)
      const received: MidiMessage[] = []
      makeWebMidiSource(access, message => { received.push(message) })

      access.dispatchEvent(stateChange(input, "input", "disconnected"))
      input.dispatchEvent(midiMessage(0x90, 60, 100))

      expect(received).toEqual([])
    })
    it("emits again, only once, when a disconnected input is reconnected", () => {
      const input = makeInput("keyboard")
      const access = makeAccess(input)
      const received: MidiMessage[] = []
      makeWebMidiSource(access, message => { received.push(message) })

      access.dispatchEvent(stateChange(input, "input", "disconnected"))
      access.dispatchEvent(stateChange(input, "input", "connected"))
      input.dispatchEvent(midiMessage(0x90, 60, 100))

      expect(received).toEqual([ { kind: "note.on", channel: 1, note: 60 } ])
    })
    it("replaces an input reconnected as a new object with the same id", () => {
      const previous = makeInput("keyboard")
      const current = makeInput("keyboard")
      const access = makeAccess(previous)
      const received: MidiMessage[] = []
      makeWebMidiSource(access, message => { received.push(message) })

      access.dispatchEvent(stateChange(current, "input", "connected"))
      previous.dispatchEvent(midiMessage(0x90, 60, 100))
      current.dispatchEvent(midiMessage(0x90, 62, 100))

      expect(received).toEqual([ { kind: "note.on", channel: 1, note: 62 } ])
    })
  })

  describe("when stopping the whole MIDI source", () => {
    it("stops emitting the messages of every plugged input", () => {
      const initial = makeInput("initial")
      const plugged = makeInput("plugged")
      const access = makeAccess(initial)
      const received: MidiMessage[] = []
      const source = makeWebMidiSource(access, message => { received.push(message) })
      access.dispatchEvent(stateChange(plugged, "input", "connected"))

      source.stop()
      initial.dispatchEvent(midiMessage(0x90, 60, 100))
      plugged.dispatchEvent(midiMessage(0x90, 62, 100))

      expect(received).toEqual([])
    })
    it("does not plug the inputs connected after being stopped", () => {
      const access = makeAccess()
      const input = makeInput("keyboard")
      const received: MidiMessage[] = []
      const source = makeWebMidiSource(access, message => { received.push(message) })

      source.stop()
      access.dispatchEvent(stateChange(input, "input", "connected"))
      input.dispatchEvent(midiMessage(0x90, 60, 100))

      expect(received).toEqual([])
    })
    it("can be stopped twice without throwing", () => {
      const source = makeWebMidiSource(makeAccess(makeInput("keyboard")), () => {})

      source.stop()
      expect(() => source.stop()).not.toThrow()
    })
  })
})