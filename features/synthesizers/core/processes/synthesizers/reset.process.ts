import type { Facts } from "../../../../shared/facts"
import type { SynthesizersEffects } from "../../data/Effect.type"
import type { Viewport } from "../../data/Synthesizer.type"
import type { Uuid } from "../../data/Uuid.type"
import { DEFAULT_VIEWPORT } from "../../shared/Constants"

export type SynthesizerFacts = Facts<SynthesizersEffects>

export type ResetFct = (id: Uuid, viewport: Viewport) => SynthesizerFacts

function isDefault(viewport: Viewport): boolean {
  return viewport.position.x == DEFAULT_VIEWPORT.position.x &&
    viewport.position.y == DEFAULT_VIEWPORT.position.y &&
    viewport.scale == DEFAULT_VIEWPORT.scale
}

export const reset: ResetFct = (id, viewport) => ({
  effects: isDefault(viewport) ? [] : [ { type: "synthesizers.viewport.save", id, viewport: DEFAULT_VIEWPORT } ]
})
