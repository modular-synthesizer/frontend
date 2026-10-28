import type { Viewport } from "../data/Viewport.type"
import { DEFAULT_VIEWPORT } from "../shared/Constants"
import { isDefaultViewport } from "../shared/viewport"
import type { ViewportChange } from "../data/ViewportChange.type"

export type ResetViewportFct = (viewport: Viewport) => ViewportChange

export const resetViewport: ResetViewportFct = viewport => ({
  viewport: DEFAULT_VIEWPORT,
  changed: !isDefaultViewport(viewport)
})