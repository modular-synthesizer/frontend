import type { AudioModule, Control } from "~/types/Index"
import { makeRunEffect, type VoicePorts } from "../../../midi/shell/effect"
import type { VoiceIndex } from "../../../midi/core/data/VoiceIndex.type"
import type { GateState } from "../../../midi/core/data/Effect.type"
import type { MidiMessage } from "../../../midi/core/data/MidiMessage.type"
import { ok, type Result } from "../../../shared/results/result"
import type { InvalidVoicesCount } from "../../../midi/core/data/VoicesCount.type"
import { createAllocation } from "../../../midi/core/processes/createAllocation.process"
import { releaseAll as releaseAllProcess } from "../../../midi/core/processes/releaseAll.process"
import type { AllocationFacts } from "../../../midi/core/shared/allocation"
import { receiveMessage } from "../../../midi/core/processes/receiveMessage.process"

export type MidiNodeRole = "envelope" | "pitch" | "modwheel"
export type MidiControlPayload = Control["payload"]
export type AudioClock = Pick<BaseAudioContext, "currentTime">

export type ToVoicePortsFct = (module: AudioModule, payload: MidiControlPayload, context: AudioClock) => VoicePorts

type Offset = Pick<AudioParam, "setValueAtTime" | "cancelScheduledValues">

export const toVoicePorts: ToVoicePortsFct = (module, payload, context) => {

  const offsetOf = (voice: VoiceIndex, role: MidiNodeRole): Offset | undefined => {
    const name = payload[role]
    if (!name) return undefined
    const node = module.channels[voice]?.nodes[String(name)]
    return node && "offset" in node ? (node as ConstantSourceNode).offset : undefined
  }

  const gate: (voice: VoiceIndex, state: GateState) => void = (voice, state) => {
    const offset = offsetOf(voice, "envelope")
    if (!offset) return
    const now = context.currentTime
    if (state === "closed") offset.cancelScheduledValues(now)
    offset.setValueAtTime(state === "open" ? 1 : 0, now)
  }

  const pitch: (voice: VoiceIndex, voltage: number) => void = (voice, voltage) => {
    const offset = offsetOf(voice, "pitch")
    if (!offset) return
    const now = context.currentTime
    offset.cancelScheduledValues(now)
    offset.setValueAtTime(voltage, now)
  }

  const modwheel: (amount: number) => void = amount => {
    module.channels.forEach((_, voice) => {
      const offset = offsetOf(voice as VoiceIndex, "modwheel")
      if (offset) offset.setValueAtTime(amount, context.currentTime)
    })
  }

  return { gate, pitch, modwheel }
}

export type MidiControl = {
  receive: (message: MidiMessage) => Promise<void>
  releaseAll: () => Promise<void>
}
export type MidiControlFactory =
  (ports: VoicePorts, module: AudioModule, payload: MidiControlPayload) => Result<MidiControl, InvalidVoicesCount>

const voicesOf = (module: AudioModule, payload: MidiControlPayload): number => {
  const parameter = payload.voices === undefined ? undefined : module.parameters[String(payload.voices)]
  return Math.min(parameter?.value ?? 1, module.channels.length)
}

export const makeMidiController: MidiControlFactory = (ports, module, payload) => {
  const run = makeRunEffect(ports)

  return createAllocation(voicesOf(module, payload)).flatMap(initial => {
    let allocation = initial

    const apply = async ({ allocation: next, effects }: AllocationFacts): Promise<void> => {
      allocation = next
      await Promise.all(effects.map(run))
    }

    const receive = async (message: MidiMessage): Promise<void> => {
      const listening = module.parameters.channel?.value
      if (listening === undefined) return
      return apply(receiveMessage(allocation, listening, message))
    }

    const releaseAll = (): Promise<void> => apply(releaseAllProcess(allocation))

    return ok({ receive, releaseAll })
  })
}