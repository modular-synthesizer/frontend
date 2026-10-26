import type { Effect, Facts } from "../../../../shared/facts"
import type { ViewPort } from "../../data/Synthesizer.type"
import type { Uuid } from "../../data/Uuid.type"
import { DEFAULT_VIEWPORT } from "../../shared/Constants"

export type SynthesizersEffects = Effect & (
  | { type: "synthesizers.viewport.save", id: Uuid, viewPort: ViewPort }
)

export type SynthesizerFacts = Facts<SynthesizersEffects>

export type ResetFct = (id: Uuid, viewPort: ViewPort) => SynthesizerFacts

function isDefault(viewPort: ViewPort): boolean {
  return viewPort.position.x == DEFAULT_VIEWPORT.position.x &&
    viewPort.position.y == DEFAULT_VIEWPORT.position.y &&
    viewPort.scale == DEFAULT_VIEWPORT.scale
}

export const noFacts = () => ({ mutations: [], effects: [] })

export const reset: ResetFct = (id, viewPort) => ({
  effects: isDefault(viewPort) ? [] : [ { type: "synthesizers.viewport.save", id, viewPort: DEFAULT_VIEWPORT } ]
})
