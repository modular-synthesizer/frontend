import type { Viewport } from "../data/Viewport.type"
import type { ViewportChange } from "../data/ViewportChange.type"
import { clampScale } from "../shared/viewport"
import { ZOOM_RATIO } from "../shared/Constants"

export type ZoomViewportFct = (from: Viewport, deltaY: number) => ViewportChange

export const zoomViewport: ZoomViewportFct = ({ position, scale }, deltaY) => {
  const clampedScale = clampScale(scale - deltaY * ZOOM_RATIO)
  return {
    viewport: { position: { x: position.x, y: position.y }, scale: clampedScale },
    changed: scale !== clampedScale
  }
}