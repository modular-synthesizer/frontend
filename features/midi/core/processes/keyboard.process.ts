import { assertNever } from "../../../shared/facts";
import { KEYBOARD_CHANNEL } from "../shared/Constants";
import type { MidiMessage } from "../data/MidiMessage.type";
import keyboard from "../shared/keyboard.json"

export type KeyEvent = "keydown" | "keyup"

export type KeyToMessageFct = (code: string, event: KeyEvent) => MidiMessage | null

/**
 * Transforms a keyboard key into a system-usable MIDI message. See receiveMessage
 * to see how this is further handle by the system.
 * 
 * @param code the keycode sent by the keyboard event when pressing or releasing a key.
 * @param event the kind of event, being even a keydown or a keyup.
 * 
 * @returns the formatted MIDI message corresponding to the event if the key is mapped,
 *   or null if the key is not available in the mapping.
 */
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