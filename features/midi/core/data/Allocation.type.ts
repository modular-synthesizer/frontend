import type { Note } from "./MidiMessage.type";
import type { VoicesCount } from "./VoicesCount.type";

// An allocation sums up every polyphony channel and its current usage.
export type Allocation = { voices: (Note | null)[], pressed: Note[], voicesCount: VoicesCount }