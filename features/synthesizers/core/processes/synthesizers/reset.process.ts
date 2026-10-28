import type { SynthesizersEffects } from "../../data/Effect.type"
import type { Uuid } from "../../../../shared/data/Uuid.type"
import { DEFAULT_VIEWPORT } from "../../../../viewports/core/shared/Constants"
import { isDefaultViewport } from "../../../../viewports/core/shared/viewport"
import type { Viewport } from "../../../../viewports/core/data/Viewport.type"

export type ResetFct = (id: Uuid, viewport: Viewport) => { viewport: Viewport, effects: SynthesizersEffects[] }

export const reset: ResetFct = (id, viewport) => ({
  viewport: DEFAULT_VIEWPORT,
  effects: isDefaultViewport(viewport) ? [] : [ { type: "synthesizers.viewport.save", id, viewport: DEFAULT_VIEWPORT } ]
})
