import type { Allocation } from "../data/Allocation.type"
import type { MidiEffect } from "../data/Effect.type"
import type { Note } from "../data/MidiMessage.type"
import type { VoiceIndex } from "../data/VoiceIndex.type"
import type { AllocationFacts } from "../shared/allocation"
import { noteToVoltage } from "./press.process"

export type ReleaseFct = (allocation: Allocation, note: Note) => AllocationFacts

export const release: ReleaseFct = ({ voices, pressed, voicesCount }, note) => {
  const remaining = pressed.filter(n => n !== note)
  const released = voices.indexOf(note)

  if (released < 0) return { allocation: { voices, pressed: remaining, voicesCount }, effects: [] }

  const waiting = remaining.findLast(n => !voices.includes(n)) ?? null
  const voice = released as VoiceIndex

  const effect: MidiEffect = waiting === null
    ? { type: "midi.voice.gate", voice, state: "closed" }
    : { type: "midi.voice.pitch", voice, voltage: noteToVoltage(waiting) }

  return {
    allocation: { voices: voices.map((v, i) => i === released ? waiting : v), pressed: remaining, voicesCount },
    effects: [ effect ]
  }
}