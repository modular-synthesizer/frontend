import type { Effect } from "../../../shared/facts";
import type { Uuid } from "../../../shared/data/Uuid.type";
import type { Viewport } from "../../../viewports/core/data/Viewport.type";
import type { Placement } from "./Placement.type";

export type SynthesizersEffect = Effect & (
  | { type: "synthesizers.viewport.save", id: Uuid, viewport: Viewport }
  | { type: "synthesizers.scale.save", id: Uuid, scale: number }
  | { type: "synthesizers.module.save", id: Uuid, placement: Placement }
)