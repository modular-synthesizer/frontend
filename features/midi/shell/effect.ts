import { assertNever, type RunEffectFct } from "../../shared/facts"
import type { GateState, MidiEffect } from "../core/data/Effect.type"
import type { VoiceIndex } from "../core/data/VoiceIndex.type"

export type VoicePorts = {
  gate: (voice: VoiceIndex, state: GateState) => void
  pitch: (voice: VoiceIndex, voltage: number) => void
  modwheel: (amount: number) => void
}

export type RunEffectFactory = (ports: VoicePorts) => RunEffectFct<MidiEffect>

export const makeRunEffect: RunEffectFactory = ({ gate, pitch, modwheel }) => async effect => {
  switch (effect.type) {
    case "midi.voice.gate":
      return gate(effect.voice, effect.state)
    case "midi.voice.pitch":
      return pitch(effect.voice, effect.voltage)
    case "midi.modwheel":
      return modwheel(effect.amount)
    default:
      assertNever(effect)
  }
}