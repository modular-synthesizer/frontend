import type { MidiMessage } from "../core/data/MidiMessage.type"

export type EmitFct = (message: MidiMessage) => void
export type UnsubscribeFct = () => void
export type ListenFct = (listener: EmitFct) => UnsubscribeFct
export type MidiHub = { emit: EmitFct, listen: ListenFct }
export type HubFactory = () => MidiHub

export const makeHub: HubFactory = () => {
  const listeners = new Set<EmitFct>()

  const listen = (listener: EmitFct): UnsubscribeFct => {
    listeners.add(listener)
    return () => { listeners.delete(listener) }
  }

  const emit: EmitFct = message => {
    for (const listener of [ ...listeners ]) listener(message)
  }

  return { emit, listen }
}