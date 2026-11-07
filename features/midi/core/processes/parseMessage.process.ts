import type { MidiMessage } from "../data/MidiMessage.type";

export type ParseMessageFct = (data: ArrayLike<number>) => MidiMessage | null

const NOTE_ON = 0x90
const NOTE_OFF = 0x80
const CONTROL_CHANGE = 0xB0

/**
 * Parses MIDI messages to transform them into core business messages usable in the system.
 * The produced MIDI events indicate if a note should be played, or released, or if a control
 * has changed.
 * 
 * MIDI messages are given as a series of numbers, first number mixing the type, and the channel
 * (right half byte being the channel, left half byte being the type) ; second and third numbers
 * are values with a meaning different given different types.
 * 
 * @param data the raw data of the MIDI messages sent by the browser.
 * @returns a business MIDI event usable in our system, indicating what should be done.
 */
export const parseMessage: ParseMessageFct = data => {
  const [ status, first, second ] = [ data[0], data[1], data[2] ]

  if (status === undefined || first === undefined || second === undefined ) return null

  const channel = (status & 0x0F) + 1
  switch(status & 0xF0) {
    case NOTE_ON:
      // This handles the exception of some MIDI devices that sends NOTE_ON at 0 for a note off.
      return { kind: `note.${second === 0 ? "off" : "on"}`, channel, note: first }
    case NOTE_OFF:
      return { kind: "note.off", channel, note: first }
    case CONTROL_CHANGE:
      return { kind: "control", channel, controller: first, value: second }
    default:
      return null
  }
}