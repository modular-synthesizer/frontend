import type { AccessStatus } from "../core/data/Access.type"
import type { EmitFct } from "./hub"
import { makeKeyboardSource } from "./keyboard"
import type { MidiSource } from "./source"
import { makeWebMidiSource, requestAccess, type MidiNavigator } from "./webmidi"

export type MidiEnvironment = { navigator: MidiNavigator, window: EventTarget }
export type MidiSession = MidiSource & { access: Promise<AccessStatus> }
export type StartMidiFct = (environment: MidiEnvironment, emit: EmitFct) => MidiSession

export const startMidi: StartMidiFct = ({ navigator, window }, emit) => {
  const keyboard = makeKeyboardSource(window, emit)
  let webmidi: MidiSource | null = null
  let stopped = false

  const access = requestAccess(navigator).then((result): AccessStatus => {
    if (!result.ok) return result.error()
    if (!stopped) webmidi = makeWebMidiSource(result.orNull(), emit)
    return "ready"
  })

  return {
    access,
    stop: () => {
      stopped = true
      keyboard.stop()
      webmidi?.stop()
      webmidi = null
    }
  }
}