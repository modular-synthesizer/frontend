import type { CablesAdapter } from "../../cables/shell/legacy/cables.adapter";
import type { MidiHub } from "../../midi/shell/hub";
import type { InjectionKey } from "vue"

export const MIDI_HUB: InjectionKey<MidiHub> = Symbol("midi.hub")

export const CABLES: InjectionKey<CablesAdapter> = Symbol("cables")