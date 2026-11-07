import { assertNever } from "../../../shared/facts";
import { KEYBOARD_CHANNEL } from "../shared/Constants";
import type { MidiMessage } from "../data/MidiMessage.type";
import keyboard from "../shared/keyboard.json"

export type KeyEvent = "keydown" | "keyup"

export type KeyToMessageFct = (code: string, event: KeyEvent) => MidiMessage | null

export const keyToMessage: KeyToMessageFct = (code, event) => {
  const mappedKey = keyboard.find(k => k.key === code)

  if (!mappedKey) return null

  switch (event) {
    case "keydown":
      return { kind: "note.on", channel: KEYBOARD_CHANNEL, note: mappedKey.midicode }
    case "keyup":
      return { kind: "note.off", channel: KEYBOARD_CHANNEL, note: mappedKey.midicode }
    default:
      return assertNever(event)
  }
}