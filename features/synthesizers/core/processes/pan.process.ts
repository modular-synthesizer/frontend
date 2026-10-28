import type { SynthesizersEffect } from "../data/Effect.type";
import type { Position } from "../../../viewports/core/data/Position.type";
import type { Uuid } from "../../../shared/data/Uuid.type";
import type { Viewport } from "../../../viewports/core/data/Viewport.type";
import { panViewport } from "../../../viewports/core/processes/pan.process";

export type PanFct = (id: Uuid, from: Viewport, to: Position) => { viewport: Viewport, effects: SynthesizersEffect[] }

export const pan: PanFct = (id, from, to) => {
  const { viewport, changed } = panViewport(from, to)
  return { viewport, effects: changed ? [ { type: "synthesizers.viewport.save", id, viewport } ] : [] }
}