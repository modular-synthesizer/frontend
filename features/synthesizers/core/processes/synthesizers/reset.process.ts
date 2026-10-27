import type { SynthesizersEffects } from "../../data/Effect.type"
import type { Viewport } from "../../data/Synthesizer.type"
import type { Uuid } from "../../data/Uuid.type"
import { DEFAULT_VIEWPORT } from "../../shared/Constants"
import { isDefaultViewport } from "../../shared/viewport"

export type ResetFct = (id: Uuid, viewport: Viewport) => { viewport: Viewport, effects: SynthesizersEffects[] }

export const reset: ResetFct = (id, viewport) => ({
  viewport: DEFAULT_VIEWPORT,
  effects: isDefaultViewport(viewport) ? [] : [ { type: "synthesizers.viewport.save", id, viewport: DEFAULT_VIEWPORT } ]
})
