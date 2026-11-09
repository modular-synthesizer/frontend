import { beforeEach, describe, expect, it } from "vitest"
import type { Parameter as LegacyParameter } from "~/types/modules/Parameter"
import { makeMidiLearn, type MidiLearn } from "../midiLearn.adapter"
import type { EditParameterAdapter } from "../parameter.adapter"
import type { MidiMessage } from "../../../../midi/core/data/MidiMessage.type"
import type { ParameterChange } from "../../../core/data/Parameter.type"

type Call = { parameter: LegacyParameter, change: ParameterChange }

const toLegacy = (id: string, deleted = false): LegacyParameter =>
  ({ id, mod: { deleted } }) as unknown as LegacyParameter

const cc = (controller: number, value: number, channel = 1): MidiMessage =>
  ({ kind: "control", channel, controller, value })

describe("makeMidiLearn", () => {
  let calls: Call[]
  let midiLearn: MidiLearn
  const cutoff = toLegacy("cutoff")
  const resonance = toLegacy("resonance")

  beforeEach(() => {
    calls = []
    const edit: EditParameterAdapter = async (parameter, change) => { calls.push({ parameter, change }) }
    midiLearn = makeMidiLearn(edit)
  })

  describe("learn", () => {
    it("edits the parameter from the learning message on, with a midi change (decision C)", async () => {
      midiLearn.learn(cutoff)
      await midiLearn.receive(cc(74, 10))
      await midiLearn.receive(cc(74, 20))
      expect(calls).toEqual([
        { parameter: cutoff, change: { kind: "midi", amount: 10 } },
        { parameter: cutoff, change: { kind: "midi", amount: 20 } },
      ])
    })
    it("passes the legacy parameter itself to edit", async () => {
      midiLearn.learn(cutoff)
      await midiLearn.receive(cc(74, 10))
      expect(calls[0]?.parameter).toBe(cutoff)
    })
    it("ignores a learned controller received on another channel (decision D)", async () => {
      midiLearn.learn(cutoff)
      await midiLearn.receive(cc(74, 10, 1))
      calls.length = 0
      await midiLearn.receive(cc(74, 20, 2))
      expect(calls).toEqual([])
    })
    it("edits only once per message when the same controller is learned twice (B8)", async () => {
      midiLearn.learn(cutoff)
      await midiLearn.receive(cc(74, 10))
      midiLearn.learn(cutoff)
      await midiLearn.receive(cc(74, 20))
      calls.length = 0
      await midiLearn.receive(cc(74, 30))
      expect(calls).toEqual([{ parameter: cutoff, change: { kind: "midi", amount: 30 } }])
    })
    it("edits every parameter learned on the same controller", async () => {
      midiLearn.learn(cutoff)
      await midiLearn.receive(cc(74, 10))
      midiLearn.learn(resonance)
      await midiLearn.receive(cc(74, 20))
      calls.length = 0
      await midiLearn.receive(cc(74, 30))
      expect(calls.map(({ parameter }) => parameter)).toEqual([cutoff, resonance])
    })
    it("binds only the first controller received after learn, even without waiting for edit", async () => {
      midiLearn.learn(cutoff)
      await Promise.all([midiLearn.receive(cc(74, 10)), midiLearn.receive(cc(75, 20))])
      calls.length = 0
      await midiLearn.receive(cc(75, 30))
      expect(calls).toEqual([])
    })
  })

  describe("receive", () => {
    it("does not edit a parameter whose module was deleted (B3)", async () => {
      const removed = toLegacy("removed", true)
      midiLearn.learn(removed)
      await midiLearn.receive(cc(74, 10))
      expect(calls).toEqual([])
    })
    it("resolves only once every edit has resolved", async () => {
      let release = (): void => {}
      const learner = makeMidiLearn(() => new Promise<void>(resolve => { release = resolve }))
      learner.learn(cutoff)
      let resolved = false
      const pending = learner.receive(cc(74, 10)).then(() => { resolved = true })
      await Promise.resolve()
      expect(resolved).toBe(false)
      release()
      await pending
      expect(resolved).toBe(true)
    })
  })

  describe("unlearn", () => {
    it("removes every controller bound to the parameter, and keeps the others", async () => {
      midiLearn.learn(cutoff)
      await midiLearn.receive(cc(74, 10))
      midiLearn.learn(cutoff)
      await midiLearn.receive(cc(75, 10))
      midiLearn.learn(resonance)
      await midiLearn.receive(cc(76, 10))
      midiLearn.unlearn(cutoff)
      calls.length = 0
      for (const controller of [74, 75, 76]) await midiLearn.receive(cc(controller, 20))
      expect(calls).toEqual([{ parameter: resonance, change: { kind: "midi", amount: 20 } }])
    })
    it("keeps the old controllers unbound when the parameter is learned again", async () => {
      midiLearn.learn(cutoff)
      await midiLearn.receive(cc(74, 10))
      midiLearn.unlearn(cutoff)
      midiLearn.learn(cutoff)
      await midiLearn.receive(cc(75, 10))
      calls.length = 0
      await midiLearn.receive(cc(74, 20))
      expect(calls).toEqual([])
    })
    it("cancels a pending learn of the parameter", async () => {
      midiLearn.learn(cutoff)
      midiLearn.unlearn(cutoff)
      await midiLearn.receive(cc(74, 10))
      expect(calls).toEqual([])
    })
  })

  describe("reset", () => {
    it("forgets every binding (B3)", async () => {
      midiLearn.learn(cutoff)
      await midiLearn.receive(cc(74, 10))
      midiLearn.reset()
      calls.length = 0
      await midiLearn.receive(cc(74, 20))
      expect(calls).toEqual([])
    })
    it("keeps the old controllers unbound when the parameter is learned again", async () => {
      midiLearn.learn(cutoff)
      await midiLearn.receive(cc(74, 10))
      midiLearn.reset()
      midiLearn.learn(cutoff)
      await midiLearn.receive(cc(75, 10))
      calls.length = 0
      await midiLearn.receive(cc(74, 20))
      expect(calls).toEqual([])
    })
    it("cancels a pending learn", async () => {
      midiLearn.learn(cutoff)
      midiLearn.reset()
      await midiLearn.receive(cc(74, 10))
      expect(calls).toEqual([])
    })
  })
})