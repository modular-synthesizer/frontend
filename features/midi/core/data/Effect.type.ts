import type { Effect } from "../../../shared/facts";
import type { VoiceIndex } from "./VoiceIndex.type";

export type GateState = "open" | "closed"

export type MidiEffect = Effect & (
  | { type: "midi.voice.gate", voice: VoiceIndex, state: GateState }
  | { type: "midi.voice.pitch", voice: VoiceIndex, voltage: number }
  | { type: "midi.modwheel", amount: number }
)