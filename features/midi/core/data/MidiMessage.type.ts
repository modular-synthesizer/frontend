export type MidiChannel = number

export type MidiController = number

export type Note = number

export type MidiMessage =
  | { kind: "note.on", channel: MidiChannel, note: Note }
  | { kind: "note.off", channel: MidiChannel, note: Note }
  | { kind: "control", channel: MidiChannel, controller: MidiController, value: number}