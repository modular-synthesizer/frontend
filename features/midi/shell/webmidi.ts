import { ko, ok, type Result } from "../../shared/results/result"
import type { AccessError } from "../core/data/Access.type"
import { parseMessage } from "../core/processes/parseMessage.process"
import type { EmitFct } from "./hub"
import type { MidiSource } from "./source"

export type MidiInputLike = EventTarget & { id: string }
export type MidiAccessLike = EventTarget & { inputs: ReadonlyMap<string, MidiInputLike> }
export type MidiNavigator = { requestMIDIAccess?: () => Promise<MidiAccessLike> }

export type RequestAccessFct = (navigator: MidiNavigator) => Promise<Result<MidiAccessLike, AccessError>>

type MidiMessageEventLike = Event & { data?: ArrayLike<number> | null }
type MidiStateEventLike = Event & { port?: (MidiInputLike & { type?: string, state?: string }) | null }

export const requestAccess: RequestAccessFct = async navigator => {
  if (!navigator.requestMIDIAccess) return ko("unsupported")
  try {
    return ok(await navigator.requestMIDIAccess())
  }
  catch {
    return ko("denied")
  }
}

export type WebMidiSourceFactory = (access: MidiAccessLike, emit: EmitFct) => MidiSource

export const makeWebMidiSource: WebMidiSourceFactory = (access, emit) => {
  const bound = new Map<string, MidiInputLike>()

  const onMessage = (event: Event) => {
    const { data } = event as MidiMessageEventLike
    if (!data) return
    const message = parseMessage(data)
    if (message) emit(message)
  }

  const unbind = (id: string) => {
    bound.get(id)?.removeEventListener("midimessage", onMessage)
    bound.delete(id)
  }

  const bind = (input: MidiInputLike) => {
    if (bound.get(input.id) === input) return
    unbind(input.id)
    input.addEventListener("midimessage", onMessage)
    bound.set(input.id, input)
  }

  const onStateChange = (event: Event) => {
    const { port } = event as MidiStateEventLike
    if (!port || port.type !== "input") return
    if (port.state === "connected") bind(port)
    else unbind(port.id)
  }

  access.inputs.forEach(input => bind(input))
  access.addEventListener("statechange", onStateChange)

  return {
    stop: () => {
      access.removeEventListener("statechange", onStateChange)
      for (const id of [ ...bound.keys() ]) unbind(id)
    }
  }
}