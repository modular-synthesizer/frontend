import type { MidiHub } from "../../midi/shell/hub";
import type { InjectionKey } from "vue"

export const MIDI_HUB: InjectionKey<MidiHub> = Symbol("midi.hub")