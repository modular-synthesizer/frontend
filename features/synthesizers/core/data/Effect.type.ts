import type { Effect } from "../../../shared/facts";
import type { Viewport } from "./Synthesizer.type";
import type { Uuid } from "./Uuid.type";

export type SynthesizersEffects = Effect & (
  | { type: "synthesizers.viewport.save", id: Uuid, viewport: Viewport }
)