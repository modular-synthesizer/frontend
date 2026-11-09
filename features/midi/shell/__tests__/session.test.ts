import { describe, expect, it } from "vitest"
import type { MidiMessage } from "../../core/data/MidiMessage.type"
import { startMidi } from "../session"
import type { MidiAccessLike, MidiInputLike, MidiNavigator } from "../webmidi"

describe("startMidi", () => {
  const makeInput = () => Object.assign(new EventTarget(), { id: "keyboard" })
  const makeAccess = (input: MidiInputLike): MidiAccessLike =>
    Object.assign(new EventTarget(), { inputs: new Map([ [ input.id, input ] ]) })
  const pressKey = (target: EventTarget, code: string) =>
    target.dispatchEvent(new KeyboardEvent("keydown", { code }))
  const midiMessage = (...data: number[]) =>
    Object.assign(new Event("midimessage"), { data: new Uint8Array(data) })

  const start = (navigator: MidiNavigator) => {
    const window = new EventTarget()
    const received: MidiMessage[] = []
    const session = startMidi({ navigator, window }, message => { received.push(message) })
    return { window, received, session }
  }
  const pending = () => {
    let resolve: (access: MidiAccessLike) => void = () => {}
    const promise = new Promise<MidiAccessLike>(r => { resolve = r })
    return { navigator: { requestMIDIAccess: () => promise }, resolve }
  }

  const keyboardNote = { kind: "note.on", channel: 0, note: 60 }
  const midiNote = { kind: "note.on", channel: 1, note: 64 }

  describe("starting the session", () => {
    it("plays the computer keyboard and reports 'unsupported' without Web MIDI", async () => {
      const { window, received, session } = start({})

      pressKey(window, "KeyQ")

      expect(received).toEqual([ keyboardNote ])
      expect(await session.access).toBe("unsupported")
    })
    it("plays the computer keyboard while the access is still pending", () => {
      const { window, received } = start(pending().navigator)

      pressKey(window, "KeyQ")

      expect(received).toEqual([ keyboardNote ])
    })
    it("reports 'denied', without rejecting, when the access is refused", async () => {
      const { session } = start({ requestMIDIAccess: () => Promise.reject(new Error("denied")) })

      await expect(session.access).resolves.toBe("denied")
    })
    it("reports 'ready' and plugs the MIDI inputs when the access is granted", async () => {
      const input = makeInput()
      const { received, session } = start({ requestMIDIAccess: async () => makeAccess(input) })

      expect(await session.access).toBe("ready")
      input.dispatchEvent(midiMessage(0x90, 64, 100))

      expect(received).toEqual([ midiNote ])
    })
  })

  describe("stopping the session", () => {
    it("stops the computer keyboard", () => {
      const { window, received, session } = start({})

      session.stop()
      pressKey(window, "KeyQ")

      expect(received).toEqual([])
    })
    it("stops the MIDI inputs", async () => {
      const input = makeInput()
      const { received, session } = start({ requestMIDIAccess: async () => makeAccess(input) })
      await session.access

      session.stop()
      input.dispatchEvent(midiMessage(0x90, 64, 100))

      expect(received).toEqual([])
    })
    it("never plugs the MIDI inputs when stopped before the access is granted", async () => {
      const input = makeInput()
      const { navigator, resolve } = pending()
      const { received, session } = start(navigator)

      session.stop()
      resolve(makeAccess(input))
      await session.access
      input.dispatchEvent(midiMessage(0x90, 64, 100))

      expect(received).toEqual([])
    })
    it("can be stopped twice without throwing", async () => {
      const { session } = start({ requestMIDIAccess: async () => makeAccess(makeInput()) })
      await session.access

      session.stop()
      expect(() => session.stop()).not.toThrow()
    })
  })
})
