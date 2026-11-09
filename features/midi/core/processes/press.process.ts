import type { Mapper } from "../../../shared/types/mapper.type"
import type { Allocation } from "../data/Allocation.type"
import type { MidiEffect } from "../data/Effect.type"
import type { Note } from "../data/MidiMessage.type"
import type { VoiceIndex } from "../data/VoiceIndex.type"
import type { VoicesCount } from "../data/VoicesCount.type"
import type { AllocationFacts } from "../shared/allocation"

type Occupation = { full: boolean, next: VoiceIndex }

type GetOccupationFct = (voices: (Note | null)[], voicesCount: VoicesCount) => Occupation

const getOccupationState: GetOccupationFct = (voices, voicesCount) => {
  const free = voices.indexOf(null)
  return free < 0
    ? { full: true, next: voicesCount - 1 as VoiceIndex }
    : { full: false, next: free as VoiceIndex }
}

export type PressFct = (allocation: Allocation, note: Note) => AllocationFacts

/**
 * Transforms an allocation by applying the given note to it.
 * 
 * In a monophonic allocation :
 * - if the voice is free, plays the note in it
 * - if the voice is taken by another note, overwrites it, and sends pitch effect
 * - if the voice is taken by the same note, does nothing and returns the allocation
 * 
 * In a polyphonic allocation :
 * - if the note is already played in a voice, does nothing and returns the allocation
 * - if there is a free voice, plays the note in it, and return both effects
 * - if there are no free voices, plays the note in the last voice, and return the pitch effect.
 * 
 * @param allocation the current allocation status of the synthesizer's voices.
 * @param note the note that has been pressed as a MIDI note code
 * 
 * @returns the modified allocation and the triggered effects.
 */
export const press: PressFct = ({ voices, pressed, voicesCount }, note) => {
  if (pressed.includes(note)) return { effects: [], allocation: { voices, pressed, voicesCount } }

  const { next, full } = getOccupationState(voices, voicesCount)

  const newAllocation: Allocation = {
    voicesCount: voicesCount,
    pressed: [ ...pressed, note ],
    voices: voices.map((v, i) => (i === next) ? note : v)
  }

  const effects: MidiEffect[] = []

  if (!full) effects.push({ type: "midi.voice.gate", voice: next, state: "open" })
  effects.push({ type: "midi.voice.pitch", voice: next, voltage: noteToVoltage(note) })

  return { allocation: newAllocation, effects }
}

export const noteToVoltage: Mapper<number, number> = note => ((note - 69) / 12)