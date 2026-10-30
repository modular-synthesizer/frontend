import { zoomViewport } from "../../../viewports/core/processes/zoom.process";
import type { SynthesizersEffect } from "../data/Effect.type";
import type { Viewport } from "../../../viewports/core/data/Viewport.type";
import type { Uuid } from "../../../shared/data/Uuid.type";

export type ZoomFct = (id: Uuid, from: Viewport, deltaY: number) => { viewport: Viewport, effects: SynthesizersEffect[] }

export const zoom: ZoomFct = (id, from, deltaY) => {
  const { changed, viewport } = zoomViewport(from, deltaY)
  return { viewport, effects: changed ? [ { type: "synthesizers.scale.save", id, scale: viewport.scale } ] : [] }
}