import type { SynthesizersEffects } from "../../data/Effect.type";
import type { Position } from "../../data/Position.type";
import type { Viewport } from "../../data/Synthesizer.type";
import type { Uuid } from "../../data/Uuid.type";
import { positionsDiffer } from "../../shared/viewport";

export type PanFct = (id: Uuid, from: Viewport, to: Position) => { viewport: Viewport, effects: SynthesizersEffects[] }

export const pan: PanFct = (id, from, to) => {
  const viewport = { position: { x: to.x, y: to.y }, scale: from.scale }
  return {
    viewport,
    effects: positionsDiffer(from.position, to) ? [ { type: "synthesizers.viewport.save", id, viewport } ] : []
  }
}