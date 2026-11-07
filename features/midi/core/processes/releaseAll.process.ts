import type { Allocation } from "../data/Allocation.type";
import type { MidiEffect } from "../data/Effect.type";
import type { VoiceIndex } from "../data/VoiceIndex.type";
import type { AllocationFacts } from "../shared/allocation";

export type ReleaseAllFct = (allocation: Allocation) => AllocationFacts

export const releaseAll: ReleaseAllFct = ({ voices, voicesCount }) => {
  const effects: MidiEffect[] = []
  voices.forEach((v, k) => {
    if (v !== null) {
      effects.push({ type: "midi.voice.gate", voice: k as VoiceIndex, state: "closed" })
    }
  })

  const newVoices = Array.from({ length: voicesCount }, () => null)

  return { allocation: { voicesCount, voices: newVoices, pressed: [] }, effects }
}