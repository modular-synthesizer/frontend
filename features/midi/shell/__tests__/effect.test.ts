import { describe, expect, it } from "vitest";
import type { VoiceIndex } from "../../core/data/VoiceIndex.type";
import type { GateState } from "../../core/data/Effect.type";
import { makeRunEffect } from "../effect";

function makeGate() {
  const gates: { voice: VoiceIndex, state: GateState }[] = []
  const gatePort = (voice: VoiceIndex, state: GateState) => {
    gates.push({ voice, state })
  }
  return { gatePort, gates}
}
function makePitch() {
  const pitches: { voice: VoiceIndex, voltage: number }[] = []
  const pitchPort = (voice: VoiceIndex, voltage: number) => {
    pitches.push({ voice, voltage })
  }
  return { pitchPort, pitches}
}
function makeModwheel() {
  const modwheels: { amount: number }[] = []
  const modwheelPort = (amount: number) => {
    modwheels.push({ amount })
  }
  return { modwheelPort, modwheels}
}

const makePorts = () => {
  const { gatePort, gates} = makeGate()
  const { pitchPort, pitches} = makePitch()
  const { modwheelPort, modwheels} = makeModwheel()

  const ports = { pitch: pitchPort, gate: gatePort, modwheel: modwheelPort }

  return { ports, gates, pitches, modwheels }
}

describe("makeRunEffect", () => {
  it("correctly forwards the midi gate open messages", async () => {
    const { ports, gates, pitches, modwheels } = makePorts()
    const runEffect = makeRunEffect(ports)

    await runEffect({ type: "midi.voice.gate", voice: 10 as VoiceIndex, state: "open" })

    expect(gates).toEqual([ { voice: 10, state: "open" } ])
    expect(pitches).toEqual([])
    expect(modwheels).toEqual([])
  })
  it("correctly forwards the midi gate closed messages", async () => {
    const { ports, gates, pitches, modwheels } = makePorts()
    const runEffect = makeRunEffect(ports)

    await runEffect({ type: "midi.voice.gate", voice: 10 as VoiceIndex, state: "closed" })

    expect(gates).toEqual([ { voice: 10, state: "closed" } ])
    expect(pitches).toEqual([])
    expect(modwheels).toEqual([])
  })
  it("correctly forwards the midi pitch messages", async () => {
    const { ports, gates, pitches, modwheels } = makePorts()
    const runEffect = makeRunEffect(ports)

    await runEffect({ type: "midi.voice.pitch", voice: 12 as VoiceIndex, voltage: 6 })

    expect(gates).toEqual([])
    expect(pitches).toEqual([ { voice: 12, voltage: 6 } ])
    expect(modwheels).toEqual([])
  })
  it("correctly forwards the modwheel midi messages", async () => {
    const { ports, gates, pitches, modwheels } = makePorts()
    const runEffect = makeRunEffect(ports)

    await runEffect({ type: "midi.modwheel", amount: 16 })

    expect(gates).toEqual([])
    expect(pitches).toEqual([])
    expect(modwheels).toEqual([ { amount: 16 } ])
  })
})