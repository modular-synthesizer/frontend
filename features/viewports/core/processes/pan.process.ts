import type { Position } from "../data/Position.type"
import type { Viewport } from "../data/Viewport.type"
import { positionsDiffer } from "../shared/viewport"
import type { ViewportChange } from "../data/ViewportChange.type"

export type PanViewportFct = (from: Viewport, to: Position) => ViewportChange

export const panViewport: PanViewportFct = (from, to) => {
  const viewport = { position: { x: to.x, y: to.y }, scale: from.scale }
  return { viewport, changed: positionsDiffer(from.position, to) }
}