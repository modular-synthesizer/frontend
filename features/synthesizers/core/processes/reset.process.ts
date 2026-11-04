import type { SynthesizersEffect } from "../data/Effect.type"
import type { ObjectId } from "../../../shared/data/ObjectId.type"
import type { Viewport } from "../../../viewports/core/data/Viewport.type"
import { resetViewport } from "../../../viewports/core/processes/reset.process"

export type ResetFct = (id: ObjectId, viewport: Viewport) => { viewport: Viewport, effects: SynthesizersEffect[] }

export const reset: ResetFct = (id, from) => {
  const { viewport, changed } = resetViewport(from)
  return { viewport, effects: changed ? [ { type: "synthesizers.viewport.save", id, viewport } ] : [] }
}
