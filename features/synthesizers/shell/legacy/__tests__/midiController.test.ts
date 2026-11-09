import { beforeEach, describe, expect, it } from "vitest"
import type { AudioModule } from "~/types/Index"
import type { VoiceIndex } from "../../../../midi/core/data/VoiceIndex.type"
import { makeMidiController, toVoicePorts, type MidiControl, type MidiControlPayload } from "../midiController.adapter"
import type { VoicePorts } from "../../../../midi/shell/effect"
import type { MidiMessage } from "../../../../midi/core/data/MidiMessage.type"

type Log = string[]

const spyNode = (log: Log, id: string) => ({
  offset: {
    setValueAtTime: (value: number, time: number) => { log.push(`${id}.set(${value},${time})`) },
    cancelScheduledValues: (time: number) => { log.push(`${id}.cancel(${time})`) },
  },
})

const fullVoice = (log: Log, index: number) => ({
  env: spyNode(log, `env${index}`),
  vco: spyNode(log, `vco${index}`),
  mw: spyNode(log, `mw${index}`),
})

const toModule = (voices: Record<string, unknown>[]): AudioModule =>
  ({ channels: voices.map(nodes => ({ nodes })) }) as unknown as AudioModule

const voice = (index: number) => index as VoiceIndex

const payload: MidiControlPayload = { envelope: "env", pitch: "vco", modwheel: "mw" }

describe("toVoicePorts", () => {
  let log: Log
  let clock: { currentTime: number }
  let module: AudioModule

  beforeEach(() => {
    log = []
    clock = { currentTime: 3 }
    module = toModule([0, 1, 2].map(index => fullVoice(log, index)))
  })

  describe("gate", () => {
    it("opens the envelope of the voice without cancelling scheduled values", () => {
      toVoicePorts(module, payload, clock).gate(voice(1), "open")
      expect(log).toEqual(["env1.set(1,3)"])
    })
    it("closes the envelope of the voice after cancelling scheduled values", () => {
      toVoicePorts(module, payload, clock).gate(voice(1), "closed")
      expect(log).toEqual(["env1.cancel(3)", "env1.set(0,3)"])
    })
  })

  describe("pitch", () => {
    it("sets the voltage of the voice after cancelling scheduled values", () => {
      toVoicePorts(module, payload, clock).pitch(voice(1), 0.25)
      expect(log).toEqual(["vco1.cancel(3)", "vco1.set(0.25,3)"])
    })
  })

  describe("modwheel", () => {
    it("sets the amount on the modwheel node of every voice, without cancelling", () => {
      toVoicePorts(module, payload, clock).modwheel(0.5)
      expect(log).toEqual(["mw0.set(0.5,3)", "mw1.set(0.5,3)", "mw2.set(0.5,3)"])
    })
    it("skips the voices without a modwheel node", () => {
      const { mw: _, ...withoutModwheel } = fullVoice(log, 1)
      module = toModule([fullVoice(log, 0), withoutModwheel, fullVoice(log, 2)])
      toVoicePorts(module, payload, clock).modwheel(0.5)
      expect(log).toEqual(["mw0.set(0.5,3)", "mw2.set(0.5,3)"])
    })
  })

  it("reads the clock when a port is called, not when the ports are built", () => {
    clock.currentTime = 0
    const ports = toVoicePorts(module, payload, clock)
    clock.currentTime = 2.5
    ports.gate(voice(0), "open")
    expect(log).toEqual(["env0.set(1,2.5)"])
  })

  it("drives each role on its own node", () => {
    const ports = toVoicePorts(module, payload, clock)
    ports.gate(voice(0), "open")
    ports.pitch(voice(0), 0.25)
    expect(log).toEqual(["env0.set(1,3)", "vco0.cancel(3)", "vco0.set(0.25,3)"])
  })

  describe("missing nodes (B11)", () => {
    it("ignores the gate when the payload has no envelope, and still drives the pitch", () => {
      const { envelope: _, ...withoutEnvelope } = payload
      const ports = toVoicePorts(module, withoutEnvelope, clock)
      ports.gate(voice(0), "open")
      ports.pitch(voice(0), 0.25)
      expect(log).toEqual(["vco0.cancel(3)", "vco0.set(0.25,3)"])
    })
    it("ignores the modwheel when the payload has no modwheel, and still drives gate and pitch", () => {
      const { modwheel: _, ...withoutModwheel } = payload
      const ports = toVoicePorts(module, withoutModwheel, clock)
      ports.modwheel(0.5)
      ports.gate(voice(0), "open")
      ports.pitch(voice(0), 0.25)
      expect(log).toEqual(["env0.set(1,3)", "vco0.cancel(3)", "vco0.set(0.25,3)"])
    })
    it("ignores the port when the voice has no node of that name", () => {
      const { env: _, ...withoutEnvelope } = fullVoice(log, 0)
      module = toModule([withoutEnvelope])
      toVoicePorts(module, payload, clock).gate(voice(0), "open")
      expect(log).toEqual([])
    })
    it("ignores the port when the node has no offset", () => {
      module = toModule([{ ...fullVoice(log, 0), env: { gain: {} } }])
      toVoicePorts(module, payload, clock).gate(voice(0), "open")
      expect(log).toEqual([])
    })
    it("ignores the port when the voice does not exist", () => {
      toVoicePorts(module, payload, clock).gate(voice(5), "open")
      expect(log).toEqual([])
    })
  })
})

const spyPorts = (log: Log): VoicePorts => ({
  gate: (voice, state) => { log.push(`gate(${voice},${state})`) },
  pitch: (voice, voltage) => { log.push(`pitch(${voice},${voltage})`) },
  modwheel: amount => { log.push(`modwheel(${amount})`) },
})

type ModuleSpec = { channel?: number, voices?: number, channels?: number }

const toControlledModule = ({ channel = 1, voices, channels = 4 }: ModuleSpec): AudioModule => ({
  parameters: {
    channel: { value: channel },
    ...(voices === undefined ? {} : { poly: { value: voices } }),
  },
  channels: Array.from({ length: channels }, () => ({ nodes: {} })),
}) as unknown as AudioModule

const controlPayload: MidiControlPayload = { envelope: "env", pitch: "vco", modwheel: "mw", voices: "poly" }

const on = (note: number, channel = 1): MidiMessage => ({ kind: "note.on", channel, note })
const off = (note: number, channel = 1): MidiMessage => ({ kind: "note.off", channel, note })

const controlOf = (log: Log, module: AudioModule, p: MidiControlPayload = controlPayload): MidiControl => {
  const result = makeMidiController(spyPorts(log), module, p)
  if (!result.ok) throw new Error(`unexpected ${result.error()}`)
  return result.orNull()
}

describe("makeMidiController", () => {
  let log: Log

  beforeEach(() => { log = [] })

  describe("voices count", () => {
    it("fails when the voices parameter is 0", () => {
      expect(makeMidiController(spyPorts(log), toControlledModule({ voices: 0 }), controlPayload).error()).toBe("voices.count.invalid")
    })
    it("fails when the module has no voice", () => {
      expect(makeMidiController(spyPorts(log), toControlledModule({ voices: 2, channels: 0 }), controlPayload).error()).toBe("voices.count.invalid")
    })
    it("uses a single voice when the payload has no voices key", async () => {
      const { voices: _, ...withoutVoices } = controlPayload
      const control = controlOf(log, toControlledModule({ voices: 4 }), withoutVoices)
      await control.receive(on(69))
      await control.receive(on(81))
      expect(log).toEqual(["gate(0,open)", "pitch(0,0)", "pitch(0,1)"])
    })
    it("uses a single voice when the module has no parameter of that name", async () => {
      const control = controlOf(log, toControlledModule({}))
      await control.receive(on(69))
      await control.receive(on(81))
      expect(log).toEqual(["gate(0,open)", "pitch(0,0)", "pitch(0,1)"])
    })
    it("never targets a voice beyond the voices parameter (B5)", async () => {
      const control = controlOf(log, toControlledModule({ voices: 2, channels: 4 }))
      for (const note of [69, 81, 57]) await control.receive(on(note))
      expect(log).toEqual(["gate(0,open)", "pitch(0,0)", "gate(1,open)", "pitch(1,1)", "pitch(1,-1)"])
    })
    it("never targets a voice beyond the module channels (B5)", async () => {
      const control = controlOf(log, toControlledModule({ voices: 4, channels: 2 }))
      for (const note of [69, 81, 57]) await control.receive(on(note))
      expect(log).toEqual(["gate(0,open)", "pitch(0,0)", "gate(1,open)", "pitch(1,1)", "pitch(1,-1)"])
    })
  })

  describe("receive", () => {
    it("opens the gate and sets the pitch of voice 0 on a note of the listened channel", async () => {
      await controlOf(log, toControlledModule({ voices: 2 })).receive(on(81))
      expect(log).toEqual(["gate(0,open)", "pitch(0,1)"])
    })
    it("keeps the allocation between messages", async () => {
      const control = controlOf(log, toControlledModule({ voices: 2 }))
      await control.receive(on(69))
      await control.receive(off(69))
      expect(log).toEqual(["gate(0,open)", "pitch(0,0)", "gate(0,closed)"])
    })
    it("updates the allocation before running the effects", async () => {
      const control = controlOf(log, toControlledModule({ voices: 2 }))
      await Promise.all([control.receive(on(69)), control.receive(on(81))])
      expect(log).toEqual(["gate(0,open)", "pitch(0,0)", "gate(1,open)", "pitch(1,1)"])
    })
    it("drives the modwheel", async () => {
      await controlOf(log, toControlledModule({})).receive({ kind: "control", channel: 1, controller: 1, value: 127 })
      expect(log).toEqual(["modwheel(10)"])
    })
    it("ignores every message when the module has no channel parameter", async () => {
      const module = toControlledModule({ voices: 2 })
      delete (module.parameters as Record<string, unknown>).channel
      await controlOf(log, module).receive(on(69))
      expect(log).toEqual([])
    })
  })

  describe("listened channel", () => {
    it("reacts to channel 0 (computer keyboard) and not to channel 1 when the parameter is 0", async () => {
      const control = controlOf(log, toControlledModule({ channel: 0, voices: 2 }))
      await control.receive(on(69, 1))
      await control.receive(on(81, 0))
      expect(log).toEqual(["gate(0,open)", "pitch(0,1)"])
    })
    it("reacts to channel 1 and not to channel 0 when the parameter is 1", async () => {
      const control = controlOf(log, toControlledModule({ channel: 1, voices: 2 }))
      await control.receive(on(69, 0))
      await control.receive(on(81, 1))
      expect(log).toEqual(["gate(0,open)", "pitch(0,1)"])
    })
    it("reads the channel parameter on every message, without any event (B4)", async () => {
      const module = toControlledModule({ channel: 1, voices: 2 })
      const control = controlOf(log, module)
      module.parameters.channel!.value = 2
      await control.receive(on(69, 1))
      await control.receive(on(81, 2))
      expect(log).toEqual(["gate(0,open)", "pitch(0,1)"])
    })
  })

  describe("releaseAll", () => {
    it("closes the gates of the busy voices only", async () => {
      const control = controlOf(log, toControlledModule({ voices: 4 }))
      for (const note of [69, 81, 57]) await control.receive(on(note))
      await control.receive(off(81))
      log.length = 0
      await control.releaseAll()
      expect(log).toEqual(["gate(0,closed)", "gate(2,closed)"])
    })
    it("frees every voice", async () => {
      const control = controlOf(log, toControlledModule({ voices: 2 }))
      await control.receive(on(69))
      await control.releaseAll()
      log.length = 0
      await control.releaseAll()
      await control.receive(on(81))
      expect(log).toEqual(["gate(0,open)", "pitch(0,1)"])
    })
  })

  it("drives the legacy nodes through toVoicePorts", async () => {
    const calls: Log = []
    const node = (id: string) => ({ offset: {
      setValueAtTime: (value: number) => { calls.push(`${id}=${value}`) },
      cancelScheduledValues: () => {},
    } })
    const module = toControlledModule({ voices: 2 })
    module.channels.forEach((channel, index) => { channel.nodes = { env: node(`env${index}`), vco: node(`vco${index}`) } as never })
    const result = makeMidiController(toVoicePorts(module, controlPayload, { currentTime: 0 }), module, controlPayload)
    await result.orNull()!.receive(on(81))
    expect(calls).toEqual(["env0=1", "vco0=1"])
  })
})
