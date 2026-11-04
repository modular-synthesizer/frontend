import type { ObjectId } from "../../../shared/data/ObjectId.type";
import type { BlueprintsEffect } from "../data/Effect.type";
import type { Viewport } from "../../../viewports/core/data/Viewport.type";
import type { Position } from "../../../viewports/core/data/Position.type";
import { panViewport } from "../../../viewports/core/processes/pan.process";

export type PanFct = (id: ObjectId | null, from: Viewport, to: Position ) =>
  { viewport: Viewport, effects: BlueprintsEffect[]}

export const pan: PanFct = (id, from, to) => {
  const { viewport, changed } = panViewport(from, to)
  return { viewport, effects: (id !== null && changed) ? [ { type: "blueprints.viewport.save", id, viewport } ] : [] }
}