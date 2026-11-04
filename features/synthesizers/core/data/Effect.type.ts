import type { Effect } from "../../../shared/facts";
import type { ObjectId } from "../../../shared/data/ObjectId.type";
import type { Viewport } from "../../../viewports/core/data/Viewport.type";
import type { Placement } from "./Placement.type";

export type SynthesizersEffect = Effect & (
  | { type: "synthesizers.viewport.save", id: ObjectId, viewport: Viewport }
  | { type: "synthesizers.scale.save", id: ObjectId, scale: number }
  | { type: "synthesizers.module.save", id: ObjectId, placement: Placement }
  | { type: "synthesizers.parameter.save", id: ObjectId, moduleId: ObjectId, value: number, t: number }
)